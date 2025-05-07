import { getServerSupabaseClient } from '@/lib/supabase/server';

export const supabaseDb = {
  async insertMessage({ userId, role, content, chatSessionId }: { userId?: string | null; role: string; content: string; chatSessionId?: string }) {
    const supabase = await getServerSupabaseClient();
    console.log('Inserting message:', { userId, role, content, chatSessionId });
    return await supabase.from('chatbot_messages').insert([{
      user_id: userId,
      role: role,
      content: content,
      chat_session_id: chatSessionId,
    }])
  },

  async getMessages(userId?: string | null, chatSessionId?: string) {
    const supabase = await getServerSupabaseClient();
    let query = supabase
      .from('chatbot_messages')
      .select('*')
      .eq('user_id', userId);

    if (chatSessionId) {
      query = query.eq('chat_session_id', chatSessionId);
    }

    return await query.order('created_at', { ascending: true });
  },

  async clearMessages(userId?: string, chatSessionId?: string) {
    const supabase = await getServerSupabaseClient();
    return await supabase
      .from('chatbot_messages')
      .delete()
      .eq('user_id', userId)
      .eq('chat_session_id', chatSessionId);
  }
};