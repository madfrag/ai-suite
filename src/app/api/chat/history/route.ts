// app/api/chat/history/route.ts
import { NextResponse } from 'next/server';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatSessionId = searchParams.get('chatSessionId');

  if (!chatSessionId) {
    return NextResponse.json({ error: 'chatSessionId is required.' }, { status: 400 });
  }

  const messages = await chatbotMessagesServer.getChatSessionMessages(chatSessionId);
  return NextResponse.json({ messages });
}
