'use client';

type TextInputProps = {
  text: string;
  onChange: (value: string) => void;
};

export default function TextInput({ text, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-lg uppercase tracking-wide text-foreground">
        Input Text
      </label>
      <textarea
        className="w-full h-40 p-4 text-base border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
        placeholder="Paste or write your content here..."
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
