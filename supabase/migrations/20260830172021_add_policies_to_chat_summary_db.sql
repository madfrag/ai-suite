
alter table public.chat_session_summary enable row level security;

create policy "Users can read their own chat session summaries"
on public.chat_session_summary
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their own chat session summaries"
on public.chat_session_summary
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own chat session summaries"
on public.chat_session_summary
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own chat session summaries"
on public.chat_session_summary
for delete
to authenticated
using ((select auth.uid()) = user_id);