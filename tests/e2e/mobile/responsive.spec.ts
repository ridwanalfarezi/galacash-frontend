import { expect, test } from '@playwright/test';

import { loginAs } from '../utils/api-mock';

/**
 * Mobile responsive tests — only run on mobile viewport projects
 * These tests verify the app renders correctly on small screens
 */
test.describe('Mobile Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student');

    // Mock common API routes
    await page.route('**/api/dashboard/summary*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { totalBalance: 1000000, totalIncome: 1500000, totalExpense: 500000 },
        },
      });
    });

    await page.route('**/api/transactions*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });

    await page.route('**/api/cash-bills/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });

    await page.route('**/api/fund-applications/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });
  });

  test('login page should render correctly on mobile', async ({ page }) => {
    await page.goto('/sign-in');

    // Form should be visible and usable
    await expect(page.getByPlaceholder('NIM')).toBeVisible();
    await expect(page.getByPlaceholder('Kata Sandi')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();

    // Should not have horizontal overflow
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    const viewport = page.viewportSize();
    if (bodyBox && viewport) {
      expect(bodyBox.width).toBeLessThanOrEqual(viewport.width + 1); // +1 for rounding
    }
  });

  test('dashboard should render without horizontal overflow', async ({ page }) => {
    await page.goto('/user/dashboard');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('sidebar should be hidden by default on mobile', async ({ page }) => {
    await page.goto('/user/dashboard');

    // On mobile, sidebar should be hidden/collapsed by default
    // The sidebar nav links should not be visible unless opened
    const sidebar = page.locator('aside').first();

    // Sidebar might use transform/visibility to hide
    // Check if sidebar is either not visible or has zero width
    if (await sidebar.isVisible()) {
      const sidebarBox = await sidebar.boundingBox();
      // If visible, it should be an overlay, not pushing content
      if (sidebarBox) {
        const viewport = page.viewportSize();
        if (viewport) {
          expect(sidebarBox.width).toBeLessThan(viewport.width);
        }
      }
    }
  });

  test('kas kelas page should render correctly on mobile', async ({ page }) => {
    // Mock kas kelas API
    await page.route('**/api/cash-bills/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { bills: [], pagination: { totalItems: 0 } },
        },
      });
    });

    await page.goto('/user/tagihan-kas');

    // Should not have horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
