type Props = {
    onClick: () => void;
    disabled: boolean;
  };
  
  export default function SaveButton({ onClick, disabled }: Props) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="border border-black text-black px-6 py-2 uppercase text-sm tracking-wide hover:bg-black hover:text-white transition"
      >
        Save Summary
      </button>
    );
  }
  