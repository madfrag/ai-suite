import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import { Providers } from '@/lib/providers';
import HomeButton from '@/components/HomeButton';

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
  const theme = (await cookies()).get('theme')?.value ?? 'light';
  const isDark = theme === 'dark';
  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <header className="fixed top-4 left-4"></header>
          {/* <HomeButton /> */}
          <div style={{ background: 'black' }}>
            <button
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
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-10"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"></path>
              </svg>
            </button>
          </div>
          {children}
          <div className="fixed bottom-0 right-0 p-4">
            <ThemeToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
