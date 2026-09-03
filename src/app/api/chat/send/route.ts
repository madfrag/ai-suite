// app/api/chat/send/route.ts
import OpenAI from 'openai';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';
import { SYSTEM_PROMPT } from '@/lib/consts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { content, chatSessionId } = await req.json();

  await chatbotMessagesServer.addUserMessage({ content, chatSessionId });
  const history = await chatbotMessagesServer.getChatSessionMessages(chatSessionId);

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await openai.responses.create({
        model: 'gpt-5-nano',
        input: [
          { role: 'system', content: SYSTEM_PROMPT ?? '' },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      });

      let fullText = '';

      for await (const event of response) {
        // Forward every raw event to the client
        controller.enqueue(enc.encode(JSON.stringify(event) + '\n'));

        if (event.type === 'response.output_text.delta') {
          fullText += event.delta;
        }

        // Save the complete message only when the stream is fully done
        if (event.type === 'response.completed') {
          await chatbotMessagesServer.addAssistantMessage({ content: fullText, chatSessionId });
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}
