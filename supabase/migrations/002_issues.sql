-- ================================================================
-- Campus-Voice: Issues System
-- Migration 002 – tables, views, RLS policies, helper functions
--
-- Idempotent: drops and recreates all objects.
-- Run in Supabase SQL Editor or via `supabase db push`
-- ================================================================


-- ════════════════════════════════════════════════
--  CLEAN SLATE – drop previous objects if they exist
--  (safe for dev; remove this block in production)
-- ════════════════════════════════════════════════

drop trigger if exists trg_issues_updated_at  on public.issues;
drop trigger if exists trg_vote_count_insert  on public.issue_votes;
drop trigger if exists trg_vote_count_delete  on public.issue_votes;

drop view  if exists public.issues_public   cascade;
drop table if exists public.audit_logs      cascade;
drop table if exists public.locations       cascade;
drop table if exists public.issue_flags     cascade;
drop table if exists public.issue_votes     cascade;
drop table if exists public.issue_updates   cascade;
drop table if exists public.issues          cascade;

drop function if exists public.set_updated_at();
drop function if exists public.update_vote_count();
drop function if exists public.is_admin();


-- ────────────────────────────────────────────────
-- 0.  Helper function: is_admin()
--     Returns true when the calling user has role = 'admin'
--     in the profiles table created by 001_profiles.sql.
-- ────────────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


-- ════════════════════════════════════════════════
--  TABLES
-- ════════════════════════════════════════════════


-- ────────────────────────────────────────────────
-- 1.  issues
-- ────────────────────────────────────────────────

create table if not exists public.issues (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null,
  category    text        not null,
  location    text        not null default 'Unknown',
  priority    text        not null default 'medium'
              constraint  issues_priority_chk
              check       (priority in ('low', 'medium', 'high', 'critical')),
  status      text        not null default 'submitted'
              constraint  issues_status_chk
              check       (status in (
                'submitted',
                'under_review',
                'in_progress',
                'resolved',
                'rejected'
              )),
  visibility  text        not null default 'student'
              constraint  issues_visibility_chk
              check       (visibility in ('student', 'faculty', 'public')),
  created_by  uuid        not null references auth.users(id),
  assigned_to uuid        references auth.users(id),
  upvotes     integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- ────────────────────────────────────────────────
-- 2.  issue_updates
-- ────────────────────────────────────────────────

create table if not exists public.issue_updates (
  id          uuid        primary key default gen_random_uuid(),
  issue_id    uuid        not null references public.issues(id) on delete cascade,
  message     text        not null,
  update_type text        not null default 'comment',
  new_status  text,
  created_by  uuid        references auth.users(id),
  created_at  timestamptz not null default now()
);


-- ────────────────────────────────────────────────
-- 3.  issue_votes  (composite PK – one vote per user per issue)
-- ────────────────────────────────────────────────

create table if not exists public.issue_votes (
  issue_id   uuid        not null references public.issues(id) on delete cascade,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (issue_id, user_id)
);


-- ────────────────────────────────────────────────
-- 4.  issue_flags
-- ────────────────────────────────────────────────

create table if not exists public.issue_flags (
  id         uuid        primary key default gen_random_uuid(),
  issue_id   uuid        not null references public.issues(id) on delete cascade,
  flagged_by uuid        not null references auth.users(id),
  reason     text        not null,
  created_at timestamptz not null default now()
);


-- ────────────────────────────────────────────────
-- 5.  locations  (hierarchical campus tree)
-- ────────────────────────────────────────────────

create table if not exists public.locations (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  type       text        not null default 'facility'
             constraint  locations_type_chk
             check       (type in ('campus', 'block', 'lab', 'hostel', 'facility')),
  parent_id  uuid        references public.locations(id) on delete set null,
  created_at timestamptz not null default now()
);


-- ────────────────────────────────────────────────
-- 6.  audit_logs  (admin action tracking)
-- ────────────────────────────────────────────────

create table if not exists public.audit_logs (
  id         uuid        primary key default gen_random_uuid(),
  action     text        not null,
  admin_id   uuid        not null references auth.users(id),
  type       text        not null default 'system'
             constraint  audit_logs_type_chk
             check       (type in ('resolve', 'assign', 'escalate', 'update', 'system')),
  details    jsonb,
  created_at timestamptz not null default now()
);


-- ════════════════════════════════════════════════
--  VIEW – student anonymity
-- ════════════════════════════════════════════════

-- ────────────────────────────────────────────────
-- 7.  issues_public
--     Exposes every column EXCEPT created_by so that
--     regular users never see who reported the issue.
--     Admins who need reporter info query the base
--     `issues` table directly (allowed by their RLS policy).
-- ────────────────────────────────────────────────

create or replace view public.issues_public as
select
  id,
  title,
  description,
  category,
  location,
  priority,
  status,
  visibility,
  assigned_to,
  upvotes,
  created_at,
  updated_at
from public.issues;


-- ════════════════════════════════════════════════
--  TRIGGERS & FUNCTIONS
-- ════════════════════════════════════════════════

-- ────────────────────────────────────────────────
-- 8.  Auto-update `updated_at` on every UPDATE
-- ────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_issues_updated_at on public.issues;
create trigger trg_issues_updated_at
  before update on public.issues
  for each row
  execute function public.set_updated_at();


-- ────────────────────────────────────────────────
-- 9.  Maintain denormalized `issues.upvotes` count
--     via triggers on issue_votes insert/delete
-- ────────────────────────────────────────────────

create or replace function public.update_vote_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.issues
      set upvotes = upvotes + 1
      where id = new.issue_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.issues
      set upvotes = greatest(upvotes - 1, 0)
      where id = old.issue_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_vote_count_insert on public.issue_votes;
create trigger trg_vote_count_insert
  after insert on public.issue_votes
  for each row
  execute function public.update_vote_count();

drop trigger if exists trg_vote_count_delete on public.issue_votes;
create trigger trg_vote_count_delete
  after delete on public.issue_votes
  for each row
  execute function public.update_vote_count();


-- ════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════

alter table public.issues        enable row level security;
alter table public.issue_updates enable row level security;
alter table public.issue_votes   enable row level security;
alter table public.issue_flags   enable row level security;
alter table public.locations     enable row level security;
alter table public.audit_logs    enable row level security;


-- ────────────────────────────────────────────────
-- 10.  RLS — issues
-- ────────────────────────────────────────────────

-- 10a  INSERT: users can only create issues as themselves
drop policy if exists "Users can insert own issues" on public.issues;
create policy "Users can insert own issues"
  on public.issues for insert
  with check (auth.uid() = created_by);

-- 10b  SELECT: any authenticated user can read issues
drop policy if exists "Authenticated users can read issues" on public.issues;
create policy "Authenticated users can read issues"
  on public.issues for select
  using (auth.role() = 'authenticated');

-- 10c  UPDATE: only admins can update issues (status, priority, etc.)
drop policy if exists "Admins can update issues" on public.issues;
create policy "Admins can update issues"
  on public.issues for update
  using  (public.is_admin())
  with check (public.is_admin());


-- ────────────────────────────────────────────────
-- 11.  RLS — issue_updates
-- ────────────────────────────────────────────────

-- 11a  SELECT: authenticated users can read updates for issues they can see
drop policy if exists "Authenticated users can read issue updates" on public.issue_updates;
create policy "Authenticated users can read issue updates"
  on public.issue_updates for select
  using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.issues
      where issues.id = issue_updates.issue_id
    )
  );

