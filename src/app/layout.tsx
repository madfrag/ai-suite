import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import './globals.css';
import './custom.css';
import ThemeToggle from '@/components/ThemeToggle';
import { Providers } from '@/lib/providers';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Suite',
  description: 'A suite of AI tools for developers and enthusiasts.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await cookies()).get('theme')?.value === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <header className="fixed top-0 left-0 right-0 z-50 h-12 px-6 flex items-center justify-between border-b border-border/40 bg-background/90 backdrop-blur-md">
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <ThemeToggle initialTheme={theme} />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
