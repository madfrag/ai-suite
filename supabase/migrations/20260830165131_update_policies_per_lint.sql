-- ============================================================
-- chatbot_messages policies
-- ============================================================
drop policy if exists "Users can read their own chatbot messages" on public.chatbot_messages;
drop policy if exists "Users can insert their own chatbot messages" on public.chatbot_messages;
drop policy if exists "Users can update their own chatbot messages" on public.chatbot_messages;
drop policy if exists "Users can delete their own chatbot messages" on public.chatbot_messages;

create policy "Users can read their own chatbot messages"
on public.chatbot_messages
for select
to authenticated
using ((select auth.uid()) = user_id);


create policy "Users can insert their own chatbot messages"
on public.chatbot_messages
for insert
to authenticated
with check ((select auth.uid()) = user_id);


create policy "Users can update their own chatbot messages"
on public.chatbot_messages
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


create policy "Users can delete their own chatbot messages"
on public.chatbot_messages
for delete
to authenticated
using ((select auth.uid()) = user_id);


-- ============================================================
-- articles_summary policies
-- ============================================================

drop policy if exists "Users can read their own articles_summary" on public.articles_summary;
drop policy if exists "Users can insert their own articles_summary" on public.articles_summary;
drop policy if exists "Users can update their own articles_summary" on public.articles_summary;
drop policy if exists "Users can delete their own articles_summary" on public.articles_summary;

create policy "Users can read their own articles_summary"
on public.articles_summary
for select
to authenticated
using ((select auth.uid()) = user_id);


create policy "Users can insert their own articles_summary"
on public.articles_summary
for insert
to authenticated
with check ((select auth.uid()) = user_id);


create policy "Users can update their own articles_summary"
on public.articles_summary
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


create policy "Users can delete their own articles_summary"
on public.articles_summary
for delete
to authenticated
using ((select auth.uid()) = user_id);