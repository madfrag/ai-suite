type Props = {
  onClick: () => void;
  loading: boolean;
};

export default function SummarizeButton({ onClick, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-primary text-primary-foreground px-6 py-2 rounded uppercase text-sm tracking-wide hover:opacity-90 transition inline-flex items-center gap-4"
    >
      {loading && <span className="waiting" aria-hidden="true" />}
      {/* aria-live (not role="status") — a role would exclude this text from
          the button's own accessible-name computation, silently naming it "". */}
      <span aria-live="polite">{loading ? 'Summarizing...' : 'Summarize'}</span>
    </button>
  );
}
