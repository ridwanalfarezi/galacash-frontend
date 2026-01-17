import { create } from 'zustand'

import type { User } from '~/types/domain'

// ============================================================================
// Auth Store Types
// ============================================================================

interface AuthState {
  /**
   * Current authenticated user or null if not authenticated
   */
  user: User | null
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean
  /**
   * Whether the auth state is being loaded
   */
  isLoading: boolean
}

interface AuthActions {
  /**
   * Set the current user
   */
  setUser: (user: User | null) => void
  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => void
  /**
   * Clear user and logout
   */
  logout: () => void
  /**
   * Check if user has a specific role
   */
  hasRole: (role: 'user' | 'bendahara') => boolean
}

type AuthStore = AuthState & AuthActions

// ============================================================================
// Auth Store
// ============================================================================

/**
 * Global auth store using Zustand
 *
 * This store is used to cache the authenticated user across the app,
 * avoiding repeated API calls to /auth/me on every route.
 *
 * Note: We don't persist this store because auth state should be
 * validated on page refresh via the httpOnly cookie.
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  hasRole: (role) => {
    const { user } = get()
    return user?.role === role
  },
}))

// ============================================================================
// Selector Hooks
// ============================================================================

/**
 * Get current user from auth store
 */
export const useCurrentUser = () => useAuthStore((state) => state.user)

/**
 * Check if user is authenticated
 */
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)

/**
 * Check if auth is loading
 */
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading)

/**
 * Check if current user is bendahara
 */
export const useIsBendahara = () => useAuthStore((state) => state.user?.role === 'bendahara')

/**
 * Get user's display name
 */
export const useUserDisplayName = () => useAuthStore((state) => state.user?.name || 'User')

/**
 * Get user's initials for avatar
 */
export const useUserInitials = () =>
  useAuthStore((state) => {
    const name = state.user?.name || ''
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })
