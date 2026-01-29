import type { Page } from '@playwright/test'

import { mockBendahara, mockStudent } from '../mocks/data'

export const loginAs = async (page: Page, role: 'student' | 'bendahara') => {
  const user = role === 'student' ? mockStudent : mockBendahara

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

  // Mock /auth/me (alternative)
  await page.route('**/api/auth/me', async (route) => {
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
        data: { accessToken: 'fake-token' },
      }),
    })
  })
}
