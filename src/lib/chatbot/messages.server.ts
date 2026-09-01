// lib/chatbot/messages.ts
import { serverDb } from '@/lib/db/db.server-side';

export const chatbotMessagesServer = {
  async getAllMessages() {
    const { data, error } = await serverDb.getMessages();
    if (error) throw new Error(error.message);
    return data;
  },

  async addUserMessage({ content, chatSessionId }: { content: string; chatSessionId?: string }) {
    console.log('Adding user message:', { content, chatSessionId });
    return await serverDb.insertMessage({ role: 'user', content, chatSessionId });
  },

  async addAssistantMessage({
    content,
    chatSessionId,
  }: {
    content: string;
    chatSessionId?: string;
  }) {
    return await serverDb.insertMessage({ role: 'assistant', content, chatSessionId });
  },

  async clearMessages(chatSessionId?: string) {
    const { error } = await serverDb.clearMessages(chatSessionId);
    if (error) throw new Error(error.message);
  },

  async getChatSessionMessages(chatSessionId?: string) {
    const { data, error } = await serverDb.getMessages(chatSessionId);
    if (error) {
      return []; // Return an empty array if there's an error fetching messages
      // throw new Error(error.message);
    }
    return data.filter((msg: any) => msg.chat_session_id === chatSessionId);
  },
};
