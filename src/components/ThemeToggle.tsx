'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [cookies, setCookie] = useCookies(['theme']);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const cookieTheme = cookies.theme || 'light';
    setTheme(cookieTheme);
    document.documentElement.classList.toggle('dark', cookieTheme === 'dark');
  }, [cookies]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCookie('theme', newTheme, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // ❌ Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
