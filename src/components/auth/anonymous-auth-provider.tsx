// src/components/auth/anonymous-auth-provider.tsx
'use client';

import { createContext, useEffect, useState } from 'react';

type AuthContextValue = {
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  loading: true,
});

export function AnonymousAuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/anonymous', { method: 'POST' })
      .catch((error) => console.error('Error establishing session:', error))
      .finally(() => setLoading(false));
  }, []);

  return <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>;
}
