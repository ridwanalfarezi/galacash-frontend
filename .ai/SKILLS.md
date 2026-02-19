# Skills

## Adding a New API Service

1. Check `app/types/api.d.ts` for generated OpenAPI types
2. Create or open service file in `app/lib/services/[name].service.ts`
3. Define service object with async methods using apiClient
4. Add corresponding query keys in `app/lib/queries/keys.ts`
5. Create query configurations in `app/lib/queries/[name].queries.ts`
6. Export from `app/lib/queries/index.ts`
7. Run `bun run typecheck` to verify

## Adding a New Shadcn/ui Component

1. Run `bunx shadcn add [component-name]`
2. Verify component installed to `app/components/ui/`
3. Check that imports use `~/components/ui/[component]`
4. For form components, add to `app/components/form/`
5. Run `bun run lint` to verify imports

## Creating a New Route

1. Create route file in `app/routes/[feature]/[page].tsx`
2. Add route definition to `app/routes.ts`
3. Export `clientLoader` with `requireAuth()` guard
4. Use `queryClient.prefetchQuery()` for data fetching
5. Return `{ dehydratedState: dehydrate(queryClient) }`
6. Wrap component in `HydrationBoundary` and `Suspense`
7. Create page component in `app/pages/[feature]/[page].tsx`
8. Add skeleton component to `app/components/data-display/`

## Adding a New Form

1. Define Zod schema in page component file
2. Use `useForm` from react-hook-form with zodResolver
3. Import form components from `~/components/form/`
4. Use CurrencyInput for money fields
5. Use FileUpload for document uploads
6. Submit via service layer method
7. Use Sonner toast for success/error feedback
8. Invalidate relevant query keys after mutation

## Implementing Role-Based Access

1. Use `requireAuth()` from `~/lib/auth` in route loader
2. Check user role from auth store or API response
3. Return redirect for unauthorized roles
4. Conditionally render UI elements based on role
5. Add role-specific route folders: `bendahara/` or `user/`

## Adding a Data Table

1. Import DataTable from `~/components/shared/data-table`
2. Define columns array with accessor and header
3. Add action buttons column with DropdownMenu
4. Implement pagination with useState for page/size
5. Use TanStack Query with list query key
6. Add empty state with EmptyState component
7. Add BillStatusBadge for status columns

## Tracing Data Flow

1. Start at component consuming data
2. Check TanStack Query hook for query key
3. Find query configuration in `app/lib/queries/`
4. Trace to service method in `app/lib/services/`
5. Verify API endpoint in service method
6. Check generated types in `app/types/api.d.ts`
7. For mutations, check query invalidation

## Adding Client State

1. Create store file in `app/lib/stores/[name].store.ts`
2. Use Zustand create with TypeScript interface
3. Export typed hook: `use[N]Store`
4. Add selectors for computed values
5. Keep server state in TanStack Query only
6. Import store hook in components

## Debugging API Integration

1. Check FetchClient in `app/lib/api/fetch-client.ts` for request/response handling
2. Verify proxy configuration in `vite.config.ts`
3. Confirm environment variables in `.env`
4. Check generated types match actual API
5. Use browser network tab for request inspection
6. Verify error handling in service layer

## Running Code Quality Checks

1. Run `bun run lint` before committing
2. Run `bun run typecheck` for type safety
3. Fix auto-fixable issues with `bun run lint:fix`
4. Run `bun run format` for consistent formatting
5. Stage changes and run `bun run commit` for conventional commits
6. Verify Husky hooks pass on commit

## Adding a Chart Component

1. Use Recharts from `~/components/chart/`
2. Import ResponsiveContainer for responsive sizing
3. Define data structure matching chart requirements
4. Use useMemo for data transformation
5. Add CustomTooltip for formatted tooltips
6. Export from chart index file
7. Use in dashboard or analytics pages

## Refactoring Shared Components

1. Move component to `app/components/shared/`
2. Update imports in all consuming files to use `~/components/shared/`
3. Ensure component accepts flexible props
4. Verify TypeScript types are exported
5. Run `bun run typecheck` across affected files
6. Run `bun run lint` to verify no circular dependencies

## Handling File Uploads

1. Use FileUpload component from `~/components/form/`
2. Accept `accept` prop for file type restrictions
3. Handle file selection in form onChange
4. Convert File to FormData for API submission
5. Show upload progress if needed
6. Handle validation errors with Zod schema
7. Display success toast after upload

