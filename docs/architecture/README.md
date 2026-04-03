# Architecture Docs

This folder is the primary technical documentation for engineers working on the Social Media Management Dashboard codebase.

## Document Map

1. `frontend-ui.md`
Purpose: UI architecture, module ownership, state flow, and navigation.

2. `backend-services.md`
Purpose: Edge function architecture, auth model, security controls, and domain flows.

3. `api-reference.md`
Purpose: concise endpoint contract grouped by domain and access level.

4. `database.md`
Purpose: database/storage model, schema contracts, RLS strategy, and migration roadmap.

5. `integrations-social.md`
Purpose: social provider integration design (Meta, X, LinkedIn, YouTube).

6. `runbook.md`
Purpose: deployment, diagnostics, incident handling, and operational checklist.

## Quick Orientation

Codebase roots:
- Frontend app: `src/app`
- Edge function backend: `supabase/functions/server`
- SQL migrations: `supabase/migrations`
- Generated Supabase project info: `utils/supabase/info.tsx`

Runtime topology:
- Browser app talks to Supabase Edge Function `server`.
- Edge function uses Supabase Auth + Postgres (KV currently, relational planned).
- Realtime notifications use `public.notifications` subscription in the browser.

## Recommended Reading Order

1. `frontend-ui.md`
2. `backend-services.md`
3. `database.md`
4. `integrations-social.md`
5. `runbook.md`
