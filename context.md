# GalaCash Context

> Non-obvious knowledge that prevents future mistakes. Read this before modifying financial logic, authentication flows, or query patterns.

---

## Domain Model

### Roles and Boundaries

**Bendahara** (treasurer) and **user** (student) are not merely UI labels. They are strict architectural boundaries enforced at the route, service, and component levels. Each role has isolated route trees under `/bendahara/*` and `/user/*`.

### Core Entities

| Entity            | Purpose                                | Key States                                                |
| ----------------- | -------------------------------------- | --------------------------------------------------------- |
| `Transaction`     | Income/expense records                 | `income` or `expense` type                                |
| `CashBill`        | Monthly class fund obligations         | `belum_dibayar` → `menunggu_konfirmasi` → `sudah_dibayar` |
| `FundApplication` | Student requests for fund disbursement | `pending` → `approved`/`rejected`                         |
| `RekapKas`        | Financial summary across all students  | Read-only aggregate view                                  |

### Business Rules

1. **Bill deadlines skip excluded months**. `calculateDeadline()` in `app/lib/calculations.ts` automatically advances past January, February, July, and August. Modifying this logic affects all deadline calculations across the app.

2. **Income transactions can only be created two ways**: (a) automatically when a `CashBill` is confirmed paid by bendahara, or (b) manually by bendahara under the `other` category. Students cannot create income transactions.

3. **Cash bill status transitions are unidirectional**. Once a bill reaches `sudah_dibayar`, it cannot revert. Rejection moves it back to `belum_dibayar` from `menunggu_konfirmasi` only.

4. **Fund application approval creates a transaction**. Approving a fund request automatically generates an expense transaction with the application details. This is handled server-side; the frontend assumes this coupling.

---

## Critical Invariants

### Financial Calculation Safety

- **Always use nullish coalescing (`??`) for monetary values**, never logical OR (`||`). Zero amounts are valid and common in refunds or adjustments. `amount || 0` would incorrectly treat `0` as falsy.

- **Currency inputs must use `CurrencyInput` component**, not raw text fields. It handles thousand separators, decimal precision, and `NaN` fallbacks.

- **Date calculations assume Indonesian locale**. Month arrays in `app/lib/constants.ts` use Indonesian names (Januari, Februari, ...). The backend expects ISO dates but displays in Indonesian format.

### Authentication State

- **Zustand auth store is non-persistent**. It exists only to prevent duplicate `/auth/me` calls during client-side navigation. On full page reload, `requireAuth()` revalidates against the API using httpOnly cookies.

- **Token refresh is handled by Axios interceptor**, not by explicit refresh logic in components. Never call `/auth/refresh` directly from application code.

- **401 on `/auth/me` triggers retry logic with exponential backoff**. `requireAuth()` implements up to 2 retries (200ms, then 500ms delay) to handle race conditions on page refresh.

---

## Implicit Assumptions

### Data Fetching

1. **Stale times are domain-specific and intentional**:
   - Dashboard data: 60 seconds (frequently accessed, changes often)
   - Fund applications: 120 seconds (moderate change frequency)
   - RekapKas/students: 300 seconds (stable, large datasets)
   - Auth user: Infinity (only invalidate on explicit logout or mutation)

2. **All mutations invalidate multiple query keys**. Approving a fund application invalidates `fund-applications`, `bendahara`, `dashboard`, and `transactions`. Missing an invalidation causes stale data to persist across views.

3. **Prefetches in route loaders are wrapped in try-catch**. Silent failures are acceptable; the component will fetch on mount. This prevents loader errors from blocking route entry.

### Component Loading

- **Route components use `lazy()` for code splitting**. The route file imports the page component lazily, but the loader runs eagerly. This ensures data fetching starts while the code chunk loads.

- **Skeletons must match the final layout dimensions exactly**. Perceived performance depends on avoiding layout shift when real data replaces the skeleton.

---

## Architectural Landmines

### Query Key Stability

Query keys in `app/lib/queries/keys.ts` use a hierarchical factory pattern. **Changing a key segment invalidates all cached data for that branch**. For example, adding a parameter to `queryKeys.bendahara.dashboard` will cause all dashboard queries to refetch on next access, even with identical parameters.

### API Client Global State

The Axios instance in `app/lib/api/client.ts` maintains global state for token refresh:

```typescript
let isRefreshing = false
let failedQueue: Array<{ resolve; reject }> = []
```

