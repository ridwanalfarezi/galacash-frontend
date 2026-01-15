import { apiClient } from '~/lib/api/client'
import type { components } from '~/types/api'

type User = components['schemas']['User']

export interface UpdateProfileData {
  name?: string
  email?: string
}

/**
 * User service
 * Handles user profile operations
 */
export const userService = {
  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>('/users/profile')
    return response.data.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<{ success: boolean; data: User }>('/users/profile', data)
    return response.data.data
  },

  /**
   * Change user password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/users/password', {
      oldPassword,
      newPassword,
    })
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await apiClient.post<{ success: boolean; data: User }>(
      '/users/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },
}
