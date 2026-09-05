// app/api/chat/send/route.ts
import OpenAI from 'openai';
import { chatbotMessagesServer } from '@/lib/chatbot/messages.server';
import { OPENAI_CHAT_MODEL, SYSTEM_PROMPT } from '@/lib/consts';
import { isOverThreshold, RECENT_WINDOW, shouldRefreshSummary } from '@/lib/chatbot/summarize';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function summarizeMessages(messages: { role: string; content: string }[]) {
  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const response = await openai.responses.create({
    model: OPENAI_CHAT_MODEL,
    input: `Summarize the following conversation concisely, keeping the key facts and context needed to continue it naturally:\n\n${transcript}`,
  });

  return response.output_text;
}

export async function POST(req: Request) {
  const { content, chatSessionId } = await req.json();

  await chatbotMessagesServer.addUserMessage({ content, chatSessionId });
  const history = await chatbotMessagesServer.getChatSessionMessages(chatSessionId);

  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let summary: string | null = null;
      let contextMessages = history;

      if (isOverThreshold(history.length)) {
        summary = await chatbotMessagesServer.getChatSummary(chatSessionId);

        if (shouldRefreshSummary(history.length, !!summary)) {
          controller.enqueue(enc.encode(JSON.stringify({ type: 'summary.started' }) + '\n'));
          try {
            summary = await summarizeMessages(history.slice(0, -RECENT_WINDOW));
            await chatbotMessagesServer.saveChatSummary({ chatSessionId, content: summary });
          } catch (err) {
            console.error('Failed to summarize chat session:', err);
          }
          controller.enqueue(enc.encode(JSON.stringify({ type: 'summary.completed' }) + '\n'));
        }

        // Only drop the older messages once we actually have a summary to stand in for them
        if (summary) {
          contextMessages = history.slice(-RECENT_WINDOW);
        }
      }

      const response = await openai.responses.create({
        model: OPENAI_CHAT_MODEL,
        input: [
          { role: 'system', content: SYSTEM_PROMPT ?? '' },
          ...(summary
            ? [
                {
                  role: 'system' as const,
                  content: `Summary of the earlier conversation:\n${summary}`,
                },
              ]
            : []),
          ...contextMessages.map((m) => ({ role: m.role, content: m.content })),
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
