alter table public.profiles add column if not exists username text;

update public.profiles
set username = 'spark_' || lower(substr(replace(id::text, '-', ''), 1, 8))
where username is null;

alter table public.profiles alter column username set not null;
alter table public.profiles add constraint profiles_username_format
  check (username ~ '^[a-z0-9_]{3,24}$');
create unique index profiles_username_unique on public.profiles (lower(username));

create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (sender_id, recipient_id),
  check (sender_id <> recipient_id)
);

alter table public.friend_requests enable row level security;

create policy "people see their friend requests" on public.friend_requests
for select to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());

create policy "people send friend requests" on public.friend_requests
for insert to authenticated
with check (sender_id = auth.uid());

create policy "recipients answer friend requests" on public.friend_requests
for update to authenticated
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());

create policy "people remove their friend requests" on public.friend_requests
for delete to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());
