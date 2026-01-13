# Frontend API Integration Summary

## Overview

Complete integration of galacash-frontend with galacash-server backend using React Query, openapi-typescript, and httpOnly cookie authentication.

## Technology Stack

### Backend

- **Runtime**: Node.js + Express + TypeScript
- **Database**: Prisma + PostgreSQL
- **Caching**: Redis
- **Authentication**: httpOnly cookies (accessToken: 1h, refreshToken: 7d)
- **Cookie Settings**: sameSite:'none', secure:true (cross-domain support)
- **API URL**: https://galacash-server-2-66220284668.asia-southeast2.run.app/api

### Frontend

- **Framework**: React Router v7.7.0 (SPA mode with ssr:false)
- **Build Tool**: Vite 7.3.1
- **TypeScript**: 5.9.3
- **HTTP Client**: axios 1.13.2 (withCredentials:true)
- **State Management**: @tanstack/react-query 5.90.16 + zustand 5.0.9
- **Toast Notifications**: sonner 2.0.7
- **Type Generation**: openapi-typescript 7.10.1

## Authentication Flow

### Cookie-Based Auth

```typescript
// Login - sets httpOnly cookies
POST /api/auth/login
Response: { user } + Set-Cookie: accessToken, refreshToken

// API Calls - automatic token refresh on 401
GET /api/dashboard/summary
Request: Cookie: accessToken=...
Response (401): { code: "TOKEN_EXPIRED" }
→ Auto refresh: POST /api/auth/refresh (reads refreshToken from cookies)
→ Retry original request

// Logout - clears cookies
POST /api/auth/logout
Response: { message } + Clear-Cookie: accessToken, refreshToken
```

### Token Refresh Logic

- Axios response interceptor detects `TOKEN_EXPIRED` error code
- Calls `/auth/refresh` endpoint (reads refreshToken from cookies)
- Queues pending requests during refresh
- Retries all queued requests with new access token
- Redirects to sign-in on `INVALID_TOKEN` or `UNAUTHORIZED`

## File Structure

### Backend Changes

```
galacash-server/
├── package.json (+cookie-parser)
├── src/
│   ├── index.ts (added cookieParser() middleware)
│   ├── controllers/
│   │   └── auth.controller.ts (login/refresh/logout with cookies)
│   └── middlewares/
│       └── auth.middleware.ts (reads from cookies with fallback)
```

### Frontend Infrastructure

```
galacash-frontend/
├── .env.development (VITE_API_URL=/api)
├── .env.production (VITE_API_URL=https://galacash-server-2...)
├── react-router.config.ts (ssr: false)
├── vite.config.ts (proxy /api → backend)
├── app/
│   ├── root.tsx (QueryClientProvider + Toaster)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts (axios + token refresh)
│   │   │   └── errors.ts (APIError class)
│   │   ├── query-client.ts (QueryClient config)
│   │   ├── auth.ts (requireAuth, redirectIfAuthenticated)
│   │   ├── services/ (6 service files)
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── fund-application.service.ts
│   │   │   ├── cash-bill.service.ts
│   │   │   └── bendahara.service.ts
│   │   └── queries/ (5 query factory files)
│   │       ├── auth.queries.ts
│   │       ├── dashboard.queries.ts
│   │       ├── transaction.queries.ts
│   │       ├── fund-application.queries.ts
│   │       └── cash-bill.queries.ts
│   └── types/
│       └── api.d.ts (generated from openapi.yaml)
```

## Integrated Routes

### ✅ User Routes

#### 1. `/sign-in` - Authentication

**Route**: [app/routes/auth/sign-in.tsx](app/routes/auth/sign-in.tsx)

- `clientLoader`: redirectIfAuthenticated()
- No prefetching needed (public route)

**Page**: [app/pages/auth/sign-in.tsx](app/pages/auth/sign-in.tsx)

- `useMutation` for login with role-based redirect
- Toast notifications for errors
- Loading state during submission

#### 2. `/user/dashboard` - User Dashboard

**Route**: [app/routes/user/dashboard.tsx](app/routes/user/dashboard.tsx)

- `clientLoader`: requireAuth() + prefetch 3 queries
  - `dashboardQueries.summary()`
  - `transactionQueries.recent(5)`
  - `cashBillQueries.my()`
- `HydrationBoundary` for prefetched data

**Page**: [app/pages/user/dashboard.tsx](app/pages/user/dashboard.tsx)

