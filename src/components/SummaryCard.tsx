'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type SummaryCardProps = {
  title: string;
  content: string;
  onSave?: () => void;
  saved?: boolean;
};

export default function SummaryCard({ title, content, onSave, saved }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t-4 border-primary bg-card p-6 shadow-md text-card-foreground">
      <div className="flex items-center justify-between mb-2 gap-4">
        <h2 className="uppercase font-bold text-sm tracking-wider text-muted-foreground">
          {title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Copy summary"
          >
            {copied ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
            <span role="status" className="sr-only">
              {copied ? 'Copied to clipboard' : ''}
            </span>
          </button>
          {onSave && (
            <button
              onClick={onSave}
              disabled={saved}
              className="border border-border text-foreground px-3 py-1 rounded uppercase text-xs tracking-wide hover:bg-muted transition disabled:opacity-60"
            >
              {/* aria-live (not role="status") — a role would exclude this text from
                  the button's own accessible-name computation, silently naming it "". */}
              <span aria-live="polite">{saved ? 'Saved' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>
      <p className="whitespace-pre-line leading-relaxed text-base">{content}</p>
    </div>
  );
}
