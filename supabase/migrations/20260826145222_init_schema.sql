-- ============================================================
-- chatbot_messages
-- ============================================================

create table public.chatbot_messages (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    default auth.uid()
    references auth.users(id)
    on delete cascade,

  chat_session_id uuid not null,

  role text not null
    check (role in ('user', 'assistant', 'system')),

  content text not null,

  created_at timestamptz not null default now()
);


-- ============================================================
-- summaries
-- ============================================================

create table public.summaries (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    default auth.uid()
    references auth.users(id)
    on delete cascade,

  original text not null,

  summary text not null,

  created_at timestamptz not null default now()
);


-- ============================================================
-- Indexes
-- ============================================================

create index chatbot_messages_user_id_idx
  on public.chatbot_messages(user_id);

create index chatbot_messages_session_id_idx
  on public.chatbot_messages(chat_session_id);

create index chatbot_messages_created_at_idx
  on public.chatbot_messages(created_at);

create index summaries_user_id_idx
  on public.summaries(user_id);

create index summaries_created_at_idx
  on public.summaries(created_at);


-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.chatbot_messages enable row level security;
alter table public.summaries enable row level security;


-- ============================================================
-- chatbot_messages policies
-- ============================================================

create policy "Users can read their own chatbot messages"
on public.chatbot_messages
for select
to authenticated
using (auth.uid() = user_id);


create policy "Users can insert their own chatbot messages"
on public.chatbot_messages
for insert
to authenticated
with check (auth.uid() = user_id);


create policy "Users can update their own chatbot messages"
on public.chatbot_messages
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "Users can delete their own chatbot messages"
on public.chatbot_messages
for delete
to authenticated
using (auth.uid() = user_id);


-- ============================================================
-- summaries policies
-- ============================================================

create policy "Users can read their own summaries"
on public.summaries
for select
to authenticated
using (auth.uid() = user_id);


create policy "Users can insert their own summaries"
on public.summaries
for insert
to authenticated
with check (auth.uid() = user_id);


create policy "Users can update their own summaries"
on public.summaries
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "Users can delete their own summaries"
on public.summaries
for delete
to authenticated
using (auth.uid() = user_id);