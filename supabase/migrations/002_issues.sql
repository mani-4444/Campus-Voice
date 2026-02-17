-- ================================================================
-- Campus-Voice: issues table and related tables
-- Run this in the Supabase SQL Editor (or via supabase db push).
-- ================================================================

-- 1. Create issues table
create table if not exists public.issues (
  id          serial primary key,
  title       text not null,
  description text not null,
  status      text not null default 'submitted'
              check (status in ('submitted', 'under_review', 'in_progress', 'resolved')),
  priority    text not null default 'medium'
              check (priority in ('critical', 'high', 'medium', 'low')),
  category    text not null,
  location    text not null,
  reporter_id uuid references public.profiles(id) on delete set null,
  assigned_to text,
  upvotes     int not null default 0,
  progress    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Create issue_updates table
create table if not exists public.issue_updates (
  id         serial primary key,
  issue_id   int not null references public.issues(id) on delete cascade,
  author     text not null,
  message    text not null,
  type       text not null default 'update'
             check (type in ('system', 'assign', 'update', 'critical')),
  created_at timestamptz not null default now()
);

-- 3. Create issue_votes table
create table if not exists public.issue_votes (
  id         serial primary key,
  issue_id   int not null references public.issues(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(issue_id, user_id)
);

-- 4. Create issue_flags table
create table if not exists public.issue_flags (
  id         serial primary key,
  issue_id   int not null references public.issues(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  reason     text not null,
  created_at timestamptz not null default now()
);

-- 5. Create locations table
create table if not exists public.locations (
  id         text primary key,
  name       text not null,
  type       text not null
             check (type in ('campus', 'block', 'lab', 'hostel', 'facility')),
  parent_id  text references public.locations(id) on delete set null,
  issue_count int not null default 0
);

-- 6. Create audit_logs table
create table if not exists public.audit_logs (
  id         serial primary key,
  action     text not null,
  admin_id   uuid not null references public.profiles(id) on delete no action,
  type       text not null default 'system'
             check (type in ('resolve', 'assign', 'escalate', 'update', 'system')),
  created_at timestamptz not null default now()
);

-- 7. Enable RLS on all tables
alter table public.issues enable row level security;
alter table public.issue_updates enable row level security;
alter table public.issue_votes enable row level security;
alter table public.issue_flags enable row level security;
alter table public.locations enable row level security;
alter table public.audit_logs enable row level security;

-- 8. RLS policies for issues

-- Anyone can read issues
create policy "Anyone can read issues"
  on public.issues for select
  using (true);

-- Authenticated users can create issues
create policy "Authenticated users can create issues"
  on public.issues for insert
  with check (auth.role() = 'authenticated');

-- Admins can update issues
create policy "Admins can update issues"
  on public.issues for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 9. RLS policies for issue_updates

-- Anyone can read issue updates
create policy "Anyone can read issue updates"
  on public.issue_updates for select
  using (true);

-- Faculty and admins can create updates
create policy "Faculty and admins can create updates"
  on public.issue_updates for insert
  with check (
    auth.role() = 'authenticated' and (
      exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('faculty', 'admin')
      )
    )
  );

-- 10. RLS policies for issue_votes

-- Authenticated users can read their own votes
create policy "Users can read their own votes"
  on public.issue_votes for select
  using (auth.uid() = user_id);

-- Admins can read all votes
create policy "Admins can read all votes"
  on public.issue_votes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Authenticated users can create votes
create policy "Authenticated users can create votes"
  on public.issue_votes for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);

-- Authenticated users can delete their own votes
create policy "Users can delete their own votes"
  on public.issue_votes for delete
  using (auth.uid() = user_id);

-- 11. RLS policies for locations

-- Anyone can read locations
create policy "Anyone can read locations"
  on public.locations for select
  using (true);

-- Admins can manage locations
create policy "Admins can manage locations"
  on public.locations for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update locations"
  on public.locations for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete locations"
  on public.locations for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 12. RLS policies for audit_logs

-- Only admins can read audit logs
create policy "Admins can read audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can create audit logs
create policy "Admins can create audit logs"
  on public.audit_logs for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 13. Create indexes for performance
create index idx_issues_status on public.issues(status);
create index idx_issues_priority on public.issues(priority);
create index idx_issues_location on public.issues(location);
create index idx_issues_reporter_id on public.issues(reporter_id);
create index idx_issue_updates_issue_id on public.issue_updates(issue_id);
create index idx_issue_votes_issue_id on public.issue_votes(issue_id);
create index idx_issue_votes_user_id on public.issue_votes(user_id);
create index idx_issue_flags_issue_id on public.issue_flags(issue_id);
create index idx_locations_parent_id on public.locations(parent_id);
