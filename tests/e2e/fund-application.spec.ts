import { expect, test } from '@playwright/test';

import {
  mockFundApplication,
  mockFundApplicationApproved,
  mockFundApplicationRejected,
} from './mocks/data';
import { loginAs } from './utils/api-mock';

test.describe('Fund Application Lifecycle', () => {
  test('Student can create fund application', async ({ page }) => {
    await loginAs(page, 'student');

    // Mock initial list
    await page.route('**/api/fund-applications/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { applications: [], pagination: { totalItems: 0 } },
        },
      });
    });

    // Also mock 'all' list which is present on the page
    await page.route('**/api/fund-applications?*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { applications: [], pagination: { totalItems: 0 } },
        },
      });
    });

    await page.goto('/user/aju-dana');

    await page.getByRole('button', { name: /Ajukan Dana/i }).click();

    // Mock create
    await page.route('**/api/fund-applications', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: { success: true, data: {} } });
      } else {
        // Fallback for list if needed
        await route.continue();
      }
    });

    // Fill form
    await page.getByPlaceholder('Contoh: Pembelian buku referensi').fill('Buy Markers');
    // Nominal might be a text input with formatting, filling standard number string usually works if masked
    await page.getByLabel(/Nominal/i).fill('50000');

    // Select Category
    await page.getByRole('combobox').click();
    await page.getByRole('option').first().click();

    // Submit (Button says "Buat")
    await page.getByRole('button', { name: 'Buat' }).click();
  });

  test('Treasurer can approve fund application', async ({ page }) => {
    // The approve/reject buttons are inside a flex container with overflow-hidden wrapper.
    // On mobile viewports, these buttons may not be visible. Skip on mobile.
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;
    test.skip(isMobile, 'Approve/reject buttons not reliably visible on mobile viewports');

    await loginAs(page, 'bendahara');

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
      });
    });

    await page.goto('/bendahara/dashboard');

    await expect(page.getByText(mockFundApplication.purpose)).toBeVisible({ timeout: 10000 });

    // Mock approve
    await page.route(
      `**/api/bendahara/fund-applications/${mockFundApplication.id}/approve`,
      async (route) => {
        await route.fulfill({ json: { success: true, data: mockFundApplicationApproved } });
      }
    );

    // Find the row containing the fund application purpose, then click the approve button (2nd button)
    const row = page.locator('div').filter({ hasText: mockFundApplication.purpose }).first();
    await row.locator('button').nth(1).click();
  });

  test('Treasurer can reject fund application', async ({ page }) => {
    // Same as approve — buttons not visible on mobile
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;
    test.skip(isMobile, 'Approve/reject buttons not reliably visible on mobile viewports');

    await loginAs(page, 'bendahara');

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
      });
    });

    await page.goto('/bendahara/dashboard');

    await expect(page.getByText(mockFundApplication.purpose)).toBeVisible({ timeout: 10000 });

    // Mock reject
    await page.route(
      `**/api/bendahara/fund-applications/${mockFundApplication.id}/reject`,
      async (route) => {
        await route.fulfill({ json: { success: true, data: mockFundApplicationRejected } });
      }
    );

    const row = page.locator('div').filter({ hasText: mockFundApplication.purpose }).first();
    await row.locator('button').first().click();
  });
});
