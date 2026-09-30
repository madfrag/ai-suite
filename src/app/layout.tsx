import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import './globals.css';
import './custom.css';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Providers>
          <header className="fixed top-0 left-0 right-0 z-50 h-12 px-6 flex items-center justify-between border-b border-border/40 bg-background/90 backdrop-blur-md">
            <nav aria-label="Primary">
              <Link
                href="/"
                className="text-sm font-semibold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
            </nav>
            <ThemeToggle initialTheme={theme} />
          </header>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
