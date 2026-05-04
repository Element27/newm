create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  primary_style text,
  size text,
  style_preferences text[] not null default '{}',
  onboarding_completed boolean not null default false,
  uploaded_first_item boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can view own profile'
  ) then
    create policy "Users can view own profile" on profiles
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile" on profiles
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile" on profiles
      for update using (auth.uid() = user_id);
  end if;
end $$;
