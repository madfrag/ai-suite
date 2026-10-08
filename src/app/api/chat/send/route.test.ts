// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { db, create } = vi.hoisted(() => ({
  db: {
    addUserMessage: vi.fn(),
    addAssistantMessage: vi.fn(),
    getChatSessionMessages: vi.fn(),
    getChatSummary: vi.fn(),
    saveChatSummary: vi.fn(),
  },
  create: vi.fn(),
}));

vi.mock('@/lib/chatbot/messages.server', () => ({ chatbotMessagesServer: db }));
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, count: 1 }),
  getClientIp: () => '127.0.0.1',
}));
vi.mock('openai', () => ({
  default: class {
    responses = { create };
  },
}));

import { POST } from './route';

function postRequest(body: unknown) {
  return new Request('http://localhost/api/chat/send', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function* fakeStream() {
  yield { type: 'response.output_text.delta', delta: 'hi' };
  yield { type: 'response.completed' };
}

describe('POST /api/chat/send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    create.mockResolvedValue(fakeStream());
    db.getChatSessionMessages.mockResolvedValue([{ role: 'user', content: 'hello' }]);
  });

  it('private mode never reads from or writes to the database', async () => {
    const res = await POST(
      postRequest({
        private: true,
        messages: [
          { role: 'user', content: 'a' },
          { role: 'assistant', content: 'b' },
          { role: 'user', content: 'c' },
        ],
      })
    );
    await res.text(); // drain the stream so the completion branch runs

    expect(res.status).toBe(200);
    for (const fn of Object.values(db)) expect(fn).not.toHaveBeenCalled();
    const input = create.mock.calls[0][0].input;
    expect(input.at(-1)).toEqual({ role: 'user', content: 'c' });
  });

  it('private mode rejects an invalid payload', async () => {
    const res = await POST(postRequest({ private: true, messages: 'nope' }));
    expect(res.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it('normal mode still persists both messages', async () => {
    const res = await POST(postRequest({ content: 'hello', chatSessionId: 's1' }));
    await res.text();

    expect(db.addUserMessage).toHaveBeenCalledWith({ content: 'hello', chatSessionId: 's1' });
    expect(db.addAssistantMessage).toHaveBeenCalledWith({ content: 'hi', chatSessionId: 's1' });
  });
});
