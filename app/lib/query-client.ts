import { QueryClient } from '@tanstack/react-query'

/**
 * Shared React Query client instance
 * Configure staleTime for different data types:
 * - auth: Infinity (only refetch manually)
 * - dashboard: 60s (1 minute)
 * - lists: 120s (2 minutes)
 * - profile: 300s (5 minutes)
 * - static: 600s (10 minutes)
 * - default: 30s
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds default
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx errors except 401
        const axiosError = error as Record<string, unknown>
        const status = (axiosError?.response as Record<string, unknown>)?.status as
          | number
          | undefined
        if (status !== undefined && status >= 400 && status < 500) {
          if (status === 401) {
            return failureCount < 2
          }
          return false
        }
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
