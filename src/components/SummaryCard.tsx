type SummaryCardProps = {
    title: string;
    content: string;
  };
  
  export default function SummaryCard({ title, content }: SummaryCardProps) {
    return (
      <div className="border-t-4 border-black bg-white p-6 shadow-md">
        <h2 className="uppercase font-bold text-sm tracking-wider text-neutral-700 mb-2">
          {title}
        </h2>
        <p className="whitespace-pre-line text-neutral-900 leading-relaxed text-base">
          {content}
        </p>
      </div>
    );
  }
  