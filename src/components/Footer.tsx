'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GITHUB_URL = 'https://github.com/madfrag/ai-suite';

function LegalNav() {
  return (
    <nav aria-label="Legal" className="flex items-center gap-4 text-xs normal-case tracking-normal">
      <Link href="/impressum" className="hover:text-foreground hover:underline transition">
        Impressum
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/datenschutz" className="hover:text-foreground hover:underline transition">
        Datenschutz
      </Link>
    </nav>
  );
}

export default function Footer() {
  // The chat page is a fixed-height app view (only the message list scrolls),
  // so it gets a slim footer. Its height (h-10) must match the 2.5rem that
  // ChatUI subtracts from 100dvh.
  if (usePathname().startsWith('/chatbot')) {
    return (
      <footer className="h-10 shrink-0 border-t border-border flex items-center justify-center text-muted-foreground">
        <LegalNav />
      </footer>
    );
  }

  return (
    <footer className="border-t border-border py-6 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground uppercase tracking-wide">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition"
        aria-label="GitHub repository"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
        </svg>
      </a>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
        &copy; 2026 Rushan Engalychev
      </a>
      <LegalNav />
    </footer>
  );
}
