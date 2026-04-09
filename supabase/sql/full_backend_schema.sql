-- Full backend schema for SocialdZ
-- Safe to run multiple times in Supabase SQL Editor (idempotent where possible)

create extension if not exists pgcrypto;

-- =========================================================
-- Utility functions
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- KV compatibility table (current runtime storage)
-- =========================================================

create table if not exists public.kv_store_0d8dae93 (
  key text primary key,
  value jsonb not null
);

alter table public.kv_store_0d8dae93 replica identity full;

create index if not exists idx_kv_store_0d8dae93_key_prefix
  on public.kv_store_0d8dae93 (key);

-- =========================================================
-- Core user profile + security settings
-- =========================================================

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Utilisateur',
  email text,
  company text not null default '',
  role text not null default '',
  timezone text not null default 'UTC+1 (Alger)',
  language text not null default 'Francais',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_user_profiles_full_name_len check (char_length(full_name) <= 120),
  constraint chk_user_profiles_email_len check (email is null or char_length(email) <= 254),
  constraint chk_user_profiles_company_len check (char_length(company) <= 120),
  constraint chk_user_profiles_role_len check (char_length(role) <= 120),
  constraint chk_user_profiles_timezone_len check (char_length(timezone) <= 100),
  constraint chk_user_profiles_language_len check (char_length(language) <= 50)
);

create unique index if not exists idx_user_profiles_email_unique
  on public.user_profiles (lower(email))
  where email is not null;

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

create table if not exists public.user_security_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  two_factor_enabled boolean not null default false,
  two_factor_secret text,
  pending_two_factor_secret text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_security_settings_updated_at on public.user_security_settings;
create trigger trg_user_security_settings_updated_at
before update on public.user_security_settings
for each row
execute function public.set_updated_at();

create table if not exists public.user_notification_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email boolean not null default true,
  push boolean not null default true,
  post_published boolean not null default true,
  weekly_report boolean not null default true,
  team_activity boolean not null default false,
  new_follower boolean not null default false,
  token_low boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_notification_settings_updated_at on public.user_notification_settings;
create trigger trg_user_notification_settings_updated_at
before update on public.user_notification_settings
for each row
execute function public.set_updated_at();

create table if not exists public.user_appearance_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'Systeme',
  accent_color text not null default '#2563EB',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_user_appearance_settings_theme check (theme in ('Clair', 'Sombre', 'Systeme')),
  constraint chk_user_appearance_settings_accent check (accent_color ~* '^#[0-9a-f]{6}$')
);

drop trigger if exists trg_user_appearance_settings_updated_at on public.user_appearance_settings;
create trigger trg_user_appearance_settings_updated_at
before update on public.user_appearance_settings
for each row
execute function public.set_updated_at();

create table if not exists public.user_integration_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  canva boolean not null default true,
  google_analytics boolean not null default true,
  whatsapp_business boolean not null default false,
  shopify boolean not null default false,
  cib_dahabia boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_integration_settings_updated_at on public.user_integration_settings;
create trigger trg_user_integration_settings_updated_at
before update on public.user_integration_settings
for each row
execute function public.set_updated_at();

create table if not exists public.user_billing_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  card_brand text not null default 'CIB / Dahabia',
  card_last4 text not null default '8742',
  card_expiry text not null default '06/2028',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_user_billing_settings_last4 check (card_last4 ~ '^[0-9]{4}$')
);

drop trigger if exists trg_user_billing_settings_updated_at on public.user_billing_settings;
create trigger trg_user_billing_settings_updated_at
before update on public.user_billing_settings
for each row
execute function public.set_updated_at();

-- =========================================================
-- Token economy
-- =========================================================

create table if not exists public.user_token_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance integer not null default 500,
  total_used integer not null default 0,
  plan text not null default 'Decouverte',
  monthly_allowance integer not null default 500,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_user_token_wallets_balance_non_negative check (balance >= 0),
  constraint chk_user_token_wallets_total_used_non_negative check (total_used >= 0),
  constraint chk_user_token_wallets_monthly_allowance_non_negative check (monthly_allowance >= 0),
  constraint chk_user_token_wallets_plan check (plan in ('Decouverte', 'Pro', 'Entreprise'))
);

drop trigger if exists trg_user_token_wallets_updated_at on public.user_token_wallets;
create trigger trg_user_token_wallets_updated_at
before update on public.user_token_wallets
for each row
execute function public.set_updated_at();

create table if not exists public.user_token_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  module text not null default 'General',
  tokens integer not null,
  type text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint chk_user_token_history_tokens_positive check (tokens > 0),
  constraint chk_user_token_history_type check (type in ('consume', 'earn'))
);

create index if not exists idx_user_token_history_user_occurred
  on public.user_token_history (user_id, occurred_at desc);

-- =========================================================
-- Content / posts
-- =========================================================

create table if not exists public.user_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  post_time text,
  platforms text[] not null default '{}',
  status text not null default 'draft',
  image text,
  post_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_user_posts_content_len check (char_length(content) <= 5000),
  constraint chk_user_posts_status check (status in ('draft', 'scheduled', 'published'))
);

create index if not exists idx_user_posts_user_post_date
  on public.user_posts (user_id, post_date desc);

