-- ============================================================================
-- TaskTrack — tasks table
-- ----------------------------------------------------------------------------
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
--
-- It is safe to run more than once: every object is dropped-if-exists first,
-- so re-running after a tweak will not error out.
--
-- The important part is Row Level Security. Without it, ANY signed-in user can
-- read EVERY user's tasks — the API is public, and the only thing standing
-- between your data and the internet is these policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The table
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
  id           uuid        primary key default gen_random_uuid(),

  -- Who owns this row. Defaulting to auth.uid() means the app never has to
  -- send it, and `on delete cascade` means deleting an account takes its tasks
  -- with it rather than leaving orphans behind.
  user_id      uuid        not null default auth.uid()
                           references auth.users (id) on delete cascade,

  -- The "Enter task" box on the Add screen.
  title        text        not null,

  is_completed boolean     not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),

  -- Reject blank or whitespace-only titles at the database, not just in the UI.
  constraint tasks_title_not_blank
    check (length(btrim(title)) between 1 and 200),

  -- Keep the two "completed" columns from ever disagreeing with each other.
  constraint tasks_completed_at_matches_flag
    check (
      (is_completed and completed_at is not null)
      or (not is_completed and completed_at is null)
    )
);

-- ----------------------------------------------------------------------------
-- 2. Row Level Security — the part that actually protects the data
-- ----------------------------------------------------------------------------
alter table public.tasks enable row level security;

drop policy if exists "Users can read their own tasks"   on public.tasks;
drop policy if exists "Users can create their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

create policy "Users can read their own tasks"
  on public.tasks for select
  to authenticated
  using (auth.uid() = user_id);

-- `with check` is what stops someone inserting a row owned by somebody else.
create policy "Users can create their own tasks"
  on public.tasks for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Both clauses are needed: `using` decides which rows you may touch, and
-- `with check` stops you from editing one so that it belongs to another user.
create policy "Users can update their own tasks"
  on public.tasks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  to authenticated
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. Indexes for the two screens that list tasks
-- ----------------------------------------------------------------------------
-- Home ("5 Tasks for today") and Completed both filter by user, so the user
-- column leads both indexes.
create index if not exists tasks_user_created_idx
  on public.tasks (user_id, created_at desc);

create index if not exists tasks_user_completed_idx
  on public.tasks (user_id, is_completed, created_at desc);

-- ----------------------------------------------------------------------------
-- 4. Keep completed_at in step with is_completed automatically
-- ----------------------------------------------------------------------------
-- Without this the app would have to remember to set both columns together,
-- and the check constraint above would reject the row the first time it forgot.
create or replace function public.tasks_sync_completed_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- OLD does not exist on INSERT, so the two cases have to be handled apart.
  if tg_op = 'INSERT' then
    if new.is_completed then
      new.completed_at := coalesce(new.completed_at, now());
    else
      new.completed_at := null;
    end if;
  else
    if new.is_completed and not old.is_completed then
      new.completed_at := now();
    elsif not new.is_completed then
      new.completed_at := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists tasks_sync_completed_at on public.tasks;

create trigger tasks_sync_completed_at
  before insert or update on public.tasks
  for each row execute function public.tasks_sync_completed_at();

-- ----------------------------------------------------------------------------
-- 5. Confirm it worked
-- ----------------------------------------------------------------------------
-- Expect: rls_enabled = true, and policy_count = 4.
select
  c.relrowsecurity                          as rls_enabled,
  (select count(*) from pg_policies p
    where p.schemaname = 'public'
      and p.tablename  = 'tasks')           as policy_count
from pg_class c
where c.oid = 'public.tasks'::regclass;
