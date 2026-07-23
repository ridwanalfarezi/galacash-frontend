# Agent Operating Contract

Applies to work on the GalaCash React frontend.

## Mission

Maintain a trustworthy financial SPA for students (`user`) and treasurers
(`bendahara`). Favor correctness, authorization clarity, fresh financial
projections, accessibility, and small changes that fit existing architecture.

## Start-of-task protocol

1. Read `README.md` in this directory and load only the memory relevant to the
   task.
2. Inspect the current implementation before trusting a remembered claim.
3. Identify the source contract and all downstream projections before editing.
4. Check the working tree and preserve unrelated user changes.
5. State uncertainty explicitly; do not convert an inference into a fact.

## Architectural boundaries

| Concern | Current owner | Rule |
| --- | --- | --- |
| Route graph | `app/routes.ts` | Route modules are automatically code-split. |
| Route access | `app/lib/auth.ts` and route loaders | Bendahara routes use `requireRole`; user routes mostly use `requireAuth`. |
| Remote API state | TanStack Query | Use option factories and centralized keys. |
| Client auth cache | `app/lib/stores/auth.store.ts` | Zustand is non-persistent and auth-only. |
| HTTP/auth retry | `app/lib/api/fetch-client.ts` | Preserve cookie flow and one refresh request for concurrent 401s. |
| API contract snapshot | `app/types/api.d.ts` | Use the configured generation workflow; do not treat hand edits as canonical. |
| Financial projections | Query modules and `app/lib/queries/query-broadcast.ts` | Mutations must invalidate all affected views and open tabs. |
| Shared UI | `app/components/ui` and `app/components/shared` | Preserve accessibility and role-specific action boundaries. |

## Invariants

- Monetary zero is valid. Prefer `??` when providing a monetary fallback. When
  touching existing `||` monetary fallbacks, assess and correct them rather
  than documenting them as safe.
- Do not persist tokens or authenticated user data in local storage. The client
  contract uses browser-inaccessible httpOnly cookies.
- `clearAuthState()` clears both Zustand auth state and the QueryClient cache.
- A query key's shape is part of cache identity. Change it only with a complete
  invalidation audit.
- Financial data currently uses `staleTime: 0` and refetch-on-focus. Treat this
  as intentional truth-first behavior.
- `invalidateFinancialQueries()` is the broad invalidation path for bill,
  application, transaction, dashboard, and bendahara projections.
- Role-specific pages may share presentation components, but permissions and
  available actions must remain explicit at route and mutation boundaries.
- Legacy hidden category values remain displayable even when not selectable.
- Indonesian labels and semester rules are user-visible domain behavior.

## High-risk changes

Audit end to end before changing:

- `app/lib/auth.ts`
- `app/lib/api/fetch-client.ts`
- `app/lib/queries/keys.ts`
- `app/lib/queries/query-broadcast.ts`
- `app/lib/calculations.ts`
- `app/lib/constants.ts`
- `app/types/api.d.ts`
- loader guards in `app/routes/**`

For any of these, trace route -> query -> service -> endpoint -> local API
declaration and trace the reverse path for invalidation/error behavior.

## Dependency policy

Prefer the existing stack: React Router, TanStack Query, Zustand, React Hook
Form, Zod, Radix/shadcn, Tailwind, date-fns, Lucide, Recharts, and native fetch.
Ask before adding a new runtime dependency or state/HTTP/UI framework.

## Completion protocol

- Run checks proportional to the change.
- Re-read the diff for auth, role, money, date, and cache semantics.
- Update `.ai/CONTEXT.md` when a stable fact or relationship changed.
- Update `.ai/DECISIONS.md` when an architectural choice or known mismatch was
  resolved.
- Update `.ai/SKILLS.md` when the safe procedure changed.
