import { getServerSupabaseClient } from '@/lib/supabase/server';

export const supabaseDb = {
  async insertMessage({
    role,
    content,
    chatSessionId,
  }: {
    role: string;
    content: string;
    chatSessionId?: string;
  }) {
    const supabase = await getServerSupabaseClient();

    const inserted = await supabase
      .from('chatbot_messages')
      .insert([
        {
          role: role,
          content: content,
          chat_session_id: chatSessionId,
        },
      ])
      .select();
    console.log('Inserted message into Supabase:', inserted);
    return inserted;
  },

  async getMessages(chatSessionId?: string) {
    const supabase = await getServerSupabaseClient();
    let query = supabase.from('chatbot_messages').select('*');

    if (chatSessionId) {
      query = query.eq('chat_session_id', chatSessionId);
    }

    return await query.order('created_at', { ascending: true });
  },

  async clearMessages(chatSessionId?: string) {
    const supabase = await getServerSupabaseClient();
    return await supabase.from('chatbot_messages').delete().eq('chat_session_id', chatSessionId);
  },

  async insertChatSummary({ chatSessionId, summary }: { chatSessionId: string; summary: string }) {
    const supabase = await getServerSupabaseClient();
    const { data, error } = await supabase
      .from('chat_session_summary')
      .insert([{ chat_session_id: chatSessionId, summary }])
      .select();

    if (error) {
      console.error('Error inserting chat summary:', error);
      throw new Error(error.message);
    }

    return data;
  },
};