This prevents concurrent refresh calls but means **requests made during a refresh are queued, not rejected**. If the refresh fails, all queued requests fail with the same error. Do not add retry logic around these requests—it would cause thundering herd.

### Category Constants

`app/lib/constants.ts` contains multiple category mappings with `hidden: true` flags. These are legacy values preserved for backward compatibility with existing data. **Removing a legacy category breaks historical transaction displays** even if it's not selectable in new forms.

### Default Dashboard Date

`DEFAULT_DASHBOARD_START_DATE` is hardcoded to September 5, 2024. This assumes the academic/fiscal year starts in September. Changing this affects all historical period calculations.

---

## High Blast-Radius Areas

| Area                      | Impact of Change                         | Files to Audit                            |
| ------------------------- | ---------------------------------------- | ----------------------------------------- |
| `app/lib/auth.ts`         | All route access, role checks, redirects | All route files, `auth.store.ts`          |
| `app/lib/queries/keys.ts` | Cache invalidation patterns              | All query files, all mutation files       |
| `app/lib/calculations.ts` | Financial summaries, deadlines           | Dashboard, rekap-kas, cash-bill flows     |
| `app/lib/constants.ts`    | Status labels, categories, chart colors  | All forms, all display components         |
| `app/types/api.d.ts`      | Type safety across entire app            | All services, all queries, all components |

---

## Performance-Sensitive Paths

1. **RekapKas list** (`/bendahara/rekap-kas`) can return 50+ students with nested transaction history. Uses 300s staleTime and pagination. Removing pagination would cause severe memory pressure.

2. **Chart data** uses dedicated query keys with `staleTime: 300s`. Chart re-renders are expensive due to Recharts DOM manipulation.

3. **Auth retry logic** blocks route entry for up to 700ms (200ms + 500ms). This is intentional to ensure auth state before rendering protected content.

4. **File uploads** in transaction creation use `multipart/form-data`. These are not cached and bypass typical request interceptors.

---

## Security-Sensitive Logic

### Role Confusion Prevention

- `requireRole()` throws a redirect if the user lacks the required role. **The redirect goes to the user's correct dashboard**, not a generic error page. This prevents users from attempting to access URLs they shouldn't know about.

- The `/bendahara/*` and `/user/*` route trees are not merely organizational—they are **enforced security boundaries**.

### XSS via File Uploads

Attachment uploads in `bendahara.service.ts` accept arbitrary files. The backend is responsible for sanitization, but the frontend displays filenames. **Never render uploaded filenames with `dangerouslySetInnerHTML`**.

### Query Cache Contamination

Query keys include user-specific filters but not the user ID. This assumes **one user per browser session**. If implementing account switching, you must clear the query cache on user change or add userId to all query keys.

---

## Historical Tradeoffs

### Why Axios Instead of Fetch

The codebase initially used a custom FetchClient (mentioned in early documentation) but migrated to Axios. The interceptor pattern for token refresh is significantly cleaner with Axios's `failedQueue` implementation. Migrating back to fetch would require reimplementing this queue logic.

### SPA Mode Over SSR

React Router v7 supports SSR, but this app explicitly disables it (`ssr: false`). This decision was made because:

- httpOnly cookies require client-side JavaScript to access
- Financial data is user-specific and cannot be meaningfully pre-rendered
- Bundle splitting is more effective in SPA mode

### Query Factory Pattern Complexity

The hierarchical query key factory in `keys.ts` adds verbosity but prevents a class of cache invalidation bugs. The pattern ensures that invalidating `queryKeys.transactions.all` cascades to all transaction sub-queries.

### Legacy Category Preservation

Categories like `education`, `health`, `emergency` in `FUND_CATEGORIES` are marked `hidden: true` but kept in the object. This prevents runtime errors when displaying historical fund applications that used these categories before the schema changed.

---

## Assumptions (Mark as Verified if Changed)

- **Assumption**: Backend API base URL is configured via `VITE_API_URL` env var, defaults to `/api` (proxied to production in dev).
- **Assumption**: All API responses wrap data in `{ success: boolean, data: T, message?: string }` envelope.
- **Assumption**: Indonesian Rupiah (IDR) is the only currency; no currency conversion logic exists.
- **Assumption**: Date pickers return JavaScript Date objects; service layer converts to ISO strings for API.
- **Assumption**: Bendahara can only view students in their own class; backend enforces this, frontend assumes it.
