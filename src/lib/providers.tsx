'use client';

import { CookiesProvider } from 'react-cookie';
import { AnonymousAuthProvider } from '@/components/auth/anonymous-auth-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AnonymousAuthProvider>{children}</AnonymousAuthProvider>
    </CookiesProvider>
  );
}
