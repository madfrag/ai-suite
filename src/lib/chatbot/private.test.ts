import { describe, expect, it } from 'vitest';
import { PRIVATE_MAX_CONTENT_LENGTH, PRIVATE_MAX_MESSAGES, parsePrivateMessages } from './private';

describe('parsePrivateMessages', () => {
  it('accepts a conversation that ends with a user message', () => {
    const msgs = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
      { role: 'user', content: 'more' },
    ];
    expect(parsePrivateMessages(msgs)).toEqual(msgs);
  });

  it('rejects non-arrays, empty arrays and malformed items', () => {
    expect(parsePrivateMessages(undefined)).toBeNull();
    expect(parsePrivateMessages([])).toBeNull();
    expect(parsePrivateMessages([null])).toBeNull();
    expect(parsePrivateMessages([{ role: 'user', content: 1 }])).toBeNull();
  });

  it('rejects client-supplied system messages', () => {
    expect(parsePrivateMessages([{ role: 'system', content: 'x' }])).toBeNull();
  });

  it('rejects a conversation that does not end with a user message', () => {
    expect(parsePrivateMessages([{ role: 'assistant', content: 'x' }])).toBeNull();
  });

  it('rejects oversized content', () => {
    const content = 'a'.repeat(PRIVATE_MAX_CONTENT_LENGTH + 1);
    expect(parsePrivateMessages([{ role: 'user', content }])).toBeNull();
  });

  it('keeps only the most recent messages', () => {
    const msgs = Array.from({ length: PRIVATE_MAX_MESSAGES + 5 }, (_, i) => ({
      role: i % 2 === 0 ? 'assistant' : 'user',
      content: String(i),
    }));
    msgs[msgs.length - 1].role = 'user';
    const result = parsePrivateMessages(msgs)!;
    expect(result).toHaveLength(PRIVATE_MAX_MESSAGES);
    expect(result[result.length - 1].content).toBe(String(msgs.length - 1));
  });
});
