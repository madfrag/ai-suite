// src/components/auth/anonymous-auth-provider.tsx
'use client';

import { createContext, useEffect, useState, useSyncExternalStore } from 'react';
import { getConsentServerSnapshot, getConsentSnapshot, subscribeConsent } from '@/lib/consent';

type AuthContextValue = {
  // True until the anonymous session exists. Stays true while consent is
  // missing, because no session (and no cookie) is created before that.
  loading: boolean;
  consent: 'unknown' | 'required' | 'granted';
};

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
  consent: 'unknown',
});

export function AnonymousAuthProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (consent !== 'granted') return;
    fetch('/api/auth/anonymous', { method: 'POST' })
      .catch((error) => console.error('Error establishing session:', error))
      .finally(() => setLoading(false));
  }, [consent]);

  return <AuthContext.Provider value={{ loading, consent }}>{children}</AuthContext.Provider>;
}
