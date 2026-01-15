import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'

import { queryClient } from '~/lib/query-client'
import { userService } from '~/lib/services/user.service'

/**
 * User query factory
 * Defines all user-related queries
 */
export const userQueries = {
  /**
   * Get user profile
   */
  profile: () =>
    queryOptions({
      queryKey: ['user', 'profile'],
      queryFn: () => userService.getProfile(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
}

/**
 * Hook to use user profile query
 */
export function useUserProfile() {
  return useQuery(userQueries.profile())
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    },
  })
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(oldPassword, newPassword),
  })
}

/**
 * Hook to upload avatar
 */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    },
  })
}
