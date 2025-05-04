'use client';

export default function SummarizeButton() {
  const handleClick = async () => {
    const text = document.querySelector('textarea')?.value;
    if (!text) return;

    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, provider: 'huggingface' }),
    });

    const data = await response.json();
    document.getElementById("summarized")!.innerHTML = data.summaryText;
    console.log('Summary:response:', response);
    console.log('Summary:data:', data);

    // No direct Supabase call here!
    // Insert to DB is handled in /api/summarize
  }

  return (
    <button
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      onClick={handleClick}
    >
      Summarize
    </button>
  )
}
