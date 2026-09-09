alter table public.articles_summary
  add column provider text check (provider in ('huggingface', 'openai'));
