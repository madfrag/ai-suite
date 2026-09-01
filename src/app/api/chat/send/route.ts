// app/api/chat/send/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';
import { SYSTEM_PROMPT } from '@/lib/consts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { content, chatSessionId } = await req.json();

  await chatbotMessagesServer.addUserMessage({ content, chatSessionId });

  const history = await chatbotMessagesServer.getChatSessionMessages(chatSessionId);

  const chatLength = history.length;
  const chatSummary = `Chat length: ${chatLength}`;

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT ?? '' },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];
  console.log('Formatted messages for OpenAI:', formattedMessages);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: formattedMessages,
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content ?? '-';

  await chatbotMessagesServer.addAssistantMessage({ content: reply, chatSessionId });

  return NextResponse.json({ reply });
}
