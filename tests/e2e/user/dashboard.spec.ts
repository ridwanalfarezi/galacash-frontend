import { expect, test } from '@playwright/test';

import { mockStudent } from '../mocks/data';
import { loginAs } from '../utils/api-mock';

/**
 * Helper to mock all dashboard API endpoints.
 * The user dashboard fetches from:
 * - /api/dashboard/summary (via dashboardQueries.summary())
 * - /api/transactions (via transactionQueries.list())
 * - /api/cash-bills/my (via cashBillQueries.my()) — NOT /api/dashboard/pending-bills
 * - /api/fund-applications/my (via fundApplicationQueries.my()) — NOT /api/dashboard/pending-applications
 */
async function mockDashboardAPIs(
  page: import('@playwright/test').Page,
  overrides?: {
    summary?: Record<string, unknown>;
    bills?: unknown[];
    applications?: unknown[];
  }
) {
  // Mock dashboard summary
  await page.route('**/api/dashboard/summary*', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: overrides?.summary ?? {
          totalBalance: 1000000,
          totalIncome: 1500000,
          totalExpense: 500000,
        },
      },
    });
  });

  // Mock transactions list
  await page.route('**/api/transactions*', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: { data: [], pagination: { totalItems: 0 } },
      },
    });
  });

  // Mock cash bills (the dashboard uses cashBillQueries.my())
  await page.route('**/api/cash-bills/my*', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: {
          data: overrides?.bills ?? [],
          pagination: { totalItems: overrides?.bills?.length ?? 0 },
        },
      },
    });
  });

  // Mock fund applications (the dashboard uses fundApplicationQueries.my())
  await page.route('**/api/fund-applications/my*', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: {
          data: overrides?.applications ?? [],
          pagination: { totalItems: overrides?.applications?.length ?? 0 },
        },
      },
    });
  });
}

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student');
  });

  test('should display dashboard summary cards', async ({ page }) => {
    await mockDashboardAPIs(page, {
      summary: { totalBalance: 1500000, totalIncome: 2000000, totalExpense: 500000 },
    });

    await page.goto('/user/dashboard');

    // Dashboard should load and show content
    await expect(page.locator('body')).toContainText(/Saldo Kas/i);
  });

  test('should display pending bills notification', async ({ page }) => {
    await mockDashboardAPIs(page, {
      bills: [
        {
          id: 'bill-1',
          billId: 'BILL-001',
          month: 3,
          year: 2024,
          status: 'belum_dibayar',
          dueDate: '2024-04-01',
          totalAmount: 15000,
        },
      ],
    });

    await page.goto('/user/dashboard');

    // The dashboard renders two TagihanCard instances: one for mobile (block lg:hidden)
    // and one for desktop (hidden lg:block). .first() always matches the hidden variant
    // regardless of viewport. Use containsText on body to verify the card rendered.
    await expect(page.locator('body')).toContainText('Tagihan Kas Anda', { timeout: 10000 });
  });

  test('should display pending applications section', async ({ page }) => {
    await mockDashboardAPIs(page, {
      applications: [
        {
          id: 'app-1',
          purpose: 'Beli spidol',
          category: 'consumption',
          amount: 25000,
          status: 'pending',
          createdAt: '2024-03-15T10:00:00Z',
          applicant: {
            id: mockStudent.id,
            name: mockStudent.name,
          },
        },
      ],
    });

    await page.goto('/user/dashboard');

    // The dashboard shows application.purpose in the pending applications section
    await expect(page.getByText('Beli spidol').first()).toBeVisible({ timeout: 10000 });
  });

  test('should show empty states when no data', async ({ page }) => {
    await mockDashboardAPIs(page);

    await page.goto('/user/dashboard');

    // Page should still load without errors
    await expect(page.locator('body')).not.toContainText('Error');
  });
});
