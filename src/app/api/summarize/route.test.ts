// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { POST } from './route';

function postRequest(body: unknown) {
  return new Request('http://localhost/api/summarize', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/summarize', () => {
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
});
