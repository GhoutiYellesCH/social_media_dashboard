# Project Guidelines

Welcome to the guidelines for the Social Media Management Dashboard project.

## General Code & Architecture

- **Frontend:** React, TypeScript, and Vite.
- **Styling:** Tailwind CSS combined with Radix UI primitives.
- **Backend:** Supabase (Auth, Database, Edge Functions).
- Keep file sizes small and decouple helper functions from UI components.

## TypeScript Practices

- Always use strict typing (`interface` and `type`).
- Avoid using `any` wherever possible to maintain type safety.
- Prefer functional components and standard React hooks.

## UI & Styling Rules

- Use a base font-size of 14px unless otherwise specified.
- Date formats should generally follow standard local formats visually.
- Do not use inline styles (`style={{...}}`) unless computing dynamic styles (e.g., progress bar percentages). Use Tailwind utility classes instead.
- Icons should be sourced from `lucide-react`.

## Backend & API Integration

- All external network requests must pass through the `api-client.tsx` wrapper.
- Backend logic (e.g., payment webhook verification) should be developed natively in Deno within `supabase/functions`.
- Real-time updates should leverage Supabase Realtime subscriptions inside component `useEffect` blocks.

## Delivery Workflow

- Maintain implementation progress in `guidelines/TODO_TEST_MAP.md`.
- Every feature PR/change must update docs in this order:
1. Update architecture document impacted (`docs/architecture/*`).
2. Update `guidelines/TODO_TEST_MAP.md` status and tests.
3. Update `README.md` only if setup/run commands changed.
- Do not mark features complete unless required tests are listed and passing.

<!--
  Note: You can add more specific details about components like Buttons, Inputs, etc., below.
-->
