create table public.api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  endpoint text not null,
  request_date date not null default current_date,
  request_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index api_rate_limits_ip_endpoint_date_idx
  on public.api_rate_limits (ip_address, endpoint, request_date);

alter table public.api_rate_limits enable row level security;

-- Not user-owned data (keyed by IP, shared across whoever's behind it), so this
-- is intentionally open to any authenticated (including anonymous) caller rather
-- than scoped by auth.uid() like the other tables.
create policy "Authenticated can read rate limits"
  on public.api_rate_limits for select to authenticated using (true);
create policy "Authenticated can upsert rate limits"
  on public.api_rate_limits for insert to authenticated with check (true);
create policy "Authenticated can update rate limits"
  on public.api_rate_limits for update to authenticated using (true) with check (true);

create or replace function public.increment_rate_limit(p_ip_address text, p_endpoint text)
returns integer
language plpgsql
as $$
declare
  v_count integer;
begin
  insert into public.api_rate_limits (ip_address, endpoint, request_date, request_count)
  values (p_ip_address, p_endpoint, current_date, 1)
  on conflict (ip_address, endpoint, request_date)
  do update set request_count = api_rate_limits.request_count + 1, updated_at = now()
  returning request_count into v_count;

  return v_count;
end;
$$;

grant execute on function public.increment_rate_limit(text, text) to authenticated;
