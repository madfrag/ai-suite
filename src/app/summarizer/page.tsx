'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn'; // Optional utility for conditionally joining classes

export default function Home() {
  const [text, setText] = useState('');
  const [provider, setProvider] = useState<'huggingface' | 'openai'>('openai');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setSummary('');
    setError('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, provider }),
      });

      const data = await res.json();

      if (res.ok) {
        setSummary(data.summaryText || 'No summary received.');
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">Summarize your article</h1>

        <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Summary Type:</label>
          <div className="flex gap-2">
            <button
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                provider === 'huggingface' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              )}
              onClick={() => setProvider('huggingface')}
            >
              Short summary
            </button>
            <button
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                provider === 'openai' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              )}
              onClick={() => setProvider('openai')}
            >
              Bullet points
            </button>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={summarize}
          disabled={loading}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            ⚠️ {error}
          </div>
        )}
      </div>

      {summary && (
        <div className="max-w-xl w-full bg-white mt-6 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary:</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {summary}
          </div>
        </div>
      )}
    </main>
  );
}
