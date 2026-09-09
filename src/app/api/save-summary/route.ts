import { getServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { original, summary, provider } = await req.json();

  if (provider !== 'openai' && provider !== 'huggingface') {
    return NextResponse.json({ error: 'Unknown provider.' }, { status: 400 });
  }

  const supabase = await getServerSupabaseClient();

  const { error } = await supabase
    .from('articles_summary')
    .insert([{ original, summary, provider }]);

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to save summary.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Saved.' });
}