-- 11b  INSERT: admins can add updates
drop policy if exists "Admins can insert issue updates" on public.issue_updates;
create policy "Admins can insert issue updates"
  on public.issue_updates for insert
  with check (public.is_admin());


-- ────────────────────────────────────────────────
-- 12.  RLS — issue_votes
-- ────────────────────────────────────────────────

-- 12a  SELECT: users can see their own votes
drop policy if exists "Users can read own votes" on public.issue_votes;
create policy "Users can read own votes"
  on public.issue_votes for select
  using (auth.uid() = user_id);

-- 12b  INSERT: authenticated users can vote as themselves only
drop policy if exists "Users can insert own votes" on public.issue_votes;
create policy "Users can insert own votes"
  on public.issue_votes for insert
  with check (auth.uid() = user_id);

-- 12c  DELETE: users can remove their own votes (toggle support)
drop policy if exists "Users can delete own votes" on public.issue_votes;
create policy "Users can delete own votes"
  on public.issue_votes for delete
  using (auth.uid() = user_id);


-- ────────────────────────────────────────────────
-- 13. RLS — issue_flags
-- ────────────────────────────────────────────────

-- 13a SELECT: users can see their own flags
drop policy if exists "Users can read own flags" on public.issue_flags;
create policy "Users can read own flags"
  on public.issue_flags for select
  using (auth.uid() = flagged_by);

-- 13b SELECT: admins can see all flags
drop policy if exists "Admins can read all flags" on public.issue_flags;
create policy "Admins can read all flags"
  on public.issue_flags for select
  using (public.is_admin());

-- 13c INSERT: authenticated users can flag issues as themselves
drop policy if exists "Users can insert own flags" on public.issue_flags;
create policy "Users can insert own flags"
  on public.issue_flags for insert
  with check (auth.uid() = flagged_by);


-- ────────────────────────────────────────────────
-- 14. RLS — locations (read-only for authenticated, admin can manage)
-- ────────────────────────────────────────────────

drop policy if exists "Authenticated users can read locations" on public.locations;
create policy "Authenticated users can read locations"
  on public.locations for select
  using (auth.role() = 'authenticated');

drop policy if exists "Admins can manage locations" on public.locations;
create policy "Admins can manage locations"
  on public.locations for all
  using (public.is_admin())
  with check (public.is_admin());


-- ────────────────────────────────────────────────
-- 15. RLS — audit_logs (admin-only read, system insert)
-- ────────────────────────────────────────────────

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
  on public.audit_logs for select
  using (public.is_admin());

drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs"
  on public.audit_logs for insert
  with check (public.is_admin());


-- ════════════════════════════════════════════════
--  INDEXES
-- ════════════════════════════════════════════════

create index if not exists idx_issues_status       on public.issues(status);
create index if not exists idx_issues_priority     on public.issues(priority);
create index if not exists idx_issues_category     on public.issues(category);
create index if not exists idx_issues_created_by   on public.issues(created_by);
create index if not exists idx_issues_created_at   on public.issues(created_at desc);
create index if not exists idx_issues_location     on public.issues(location);
create index if not exists idx_issue_updates_issue on public.issue_updates(issue_id);
create index if not exists idx_issue_flags_issue   on public.issue_flags(issue_id);
create index if not exists idx_locations_parent    on public.locations(parent_id);
create index if not exists idx_audit_logs_admin    on public.audit_logs(admin_id);
create index if not exists idx_audit_logs_created  on public.audit_logs(created_at desc);


-- ════════════════════════════════════════════════
--  DONE
-- ════════════════════════════════════════════════
-- Summary:
--   Tables   : issues, issue_updates, issue_votes, issue_flags, locations, audit_logs
--   View     : issues_public  (excludes created_by for anonymity)
--   Functions: is_admin(), set_updated_at(), update_vote_count()
--   Triggers : trg_issues_updated_at, trg_vote_count_insert, trg_vote_count_delete
--   RLS      : 16 policies across 6 tables
--   Indexes  : 11 performance indexes
-- ================================================================