- `useQuery(dashboardQueries.summary())` → Financial summary
- `useQuery(transactionQueries.recent(5))` → Recent transactions
- `useQuery(cashBillQueries.my())` → Unpaid bills
- Type mapping from API types to local types

#### 3. `/user/kas-kelas` - Transaction List

**Route**: [app/routes/user/kas-kelas.tsx](app/routes/user/kas-kelas.tsx)

- `clientLoader`: requireAuth() + prefetch 2 queries
  - `transactionQueries.list({ page, limit, type })`
  - `transactionQueries.chartData({})`
- `HydrationBoundary` for prefetched data

**Page**: [app/pages/user/kas-kelas.tsx](app/pages/user/kas-kelas.tsx)

- `useQuery(transactionQueries.list())` → Paginated transactions with filters
- `useQuery(transactionQueries.chartData())` → Chart data for income/expense
- Export function with blob download
- Client-side filtering and sorting
- Pagination state management

#### 4. `/user/aju-dana` - Fund Applications

**Route**: [app/routes/user/aju-dana.tsx](app/routes/user/aju-dana.tsx)

- `clientLoader`: requireAuth() + prefetch
  - `fundApplicationQueries.my()`
- `HydrationBoundary` for prefetched data

**Page**: [app/pages/user/aju-dana.tsx](app/pages/user/aju-dana.tsx)

- `useQuery(fundApplicationQueries.my())` → My applications
- `useMutation` for creating applications (FormData with file upload)
- Toast notifications for success/error
- Auto-invalidate queries on success

#### 5. `/user/tagihan-kas` - Cash Bills

**Route**: [app/routes/user/tagihan-kas.tsx](app/routes/user/tagihan-kas.tsx)

- `clientLoader`: requireAuth() + prefetch
  - `cashBillQueries.my()`
- `HydrationBoundary` for prefetched data

**Page**: [app/pages/user/tagihan-kas.tsx](app/pages/user/tagihan-kas.tsx)

- `useQuery(cashBillQueries.my())` → My bills
- `useMutation` for paying bills (FormData with payment proof)
- Status badge rendering (Belum Dibayar, Menunggu Konfirmasi, Sudah Dibayar)
- Auto-invalidate queries on successful payment

## Query Patterns

### Query Factory Pattern

```typescript
// app/lib/queries/dashboard.queries.ts
import { queryOptions } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'

export const dashboardQueries = {
  all: () => ['dashboard'] as const,
  summary: () =>
    queryOptions({
      queryKey: [...dashboardQueries.all(), 'summary'],
      queryFn: () => dashboardService.getSummary(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
}
```

### Route Pattern (clientLoader + Prefetch)

```typescript
// app/routes/user/dashboard.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { requireAuth } from '~/lib/auth'
import { queryClient } from '~/lib/query-client'

export async function clientLoader() {
  await requireAuth()

  // Prefetch critical queries
  await queryClient.prefetchQuery(dashboardQueries.summary())
  await queryClient.prefetchQuery(transactionQueries.recent(5))

  return { dehydratedState: dehydrate(queryClient) }
}

export default function Dashboard({ loaderData }) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <DashboardPage />
    </HydrationBoundary>
  )
}
```

### Component Pattern (useQuery)

```typescript
// app/pages/user/dashboard.tsx
export default function DashboardPage() {
  const { data: summary } = useQuery(dashboardQueries.summary())
  const { data: transactions } = useQuery(transactionQueries.recent(5))

  return (
    <div>
      <h1>Saldo: {formatCurrency(summary?.balance || 0)}</h1>
      {transactions?.map(t => <TransactionCard key={t.id} {...t} />)}
    </div>
  )
}
```

### Mutation Pattern (Create/Update)

```typescript
// app/pages/user/aju-dana.tsx
const createApplicationMutation = useMutation({
  mutationFn: (data: FormData) => fundApplicationService.createApplication(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: fundApplicationQueries.my().queryKey })
    toast.success('Pengajuan dana berhasil dibuat')
  },
  onError: () => {
    toast.error('Gagal membuat pengajuan dana')
  },
})

// Usage
const handleSubmit = (formData: FormData) => {
  createApplicationMutation.mutate(formData)
}
```

## Type Safety

### OpenAPI Type Generation

```bash
# Generate types from backend OpenAPI spec
pnpm openapi-typescript ../galacash-server/openapi.yaml -o app/types/api.d.ts
```

