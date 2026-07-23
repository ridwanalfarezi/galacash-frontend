# Task Playbooks

These are procedures, not semantic facts. Confirm current code before applying
them.

## Trace a feature end to end

1. Start from `app/routes.ts` and the route module.
2. Identify its loader guard and prefetch calls.
3. Trace `useQuery`/`useMutation` to `app/lib/queries`.
4. Resolve the key in `app/lib/queries/keys.ts`.
5. Trace the query function to `app/lib/services`.
6. Match the payload and response to `app/types/api.d.ts`.
7. Check local mocks and E2E tests when behavior is ambiguous.
8. For mutations, enumerate every financial projection that can become stale.

## Add or change an API field

1. Confirm the upstream API contract has been published and validated.
2. Run `bun run types:generate`.
3. Review the generated diff in `app/types/api.d.ts`.
4. Update service unwrapping and any domain adapter.
5. Update query option types, forms, components, mocks, and tests.
6. Run `bun run type-check` and relevant tests.

Do not treat a hand edit to the generated declaration as the canonical fix.

## Add a route

1. Add the route module under `app/routes/<role-or-auth>/`.
2. Register it in `app/routes.ts`.
3. Choose the real access rule:
   - `requireRole('bendahara')` for treasurer-only behavior;
   - `requireRole('user')` only if the endpoint is truly student-only;
   - `requireAuth()` when either authenticated role is valid.
4. Prefetch with an existing query option factory.
5. Wrap dehydrated data in `HydrationBoundary`.
6. Keep prefetch failure non-blocking when the component can fetch safely.
7. Add metadata, loading/empty/error behavior, and navigation if needed.
8. Test direct URL access with both roles.

## Add a query

1. Add a hierarchical key to `app/lib/queries/keys.ts`.
2. Include every parameter that changes the response.
3. Add an option factory in the feature query module.
4. Use a service method; do not call FetchClient from components.
5. Default to current truth-first freshness (`staleTime: 0`) unless there is
   measured and documented reason to diverge.
6. Add loader prefetch if the route benefits.
7. Verify partial-key invalidation still reaches the query.

## Add a financial mutation

1. Confirm the local API contract treats the mutation as one authorized
   business operation.
2. Add the service method and typed payload.
3. Add the mutation hook.
4. On success, call `invalidateFinancialQueries()` when any balance, bill,
   application, transaction, chart, rekap, or dashboard can change.
5. Use targeted `broadcastInvalidation()` for non-financial profile/auth
   projections.
6. Show localized success and typed failure feedback.
7. Test initiating and non-initiating views, including another tab when
   cross-tab freshness matters.

## Change authentication

1. Read `app/lib/auth.ts`, auth store, auth service, FetchClient, auth queries,
   and authentication E2E mocks together.
2. Preserve httpOnly-cookie ownership; do not expose tokens to application
   state.
3. Preserve single-flight refresh behavior for concurrent expired requests.
4. Distinguish `TOKEN_EXPIRED`, `INVALID_TOKEN`, and `UNAUTHORIZED`.
5. Ensure terminal failure and logout call `clearAuthState()`.
6. Test reload, concurrent requests, refresh rotation, wrong role, and logout.

## Add or change a form

1. Reuse React Hook Form and Zod.
2. Use `CurrencyInput` for amounts and `FileUpload` for attachments.
3. Match accepted file types and size to local form components, API types, and
   tests.
4. Send files as `FormData` without setting multipart boundaries manually.
5. Keep Indonesian user-facing labels/messages.
6. Disable duplicate submission and surface API error details safely.
7. Invalidate the full affected projection set after success.

## Change categories or statuses

1. Compare frontend constants, generated OpenAPI enums, and Prisma enums.
2. Preserve old values needed to render historical records.
3. Separate selectable values from displayable values.
4. Audit badges, filters, charts, forms, serializers, and tests.
5. Refresh local generated API types when the contract changes.

## Add a shared role component

1. Keep data ownership in route/query layers.
2. Pass capabilities or callbacks explicitly; do not infer authorization from
   styling or pathname alone.
3. Verify both user and bendahara usages.
4. Keep authorization assumptions explicit in the local service contract and
   tests.
5. Test empty, loading, error, and mobile states.

## Debug stale data

1. Identify the exact query key and parameters in Query Devtools/logging.
2. Confirm the mutation success handler runs.
3. Check whether `invalidateFinancialQueries()` or the correct targeted root is
   used.
4. Confirm the affected query uses the same key factory.
5. Check cross-tab BroadcastChannel behavior.
6. Confirm whether the response itself is stale before adding client
   workarounds.

## Verification matrix

| Change                        | Minimum checks                                            |
| ----------------------------- | --------------------------------------------------------- |
| docs/memory only              | links, `git diff --check`                                 |
| component or utility          | `bun run test`, `bun run type-check`, lint relevant files |
| route/query/service           | `bun run type-check`, `bun run lint`, relevant tests      |
| auth/roles/financial workflow | above plus targeted Playwright E2E                        |
| generated API contract        | type generation diff, type-check, affected local tests    |

Use `bun run test` for unit tests; plain `bun test` also discovers Playwright
files and is not the intended suite boundary. Use `bun run test:e2e` for the
browser suite.
