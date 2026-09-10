'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch'; // from shadcn-ui
import SummarizeButton from './SummarizeButton';
import SummaryCard from './SummaryCard';

type Provider = 'huggingface' | 'openai';

type SavedSummary = {
  id: string;
  original: string;
  summary: string;
  provider: Provider | null;
  created_at: string;
};

const PROVIDER_LABEL: Record<Provider, string> = {
  huggingface: 'HuggingFace',
  openai: 'OpenAI',
};

export default function SummaryTabs({ openaiDailyLimit }: { openaiDailyLimit: number }) {
  const [text, setText] = useState('');
  const [provider, setProvider] = useState<Provider>('huggingface');
  const [results, setResults] = useState<{ [key in Provider]?: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedMap, setSavedMap] = useState<{ [key in Provider]?: boolean }>({});

  const [isOpen, setIsOpen] = useState(false);
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [savedSummariesLoading, setSavedSummariesLoading] = useState(false);
  const [viewingSaved, setViewingSaved] = useState<SavedSummary | null>(null);
  const [copiedOriginal, setCopiedOriginal] = useState(false);

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

  const save = async (targetProvider: Provider) => {
    const summary = results[targetProvider];
    if (!summary) return;

    setError('');

    const res = await fetch('/api/save-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original: text, summary, provider: targetProvider }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to save.');
      return;
    }

    setSavedMap((prev) => ({ ...prev, [targetProvider]: true }));
    setTimeout(() => setSavedMap((prev) => ({ ...prev, [targetProvider]: false })), 2000);
  };

  const loadSavedSummaries = async () => {
    setSavedSummariesLoading(true);
    const res = await fetch('/api/summaries');
    if (res.ok) {
      const data = await res.json();
      setSavedSummaries(data.summaries);
    }
    setSavedSummariesLoading(false);
  };

  const viewSavedSummary = (item: SavedSummary) => {
    setViewingSaved(item);
    setIsOpen(false);
  };

  const copyOriginal = () => {
    if (!viewingSaved) return;
    navigator.clipboard.writeText(viewingSaved.original);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const startNewSummary = () => {
    setViewingSaved(null);
    setText('');
    setResults({});
    setSavedMap({});
    setError('');
  };

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        className="border border-border rounded-lg shadow-sm w-full"
        value={isOpen ? 'saved-summaries' : ''}
        onValueChange={(value) => {
          setIsOpen(!!value);
          if (value) loadSavedSummaries();
        }}
      >
        <AccordionItem value="saved-summaries">
          <AccordionTrigger className="cursor-pointer flex justify-between items-center text-lg font-medium px-4 py-3 bg-muted text-muted-foreground hover:bg-muted/80 rounded-t-lg w-full">
            <span>Previous Summaries</span>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </AccordionTrigger>
          <AccordionContent className="p-4 space-y-3 max-h-75 overflow-y-auto bg-card text-card-foreground rounded-b-lg border-t border-border w-full">
            {savedSummariesLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!savedSummariesLoading && savedSummaries.length === 0 && (
              <p className="text-sm text-muted-foreground">No saved summaries found.</p>
            )}
            {savedSummaries.map((item) => (
              <button
                key={item.id}
                onClick={() => viewSavedSummary(item)}
                className="block w-full text-left border border-border rounded-md p-3 bg-background hover:bg-muted transition"
              >
                <span className="uppercase font-semibold text-xs text-muted-foreground mr-2">
                  {item.provider ? PROVIDER_LABEL[item.provider] : 'Unknown'}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  {item.original.length > 100 ? `${item.original.slice(0, 100)}…` : item.original}
                </span>
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {viewingSaved ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Viewing a saved summary</p>
            <button
              onClick={startNewSummary}
              className="border border-border text-foreground px-4 py-2 rounded uppercase text-sm tracking-wide hover:bg-muted transition"
            >
              + New Summary
            </button>
          </div>

          <div className="space-y-4 bg-card text-card-foreground border border-border rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Original Text
              </label>
              <button
                onClick={copyOriginal}
                className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Copy original text"
              >
                {copiedOriginal ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <textarea
              value={viewingSaved.original}
              readOnly
              className="w-full min-h-[180px] p-4 text-sm rounded-md bg-background border border-border text-foreground cursor-default"
            />
          </div>

          <SummaryCard
            title={`${viewingSaved.provider ? PROVIDER_LABEL[viewingSaved.provider] : 'Unknown'} — Summary`}
            content={viewingSaved.summary}
          />
        </>
      ) : (
        <>
          <div className="space-y-4 bg-card text-card-foreground border border-border rounded-xl p-6 shadow">
            <label className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Input Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or write your content here..."
              className="w-full min-h-[180px] p-4 text-sm rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Toggle Switch Area */}
          <div className="flex items-center gap-4 bg-card border border-border rounded-md p-4 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              HuggingFace (Short Summary)
            </span>
            <Switch
              checked={provider === 'openai'}
              onCheckedChange={(checked) => setProvider(checked ? 'openai' : 'huggingface')}
            />
            <span className="text-sm font-medium text-muted-foreground">
              OpenAI (Bullet Points)
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            OpenAI summaries are limited to {openaiDailyLimit}/day per visitor. HuggingFace has no
            daily cap here, but it&apos;s a free-tier API and may rate-limit on its own —
            you&apos;ll see a message if that happens.
          </p>

          <SummarizeButton onClick={summarize} loading={loading} />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2 w-fit">
              {error}
            </p>
          )}

          {/* Summary Output — both stay visible once generated, so switching providers */}
          {/* to compare outputs doesn't hide one you already have. */}
          {results.huggingface && (
            <SummaryCard
              title="HuggingFace — Short Summary"
              content={results.huggingface}
              onSave={() => save('huggingface')}
              saved={!!savedMap.huggingface}
            />
          )}
          {results.openai && (
            <SummaryCard
              title="OpenAI — Bullet Point Summary"
              content={results.openai}
              onSave={() => save('openai')}
              saved={!!savedMap.openai}
            />
          )}
        </>
      )}
    </div>
  );
}
