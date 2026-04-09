# Frontend and UI Architecture

## Stack

- React + TypeScript + Vite
- Context-based state for auth and token wallet
- Component-driven module structure under `src/app/components`

## Entry Points

- `src/main.tsx`
- `src/app/App.tsx`

`App.tsx` is the orchestration layer for:
- top-level app mode (landing, login, dashboard)
- auth-aware routing behavior
- sidebar-driven module switching
- global realtime notification subscription

Routing and navigation source of truth:
- `src/app/navigation-config.ts`
	- central nav labels, route paths, and grouped sections
- `src/app/secure-routing.ts`
	- auth-aware route guards and safe history navigation
- `src/app/components/sidebar.tsx`
	- consumes grouped nav config for rendering menu structure

## Major UI Domains

1. Auth and onboarding
- `landing-page.tsx`
- `login-page.tsx`
- `auth-context.tsx`

2. Content workflow
- `dashboard-overview.tsx`
- `weekly-calendar.tsx`
- `new-post-modal.tsx`
- `post-composer.tsx`

3. Operations and analytics
- `analytics-view.tsx`
- `accounts-view.tsx`
- `settings-view.tsx`
- `token-dashboard.tsx`

4. Growth modules (currently mostly static/mocked)
- `ads-manager.tsx`
- `blog-manager.tsx`
- `email-manager.tsx`
- `sales-funnels.tsx`
- `link-in-bio.tsx`
- `utm-builder.tsx`
- `hashtag-research.tsx`
- `inbox-manager.tsx`
- `social-listening.tsx`
- `team-permissions.tsx`
- `content-library.tsx`

## State and Data Flow

### Auth state
- Source of truth: `auth-context.tsx`
- Token persistence: localStorage (`socialdz_token`)
- Session profile cache: localStorage (`socialdz_user`)
- Fallback strategy: direct Supabase Auth if edge route unavailable

### Token state
- Source of truth: `token-context.tsx`
- API-backed reads/writes via `api-client.tsx`
- Handles token history formatting and wallet refresh

### API gateway
- Frontend code should call only `api-client.tsx` for HTTP requests.
- `api-client.tsx` adds apikey and bearer token headers, timeout, and normalized errors.

## UI Integration Boundaries

Current production-integrated modules:
- Auth
- Posts (basic create/read/update/delete via backend)
- Token wallet and purchase endpoints
- Settings/profile basic persistence

Modules requiring backend integration work:
- Analytics
- Social accounts OAuth
- Inbox and listening ingestion
- Team and RBAC
- Content library storage
- Marketing suite modules

## Frontend Conventions

- Keep network access in `api-client.tsx`.
- Keep module components mostly presentational; push side effects to context/hooks.
- Use optimistic UI only where rollback is clearly handled.
- Avoid storing provider tokens client-side; provider auth flows must terminate server-side.
- Keep route labels and paths in `navigation-config.ts`; avoid hardcoding paths in UI components.
