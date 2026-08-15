type SummaryCardProps = {
  title: string;
  content: string;
};

export default function SummaryCard({ title, content }: SummaryCardProps) {
  return (
    <div className="border-t-4 border-primary bg-card p-6 shadow-md text-card-foreground">
      <h2 className="uppercase font-bold text-sm tracking-wider text-muted-foreground mb-2">
        {title}
      </h2>
      <p className="whitespace-pre-line leading-relaxed text-base">{content}</p>
    </div>
  );
}
