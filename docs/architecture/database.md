# Database Architecture

## Current Model

Identity:
- Supabase Auth (`auth.users`)

Application persistence:
- `public.kv_store_0d8dae93`
  - `key text primary key`
  - `value jsonb not null`

Realtime:
- `public.notifications`

## KV Domain Contracts

Keys currently used by backend:
- `user:{userId}:tokens`
- `user:{userId}:token_history`
- `user:{userId}:posts`
- `user:{userId}:settings`
- `user:{userId}:accounts`
- `payment:{transactionId}`

Benefits:
- simple write path
- fast iteration

Limitations:
- no foreign-key integrity
- difficult analytical queries
- domain-level concurrency control is coarse

## Notifications Table

Purpose:
- Supports realtime `postgres_changes` subscription from UI.

Security:
- RLS enabled
- user-scoped select and update policies

## Target Relational Model

Planned domain tables:
- `profiles`
- `token_wallets`
- `token_ledger`
- `social_posts`
- `social_accounts`
- `payments`
- storage and integration tables

See migration strategy:
- `docs/schema-evolution-plan.md`

## RLS Principles

- Enable RLS on all user-owned tables.
- Policy baseline: `auth.uid() = user_id` for read/write.
- Keep webhook and integration ingestion server-side through service role.

## Migration Approach

1. Phase A: create relational tables and policies
2. Phase B: dual-write from backend
3. Phase C: backfill historical KV data
4. Phase D: switch reads to relational
5. Phase E: remove KV dependency

## Production Checks

Before release:
- all migrations applied (`supabase db push --linked`)
- edge function deployed
- API smoke tests green
- RLS policy review completed
