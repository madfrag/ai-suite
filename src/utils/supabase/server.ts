// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type SupabaseClient } from "@supabase/supabase-js";
import { type CookieOptions } from "@supabase/ssr";

let supabase: SupabaseClient | null = null;

export const getServerSupabaseClient = async () => {
  if (!supabase) {
    const cookieStore = await cookies();

    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored in Server Components (middleware will refresh session)
            }
          },
        },
      },
    );
  }
  return supabase;
};
