import { redirect } from 'react-router'

import { authService } from './services/auth.service'

/**
 * Check if user is authenticated
 * Calls GET /auth/me to verify session
 * Throws redirect if not authenticated
 *
 * Includes retry logic for better reliability on page refresh
 * when httpOnly cookies might not be immediately available
 */
export async function requireAuth(retryCount = 0) {
  try {
    const user = await authService.getCurrentUser()
    return { user }
  } catch {
    // Retry up to 2 times with increasing delays on failure
    // This helps handle cases where cookies aren't immediately available on page refresh
    if (retryCount < 2) {
      const delay = retryCount === 0 ? 200 : 500
      await new Promise((resolve) => setTimeout(resolve, delay))
      try {
        const user = await authService.getCurrentUser()
        return { user }
      } catch {
        // Try one more time if this was the first retry
        if (retryCount === 0) {
          return requireAuth(retryCount + 1)
        }
        // All retries failed, redirect to sign-in
        throw redirect('/sign-in')
      }
    }
    throw redirect('/sign-in')
  }
}

/**
 * Redirect if already authenticated
 * Used on sign-in page
 */
export async function redirectIfAuthenticated() {
  try {
    const user = await authService.getCurrentUser()
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
