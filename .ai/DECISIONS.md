# Architecture Decisions and Known Mismatches

This file records why the system has a shape and where the current
implementation does not match older guidance. Status values are `accepted`,
`provisional`, or `open`.

## D-001: SPA mode

- Status: accepted
- Decision: React Router runs with `ssr: false`.
- Evidence: `react-router.config.ts`.
- Consequence: route authentication and data prefetch happen client-side;
  user-specific financial data is not server-rendered.

## D-002: Cookie authentication with in-memory user cache

- Status: accepted
- Decision: tokens remain httpOnly cookies; Zustand caches only the user for the
  current page lifetime.
- Evidence: auth store, FetchClient, and auth service.
- Consequence: full reload revalidates with the API; local storage is not an
  authentication source.
- Mismatch resolved: public documentation now reflects non-persistent auth
  state.

## D-003: Native FetchClient and single-flight refresh

- Status: accepted
- Decision: use the custom native-fetch wrapper and queue concurrent requests
  while one refresh is active.
- Evidence: `app/lib/api/fetch-client.ts`.
- Consequence: replacing the HTTP client or adding per-request refresh retries
  risks refresh storms and inconsistent redirects.

## D-004: Truth-first client caching

- Status: accepted
- Decision: financial and profile queries currently use `staleTime: 0` with
  refetch-on-focus.
- Evidence: `app/lib/query-client.ts`, query modules.
- Consequence: older memory describing 60/120/300 second frontend stale times is
  obsolete. Performance tuning must preserve freshness or document a measured
  tradeoff.

## D-005: Cross-tab invalidation

- Status: accepted
- Decision: important mutations propagate invalidation through
  `BroadcastChannel`.
- Evidence: `app/lib/queries/query-broadcast.ts`.
- Consequence: a new mutation is incomplete if another open tab can retain a
  stale projection.

## D-006: Generated API types

- Status: accepted
- Decision: `app/types/api.d.ts` is this repository's local generated contract
  snapshot.
- Evidence: `package.json`, `app/types/api.d.ts`.
- Consequence: follow the configured generation workflow; manual edits are not
  a durable contract update.

## D-007: Role folders are experience boundaries

- Status: accepted description of current state
- Decision: bendahara routes explicitly enforce the bendahara role; most user
  routes only require authentication. API authorization remains a separate
  contract from route visibility.
- Evidence: route loaders, `app/lib/auth.ts`, and service interfaces.
- Consequence: do not describe both route trees as symmetric security
  boundaries.
- Known mismatch: the root loader always redirects to `/user/dashboard`, even
  though sign-in redirection is role-aware.
- Open question: should `/user/*` become strictly `user`-only? This requires a
  product decision and role-focused frontend tests.

## D-008: Cross-class transparency

- Status: accepted
- Decision: several transaction, chart, balance, student, and bendahara views
  intentionally span classes, while personal bills/applications remain scoped.
- Evidence: frontend service interfaces, filters, routes, and UI behavior.
- Consequence: class scoping is endpoint-specific, not a global invariant.

## D-009: Hidden legacy categories

- Status: accepted
- Decision: legacy enum values remain displayable but are excluded from new
  selectors.
- Evidence: `app/lib/constants.ts`.
- Consequence: removing hidden constants can break historical rendering even
  if current forms no longer create them.

## D-010: Bun is the package manager

- Status: accepted
- Decision: use Bun for dependency installation, scripts, CI, and container
  builds.
- Evidence: `package.json`, `bun.lock`, `.github/workflows`, `Dockerfile`.
- Consequence: keep `bun.lock` authoritative and do not generate npm or pnpm
  lockfiles.

## Open maintenance items

- `calculateTotalBills()` uses logical-OR numeric fallbacks despite the safer
  zero-preserving convention.
- FetchClient still contains explicit `any` allowances while the repository
  otherwise aims for strict typing.
