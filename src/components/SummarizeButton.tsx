type Props = {
  onClick: () => void;
  loading: boolean;
};

export default function SummarizeButton({ onClick, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-black text-white px-6 py-2 uppercase text-sm tracking-wide hover:opacity-90 transition"
    >
      {loading ? 'Summarizing...' : 'Summarize'}
    </button>
  );
}
