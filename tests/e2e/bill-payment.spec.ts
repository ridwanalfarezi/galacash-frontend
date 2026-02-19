import { expect, test } from '@playwright/test';

import { mockBillPaid, mockBillPending, mockBillWaiting, mockStudent } from './mocks/data';
import { loginAs } from './utils/api-mock';

test.describe('Student Bill Payment Flow', () => {
  test('Student can upload payment proof', async ({ page }) => {
    await loginAs(page, 'student');

    // Mock get bills
    await page.route('**/api/cash-bills/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: { bills: [mockBillPending], pagination: { totalItems: 1 } },
        },
      });
    });

    await page.goto('/user/tagihan-kas');

    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;

    if (isMobile) {
      // On mobile, the table is hidden (hidden lg:block). Cards are shown via DataCardContainer (lg:hidden).
      // Look for bill text in the card view instead of table <td>.
      const billCard = page.getByText('Belum Dibayar', { exact: false }).first();
      await billCard.scrollIntoViewIfNeeded();
      await expect(billCard).toBeVisible({ timeout: 10000 });
      await billCard.click();
    } else {
      // On desktop, table is visible
      const billText = page.getByText('Belum Dibayar').filter({ hasText: 'Belum Dibayar' }).first();
      await expect(billText).toBeVisible({ timeout: 10000 });
      await billText.click();
    }

    // Check modal content
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10000 });

    // Mock upload
    await page.route('**/api/cash-bills/*/pay', async (route) => {
      await route.fulfill({ json: { success: true, data: {} } });
    });

    // Select payment method "Bank"
    await page.getByRole('button', { name: /Bank/i }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'proof.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image'),
    });

    // Click "Bayar Sekarang"
    await page.getByRole('button', { name: /Bayar Sekarang/i }).click();
  });

  test('Treasurer can confirm payment', async ({ page }) => {
    // This test relies on table <td> elements which are only visible on desktop (lg+ viewport).
    // Skip on mobile viewports.
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;
    test.skip(isMobile, 'Rekap kas table is hidden on mobile viewports (< lg breakpoint)');

    await loginAs(page, 'bendahara');

    // Mock rekap kas list
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

    // Ensure student name is visible
    await expect(page.getByText(mockStudent.name).first()).toBeVisible({ timeout: 10000 });

    // Navigate to detail page
    await page.goto(`/bendahara/rekap-kas/${mockStudent.id}`);

    // Mock student detail and bills
    await page.route(`**/api/bendahara/students/${mockStudent.id}`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockStudent } });
    });

    await page.route(`**/api/bendahara/cash-bills?userId=${mockStudent.id}*`, async (route) => {
      await route.fulfill({ json: { success: true, data: [mockBillWaiting] } });
    });

    // Check we are on detail page
    await expect(page).toHaveURL(new RegExp(`/bendahara/rekap-kas/${mockStudent.id}`));

    // Click the bill (resolve strict mode)
    await expect(page.getByText('Menunggu Konfirmasi').first()).toBeVisible({ timeout: 10000 });
    await page.getByText('Menunggu Konfirmasi').first().click();

    // Confirm
    await page.route('**/api/bendahara/cash-bills/*/confirm-payment', async (route) => {
      await route.fulfill({ json: { success: true, data: mockBillPaid } });
    });

    // Handle standard browser confirm dialog
    page.on('dialog', (dialog) => dialog.accept());

    await page.getByRole('button', { name: /Konfirmasi Pembayaran/i }).click();
  });

  // TODO: Implement reject payment button in UI before enabling this test
  test.skip('Treasurer can reject payment', async ({ page }) => {
    await loginAs(page, 'bendahara');

    // Mock rekap kas list
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

    // Ensure student name is visible
    await expect(page.getByText(mockStudent.name).first()).toBeVisible();

    // Navigate to detail page
    await page.goto(`/bendahara/rekap-kas/${mockStudent.id}`);

    // Mock student detail and bills
    await page.route(`**/api/bendahara/students/${mockStudent.id}`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockStudent } });
    });

    await page.route(`**/api/bendahara/cash-bills?userId=${mockStudent.id}*`, async (route) => {
      await route.fulfill({ json: { success: true, data: [mockBillWaiting] } });
    });

    await page.getByText('Menunggu Konfirmasi').first().click();

    // Reject
    await page.route('**/api/bendahara/cash-bills/*/reject-payment', async (route) => {
      await route.fulfill({ json: { success: true, data: mockBillPending } });
    });

    // This button does not exist yet!
    await page.getByRole('button', { name: /Tolak/i }).click({ timeout: 2000 });
  });
});
