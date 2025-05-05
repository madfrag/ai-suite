// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { chatbotMessages } from '@/lib/chatbot/messages';
import { getServerSupabaseClient } from '@/lib/supabase/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { content } = await req.json();
  const supabase = await getServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id;
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Store user message
  await chatbotMessages.addUserMessage({ userId, content });

  // Fetch conversation history
  const history = await chatbotMessages.getAllMessages(userId);

  // Convert to OpenAI format
  const messages = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Add current message
  messages.push({ role: 'user', content });

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content;

  if (!reply) {
    return NextResponse.json({ error: 'Failed to generate a reply' }, { status: 500 });
  }

  // Store assistant reply
  await chatbotMessages.addAssistantMessage({ userId, content: reply });

  return NextResponse.json({ reply });
}