drop trigger if exists trg_user_posts_updated_at on public.user_posts;
create trigger trg_user_posts_updated_at
before update on public.user_posts
for each row
execute function public.set_updated_at();

-- =========================================================
-- Social accounts
-- =========================================================

create table if not exists public.user_social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  account_name text,
  account_id text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_social_accounts_user_platform
  on public.user_social_accounts (user_id, platform);

drop trigger if exists trg_user_social_accounts_updated_at on public.user_social_accounts;
create trigger trg_user_social_accounts_updated_at
before update on public.user_social_accounts
for each row
execute function public.set_updated_at();

-- =========================================================
-- Payment transactions
-- =========================================================

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'baridimob',
  external_transaction_id text unique,
  amount numeric(12,2) not null,
  status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_payment_transactions_amount_positive check (amount > 0),
  constraint chk_payment_transactions_status check (status in ('pending', 'completed', 'failed', 'cancelled'))
);

create index if not exists idx_payment_transactions_user_created
  on public.payment_transactions (user_id, created_at desc);

drop trigger if exists trg_payment_transactions_updated_at on public.payment_transactions;
create trigger trg_payment_transactions_updated_at
before update on public.payment_transactions
for each row
execute function public.set_updated_at();

-- =========================================================
-- Realtime notifications (existing backend dependency)
-- =========================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  message text not null,
  level text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'chk_notifications_level'
      and conrelid = 'public.notifications'::regclass
  ) then
    alter table public.notifications
      add constraint chk_notifications_level
      check (level in ('info', 'success', 'warning', 'error'));
  end if;
end
$$;

create index if not exists idx_notifications_user_created
  on public.notifications(user_id, created_at desc);

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.notifications enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_security_settings enable row level security;
alter table public.user_notification_settings enable row level security;
alter table public.user_appearance_settings enable row level security;
alter table public.user_integration_settings enable row level security;
alter table public.user_billing_settings enable row level security;
alter table public.user_token_wallets enable row level security;
alter table public.user_token_history enable row level security;
alter table public.user_posts enable row level security;
alter table public.user_social_accounts enable row level security;
alter table public.payment_transactions enable row level security;

-- =========================================================
-- Auth user bootstrap (create defaults on signup)
-- =========================================================

create or replace function public.bootstrap_user_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Utilisateur'),
    new.email
  )
  on conflict (user_id) do nothing;

  insert into public.user_security_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_notification_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_appearance_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_integration_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_billing_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_token_wallets (user_id, balance, total_used, plan, monthly_allowance)
  values (new.id, 500, 0, 'Decouverte', 500)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_auth_users_bootstrap_defaults on auth.users;
create trigger trg_auth_users_bootstrap_defaults
after insert on auth.users
for each row
execute function public.bootstrap_user_defaults();

-- Notifications policies

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'notifications' and policyname = 'notifications_select_own'
  ) then
    create policy notifications_select_own
      on public.notifications
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'notifications' and policyname = 'notifications_update_own'
  ) then
    create policy notifications_update_own
      on public.notifications
      for update
      to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

-- Generic owner policies helper

create or replace function public.ensure_owner_policies(_table text)
returns void
language plpgsql
as $$
declare
  select_policy text := _table || '_select_own';
  insert_policy text := _table || '_insert_own';
  update_policy text := _table || '_update_own';
  delete_policy text := _table || '_delete_own';
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = _table and policyname = select_policy
  ) then
    execute format('create policy %I on public.%I for select to authenticated using (auth.uid() = user_id)', select_policy, _table);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = _table and policyname = insert_policy
  ) then
    execute format('create policy %I on public.%I for insert to authenticated with check (auth.uid() = user_id)', insert_policy, _table);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = _table and policyname = update_policy
  ) then
    execute format('create policy %I on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', update_policy, _table);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = _table and policyname = delete_policy
  ) then
    execute format('create policy %I on public.%I for delete to authenticated using (auth.uid() = user_id)', delete_policy, _table);
  end if;
end;
$$;

select public.ensure_owner_policies('user_profiles');
select public.ensure_owner_policies('user_security_settings');
select public.ensure_owner_policies('user_notification_settings');
select public.ensure_owner_policies('user_appearance_settings');
select public.ensure_owner_policies('user_integration_settings');
select public.ensure_owner_policies('user_billing_settings');
select public.ensure_owner_policies('user_token_wallets');
select public.ensure_owner_policies('user_token_history');
select public.ensure_owner_policies('user_posts');
select public.ensure_owner_policies('user_social_accounts');
select public.ensure_owner_policies('payment_transactions');

-- =========================================================
-- Compatibility views (matches architecture naming)
-- =========================================================

create or replace view public.profiles as
select * from public.user_profiles;

create or replace view public.token_wallets as
select * from public.user_token_wallets;

create or replace view public.token_ledger as
select * from public.user_token_history;

create or replace view public.social_posts as
select * from public.user_posts;

create or replace view public.social_accounts as
select * from public.user_social_accounts;

create or replace view public.payments as
select * from public.payment_transactions;

-- =========================================================
-- Realtime publication setup
-- =========================================================

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;

-- =========================================================
-- End of schema
-- =========================================================
