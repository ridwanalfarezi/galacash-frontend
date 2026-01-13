import { queryOptions } from '@tanstack/react-query'

import { authService } from '~/lib/services/auth.service'

/**
 * Auth query factory
 * Defines all auth-related queries
 */
export const authQueries = {
  /**
   * Get current user
   * staleTime: Infinity - only refetch when explicitly invalidated
   */
  me: () =>
    queryOptions({
      queryKey: ['auth', 'me'],
      queryFn: () => authService.getCurrentUser(),
      staleTime: Infinity,
      retry: false, // Don't retry on 401
    }),
}
