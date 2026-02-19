import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '~/lib/queries/keys';
import { queryClient } from '~/lib/query-client';
import { userService } from '~/lib/services/user.service';
import { useAuthStore } from '~/lib/stores/auth.store';

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
      queryKey: queryKeys.user.profile(),
      queryFn: () => userService.getProfile(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};

/**
 * Hook to use user profile query
 */
export function useUserProfile() {
  return useQuery(userQueries.profile());
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      // Update query cache
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      // Also update auth store if user data changed
      if (updatedUser) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            ...updatedUser,
          });
        }
      }
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  const logout = useAuthStore.getState().logout;
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Logout user
      logout();
    },
  });
}

/**
 * Hook to upload avatar
 */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: userService.uploadAvatar,
    onSuccess: (response) => {
      // Update query cache
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      // Also update auth store avatar
      if (response?.avatarUrl) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            avatarUrl: response.avatarUrl,
          });
        }
      }
    },
  });
}
