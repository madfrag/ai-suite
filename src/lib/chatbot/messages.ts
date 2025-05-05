// lib/chatbot/messages.ts
import { serverDb } from '@/lib/db/db.server-side';

export const chatbotMessages = {
  async addUserMessage({ userId, content }: { userId?: string; content: string }) {
    return await serverDb.insertMessage({ userId, role: 'user', content });
  },

  async addAssistantMessage({ userId, content }: { userId?: string; content: string }) {
    return await serverDb.insertMessage({ userId, role: 'assistant', content });
  },

  async getAllMessages(userId?: string) {
    const { data, error } = await serverDb.getMessages(userId);
    if (error) throw new Error(error.message);
    return data;
  },

  async clearMessages(userId?: string) {
    const { error } = await serverDb.clearMessages(userId);
    if (error) throw new Error(error.message);
  }
};