import { describe, expect, it } from 'vitest';
import { getClientIp } from './rate-limit';

function requestWithHeaders(headers: Record<string, string>) {
  return new Request('http://localhost/api/chat/send', { headers });
}

describe('getClientIp', () => {
  it('reads the first address out of x-forwarded-for', () => {
    const req = requestWithHeaders({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' });
    expect(getClientIp(req)).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    const req = requestWithHeaders({ 'x-real-ip': '203.0.113.9' });
    expect(getClientIp(req)).toBe('203.0.113.9');
  });

  it('falls back to "unknown" when neither header is present', () => {
    const req = requestWithHeaders({});
    expect(getClientIp(req)).toBe('unknown');
  });
});
