// app/api/summarize/route.ts
import { getServerSupabaseClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    const { text, provider = 'openai' } = await req.json();

    let summaryText = '';

    try {
        if (provider === 'huggingface') {
            const hfResponse = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: text }),
            });

            const hfData = await hfResponse.json();

            if (hfData.error) {
                console.error('Hugging Face error:', hfData.error);
                return NextResponse.json({ error: hfData.error }, { status: 500 });
            }

            summaryText = hfData[0]?.summary_text || 'No summary returned';

        } else {
            // Default to OpenAI
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: `Summarize this in 5 bullet points:\n\n${text}` }],
                    temperature: 0.7,
                }),
            });

            const data = await response.json();

            if (!data.choices || !data.choices[0]) {
                return NextResponse.json({ error: 'No summary from OpenAI' }, { status: 500 });
            }

            summaryText = data.choices[0].message.content;
        }

        const supabase = await getServerSupabaseClient();

        const { error } = await supabase
            .from('summaries')
            .insert([{ original: text, summary: summaryText }]);

        if (error) {
            console.error(error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ summaryText });

    } catch (err) {
        console.error('Summarization error:', err);
        return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
}
