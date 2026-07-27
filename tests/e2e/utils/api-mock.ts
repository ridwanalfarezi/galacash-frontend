import type { Page } from '@playwright/test'

import { mockBendahara, mockStudent } from '../mocks/data'

export const mockUnauthenticated = async (page: Page) => {
  await page.route('**/api/users/profile', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      }),
    })
  })
}

export const loginAs = async (page: Page, role: 'student' | 'bendahara') => {
  const user = role === 'student' ? mockStudent : mockBendahara

  // Any endpoint not explicitly mocked by the scenario is a test failure.
  await page.route('**/api/**', async (route) => {
    await route.abort('failed')
  })

  // Mock /users/profile (used for current user)
  await page.route('**/api/users/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: user,
      }),
    })
  })

  // Mock /auth/refresh
  await page.route('**/api/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
      }),
    })
  })
}
