import { getServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { original, summary } = await req.json();
  const supabase = await getServerSupabaseClient();

  const { error } = await supabase.from('summaries').insert([{ original, summary }]);

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to save summary.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Saved.' });
}
