-- Supabase RLS policies
create policy "User owns SOP" on public.sops
  for all using (auth.uid() = user_id);
