create table if not exists weekly_plans (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  days jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

alter table weekly_plans enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'weekly_plans'
      and policyname = 'Users can view own weekly plans'
  ) then
    create policy "Users can view own weekly plans" on weekly_plans
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'weekly_plans'
      and policyname = 'Users can insert own weekly plans'
  ) then
    create policy "Users can insert own weekly plans" on weekly_plans
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'weekly_plans'
      and policyname = 'Users can update own weekly plans'
  ) then
    create policy "Users can update own weekly plans" on weekly_plans
      for update using (auth.uid() = user_id);
  end if;
end $$;
