// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Bypasses RLS entirely — server-only, never expose this client or its key to
// the browser. Use it only for operations that aren't scoped to a request's
// own user, like the IP-keyed rate limiter.
export const getAdminSupabaseClient = () => {
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
