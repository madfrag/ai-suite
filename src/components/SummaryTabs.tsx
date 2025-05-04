'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch'; // from shadcn-ui
import SummarizeButton from './SummarizeButton';
import SaveButton from './SaveButton';
import SummaryCard from './SummaryCard';

export default function SummaryTabs({ text }: { text: string }) {
  const [provider, setProvider] = useState<'huggingface' | 'openai'>('huggingface');
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, provider }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults((prev) => ({ ...prev, [provider]: data.summaryText }));
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    const summary = results[provider];
    if (!summary) return;

    const res = await fetch('/api/save-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original: text, summary }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Failed to save.');
    } else {
      alert('Saved!');
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-neutral-600">Short Summary</span>
        <Switch
          checked={provider === 'openai'}
          onCheckedChange={(checked) =>
            setProvider(checked ? 'openai' : 'huggingface')
          }
        />
        <span className="text-sm font-medium text-neutral-600">Bullet Points</span>
      </div>

      <div className="flex gap-4">
        <SummarizeButton onClick={summarize} loading={loading} />
        <SaveButton onClick={save} disabled={!results[provider]} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {results[provider] && (
        <SummaryCard
          title={provider === 'openai' ? 'Bullet Point Summary' : 'Short Summary'}
          content={results[provider]}
        />
      )}
    </div>
  );
}
