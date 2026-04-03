# Backend Services Architecture

## Runtime

- Supabase Edge Function: `server`
- Source: `supabase/functions/server/index.ts`
- KV helper: `supabase/functions/server/kv_store.ts`

## Core Responsibilities

1. Auth API
- signup/login/reset/update password
- authenticated profile route

2. Token economy
- wallet read
- token consume/purchase/plan upgrade
- token history

3. Content persistence
- posts CRUD
- settings CRUD
- social accounts CRUD

4. Payment workflow
- Baridimob payment initiation
- Baridimob webhook processing

5. Operational endpoints
- health
- diagnostics

## Security Model

Implemented controls:
- CORS allowlist via `APP_ORIGIN`
- Security headers middleware
- Basic payload validation for email/password
- HMAC webhook signature verification with timing-safe compare
- Separation of public and protected routes

Auth handling:
- Public routes rely on `apikey`
- Protected routes require bearer access token
- Token identity resolution through Supabase Auth user lookup

## Data Access Pattern

Current persistence strategy:
- Key-value JSON store in `public.kv_store_0d8dae93`
- Key prefixes define domain state (`user:{id}:...`, `payment:{id}`)

Reasoning:
- Fast bootstrapping and low schema friction
- Tradeoff: weak relational guarantees and harder analytics queries

## Error and Resilience Strategy

- API returns structured error payloads (`{ error: string }`)
- Fallback behavior exists for some profile/token reads when KV is unavailable
- Frontend has auth fallback to direct Supabase auth for availability

## Near-Term Backend Priorities

1. Move from KV-only to dual-write (KV + relational tables)
2. Add idempotency constraints on payment/provider refs in relational layer
3. Add structured request tracing and error classification
4. Add provider integration service layer for social APIs
