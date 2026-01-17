import { queryOptions, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { clearAuthState } from '~/lib/auth'
import { queryKeys } from '~/lib/queries/keys'
import { queryClient } from '~/lib/query-client'
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
      queryKey: queryKeys.auth.me(),
      queryFn: () => authService.getCurrentUser(),
      staleTime: Infinity,
      retry: false, // Don't retry on 401
    }),
}

/**
 * Hook to logout user
 * Clears Zustand auth store, React Query cache, and redirects to sign-in
 */
export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Zustand auth store
      clearAuthState()
      // Clear all cached queries
      queryClient.clear()
      // Redirect to sign-in page
      navigate('/sign-in')
    },
  })
}
