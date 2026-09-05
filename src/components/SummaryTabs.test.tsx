import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SummaryTabs from './SummaryTabs';

function mockFetchOnce(response: { ok: boolean; body: unknown }) {
  return vi.fn().mockResolvedValueOnce({
    ok: response.ok,
    json: async () => response.body,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SummaryTabs', () => {
  it('does nothing when the text is empty', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<SummaryTabs text="  " />);

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the summary on success', async () => {
    vi.stubGlobal('fetch', mockFetchOnce({ ok: true, body: { summaryText: 'a short summary' } }));
    render(<SummaryTabs text="some article text" />);

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(await screen.findByText('a short summary')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.stubGlobal('fetch', mockFetchOnce({ ok: false, body: { error: 'Text is required.' } }));
    render(<SummaryTabs text="some article text" />);

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    expect(await screen.findByText('Text is required.')).toBeInTheDocument();
  });

  it('saves the summary and shows a confirmation', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ summaryText: 'a short summary' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Saved.' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<SummaryTabs text="some article text" />);

    fireEvent.click(screen.getByRole('button', { name: /summarize/i }));
    await screen.findByText('a short summary');

    fireEvent.click(screen.getByRole('button', { name: /save summary/i }));
    expect(await screen.findByText('Saved.')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