### Type Mapping Example

```typescript
// API types are all optional, need to map to local required types
interface Transaction {
  id: string
  date: string
  amount: number
  type: 'income' | 'expense'
}

const apiTransactions = data?.transactions || []
const localTransactions: Transaction[] = apiTransactions.map((t) => ({
  id: t.id || '',
  date: t.date || '',
  amount: t.amount || 0,
  type: (t.type || 'income') as 'income' | 'expense',
}))
```

## Development Workflow

### Environment Setup

```bash
# Development (uses Vite proxy)
VITE_API_URL=/api

# Production (direct backend URL)
VITE_API_URL=https://galacash-server-2-66220284668.asia-southeast2.run.app/api
```

### Running Development

```bash
# Backend (in galacash-server/)
pnpm dev

# Frontend (in galacash-frontend/)
pnpm dev
```

### Deployment

#### Backend

- Push to GitHub → Auto-deploys to Cloud Run
- URL: https://galacash-server-2-66220284668.asia-southeast2.run.app

#### Frontend

- Deploy to Vercel → https://galacash.vercel.app
- **Important**: Update backend CORS_ORIGIN to include frontend URL

## Remaining Tasks

### ⏳ Pending Routes

- [ ] `/user/settings` - User profile settings
- [ ] `/bendahara/*` - Bendahara (treasurer) routes
  - [ ] Dashboard with approval widgets
  - [ ] Fund application review (approve/reject)
  - [ ] Cash bill confirmation (confirm/reject)
  - [ ] Transaction management (create income/expense)
  - [ ] Export reports

### 🔧 Backend Configuration

- [ ] Update CORS_ORIGIN in Cloud Run environment variables:
  ```
  CORS_ORIGIN=https://galacash.vercel.app,http://localhost:5173
  ```

### 🧪 Testing

- [ ] Test complete authentication flow (login → refresh → logout)
- [ ] Test protected route redirects
- [ ] Test form submissions with file uploads
- [ ] Test export functionality
- [ ] Test error handling and toast notifications
- [ ] Test pagination and filtering
- [ ] Cross-browser testing

### 📝 Documentation

- [ ] API integration guide for new routes
- [ ] Deployment guide (backend + frontend)
- [ ] Environment variables documentation
- [ ] Troubleshooting common issues

## Security Considerations

### Cookie Settings

```typescript
res.cookie('accessToken', token, {
  httpOnly: true, // Prevents XSS attacks
  secure: true, // HTTPS only
  sameSite: 'none', // Cross-domain support
  maxAge: 3600000, // 1 hour
})
```

### CORS Configuration

```typescript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(','),
    credentials: true, // Required for cookies
  })
)
```

### Request Credentials

```typescript
// Axios client
axios.create({
  withCredentials: true, // Send cookies with every request
})
```

## Best Practices Applied

1. **Query Prefetching**: All protected routes prefetch critical queries in `clientLoader`
2. **Optimistic Updates**: Queries invalidated immediately after mutations
3. **Error Handling**: Consistent toast notifications for all errors
4. **Type Safety**: Full TypeScript coverage with generated API types
5. **Loading States**: All components show loading states from useQuery
6. **Stale Time**: Configured per query based on data volatility
7. **Query Keys**: Structured factory pattern for easy invalidation
8. **File Uploads**: Proper FormData handling for multipart requests
9. **Token Refresh**: Automatic with request queuing
10. **Security**: httpOnly cookies, CORS, secure flags

## Performance Optimizations

1. **SPA Mode**: Client-side rendering for faster navigation
2. **Query Caching**: React Query deduplicates requests
3. **Prefetching**: Critical data loaded before route renders
4. **Stale While Revalidate**: Shows cached data while fetching fresh
5. **Code Splitting**: Routes lazy-loaded automatically
6. **Vite Proxy**: Eliminates CORS in development

## Notes

- All API types are optional (generated from OpenAPI), always provide defaults
- File uploads require `FormData`, not JSON
- Export endpoints return `Blob`, handle with `window.URL.createObjectURL`
- Query keys must be arrays for proper TypeScript inference
- Always invalidate queries after mutations to refresh UI
- Use `toast.promise()` for long-running operations
- Prefetch only critical queries (< 3 per route)

---

**Last Updated**: 2025-01-12
**Backend Commit**: 2df66eb (feat: implement httpOnly cookie authentication)
**Status**: User routes fully integrated, bendahara routes pending
