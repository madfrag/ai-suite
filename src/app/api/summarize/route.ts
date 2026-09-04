import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// bart-large-cnn has a hard 1024-token context window and errors out past it,
// so longer articles need to be cut down before we send them.
const HUGGINGFACE_MAX_INPUT_CHARS = 3000;

export async function POST(req: Request) {
  const { text, provider } = await req.json();

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
  }

  if (provider !== 'openai' && provider !== 'huggingface') {
    return NextResponse.json({ error: 'Unknown provider.' }, { status: 400 });
  }

  try {
    const summaryText =
      provider === 'openai'
        ? await summarizeWithOpenAI(text)
        : await summarizeWithHuggingFace(text);

    return NextResponse.json({ summaryText });
  } catch (err) {
    console.error('Summarize error:', err);
    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 502 });
  }
}

async function summarizeWithOpenAI(text: string) {
  const response = await openai.responses.create({
    model: 'gpt-5-nano',
    input: `Summarize this in 5 bullet points:\n\n${text}`,
  });

  return response.output_text;
}

async function summarizeWithHuggingFace(text: string) {
  const res = await fetch(
    'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text.slice(0, HUGGINGFACE_MAX_INPUT_CHARS) }),
    }
  );

  if (!res.ok) {
    throw new Error(`HuggingFace request failed with status ${res.status}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
}
