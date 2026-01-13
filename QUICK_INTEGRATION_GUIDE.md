# Quick Integration Guide

## Adding a New Route with API Integration

### Step 1: Update Route File

```typescript
// app/routes/user/my-route.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Route } from './+types/my-route'
import { requireAuth } from '~/lib/auth'
import { queryClient } from '~/lib/query-client'
import { myQueries } from '~/lib/queries/my.queries'
import MyPage from '~/pages/user/my-route'

export function meta() {
  return [{ title: 'GalaCash | My Feature' }]
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  // Require authentication
  await requireAuth()

  // Prefetch critical queries (max 2-3 queries)
  await queryClient.prefetchQuery(myQueries.list())

  // Return dehydrated state
  return { dehydratedState: dehydrate(queryClient) }
}

export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function MyRoute({ loaderData }: Route.ComponentProps) {
  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <MyPage />
    </HydrationBoundary>
  )
}
```

### Step 2: Create Service

```typescript
// app/lib/services/my.service.ts
import { apiClient } from '../api/client'
import type { components } from '~/types/api'

type MyItem = components['schemas']['MyItem']

export const myService = {
  async getList(params?: { page?: number; limit?: number }) {
    const { data } = await apiClient.get<{ items: MyItem[] }>('/my-items', { params })
    return data.items
  },

  async getById(id: string) {
    const { data } = await apiClient.get<{ item: MyItem }>(`/my-items/${id}`)
    return data.item
  },

  async create(formData: FormData) {
    const { data } = await apiClient.post<{ item: MyItem }>('/my-items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.item
  },

  async update(id: string, formData: FormData) {
    const { data } = await apiClient.put<{ item: MyItem }>(`/my-items/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.item
  },

  async delete(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/my-items/${id}`)
    return data
  },

  async exportData(params?: { type?: string }) {
    const { data } = await apiClient.get<Blob>('/my-items/export', {
      params,
      responseType: 'blob',
    })
    return data
  },
}
```

### Step 3: Create Query Factory

```typescript
// app/lib/queries/my.queries.ts
import { queryOptions } from '@tanstack/react-query'
import { myService } from '../services/my.service'

export const myQueries = {
  all: () => ['my-items'] as const,

  lists: () => [...myQueries.all(), 'list'] as const,
  list: (params?: { page?: number; limit?: number; type?: string }) =>
    queryOptions({
      queryKey: [...myQueries.lists(), params],
      queryFn: () => myService.getList(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
    }),

  details: () => [...myQueries.all(), 'detail'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...myQueries.details(), id],
      queryFn: () => myService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
}
```

### Step 4: Update Page Component

```typescript
// app/pages/user/my-route.tsx
'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { myQueries } from '~/lib/queries/my.queries'
import { myService } from '~/lib/services/my.service'
import { queryClient } from '~/lib/query-client'
import { toast } from 'sonner'

export default function MyPage() {
  const [page, setPage] = useState(1)

  // Fetch list
  const { data: items, isLoading } = useQuery(myQueries.list({ page, limit: 20 }))

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => myService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myQueries.lists() })
      toast.success('Item created successfully')
    },
    onError: () => {
      toast.error('Failed to create item')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => myService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myQueries.lists() })
      toast.success('Item deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete item')
    },
  })

  // Export function
  const handleExport = async () => {
    try {
      const blob = await myService.exportData()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${new Date().toISOString()}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Export successful')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  return (
    <div>
      {/* Your UI here */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        items?.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <button onClick={() => deleteMutation.mutate(item.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  )
}
```

## Common Patterns

### Type Mapping (API → Local)

```typescript
import type { components } from '~/types/api'

type APIItem = components['schemas']['Item']

interface LocalItem {
  id: string
  name: string
  amount: number
}

// Map API types (all optional) to local types (required)
const localItems: LocalItem[] = (apiData?.items || []).map((item) => ({
  id: item.id || '',
  name: item.name || '',
  amount: item.amount || 0,
}))
```

### File Upload with FormData

```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)

  // Add additional fields
  formData.append('userId', userId)

  createMutation.mutate(formData)
}

// In JSX
<form onSubmit={handleSubmit}>
  <input type="file" name="attachment" />
  <input type="text" name="description" />
  <button type="submit">Submit</button>
</form>
```

### Blob Download (Export)

```typescript
const handleExport = async () => {
  try {
    const blob = await myService.exportData()

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export-${Date.now()}.xlsx`
    document.body.appendChild(a)
    a.click()

    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.success('Export successful')
  } catch (error) {
    toast.error('Export failed')
  }
}
```

### Pagination

```typescript
const [page, setPage] = useState(1)
const limit = 20

const { data } = useQuery(
  myQueries.list({ page, limit })
)

const totalPages = Math.ceil((data?.total || 0) / limit)

// In JSX
<button onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
<span>Page {page} of {totalPages}</span>
<button onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
```

### Filtering

```typescript
const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

const { data } = useQuery(
  myQueries.list({
    status: filter === 'all' ? undefined : filter,
  })
)
```

### Optimistic Updates

```typescript
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: FormData }) => myService.update(id, data),
  onMutate: async ({ id, data }) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: myQueries.lists() })

    // Snapshot previous value
    const previous = queryClient.getQueryData(myQueries.lists())

    // Optimistically update
    queryClient.setQueryData(myQueries.lists(), (old: any) => {
      return old?.map((item: any) =>
        item.id === id ? { ...item, ...Object.fromEntries(data) } : item
      )
    })

    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(myQueries.lists(), context?.previous)
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: myQueries.lists() })
  },
})
```

### Loading with Toast Promise

```typescript
const handleLongOperation = async () => {
  toast.promise(myService.heavyOperation(), {
    loading: 'Processing...',
    success: 'Operation completed!',
    error: 'Operation failed',
  })
}
```

## Troubleshooting

### Cookie Not Sent

- Ensure `withCredentials: true` in axios config
- Check `sameSite` and `secure` cookie settings
- Verify CORS `credentials: true` on backend

### Type Errors

- Regenerate types: `pnpm openapi-typescript ../galacash-server/openapi.yaml -o app/types/api.d.ts`
- All API types are optional, always provide defaults
- Use type mapping for required local types

### Query Not Updating

- Check query key structure (must be array)
- Invalidate specific queries after mutation
- Use React Query DevTools to debug cache

### File Upload 400 Error

- Ensure `Content-Type: multipart/form-data` header
- Don't manually set Content-Type with FormData (browser sets boundary)
- Check backend accepts multipart

### Prefetch Not Working

- Await `queryClient.prefetchQuery()` in clientLoader
- Return `dehydratedState` from clientLoader
- Wrap component in `HydrationBoundary`

## Quick Commands

```bash
# Generate API types
pnpm openapi-typescript ../galacash-server/openapi.yaml -o app/types/api.d.ts

# Run development
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm tsc

# Lint
pnpm lint

# Format
pnpm format
```

---

**Pro Tips:**

1. Keep query keys consistent across factories
2. Prefetch only critical data (< 3 queries per route)
3. Use `staleTime` based on data volatility
4. Always handle loading and error states
5. Toast notifications for all user actions
6. Invalidate queries immediately after mutations
7. Use FormData for file uploads
8. Map API types to local types with defaults
9. Test authentication flow thoroughly
10. Check Network tab for cookie headers
