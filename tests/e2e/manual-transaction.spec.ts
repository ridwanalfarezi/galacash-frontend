import { test, expect } from '@playwright/test'

import { loginAs } from './utils/api-mock'

test.describe('Manual Transaction Recording', () => {
  test('Bendahara can record manual transaction', async ({ page }) => {
    await loginAs(page, 'bendahara')

    // Mock initial list
    await page.route('**/api/transactions*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { transactions: [], pagination: { totalItems: 0 } },
        },
      })
    })

    // Mock charts to prevent 401
    await page.route('**/api/transactions/breakdown*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: [],
        },
      })
    })

    // Also mock chart-data if used
    await page.route('**/api/transactions/chart-data*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: [],
        },
      })
    })

    await page.goto('/bendahara/kas-kelas')

    // Ensure button is ready
    await expect(page.getByRole('button', { name: /Buat Transaksi/i })).toBeVisible()
    await page.getByRole('button', { name: /Buat Transaksi/i }).click({ force: true })

    // Mock create transaction
    await page.route('**/api/bendahara/transactions', async (route) => {
       // Only intercept POST
       if (route.request().method() === 'POST') {
          await route.fulfill({ json: { success: true, data: {} } })
       } else {
          await route.continue()
       }
    })

    // Fill form
    await page.getByPlaceholder('Masukkan keperluan').fill('Buying Office Supplies')

    // Type (Select)
    const typeSelect = page.locator('button[role="combobox"]').nth(0)
    await typeSelect.click()
    await page.getByRole('option', { name: /Pengeluaran/i }).click()

    // Category (Select)
    // Wait for the overlay to close or the DOM to update
    await page.waitForTimeout(500)

    // Use specific targeting for category select (it's the second combobox)
    const categorySelect = page.locator('button[role="combobox"]').nth(1)
    await expect(categorySelect).toBeVisible()
    // Force click to bypass potential overlay issues
    await categorySelect.click({ force: true })

    // Wait for options to appear
    await expect(page.getByRole('option').first()).toBeVisible()
    await page.getByRole('option').first().click()

    // Nominal
    await page.getByPlaceholder('Rp 0').fill('100000')

    // Submit
    await page.getByRole('button', { name: 'Tambahkan' }).click()

    // Verify success
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})
