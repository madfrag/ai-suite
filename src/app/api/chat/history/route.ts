// app/api/chat/history/route.ts
import { NextResponse } from 'next/server';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const messages = await chatbotMessagesServer.getAllMessages(userId);
    return NextResponse.json({ messages });
}
