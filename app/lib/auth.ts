import { redirect } from 'react-router'

import { authService } from './services/auth.service'

/**
 * Check if user is authenticated
 * Calls GET /auth/me to verify session
 * Throws redirect if not authenticated
 */
export async function requireAuth() {
  try {
    const user = await authService.getCurrentUser()
    return { user }
  } catch {
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
