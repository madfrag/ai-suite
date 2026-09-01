create table public.chat_session_summary (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  chat_session_id uuid not null,

  content text not null,

  created_at timestamptz not null default now()
);

create unique index chat_session_summary_user_session_unique_idx
  on public.chat_session_summary(user_id, chat_session_id);