-- increment_rate_limit takes the IP address as a caller-supplied argument, so
-- anyone holding the publishable key could call it directly with an arbitrary
-- IP, either to grief another visitor's limit or dodge their own. Only the
-- app's own server (using the service_role key) should ever call this.
--
-- Supabase grants EXECUTE on new functions directly to anon/authenticated (via
-- schema-level default privileges, not just PUBLIC), so both need revoking.
revoke execute on function public.increment_rate_limit(text, text) from public, anon, authenticated;
grant execute on function public.increment_rate_limit(text, text) to service_role;

drop policy if exists "Authenticated can read rate limits" on public.api_rate_limits;
drop policy if exists "Authenticated can upsert rate limits" on public.api_rate_limits;
drop policy if exists "Authenticated can update rate limits" on public.api_rate_limits;
