# Runbook

## Local Setup

1. Install deps:
- `npm i`

2. Run app:
- `npm run dev`

3. Run API diagnostics:
- `npm run test:api`

Optional authenticated API checks:
- set `API_TEST_EMAIL`
- set `API_TEST_PASSWORD`

## Supabase Operations

1. Login:
- `npx supabase login`

2. Link project:
- `npx supabase link --project-ref atntimorwfxxjicyqyei`

3. Push migrations:
- `npx supabase db push --linked`

4. Deploy edge function:
- `npx supabase functions deploy server --project-ref atntimorwfxxjicyqyei --no-verify-jwt`

## Required Secrets

- `APP_ORIGIN`
- `BARIDIMOB_WEBHOOK_SECRET`

Example:
- `npx supabase secrets set APP_ORIGIN=http://localhost:5173 --project-ref atntimorwfxxjicyqyei`
- `npx supabase secrets set BARIDIMOB_WEBHOOK_SECRET=<secret> --project-ref atntimorwfxxjicyqyei`

## Incident Playbooks

### Login or signup failing
1. Run `npm run test:api`
2. Validate `/health` and `/diagnostics`
3. Re-deploy function if needed
4. Inspect auth errors in edge logs

### KV table errors
1. Confirm migration applied
2. Validate table exists: `public.kv_store_0d8dae93`
3. Re-run db push

### Realtime notifications not arriving
1. Confirm `public.notifications` exists
2. Confirm table is in `supabase_realtime` publication
3. Validate user_id and RLS policies

### Webhook failures
1. Verify `BARIDIMOB_WEBHOOK_SECRET`
2. Check signature headers in inbound requests
3. Validate payment transaction lifecycle and idempotency

## Release Checklist

1. Migrations applied
2. Function deployed
3. API smoke tests green
4. Security secrets configured
5. Critical flows manually validated:
- auth
- token consume/purchase
- post create/update
- settings update

## Documentation Maintenance Protocol

For each implementation step:

1. Update the relevant architecture file under `docs/architecture/`.
2. Update `guidelines/TODO_TEST_MAP.md`:
- feature status
- tests executed
- blocker notes if any
3. If setup/deploy commands changed, update `README.md`.
4. Attach verification evidence in commit message or PR description:
- build result
- API smoke test result
