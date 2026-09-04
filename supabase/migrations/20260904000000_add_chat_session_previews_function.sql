create or replace function public.get_chat_session_previews()
returns table (
  chat_session_id uuid,
  content text,
  created_at timestamptz
)
language sql
stable
as $$
  select * from (
    select distinct on (chat_session_id)
      chat_session_id,
      content,
      created_at
    from public.chatbot_messages
    where role = 'user'
      and user_id = auth.uid()
    order by chat_session_id, created_at asc
  ) first_messages
  order by created_at desc;
$$;

grant execute on function public.get_chat_session_previews() to authenticated;
