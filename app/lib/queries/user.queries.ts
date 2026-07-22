import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { clearAuthState } from '~/lib/auth';
import { queryKeys } from '~/lib/queries/keys';
import { broadcastInvalidation } from '~/lib/queries/query-broadcast';
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
      staleTime: 0,
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
      // Update query cache and broadcast to other tabs
      broadcastInvalidation(queryKeys.user.all);
      broadcastInvalidation(queryKeys.auth.all);
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
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      // Clear auth state and all cached queries
      clearAuthState();
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
      // Update query cache and broadcast to other tabs
      broadcastInvalidation(queryKeys.user.all);
      broadcastInvalidation(queryKeys.auth.all);
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
