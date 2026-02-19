import { expect, test } from '@playwright/test';

import { mockBillPending, mockStudent } from './mocks/data';
import { loginAs } from './utils/api-mock';

test.describe('Treasurer Financial Reconciliation', () => {
  test.beforeEach(async ({ page }) => {
    // These tests rely on table <td> elements which are only visible on desktop (lg+ viewport).
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;
    test.skip(isMobile, 'Rekap kas table is hidden on mobile viewports (< lg breakpoint)');
  });

  test('Treasurer can view and filter financial recap', async ({ page }) => {
    await loginAs(page, 'bendahara');

    const studentArrears = {
      userId: mockStudent.id,
      name: mockStudent.name,
      nim: mockStudent.nim,
      totalPaid: 0,
      totalUnpaid: 50000,
      paymentStatus: 'has-arrears',
    };

    const studentPaid = {
      userId: 'student-2',
      name: 'Paid Student',
      nim: '11111111',
      totalPaid: 50000,
      totalUnpaid: 0,
      paymentStatus: 'up-to-date',
    };

    // Mock initial list (mixed)
    await page.route('**/api/bendahara/rekap-kas*', async (route) => {
      const url = new URL(route.request().url());
      const status = url.searchParams.get('paymentStatus');

      let students = [studentArrears, studentPaid];
      if (status === 'has-arrears') {
        students = [studentArrears];
      } else if (status === 'up-to-date') {
        students = [studentPaid];
      }

      await route.fulfill({
        json: {
          success: true,
          data: {
            students: students,
            total: students.length,
            summary: { totalBalance: 1000000 },
          },
        },
      });
    });

    await page.goto('/bendahara/rekap-kas');

    // Expect both to be visible initially (use first() to handle duplicates in list/card view)
    await expect(page.getByText(mockStudent.name).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Paid Student').first()).toBeVisible({ timeout: 10000 });

    // Filter by 'Menunggak'
    // The filter button is inside the 'Status' header cell
    await page.locator('th').filter({ hasText: 'Status' }).getByRole('button').click();

    // Select 'Menunggak' from the popover
    await page.getByRole('button', { name: 'Menunggak' }).click();
  });

  test('Treasurer can view student details', async ({ page }) => {
    await loginAs(page, 'bendahara');

    await page.route('**/api/bendahara/rekap-kas*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            students: [
              {
                userId: mockStudent.id,
                name: mockStudent.name,
                nim: mockStudent.nim,
                totalPaid: 0,
                totalUnpaid: 50000,
                paymentStatus: 'has-arrears',
              },
            ],
            total: 1,
          },
        },
      });
    });

    await page.goto('/bendahara/rekap-kas');

    // Mock student detail
    await page.route(`**/api/bendahara/students/${mockStudent.id}`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockStudent } });
    });

    await page.route(`**/api/bendahara/cash-bills?userId=${mockStudent.id}*`, async (route) => {
      await route.fulfill({ json: { success: true, data: [mockBillPending] } });
    });

    // Ensure student name is visible
    await expect(page.getByText(mockStudent.name).first()).toBeVisible({ timeout: 10000 });

    // Navigate to detail page
    await page.goto(`/bendahara/rekap-kas/${mockStudent.id}`);

    await expect(page).toHaveURL(new RegExp(`/bendahara/rekap-kas/${mockStudent.id}`));
    await expect(page.getByText('Detail Tagihan')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(mockStudent.name).first()).toBeVisible({ timeout: 10000 });
  });
});
