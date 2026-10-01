import SummaryTabs from '@/components/SummaryTabs';
import { SUMMARIZE_DAILY_LIMIT } from '@/lib/consts';

export default function SummarizerPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-background text-foreground flex-1 py-16 px-4 md:px-8 outline-none"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground">
            AI Text Summarizer
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            Paste your content below and get either a short summary or bullet points using advanced
            AI models. Switch between summary types easily.
          </p>
        </div>

        <SummaryTabs openaiDailyLimit={SUMMARIZE_DAILY_LIMIT} />
      </div>
    </main>
  );
}
