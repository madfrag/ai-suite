import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SummaryTabs from './SummaryTabs';

function mockFetchOnce(response: { ok: boolean; body: unknown }) {
  return vi.fn().mockResolvedValueOnce({
    ok: response.ok,
    json: async () => response.body,
  });
}

function renderWithText(text: string) {
  render(<SummaryTabs openaiDailyLimit={20} />);
  if (text) {
    fireEvent.change(screen.getByPlaceholderText('Paste or write your content here...'), {
      target: { value: text },
    });
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SummaryTabs', () => {
  it('does nothing when the text is empty', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderWithText('  ');

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the summary on success', async () => {
    vi.stubGlobal('fetch', mockFetchOnce({ ok: true, body: { summaryText: 'a short summary' } }));
    renderWithText('some article text');

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(await screen.findByText('a short summary')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetchOnce({ ok: false, body: { error: 'Text is required.' } }));
    renderWithText('some article text');

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(await screen.findByText('Text is required.')).toBeInTheDocument();
  });

  it('saves the summary and updates the save button', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ summaryText: 'a short summary' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Saved.' }) });
    vi.stubGlobal('fetch', fetchMock);
    renderWithText('some article text');

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    await screen.findByText('a short summary');

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByRole('button', { name: /^saved$/i })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/save-summary',
      expect.objectContaining({
        body: JSON.stringify({
          original: 'some article text',
          summary: 'a short summary',
          provider: 'huggingface',
        }),
      })
    );
  });

  it('shows the OpenAI daily limit', () => {
    renderWithText('');
    expect(screen.getByText(/limited to 20\/day/i)).toBeInTheDocument();
  });

  it('lazy-loads previous summaries only when the accordion is opened', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        summaries: [
          {
            id: '1',
            original: 'an old article',
            summary: 'an old summary',
            provider: 'openai',
            created_at: '',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderWithText('');

    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Previous Summaries'));
    expect(await screen.findByText(/an old article/)).toBeInTheDocument();
    expect(screen.getAllByText('OpenAI').length).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledWith('/api/summaries');
  });

  it('loads a previous summary into a read-only view with no summarize/save controls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        summaries: [
          {
            id: '1',
            original: 'an old article',
            summary: 'an old summary',
            provider: 'openai',
            created_at: '',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderWithText('');

    fireEvent.click(screen.getByText('Previous Summaries'));
    fireEvent.click(await screen.findByText(/an old article/));

    const originalBox = await screen.findByDisplayValue('an old article');
    expect(originalBox).toHaveAttribute('readonly');
    expect(screen.getByText('an old summary')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /summarize/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^save$/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy summary/i })).toBeInTheDocument();

    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    fireEvent.click(screen.getByRole('button', { name: /copy original text/i }));
    expect(writeText).toHaveBeenCalledWith('an old article');

    fireEvent.click(screen.getByRole('button', { name: /new summary/i }));
    expect(await screen.findByRole('button', { name: /summarize/i })).toBeInTheDocument();
  });
});
