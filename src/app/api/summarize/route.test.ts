// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

function postRequest(body: unknown) {
  return new Request('http://localhost/api/summarize', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/summarize', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects missing text', async () => {
    const res = await POST(postRequest({ provider: 'openai' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Text is required.');
  });

  it('rejects blank text', async () => {
    const res = await POST(postRequest({ text: '   ', provider: 'openai' }));
    expect(res.status).toBe(400);
  });

  it('rejects an unknown provider', async () => {
    const res = await POST(postRequest({ text: 'hello world', provider: 'bogus' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Unknown provider.');
  });

  it('surfaces a clear message when HuggingFace rate-limits the request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) })
    );

    const res = await POST(postRequest({ text: 'hello world', provider: 'huggingface' }));
    expect(res.status).toBe(429);
    expect((await res.json()).error).toMatch(/rate-limiting/i);
  });

  it('surfaces a clear message when HuggingFace cannot tokenize the input', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'index out of range in self' }),
      })
    );

    const res = await POST(postRequest({ text: 'hello world', provider: 'huggingface' }));
    expect(res.status).toBe(422);
    expect((await res.json()).error).toMatch(/couldn't process this text/i);
  });
});
