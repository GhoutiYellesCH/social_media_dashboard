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

  

| ID   | Area                      | Status | Target Files                                                              | Tests                               | Notes                                             |
| ---- | ------------------------- | ------ | ------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| B-01 | Auth hardening            | done   | `supabase/functions/server/index.ts`,src/app/components/auth-context.tsx` | `npm run build`, `npm run test:api` | Fallback auth active when edge routes unavailable |
| B-02 | KV baseline table         | done   | `supabase/migrations/20260402171608_create_kv_store_0d8dae93.sql`         | `npx supabase db push --linked`     | Required for user state persistence               |
| B-03 | Notifications table + RLS | done   | `supabase/migrations/20260402173000_create_notifications_table.sql`       | `npx supabase db push --linked`     | Realtime UI depends on this                       |
| B-04 | Route allowlist security  | done   | `src/app/secure-routing.ts`, `src/app/App.tsx`                            | `npm run build`                     | Prevents unsafe path handling                     |

  

## Product Features

  

| ID   | Feature                       | Status      | Target Files                                                                                        | Tests                                              | Notes                                               |
| ---- | ----------------------------- | ----------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| F-01 | Posts CRUD persistence        | in-progress | `src/app/App.tsx`, `supabase/functions/server/index.ts`                                             | `npm run test:api`, manual create/edit/delete post | Current storage is KV; relational migration pending |
| F-02 | Token lifecycle integrity     | in-progress | `src/app/components/token-context.tsx`, `supabase/functions/server/index.ts`                        | `npm run test:api`, manual consume/purchase flows  | Add relational ledger phase later                   |
| F-03 | Social accounts OAuth         | todo        | `src/app/components/accounts-view.tsx`, backend integration endpoints                               | provider sandbox tests + API tests                 | Meta first, then LinkedIn/X/YouTube                 |
| F-04 | Content library storage       | todo        | `src/app/components/content-library.tsx`, storage endpoints                                         | upload/download/sign URL tests                     | Needs Supabase Storage buckets                      |
| F-05 | Analytics real data           | todo        | `src/app/components/analytics-view.tsx`, analytics endpoints                                        | metrics endpoint integration tests                 | Current view uses mocked series                     |
| F-06 | Inbox and listening ingestion | todo        | `src/app/components/inbox-manager.tsx`, `src/app/components/social-listening.tsx`, webhook handlers | webhook simulation + RLS tests                     | Requires provider webhooks                          |
| F-07 | Team RBAC                     | todo        | `src/app/components/team-permissions.tsx`, access-control middleware                                | permission matrix tests                            | Add org/member schema first                         |
  

## Sprint Backlog (Execution-Ready)

  

### Sprint 1 (Stabilize core app data)

  

| ID    | Task                                          | Status | Target Files                                                                 | Endpoint/Table Scope                 | Acceptance Tests                                  |
| ----- | --------------------------------------------- | ------ | ---------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------- |
| S1-01 | Posts route hardening + validation            | done   | `supabase/functions/server/index.ts`                                         | `GET/POST/PUT/DELETE /posts*`        | `npm run test:api`, manual invalid payload checks |
| S1-02 | Settings schema validation                    | done   | `supabase/functions/server/index.ts`                                         | `GET/PUT /settings`                  | save/load profile values across refresh           |
| S1-03 | Token history shape consistency               | todo   | `src/app/components/token-context.tsx`, `supabase/functions/server/index.ts` | `GET /tokens/history`                | no UI errors, consistent `timestamp` rendering    |
| S1-04 | Add authenticated API smoke checks in CI mode | todo   | `scripts/api-smoke-test.mjs`, `README.md`                                    | `/auth/me`, `/tokens` with test user | `API_TEST_EMAIL/PASSWORD` checks pass             |
  

### Sprint 2 (Storage and media foundation)

  

| ID    | Task                           | Status | Target Files                                                                  | Endpoint/Table Scope           | Acceptance Tests                           |
| ----- | ------------------------------ | ------ | ----------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------ |
| S2-01 | Create storage metadata schema | todo   | `supabase/migrations/*`                                                       | `media_assets` (+ indexes/RLS) | `npx supabase db push --linked`            |
| S2-02 | Signed upload URL endpoint     | todo   | `supabase/functions/server/index.ts`                                          | `POST /storage/upload-url`     | upload test file and fetch signed read URL |
| S2-03 | Content library API wiring     | todo   | `src/app/components/content-library.tsx`, `src/app/components/api-client.tsx` | `GET/POST /media-assets`       | asset appears in UI after upload           |
  

### Sprint 3 (Social account integration bootstrap)

  

| ID    | Task                             | Status | Target Files                                                                | Endpoint/Table Scope                                              | Acceptance Tests                            |
| ----- | -------------------------------- | ------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| S3-01 | Social connection schema         | todo   | `supabase/migrations/*`                                                     | `social_connections`, `social_pages` (+ RLS)                      | migration succeeds + row ownership enforced |
| S3-02 | Meta OAuth start/callback routes | todo   | `supabase/functions/server/index.ts`                                        | `/integrations/meta/connect/start`, `/integrations/meta/callback` | sandbox connect flow stores account         |
| S3-03 | Accounts UI live data wiring     | todo   | `src/app/components/accounts-view.tsx`, `src/app/components/api-client.tsx` | `GET/DELETE /accounts`                                            | connected account list not mocked           |
  

### Sprint 4 (Analytics and listening ingestion)

  

| ID    | Task                                 | Status | Target Files                         | Endpoint/Table Scope                    | Acceptance Tests                      |
| ----- | ------------------------------------ | ------ | ------------------------------------ | --------------------------------------- | ------------------------------------- |
| S4-01 | Metrics aggregate endpoint           | todo   | `supabase/functions/server/index.ts` | `GET /analytics/overview`               | analytics view renders live values    |
| S4-02 | Mentions/conversations schema        | todo   | `supabase/migrations/*`              | `mentions`, `conversations`, `messages` | migration + RLS validation            |
| S4-03 | Webhook ingestion stubs (Meta first) | todo   | `supabase/functions/server/index.ts` | `POST /webhooks/meta`                   | simulated webhook creates mention row |
  

### Sprint 5 (Team and authorization)

  

| ID    | Task                             | Status | Target Files                                                                   | Endpoint/Table Scope                     | Acceptance Tests                   |
| ----- | -------------------------------- | ------ | ------------------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------- |
| S5-01 | Team membership schema           | todo   | `supabase/migrations/*`                                                        | `organizations`, `team_members`, `roles` | migration and FK checks pass       |
| S5-02 | Role guard middleware in backend | todo   | `supabase/functions/server/index.ts`                                           | admin/editor/viewer checks               | permission matrix test pass        |
| S5-03 | Team UI binding                  | todo   | `src/app/components/team-permissions.tsx`, `src/app/components/api-client.tsx` | `/team/*` routes                         | invite/update/remove flows succeed |
  

## Immediate Next 5 Tasks

  

1. S1-03 Token history shape consistency.

2. S1-04 Authenticated API smoke checks.

3. S2-01 Storage metadata schema migration.

4. S2-02 Signed upload URL endpoint.

5. S2-03 Content library API wiring.

  

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

  

| ID    | Blocker                                        | Impact                   | Workaround               | Status |
| ----- | ---------------------------------------------- | ------------------------ | ------------------------ | ------ |
| BL-01 | Provider API app review delays (Meta/LinkedIn) | Integration launch       | Use sandbox mode + mocks | open   |
| BL-02 | KV to relational migration gap                 | Query/report limitations | Keep dual-write strategy | open   |

  

## Change Log

  

- 2026-04-02: Initial TODO/Test map created.

- 2026-04-02: Removed API diagnostic button from login UI to keep production UX clean.

- 2026-04-03: Expanded into sprint-based execution backlog with endpoint/table scopes and acceptance tests.

- 2026-04-03: Completed S1-01 by adding strict posts create/update payload validation and post id guards in backend routes.

- 2026-04-03: Completed S1-02 by enforcing settings schema validation/sanitization and unknown field rejection for `PUT /settings`.