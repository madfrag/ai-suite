import { clientDb as supabaseClientDb } from './supabase.client-side';
// import { firebaseClientDb } from './firebase';

const PROVIDER = process.env.NEXT_PUBLIC_DB_PROVIDER || 'supabase';

const clientProviders = {
  supabase: supabaseClientDb,
  // firebase: firebaseClientDb,
};

export const clientDb = clientProviders[PROVIDER as keyof typeof clientProviders];

if (!clientDb) {
  throw new Error(`Unsupported DB provider: ${PROVIDER}`);
}
