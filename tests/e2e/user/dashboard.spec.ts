import { expect, test } from '@playwright/test';

import { mockStudent } from '../mocks/data';
import { loginAs } from '../utils/api-mock';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'student');
  });

  test('should display dashboard summary cards', async ({ page }) => {
    // Mock dashboard summary
    await page.route('**/api/dashboard/summary*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            totalBalance: 1500000,
            totalIncome: 2000000,
            totalExpense: 500000,
          },
        },
      });
    });

    // Mock transactions
    await page.route('**/api/transactions*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });

    // Mock pending bills
    await page.route('**/api/dashboard/pending-bills*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    // Mock pending applications
    await page.route('**/api/dashboard/pending-applications*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    await page.goto('/user/dashboard');

    // Dashboard should load and show content
    await expect(page.locator('body')).toContainText(/Dashboard|Ringkasan/i);
  });

  test('should display pending bills section', async ({ page }) => {
    // Mock dashboard summary
    await page.route('**/api/dashboard/summary*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { totalBalance: 1000000, totalIncome: 1500000, totalExpense: 500000 },
        },
      });
    });

    // Mock transactions
    await page.route('**/api/transactions*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });

    // Mock pending bills with data
    await page.route('**/api/dashboard/pending-bills*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: [
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
        },
      });
    });

    // Mock pending applications
    await page.route('**/api/dashboard/pending-applications*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    await page.goto('/user/dashboard');

    // Should display bill info
    await expect(page.getByText('BILL-001').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display pending applications section', async ({ page }) => {
    // Mock dashboard summary
    await page.route('**/api/dashboard/summary*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { totalBalance: 1000000, totalIncome: 1500000, totalExpense: 500000 },
        },
      });
    });

    // Mock transactions
    await page.route('**/api/transactions*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { data: [], pagination: { totalItems: 0 } },
        },
      });
    });

    // Mock pending bills
    await page.route('**/api/dashboard/pending-bills*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    // Mock pending applications with data
    await page.route('**/api/dashboard/pending-applications*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: [
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
        },
      });
    });

    await page.goto('/user/dashboard');

    // Should display application info
    await expect(page.getByText('Beli spidol').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show empty states when no data', async ({ page }) => {
    // Mock all empty responses
    await page.route('**/api/dashboard/summary*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { totalBalance: 0, totalIncome: 0, totalExpense: 0 },
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

    await page.route('**/api/dashboard/pending-bills*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    await page.route('**/api/dashboard/pending-applications*', async (route) => {
      await route.fulfill({
        json: { success: true, data: [] },
      });
    });

    await page.goto('/user/dashboard');

    // Page should still load without errors
    await expect(page.locator('body')).not.toContainText('Error');
  });
});
