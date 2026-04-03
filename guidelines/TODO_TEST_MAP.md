# TODO and Test Map

This file is the execution map for implementation and verification.
Update this file at every feature milestone.

## Update Rules

1. For each feature change, update:
- Status
- Owner
- Target files
- Tests to run
- Risk notes

2. Status values:
- `todo`
- `in-progress`
- `blocked`
- `done`

3. Do not mark `done` until tests listed in the row pass.

## Backend Foundation

| ID | Area | Status | Target Files | Tests | Notes |
|---|---|---|---|---|---|
| B-01 | Auth hardening | done | `supabase/functions/server/index.ts`, `src/app/components/auth-context.tsx` | `npm run build`, `npm run test:api` | Fallback auth active when edge routes unavailable |
| B-02 | KV baseline table | done | `supabase/migrations/20260402171608_create_kv_store_0d8dae93.sql` | `npx supabase db push --linked` | Required for user state persistence |
| B-03 | Notifications table + RLS | done | `supabase/migrations/20260402173000_create_notifications_table.sql` | `npx supabase db push --linked` | Realtime UI depends on this |
| B-04 | Route allowlist security | done | `src/app/secure-routing.ts`, `src/app/App.tsx` | `npm run build` | Prevents unsafe path handling |

## Product Features

| ID | Feature | Status | Target Files | Tests | Notes |
|---|---|---|---|---|---|
| F-01 | Posts CRUD persistence | in-progress | `src/app/App.tsx`, `supabase/functions/server/index.ts` | `npm run test:api`, manual create/edit/delete post | Current storage is KV; relational migration pending |
| F-02 | Token lifecycle integrity | in-progress | `src/app/components/token-context.tsx`, `supabase/functions/server/index.ts` | `npm run test:api`, manual consume/purchase flows | Add relational ledger phase later |
| F-03 | Social accounts OAuth | todo | `src/app/components/accounts-view.tsx`, backend integration endpoints | provider sandbox tests + API tests | Meta first, then LinkedIn/X/YouTube |
| F-04 | Content library storage | todo | `src/app/components/content-library.tsx`, storage endpoints | upload/download/sign URL tests | Needs Supabase Storage buckets |
| F-05 | Analytics real data | todo | `src/app/components/analytics-view.tsx`, analytics endpoints | metrics endpoint integration tests | Current view uses mocked series |
| F-06 | Inbox and listening ingestion | todo | `src/app/components/inbox-manager.tsx`, `src/app/components/social-listening.tsx`, webhook handlers | webhook simulation + RLS tests | Requires provider webhooks |
| F-07 | Team RBAC | todo | `src/app/components/team-permissions.tsx`, access-control middleware | permission matrix tests | Add org/member schema first |

## Testing Matrix

### A) CI-safe automated checks

1. Build:
- `npm run build`

2. API route checks:
- `npm run test:api`

3. Optional authenticated API checks:
- set `API_TEST_EMAIL`
- set `API_TEST_PASSWORD`
- run `npm run test:api`

### B) Manual smoke tests

1. Auth:
- signup, login, logout, reset password

2. Dashboard routing:
- `/`, `/login`, `/app/dashboard`, sidebar navigation, browser back/forward

3. Posts:
- create, move, update, delete

4. Tokens:
- refresh wallet, consume action, purchase initiation

5. Settings:
- load and save profile values

## Blockers Register

| ID | Blocker | Impact | Workaround | Status |
|---|---|---|---|---|
| BL-01 | Provider API app review delays (Meta/LinkedIn) | Integration launch | Use sandbox mode + mocks | open |
| BL-02 | KV to relational migration gap | Query/report limitations | Keep dual-write strategy | open |

## Change Log

- 2026-04-02: Initial TODO/Test map created.
- 2026-04-02: Removed API diagnostic button from login UI to keep production UX clean.
