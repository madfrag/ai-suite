import { getServerSupabaseClient } from '@/lib/supabase/server';

export const supabaseDb = {
  async insertMessage({ userId, role, content }: { userId?: string; role: string; content: string }) {
    const supabase = await getServerSupabaseClient();
    return await supabase.from('chatbot_messages').insert([{ user_id: userId, role, content }]);
  },

  async getMessages(userId?: string) {
    const supabase = await getServerSupabaseClient();
    return await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
  },

  async clearMessages(userId?: string) {
    const supabase = await getServerSupabaseClient();
    return await supabase
      .from('chatbot_messages')
      .delete()
      .eq('user_id', userId);
  }
};