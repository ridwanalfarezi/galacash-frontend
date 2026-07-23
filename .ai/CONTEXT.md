# Semantic Memory: GalaCash Frontend

Verified on 2026-07-23 against commit `c65fc94`. This is durable semantic
memory, not a changelog. Every important claim names its evidence so it can be
revalidated.

## Retrieval index

Search aliases in parentheses when locating a concept:

| Concept | Aliases | Primary evidence |
| --- | --- | --- |
| authentication | auth, session, cookie, refresh, 401 | `app/lib/auth.ts`, `app/lib/api/fetch-client.ts`, `app/lib/stores/auth.store.ts` |
| authorization | role, user, student, bendahara, treasurer, guard | `app/routes.ts`, `app/routes/**`, `app/lib/auth.ts` |
| remote API state | query, cache, stale, invalidation, refetch | `app/lib/query-client.ts`, `app/lib/queries/**` |
| API contract | OpenAPI, generated types, response envelope | `package.json`, `app/types/api.d.ts`, `app/lib/services/**` |
| cash bill | tagihan, payment, confirmation, bill | `app/lib/services/cash-bill.service.ts`, bill query/routes/components |
| fund application | aju dana, application, approval | `app/lib/services/fund-application.service.ts`, bendahara queries |
| transaction | kas kelas, income, expense, chart, balance | transaction service/query and shared kas components |
| semester | academic period, excluded month, deadline | `app/lib/constants.ts`, `app/lib/calculations.ts` |
| cross-tab freshness | BroadcastChannel, sync | `app/lib/queries/query-broadcast.ts` |

## System identity

GalaCash Frontend is a React 19, React Router v7 SPA (`ssr: false`) for a
financial system with student and treasurer experiences. Bun drives scripts,
Vite builds, Tailwind v4 styles, and React Router route modules are
automatically code-split.

Evidence: `package.json`, `react-router.config.ts`, `vite.config.ts`,
`app/routes.ts`.

## Concept graph

```text
Route loader
  -> auth guard
  -> TanStack Query prefetch
  -> dehydrated cache
  -> route component / shared feature component
  -> query option factory
  -> service method
  -> FetchClient
  -> /api endpoint

Mutation success
  -> local QueryClient invalidation
  -> BroadcastChannel invalidation when applicable
  -> route/query refetch
  -> refreshed financial projection

Local API contract snapshot
  -> app/types/api.d.ts
  -> domain/service/query/component types
```

## Roles and access semantics

`User.role` is `user | bendahara`.

- Bendahara route loaders explicitly call `requireRole('bendahara')`.
- Most `/user/*` route loaders call `requireAuth()`, not
  `requireRole('user')`.
- The role folders are experience boundaries, not a complete authorization
  guarantee.
- `requireRole()` redirects a mismatched authenticated user to their own
  dashboard.
- The `/` route currently redirects unconditionally to `/user/dashboard`.
  Role-aware redirect exists in the sign-in guard, not the root loader.

Evidence: `app/routes.ts`, `app/routes/user/**`,
`app/routes/bendahara/**`, `app/lib/auth.ts`.

Implication: never claim that `/user/*` is strictly student-only unless its
guards and API behavior are both verified. Also audit the root redirect when
changing role navigation.

## Authentication model

- The client contract carries access and refresh tokens in httpOnly cookies;
  application code never reads the token values.
- Zustand caches the current user only in memory and is intentionally not
  persisted.
- `requireAuth()` first uses the in-memory user, otherwise calls the profile
  endpoint. Its current failure path can wait 200 ms then 500 ms before
  clearing auth state and redirecting.
- `FetchClient` refreshes only for `401` with error code `TOKEN_EXPIRED`.
  Concurrent failed requests wait in `failedQueue`; one refresh request releases
  or rejects them together.
- Invalid/unauthorized non-profile requests navigate to `/sign-in`.
- Logout or exhausted auth failure must clear both auth state and query cache.

Evidence: `app/lib/stores/auth.store.ts`, `app/lib/auth.ts`,
`app/lib/api/fetch-client.ts`, `app/lib/services/auth.service.ts`.

## Data and cache model

- TanStack Query owns remote API data. Zustand currently owns auth state only.
- Query keys are hierarchical and centralized in
  `app/lib/queries/keys.ts`.
- The default and feature-specific `staleTime` are currently `0`.
- Queries refetch on window focus. Query garbage collection is five minutes.
- Query retries stop for most 4xx responses; 401 and non-4xx failures can retry
  up to the configured limit.
- Route loaders prefetch and dehydrate query state. Prefetch failure is commonly
  swallowed so the route can mount and query normally.
