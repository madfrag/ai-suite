'use client';

type TextInputProps = {
  text: string;
  onChange: (value: string) => void;
};

export default function TextInput({ text, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-lg uppercase tracking-wide text-neutral-800">
        Input Text
      </label>
      <textarea
        className="w-full h-40 p-4 text-base border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="Paste or write your content here..."
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
