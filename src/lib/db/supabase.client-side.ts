import { getSupabaseClient } from '@/lib/supabase/client';

export const clientDb = {
  async getCurrentUser() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return data.user;
  },

  // Optional: Add subscriptions, real-time logic, etc.
};