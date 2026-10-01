import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConsentGate from './ConsentGate';
import { AnonymousAuthProvider } from '@/components/auth/anonymous-auth-provider';
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from '@/lib/consent';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

function renderGate() {
  return render(
    <AnonymousAuthProvider>
      <ConsentGate>
        <p>tool content</p>
      </ConsentGate>
    </AnonymousAuthProvider>
  );
}

describe('ConsentGate', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    window.localStorage.clear();
    fetchMock.mockReset().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    push.mockReset();
  });

  it('shows the dialog and creates no session before consent', async () => {
    renderGate();

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // First visit: nothing was agreed before, so no "updated" notice.
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      '/datenschutz#english'
    );
    expect(screen.queryByText('tool content')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('cannot be dismissed with Escape', async () => {
    renderGate();
    await screen.findByRole('dialog');

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('stores consent, creates the session, then renders the content', async () => {
    renderGate();
    fireEvent.click(await screen.findByRole('button', { name: /agree/i }));

    expect(await screen.findByText('tool content')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/anonymous', { method: 'POST' });
    expect(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({
      v: CONSENT_VERSION,
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skips the dialog when consent is already stored', async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION }));
    renderGate();

    expect(await screen.findByText('tool content')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('asks again when the stored consent is for an older version', async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION - 1 }));
    renderGate();

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(/updated our privacy policy/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows no "updated" notice for an unreadable stored value', async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'not json');
    renderGate();

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });

  it('declining sends the visitor home without storing anything', async () => {
    renderGate();
    fireEvent.click(await screen.findByRole('button', { name: /decline/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('still renders the content if session creation fails', async () => {
    fetchMock.mockRejectedValue(new Error('network'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    renderGate();

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: /agree/i }));
    });

    expect(await screen.findByText('tool content')).toBeInTheDocument();
  });
});
