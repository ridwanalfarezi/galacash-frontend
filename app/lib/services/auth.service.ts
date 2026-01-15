import { apiClient } from '~/lib/api/client'
import type { components } from '~/types/api'

type User = components['schemas']['User']
type LoginResponse = components['schemas']['LoginResponse']

export interface LoginCredentials {
  nim: string
  password: string
}

/**
 * Authentication service
 * Handles login, logout, and user session management
 */
export const authService = {
  /**
   * Login with NIM and password
   * Sets httpOnly cookies automatically
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return response.data.data!.user!
  },

  /**
   * Logout current user
   * Clears httpOnly cookies
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User }>('/users/profile')
    return response.data.data
  },

  /**
   * Refresh access token
   * Called automatically by axios interceptor
   */
  async refresh(): Promise<void> {
    await apiClient.post('/auth/refresh')
  },
}
