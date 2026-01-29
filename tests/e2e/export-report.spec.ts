import { test, expect } from '@playwright/test'

import { loginAs } from './utils/api-mock'

test.describe('Financial Reporting & Export', () => {
  test('Bendahara can export rekap kas data', async ({ page }) => {
    await loginAs(page, 'bendahara')

    // Mock initial list
    await page.route('**/api/bendahara/rekap-kas*', async (route) => {
        // Check if it's the export call
        if (route.request().url().includes('/export')) {
             await route.continue() // Let the specific handler below handle it if strictly matched, or just handle here
             // Actually, export is likely a different endpoint or same with query param?
             // Code: `apiClient.get('/bendahara/rekap-kas/export', ...)` or POST
        } else {
             await route.fulfill({
                json: {
                  success: true,
                  data: {
                    students: [],
                    total: 0,
                    summary: { totalBalance: 1000000 },
                  },
                },
              })
        }
    })

    // Mock export endpoint
    await page.route('**/api/bendahara/rekap-kas/export*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('fake-excel-data'),
      })
    })

    await page.goto('/bendahara/rekap-kas')

    // Trigger export
    // Note: The download attribute is set dynamically. Playwright handles downloads via 'download' event.
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /Export Data/i }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain('rekap-kas-mahasiswa')
  })
})
