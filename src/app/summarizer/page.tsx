'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';
import SummaryTabs from '@/components/SummaryTabs';

export default function SummarizerPage() {
    const [text, setText] = useState('');

    return (
        <main className="bg-background text-foreground min-h-screen py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground">
                        AI Text Summarizer
                    </h1>
                    <p className="text-muted-foreground leading-relaxed max-w-prose">
                        Paste your content below and get either a short summary or bullet points using advanced AI models. Switch between summary types easily.
                    </p>
                </div>

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

                <SummaryTabs text={text} />
            </div>
        </main>
    );
}
