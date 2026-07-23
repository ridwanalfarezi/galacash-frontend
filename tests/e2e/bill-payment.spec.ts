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

    // The bill table uses hidden lg:block — on mobile, a card view with different markup is shown.
    // The payment flow (modal, file upload) also works best on desktop. Skip on mobile.
    const viewport = page.viewportSize();
    const isMobile = viewport ? viewport.width < 1024 : false;
    test.skip(isMobile, 'Bill table and payment flow require desktop viewport');

    // Open detail through the row action. Clicking the row itself now selects it for batch payment.
    const billRow = page.locator('tr').filter({ hasText: 'BILL-001' });
    await expect(billRow).toBeVisible({ timeout: 10000 });
    await billRow.getByRole('button').last().click();

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

  test('Student can pay multiple bills in cash without payment proof', async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(
      Boolean(viewport && viewport.width < 1024),
      'Batch table selection is covered in the desktop workflow'
    );

    await loginAs(page, 'student');
    const secondBill = {
      ...mockBillPending,
      id: 'bill-id-2',
      billId: 'BILL-002',
      month: 2,
    };

    await page.route('**/api/cash-bills/my*', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            data: [mockBillPending, secondBill],
            page: 1,
            limit: 25,
            total: 2,
            totalPages: 1,
          },
        },
      });
    });

    await page.goto('/user/tagihan-kas');
    await page.getByLabel('Pilih semua tagihan').click();
    await expect(page.getByText('2 tagihan dipilih')).toBeVisible();
    await page.getByRole('button', { name: 'Bayar Sekarang' }).click();
    await page.getByRole('button', { name: 'Cash' }).click();

    const batchRequest = page.waitForRequest('**/api/cash-bills/batch-pay');
    await page.route('**/api/cash-bills/batch-pay', async (route) => {
      const requestBody = route.request().postData() ?? '';
      expect(route.request().method()).toBe('POST');
      expect(requestBody).toContain('cash');
      expect(requestBody).toContain('bill-id-1');
      expect(requestBody).toContain('bill-id-2');
      await route.fulfill({
        json: { success: true, data: [mockBillWaiting, { ...mockBillWaiting, ...secondBill }] },
      });
    });

    await page.getByRole('button', { name: /Bayar 2 Tagihan/ }).click();
    await batchRequest;
    await expect(page.getByRole('dialog')).toBeHidden();
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

    // Mock student detail and bills
    await page.route(`**/api/bendahara/students/${mockStudent.id}`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockStudent } });
    });

    await page.route(`**/api/bendahara/cash-bills?userId=${mockStudent.id}*`, async (route) => {
      await route.fulfill({ json: { success: true, data: [mockBillWaiting] } });
    });

    // Navigate to detail page
    await page.goto(`/bendahara/rekap-kas/${mockStudent.id}`);

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

  test('Treasurer can reject payment', async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(
      Boolean(viewport && viewport.width < 1024),
      'Rekap kas table is hidden on mobile viewports (< lg breakpoint)'
    );

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

    // Mock student detail and bills
    await page.route(`**/api/bendahara/students/${mockStudent.id}`, async (route) => {
      await route.fulfill({ json: { success: true, data: mockStudent } });
    });

    await page.route(`**/api/bendahara/cash-bills?userId=${mockStudent.id}*`, async (route) => {
      await route.fulfill({ json: { success: true, data: [mockBillWaiting] } });
    });

    // Navigate to detail page
    await page.goto(`/bendahara/rekap-kas/${mockStudent.id}`);

    await page.getByText('Menunggu Konfirmasi').first().click();

    // Reject
    await page.route('**/api/bendahara/cash-bills/*/reject-payment', async (route) => {
      await route.fulfill({ json: { success: true, data: mockBillPending } });
    });

    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /Tolak Pembayaran/i }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
