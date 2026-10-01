'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/components/auth/anonymous-auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { grantConsent } from '@/lib/consent';

/**
 * Wraps a tool page (chat, summarizer). Children mount only once the visitor
 * has agreed *and* the anonymous session exists, so none of their on-mount
 * requests can run before consent.
 */
export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const { consent, loading } = useContext(AuthContext);
  const router = useRouter();

  if (consent === 'granted' && !loading) return <>{children}</>;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-background text-foreground flex-1 py-16 px-4 md:px-8 outline-none"
    >
      <Dialog open={consent === 'required' || consent === 'outdated'}>
        <DialogContent
          showClose={false}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {consent === 'outdated' && (
            <p
              role="note"
              className="border-l-4 border-primary bg-muted text-foreground rounded-r px-3 py-2 text-sm font-medium"
            >
              We&apos;ve updated our privacy policy since you last agreed. Please review it and
              confirm again.
            </p>
          )}
          <DialogHeader>
            <DialogTitle>Before you continue</DialogTitle>
            <DialogDescription>This is a demo, but it does process your data.</DialogDescription>
          </DialogHeader>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>
              What you type is sent to an AI provider (OpenAI or Hugging Face) and may be processed
              outside the EU, e.g. in the USA.
            </li>
            <li>
              Chats and saved summaries are stored in the EU until you ask for deletion. An
              anonymous session cookie links them to your browser.
            </li>
            <li>Please don&apos;t enter sensitive or personal data.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Details in the{' '}
            <Link
              href="/datenschutz#english"
              target="_blank"
              className="underline text-foreground hover:text-primary"
            >
              privacy policy (Datenschutzerklärung)
            </Link>
            .
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="border border-border text-foreground px-4 py-2 rounded uppercase text-sm tracking-wide hover:bg-muted transition cursor-pointer"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={grantConsent}
              className="bg-primary text-primary-foreground px-4 py-2 text-sm uppercase rounded-md hover:opacity-90 transition cursor-pointer"
            >
              Agree &amp; continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
