-- ================================================================
-- Campus-Voice: profiles table, auto-create trigger, RLS policies
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- ================================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'student'
             check (role in ('student', 'faculty', 'admin')),
  dept       text,
  created_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. RLS policies

-- Anyone authenticated can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Users can update their own non-role columns
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'student');
  return new;
end;
$$;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
