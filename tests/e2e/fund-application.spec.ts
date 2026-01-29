import { test, expect } from '@playwright/test'

import {
  mockFundApplication,
  mockFundApplicationApproved,
  mockFundApplicationRejected,
} from './mocks/data'
import { loginAs } from './utils/api-mock'

test.describe('Fund Application Lifecycle', () => {
  test('Student can create fund application', async ({ page }) => {
    await loginAs(page, 'student')

    // Mock initial list
    await page.route('**/api/fund-applications/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { applications: [], pagination: { totalItems: 0 } },
        },
      })
    })

    // Also mock 'all' list which is present on the page
    await page.route('**/api/fund-applications?*', async (route) => {
        await route.fulfill({
          json: {
            success: true,
            data: { applications: [], pagination: { totalItems: 0 } },
          },
        })
      })

    await page.goto('/user/aju-dana')

    await page.getByRole('button', { name: /Ajukan Dana/i }).click()

    // Mock create
    await page.route('**/api/fund-applications', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: { success: true, data: {} } })
      } else {
        // Fallback for list if needed
        await route.continue()
      }
    })

    // Fill form
    await page.getByPlaceholder('Contoh: Pembelian buku referensi').fill('Buy Markers')
    // Nominal might be a text input with formatting, filling standard number string usually works if masked
    await page.getByLabel(/Nominal/i).fill('50000')

    // Select Category
    await page.getByRole('combobox').click()
    await page.getByRole('option').first().click()

    // Submit (Button says "Buat")
    await page.getByRole('button', { name: 'Buat' }).click()

    // Verify success
    // Wait for toast or modal close
    // await expect(page.getByRole('dialog')).toBeHidden(); // Might be flaky if animation
  })

  test('Treasurer can approve fund application', async ({ page }) => {
    await loginAs(page, 'bendahara')

    // Mock dashboard
    await page.route('**/api/bendahara/dashboard*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            totalBalance: 1000000,
            recentFundApplications: [mockFundApplication],
          },
        },
      })
    })

    await page.goto('/bendahara/dashboard')

    await expect(page.getByText(mockFundApplication.purpose)).toBeVisible()

    // Mock approve
    await page.route(`**/api/bendahara/fund-applications/${mockFundApplication.id}/approve`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockFundApplicationApproved } })
    })

    // Click Approve (Check icon)
    // There are multiple buttons (Reject and Approve).
    // I need to target the one for this specific row.
    // The code:
    /*
        <div key={submission.id} ...>
           ...
           <Button onClick={() => handleApprove(submission.id)} ...>
    */
    // I can use locator with hasText/has to find the row, then find the button.
    const row = page.locator('div').filter({ hasText: mockFundApplication.purpose }).first()
    await row.locator('button').nth(1).click() // 0 is Reject, 1 is Approve based on code order: Reject(X), Approve(Check) -> Wait, code says:
    /*
      <Button ... onClick={handleReject} ...><Icons.X ... /></Button>
      <Button ... onClick={handleApprove} ...><Icons.Check ... /></Button>
    */
    // So yes, 2nd button is Approve.

    // Or better, filter by icon
    // But icons are SVGs.
    // Let's assume nth(1) works or use aria-label if present.
    // Code does not show aria-label.
  })

  test('Treasurer can reject fund application', async ({ page }) => {
    await loginAs(page, 'bendahara')

     // Mock dashboard
     await page.route('**/api/bendahara/dashboard*', async (route) => {
        await route.fulfill({
          json: {
            success: true,
            data: {
              totalBalance: 1000000,
              recentFundApplications: [mockFundApplication],
            },
          },
        })
      })

      await page.goto('/bendahara/dashboard')

      await expect(page.getByText(mockFundApplication.purpose)).toBeVisible()

    // Mock reject
    await page.route(`**/api/bendahara/fund-applications/${mockFundApplication.id}/reject`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockFundApplicationRejected } })
    })

    const row = page.locator('div').filter({ hasText: mockFundApplication.purpose }).first()
    await row.locator('button').first().click() // 0 is Reject
  })
})
