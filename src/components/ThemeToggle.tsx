'use client';

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

export default function ThemeToggle({ initialTheme }: { initialTheme: 'light' | 'dark' }) {
  const [, setCookie] = useCookies(['theme']);
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setCookie('theme', newTheme, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun
        className={`absolute w-4 h-4 transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
      />
      <Moon
        className={`absolute w-4 h-4 transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      />
    </button>
  );
}
