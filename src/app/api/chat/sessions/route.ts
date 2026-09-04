import { NextResponse } from 'next/server';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';

export async function GET() {
  const sessions = await chatbotMessagesServer.getSessionPreviews();
  return NextResponse.json({ sessions });
}
