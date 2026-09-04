import { getServerSupabaseClient } from '@/lib/supabase/server';

export const supabaseDb = {
  async insertMessage({
    role,
    content,
    chatSessionId,
  }: {
    role: 'user' | 'assistant';
    content: string;
    chatSessionId?: string;
  }) {
    const supabase = await getServerSupabaseClient();

    return await supabase
      .from('chatbot_messages')
      .insert([
        {
          role: role,
          content: content,
          chat_session_id: chatSessionId,
        },
      ])
      .select();
  },

  async getMessages(chatSessionId?: string) {
    const supabase = await getServerSupabaseClient();
    let query = supabase.from('chatbot_messages').select('*');

    if (chatSessionId) {
      query = query.eq('chat_session_id', chatSessionId);
    }

    return await query.order('created_at', { ascending: true });
  },

  async getSessionPreviews() {
    const supabase = await getServerSupabaseClient();
    return await supabase.rpc('get_chat_session_previews');
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
