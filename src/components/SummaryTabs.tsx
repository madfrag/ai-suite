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
      {/* Toggle Switch Area */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-md p-4 shadow-sm">
        <span className="text-sm font-medium text-muted-foreground">
          HuggingFace (Short Summary)
        </span>
        <Switch
          checked={provider === 'openai'}
          onCheckedChange={(checked) => setProvider(checked ? 'openai' : 'huggingface')}
        />
        <span className="text-sm font-medium text-muted-foreground">OpenAI (Bullet Points)</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <SummarizeButton onClick={summarize} loading={loading} />
        <SaveButton onClick={save} disabled={!results[provider]} />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2 w-fit">
          {error}
        </p>
      )}

      {/* Summary Output */}
      {results[provider] && (
        <SummaryCard
          title={provider === 'openai' ? 'Bullet Point Summary' : 'Short Summary'}
          content={results[provider]}
        />
      )}
    </div>
  );
}
