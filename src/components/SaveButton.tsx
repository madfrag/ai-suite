type Props = {
    onClick: () => void;
    disabled: boolean;
  };
  
  export default function SaveButton({ onClick, disabled }: Props) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="border border-border text-foreground px-6 py-2 rounded uppercase text-sm tracking-wide hover:bg-muted transition"
      >
        Save Summary
      </button>
    );
  }
  