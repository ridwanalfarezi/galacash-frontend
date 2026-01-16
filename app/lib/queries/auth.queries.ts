import { queryOptions, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

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
      queryKey: ['auth', 'me'],
      queryFn: () => authService.getCurrentUser(),
      staleTime: Infinity,
      retry: false, // Don't retry on 401
    }),
}

/**
 * Hook to logout user
 * Clears all React Query cache and redirects to sign-in
 */
export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear()
      // Redirect to sign-in page
      navigate('/sign-in')
    },
  })
}
