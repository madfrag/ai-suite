'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';
import SummaryTabs from '@/components/SummaryTabs';

export default function SummarizerPage() {
  const [text, setText] = useState('');

  return (
    <main className="bg-neutral-100 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto grid gap-12">
        <div className="grid gap-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-neutral-900">
            AI Text Summarizer
          </h1>
          <p className="text-neutral-600 tracking-wide leading-relaxed max-w-prose">
            Paste your content below and get either a short summary or bullet points using advanced AI models. Switch between summary types easily.
          </p>
        </div>

        <TextInput text={text} onChange={setText} />
        <SummaryTabs text={text} />
      </div>
    </main>
  );
}
