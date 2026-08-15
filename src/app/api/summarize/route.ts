import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text, provider } = await req.json();

  const payload =
    provider === 'openai'
      ? {
          model: 'gpt-4o',
          messages: [{ role: 'user', content: `Summarize this in 5 bullet points:\n\n${text}` }],
          temperature: 0.7,
        }
      : { inputs: text };

  const url =
    provider === 'openai'
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

  const headers =
    provider === 'openai'
      ? {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      : {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  let summaryText = '';

  if (provider === 'openai') {
    summaryText = data?.choices?.[0]?.message?.content;
  } else {
    summaryText = Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
  }

  return NextResponse.json({ summaryText });
}
