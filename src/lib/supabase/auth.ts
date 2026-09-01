"use client";

import { getSupabaseClient } from './client';

export const ensureAnonymousUser = async () => {
    const supabase = getSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    const user = session?.user;

    if (user) {
        return user;
    }

    if (error) {
        console.error('Error getting session:', error);
        return;
    }

    if (!session) {
        const { data, error: signInError } = await supabase.auth.signInAnonymously();

        if (signInError) {
            console.error('Error signing in anonymously:', signInError);
        }
        if (!data?.user) {
            console.error('No user returned from anonymous sign-in.');
        }

        return data?.user;
    }
}