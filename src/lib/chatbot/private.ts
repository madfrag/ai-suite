// Private mode: the client owns the conversation and sends it with every
// request; the server never touches the database for these requests.
export const PRIVATE_MAX_MESSAGES = 20;
export const PRIVATE_MAX_CONTENT_LENGTH = 8000;

export type PrivateMessage = { role: 'user' | 'assistant'; content: string };

/** Validates a client-supplied conversation; keeps only the most recent messages. */
export function parsePrivateMessages(value: unknown): PrivateMessage[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const messages: PrivateMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string' || content.length > PRIVATE_MAX_CONTENT_LENGTH) return null;
    messages.push({ role, content });
  }

  if (messages[messages.length - 1].role !== 'user') return null;
  return messages.slice(-PRIVATE_MAX_MESSAGES);
}
