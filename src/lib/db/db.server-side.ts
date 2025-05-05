import { supabaseDb } from './supabase.server-side';
// import { firebaseDb } from './firebase';

const PROVIDER = process.env.NEXT_PUBLIC_DB_PROVIDER || 'supabase';

const serverProviders = {
  supabase: supabaseDb,
  // firebase: firebaseDb,
};

export const serverDb = serverProviders[PROVIDER as keyof typeof serverProviders];

if (!serverDb) {
  throw new Error(`Unsupported DB provider: ${PROVIDER}`);
}
