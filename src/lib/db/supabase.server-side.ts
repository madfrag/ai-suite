import { getServerSupabaseClient } from '@/lib/supabase/server';
import { getAdminSupabaseClient } from '@/lib/supabase/admin';

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

  async getChatSummary(chatSessionId: string) {
    const supabase = await getServerSupabaseClient();
    return await supabase
      .from('chat_session_summary')
      .select('content')
      .eq('chat_session_id', chatSessionId)
      .maybeSingle();
  },

  async upsertChatSummary({ chatSessionId, content }: { chatSessionId: string; content: string }) {
    const supabase = await getServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('chat_session_summary')
      .upsert([{ chat_session_id: chatSessionId, content, user_id: user?.id }], {
        onConflict: 'user_id,chat_session_id',
      })
      .select();

    if (error) {
      console.error('Error saving chat summary:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async incrementRateLimit({ ipAddress, endpoint }: { ipAddress: string; endpoint: string }) {
    // Uses the service-role client deliberately: this table isn't scoped to a
    // user, and the RPC's EXECUTE grant is now restricted to service_role only
    // (see the 20260909000000 migration) so a caller with just the publishable
    // key can't invoke it with an arbitrary IP.
    const supabase = getAdminSupabaseClient();
    return await supabase.rpc('increment_rate_limit', {
      p_ip_address: ipAddress,
      p_endpoint: endpoint,
    });
  },
};
