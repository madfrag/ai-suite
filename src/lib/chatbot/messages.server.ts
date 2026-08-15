// lib/chatbot/messages.ts
import { serverDb } from '@/lib/db/db.server-side';

export const chatbotMessagesServer = {
  async getAllMessages(userId?: string | null) {
    const { data, error } = await serverDb.getMessages(userId);
    if (error) throw new Error(error.message);
    return data;
  },

  async addUserMessage({
    userId,
    content,
    chatSessionId,
  }: {
    userId?: string | null;
    content: string;
    chatSessionId?: string;
  }) {
    return await serverDb.insertMessage({ userId, role: 'user', content, chatSessionId });
  },

  async addAssistantMessage({
    userId,
    content,
    chatSessionId,
  }: {
    userId?: string;
    content: string;
    chatSessionId?: string;
  }) {
    return await serverDb.insertMessage({ userId, role: 'assistant', content, chatSessionId });
  },

  async clearMessages(userId?: string, chatSessionId?: string) {
    const { error } = await serverDb.clearMessages(userId, chatSessionId);
    if (error) throw new Error(error.message);
  },

  async getChatSessionMessages(userId?: string, chatSessionId?: string) {
    const { data, error } = await serverDb.getMessages(userId, chatSessionId);
    if (error) throw new Error(error.message);
    return data.filter((msg: any) => msg.chat_session_id === chatSessionId);
  },
};
