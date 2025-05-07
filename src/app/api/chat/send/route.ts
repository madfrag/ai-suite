// app/api/chat/send/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { content, userId, chatSessionId } = await req.json();

  console.log('content:', content);
  console.log('userId:', userId);

  await chatbotMessagesServer.addUserMessage({ userId, content, chatSessionId });

  const history = await chatbotMessagesServer.getChatSessionMessages(userId, chatSessionId);
  const formattedMessages = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: formattedMessages,
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content ?? '-';

  await chatbotMessagesServer.addAssistantMessage({ userId, content: reply, chatSessionId  });

  return NextResponse.json({ reply });
}