## Adding Authentication Flow

1. Check auth store in `app/lib/stores/auth.store.ts`
2. Use `requireAuth()` in route loaders
3. Handle login with `authService.login()`
4. Store user data in auth store on success
5. Redirect based on user role after login
6. Handle logout with store cleanup and redirect
7. Check httpOnly cookie handling in FetchClient (`app/lib/api/fetch-client.ts`)

## Implementing Search and Filter

1. Add search input with debounce (300ms)
2. Use URL search params for filter state
3. Update query key with filter parameters
4. Use query hook with dynamic parameters
5. Reset pagination when filters change
6. Clear filters button resets to defaults
7. Persist filters in URL for shareable links

## Adding Loading States

1. Create skeleton component in `app/components/data-display/`
2. Match exact layout of loaded content
3. Use Tailwind `animate-pulse` class
4. Export named Skeleton component
5. Use in Suspense fallback
6. Add to route clientLoader return
7. Test with network throttling

## Creating Modal Dialogs

1. Create modal component in `app/components/modals/`
2. Use Dialog from `~/components/ui/dialog`
3. Accept `open` and `onOpenChange` props
4. Use DialogTrigger for activation
5. Handle form submission in modal
6. Close on success with toast notification
7. Add backdrop blur with `data-[state=open]:` classes

## Updating Financial Calculations

1. Check existing calculations in `app/lib/calculations.ts`
2. Use precise decimal arithmetic (avoid floating point)
3. Export pure functions with typed parameters
4. Add unit tests in `tests/` directory
5. Use in service layer or components
6. Handle edge cases (zero, negative, null)
7. Document currency formatting requirements

## Adding a New Icon

1. Check Lucide icons first: `lucide-react`
2. For custom icons, create in `app/components/icons/`
3. Use SVG with Tailwind classes for sizing
4. Export with descriptive name
5. Match existing icon sizing (20x20 default)
6. Add to index export if shared
7. Use in components with `className` overrides

## Managing Query Cache

1. Define hierarchical query keys in `app/lib/queries/keys.ts`
2. Use `queryClient.invalidateQueries()` after mutations
3. Use `queryClient.prefetchQuery()` for optimistic loading
4. Set appropriate staleTime in query config
5. Use `dehydrate()` for SSR-like hydration
6. Clear cache on logout with `queryClient.clear()`
7. Monitor cache in React Query DevTools

## Adding E2E Tests

1. Create test file in `tests/e2e/` directory
2. Use Playwright fixtures and page objects
3. Test critical user flows (login, transactions, bills)
4. Run with `bun run test:e2e`
5. Mock API responses matching actual service endpoints:
   - Bills: `/api/cash-bills/my*` (NOT `/api/dashboard/pending-bills`)
   - Applications: `/api/fund-applications/my*` (NOT `/api/dashboard/pending-applications`)
   - Auth: `/api/auth/me` and `/api/auth/login`
6. Use correct route URLs: `/sign-in` (NOT `/auth/sign-in`)
7. Run in CI with headless mode

## Handling API Errors

1. Check ApiError class in `app/lib/api/errors.ts`
2. Use try-catch in service methods
3. Transform errors in apiClient interceptors
4. Display user-friendly messages in UI
5. Handle specific error codes (401, 403, 404)
6. Log errors for monitoring
7. Use error boundaries for route-level handling

## Implementing Real-time Updates

1. Use TanStack Query polling with refetchInterval
2. Or implement WebSocket in `app/lib/api/`
3. Update query cache on message receive
4. Handle connection state in UI
5. Implement exponential backoff for reconnects
6. Clean up subscriptions on unmount
7. Test with network interruptions

## Adding Environment Configuration

1. Add variable to `.env.example`
2. Add to `.env.development` and `.env.production`
3. Reference in `vite.config.ts` if needed
4. Access via `import.meta.env.VITE_*`
5. Never commit actual `.env` files
6. Update README.md with new variable
7. Type in `types/vite-env.d.ts`

## Creating Reusable Hooks

1. Create hook file in `app/hooks/[name].ts`
2. Use TypeScript for parameter and return types
3. Follow React hooks naming convention (use\*)
4. Export as default or named export
5. Add to hooks index if widely used
6. Document with JSDoc comments
7. Test with React Testing Library
