'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary transition"
      aria-label="Go to homepage"
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 50,
        mixBlendMode: 'difference',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <Home className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
      Home
    </Link>
  );
}
