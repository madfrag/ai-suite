import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OPENAI_SUMMARY_MODEL, SUMMARIZE_DAILY_LIMIT } from '@/lib/consts';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// bart-large-cnn has a hard 1024-token context window and errors out past it,
// so longer articles need to be cut down before we send them.
const HUGGINGFACE_MAX_INPUT_CHARS = 3000;

class UpstreamRateLimitError extends Error {}
class UnsupportedInputError extends Error {}

export async function POST(req: Request) {
  const { text, provider } = await req.json();

  if (typeof text !== 'string' || !text.trim()) {
    return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
  }

  if (provider !== 'openai' && provider !== 'huggingface') {
    return NextResponse.json({ error: 'Unknown provider.' }, { status: 400 });
  }

  if (provider === 'openai') {
    const { allowed } = await checkRateLimit({
      ipAddress: getClientIp(req),
      endpoint: 'summarize',
      limit: SUMMARIZE_DAILY_LIMIT,
    });

    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily summary limit reached (${SUMMARIZE_DAILY_LIMIT}/day). Try again tomorrow.`,
        },
        { status: 429 }
      );
    }
  }

  try {
    const summaryText =
      provider === 'openai'
        ? await summarizeWithOpenAI(text)
        : await summarizeWithHuggingFace(text);

    return NextResponse.json({ summaryText });
  } catch (err) {
    console.error('Summarize error:', err);

    if (err instanceof UpstreamRateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }

    if (err instanceof UnsupportedInputError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }

    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 502 });
  }
}

async function summarizeWithOpenAI(text: string) {
  const response = await openai.responses.create({
    model: OPENAI_SUMMARY_MODEL,
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

  if (res.status === 429) {
    throw new UpstreamRateLimitError(
      'HuggingFace is rate-limiting requests right now. Try again in a bit, or switch to the OpenAI provider.'
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);

    // bart-large-cnn is English-only and has a hard 1024-token window. Non-Latin
    // scripts tokenize far denser than English, so text well under our character
    // limit above can still overflow it — this is the model's own error for that.
    if (body?.error?.includes('index out of range')) {
      throw new UnsupportedInputError(
        "HuggingFace's model couldn't process this text — it works best with shorter, English-language input. Try trimming it or switching to the OpenAI provider."
      );
    }

    throw new Error(`HuggingFace request failed with status ${res.status}: ${body?.error}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
}