- `app/lib/queries/query-broadcast.ts` uses the `galacash_cache_sync`
  BroadcastChannel to
  propagate invalidations across tabs.
- `invalidateFinancialQueries()` covers cash bills, fund applications,
  dashboard, bendahara, and transaction key roots.

Evidence: `app/lib/query-client.ts`, `app/lib/queries/**`, route loaders.

Implication: any financial mutation needs an invalidation matrix, not just the
list that initiated the mutation.

## API integration contract

- API base URL is `VITE_API_URL`, defaulting to `/api`.
- Development Vite proxy and production Vercel rewrite send `/api` to their
  locally configured API target.
- FetchClient uses native fetch and parses the API error envelope into
  `APIError`.
- Services usually unwrap `{ success, data, message? }`; inspect the concrete
  service because some generic response typings differ.
- Multipart requests pass `FormData` and must not manually set the
  `Content-Type` boundary.
- `app/types/api.d.ts` is the repository-local generated API contract
  snapshot. Use the configured generation workflow when refreshing it.

Evidence: `.env.example`, `vite.config.ts`, `vercel.json`, `package.json`,
`app/lib/api/**`, `app/lib/services/**`.

## Domain entities and relationships

### Transaction

A class-scoped immutable-looking financial record with `income | expense`,
category, amount, date, description, and optional attachment. The UI and
service interfaces support cross-class transaction and chart views, with
optional filtering where exposed locally.

### CashBill

A student's monthly obligation. The visible lifecycle is:

```text
belum_dibayar
  -> menunggu_konfirmasi
  -> sudah_dibayar

menunggu_konfirmasi
  -> belum_dibayar  (cancel or rejection)
```

The confirmation API operation is treated as creating the corresponding
`income / kas_kelas` transaction. Mutation success must refresh bills and
every derived financial projection.

### FundApplication

A student request with `pending | approved | rejected`. Approval creates the
corresponding expense projection. Rejection records a reason. The client must
treat review and transaction creation as one API business event.

### User and Class

Users belong to classes. The product deliberately exposes some financial views
across classes, while bills and personal applications remain user-scoped.
Do not add class filtering merely because a `classId` exists; confirm the
endpoint's intended transparency behavior.

Evidence: `app/types/api.d.ts`, service modules, route UIs.

## Money, categories, and dates

- Currency is IDR; no conversion model exists.
- Use numeric values only after validating/parsing API or form data.
- Monetary fallback should preserve zero (`value ?? 0`).
- `CurrencyInput` is the established money input.
- Hidden legacy fund and transaction categories remain in constants so
  historical records render, while selector builders exclude them.
- `kas_kelas` is system-only in the frontend transaction category selector.
- Active semester starts are September 1 or March 1. January-February show the
  previous September start; July-August retain the March start.
- Deadline calculation skips January, February, July, and August.

Evidence: `app/components/form/CurrencyInput.tsx`,
`app/lib/constants.ts`, `app/lib/calculations.ts`.

Known debt: `calculateTotalBills()` currently uses `||` for numeric fallback.
Treat that as implementation state, not as permission to spread the pattern.

## Route map

Public:

- `/sign-in`

Authenticated student experience:

- `/user/dashboard`
- `/user/kas-kelas`
- `/user/aju-dana`
- `/user/tagihan-kas`
- `/user/settings`

Bendahara experience:

- `/bendahara/dashboard`
- `/bendahara/kas-kelas`
- `/bendahara/aju-dana`
- `/bendahara/rekap-kas`
- `/bendahara/rekap-kas/:userId`
- `/bendahara/settings`

Evidence: `app/routes.ts`.

## Change impact map

| If this changes | Also inspect |
| --- | --- |
| local API declaration/schema | service unwrapping, forms, mocks, E2E routes |
| query key shape | every option factory, loader prefetch, mutation invalidation, cross-tab messages |
| auth error code or cookie behavior | FetchClient refresh, route guards, logout, E2E auth mocks |
| bill/application lifecycle | status badges, modal actions, mutation invalidation, dashboard counts |
| transaction/category enum | constants, selectors, charts, forms, historical rendering |
| semester/excluded months | dashboard default range, bill summaries, labels, tests |
| shared role component | both role routes, action visibility, API authorization assumptions |

## Freshness protocol

Update this file only for durable facts or relationships. Put architectural
rationale and known contradictions in `.ai/DECISIONS.md`; put procedures in
`.ai/SKILLS.md`. When updating:

1. verify against code/config/tests;
2. update the evidence path;
3. record unresolved uncertainty as a question, not a fact;
4. refresh the verified commit/date only after a complete memory audit.
