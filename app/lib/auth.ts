import { redirect } from 'react-router'

import { authService } from './services/auth.service'
import { useAuthStore } from './stores/auth.store'

/**
 * Check if user is authenticated
 *
 * First checks the Zustand store for cached user data.
 * Only makes API call if store is empty (e.g., on page refresh).
 * Populates the store after successful authentication.
 *
 * Includes retry logic for better reliability on page refresh
 * when httpOnly cookies might not be immediately available.
 */
export async function requireAuth(retryCount = 0) {
  const { user: cachedUser, setUser } = useAuthStore.getState()

  // If we have a cached user, return immediately (no API call)
  if (cachedUser) {
    return { user: cachedUser }
  }

  try {
    const user = await authService.getCurrentUser()
    // Cache the user in the store for subsequent route navigations
    setUser(user)
    return { user }
  } catch {
    // Retry up to 2 times with increasing delays on failure
    // This helps handle cases where cookies aren't immediately available on page refresh
    if (retryCount < 2) {
      const delay = retryCount === 0 ? 200 : 500
      await new Promise((resolve) => setTimeout(resolve, delay))
      try {
        const user = await authService.getCurrentUser()
        // Cache the user in the store
        setUser(user)
        return { user }
      } catch {
        // Try one more time if this was the first retry
        if (retryCount === 0) {
          return requireAuth(retryCount + 1)
        }
        // All retries failed, clear store and redirect to sign-in
        setUser(null)
        throw redirect('/sign-in')
      }
    }
    // All retries failed, clear store and redirect to sign-in
    setUser(null)
    throw redirect('/sign-in')
  }
}

/**
 * Redirect if already authenticated
 * Used on sign-in page
 *
 * First checks the Zustand store for cached user data.
 */
export async function redirectIfAuthenticated() {
  const { user: cachedUser, setUser } = useAuthStore.getState()

  // If we have a cached user, redirect immediately
  if (cachedUser) {
    if (cachedUser.role === 'bendahara') {
      throw redirect('/bendahara/dashboard')
    } else {
      throw redirect('/user/dashboard')
    }
  }

  try {
    const user = await authService.getCurrentUser()
    // Cache the user in the store
    setUser(user)
    // User is authenticated, redirect based on role
    if (user.role === 'bendahara') {
      throw redirect('/bendahara/dashboard')
    } else {
      throw redirect('/user/dashboard')
    }
  } catch {
    // Not authenticated, continue to sign-in page
    return null
  }
}

/**
 * Require specific role for route access
 * Redirects to appropriate dashboard if user doesn't have the required role
 */
export async function requireRole(role: 'user' | 'bendahara') {
  const { user } = await requireAuth()

  // Check if user has the required role
  if (user.role !== role) {
    // Redirect to their appropriate dashboard
    if (user.role === 'bendahara') {
      throw redirect('/bendahara/dashboard')
    } else {
      throw redirect('/user/dashboard')
    }
  }

  return { user }
}

/**
 * Clear auth state on logout
 * Call this after successful logout API call
 */
export function clearAuthState() {
  const { logout } = useAuthStore.getState()
  logout()
}
