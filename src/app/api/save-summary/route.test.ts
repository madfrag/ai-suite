// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { POST } from './route';

function postRequest(body: unknown) {
  return new Request('http://localhost/api/save-summary', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/save-summary', () => {
  it('rejects an unknown provider', async () => {
    const res = await POST(postRequest({ original: 'x', summary: 'y', provider: 'bogus' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Unknown provider.');
  });

  it('rejects a missing provider', async () => {
    const res = await POST(postRequest({ original: 'x', summary: 'y' }));
    expect(res.status).toBe(400);
  });
});
