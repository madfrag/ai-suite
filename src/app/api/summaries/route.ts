import { NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await getServerSupabaseClient();

  const { data, error } = await supabase
    .from('articles_summary')
    .select('id, original, summary, provider, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching saved summaries:', error);
    return NextResponse.json({ error: 'Failed to load saved summaries.' }, { status: 500 });
  }

  return NextResponse.json({ summaries: data });
}
