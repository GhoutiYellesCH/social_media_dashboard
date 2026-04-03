# Schema Evolution Plan

This plan defines how to move from the current KV-based backend to a normalized relational schema without breaking the app.

## Goals

1. Keep login/signup and existing dashboard features working while migrating.
2. Improve integrity, queryability, and security with typed tables and foreign keys.
3. Migrate progressively with dual-write, then switch reads to relational sources.

## Current State

Current persistence model:
- `public.kv_store_0d8dae93` stores JSON blobs by key.
- Supabase Auth (`auth.users`) stores user identities.
- Optional `public.notifications` supports realtime subscription in frontend.

Current key patterns:
- `user:{userId}:tokens`
- `user:{userId}:token_history`
- `user:{userId}:posts`
- `user:{userId}:settings`
- `user:{userId}:accounts`
- `payment:{transactionId}`

## Target Relational Tables

### 1) profiles
- `user_id uuid primary key references auth.users(id) on delete cascade`
- `display_name text`
- `company text`
- `role text`
- `timezone text`
- `language text`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### 2) token_wallets
- `user_id uuid primary key references auth.users(id) on delete cascade`
- `balance int not null default 0`
- `total_used int not null default 0`
- `plan text not null default 'Decouverte'`
- `monthly_allowance int not null default 500`
- `updated_at timestamptz default now()`

### 3) token_ledger
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `entry_type text not null check (entry_type in ('earn','spend','adjustment'))`
- `amount int not null check (amount > 0)`
- `action text`
- `module text`
- `reference text`
- `created_at timestamptz default now()`

Indexes:
- `(user_id, created_at desc)`

### 4) social_posts
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `content text not null`
- `platforms text[] not null default '{}'::text[]`
- `image text`
- `status text not null default 'draft'`
- `scheduled_at timestamptz`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Indexes:
- `(user_id, created_at desc)`
- `(user_id, status)`

### 5) social_accounts
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `provider text not null`
- `handle text`
- `metadata jsonb not null default '{}'::jsonb`
- `connected_at timestamptz default now()`

Index:
- `(user_id, provider)`

### 6) payments
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `provider text not null default 'baridimob'`
- `provider_ref text unique`
- `amount_dzd int not null check (amount_dzd > 0)`
- `status text not null check (status in ('pending','completed','failed','cancelled'))`
- `raw_payload jsonb`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Indexes:
- `(user_id, created_at desc)`
- `(provider, provider_ref)`

## RLS Strategy

Enable RLS on all user-owned tables and enforce `auth.uid() = user_id` for `select`, `insert`, `update`, `delete` where needed.

Public routes:
- Webhook endpoint stays server-side and uses service role key.
- No direct public table writes from client.

## Migration Phases

### Phase A: Prepare schema
1. Create all target tables and indexes.
2. Add RLS policies.
3. Keep current KV routes untouched.

### Phase B: Dual-write on server
1. Update edge function write paths to write to KV and relational tables.
2. Keep read paths on KV first.
3. Add structured logging for write parity errors.

### Phase C: Backfill historical data
1. One-time migration script reads KV keys by prefix.
2. Populate relational tables per user.
3. Mark migration status per user (in metadata table or migration log).

### Phase D: Read switch
1. Move read paths (`/tokens`, `/posts`, `/settings`, `/accounts`, `/tokens/history`) to relational source.
2. Keep KV fallback for a short safety window.

### Phase E: Decommission KV
1. Remove dual-write.
2. Remove KV fallback reads.
3. Archive or drop KV table after verification period.

## Acceptance Criteria

1. Login/signup unchanged behavior.
2. Token balance and history parity between KV and relational tables during dual-write.
3. Post CRUD and settings CRUD fully served from relational tables.
4. Payment webhook idempotency guaranteed by `provider_ref` uniqueness.
5. API smoke tests pass and new relational integration tests pass.

## Rollback Strategy

1. Keep KV writes active until relational reads are fully verified.
2. Feature-flag read source in edge function.
3. If issue is detected, revert read source to KV immediately.
