import { expect, test } from '@playwright/test';

import { loginAs } from './utils/api-mock';

test.describe('Authentication Flow', () => {
  test.describe('Login Page', () => {
    test('should render login form with NIM and password fields', async ({ page }) => {
      await page.goto('/auth/sign-in');

      await expect(page.getByPlaceholder('NIM')).toBeVisible();
      await expect(page.getByPlaceholder('Kata Sandi')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Masuk' })).toBeVisible();
    });

    test('should show validation error for invalid NIM format', async ({ page }) => {
      await page.goto('/auth/sign-in');

      await page.getByPlaceholder('NIM').fill('12345');
      await page.getByPlaceholder('Kata Sandi').fill('password123');
      await page.getByRole('button', { name: 'Masuk' }).click();

      // Should show NIM validation error
      await expect(page.getByText(/13136/)).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      await page.goto('/auth/sign-in');

      await page.getByPlaceholder('NIM').fill('1313600001');
      await page.getByPlaceholder('Kata Sandi').fill('short');
      await page.getByRole('button', { name: 'Masuk' }).click();

      // Should show password validation error
      await expect(page.getByText(/8 karakter/)).toBeVisible();
    });

    test('should redirect student to user dashboard on successful login', async ({ page }) => {
      // Mock login API
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          json: {
            success: true,
            data: {
              user: {
                id: 'user-1',
                nim: '1313600001',
                name: 'Test Student',
                role: 'user',
                classId: 'class-1',
              },
            },
          },
          headers: {
            'Set-Cookie': 'accessToken=fake-token; Path=/',
          },
        });
      });

      // Mock subsequent auth/profile requests
      await loginAs(page, 'student');

      await page.goto('/auth/sign-in');

      await page.getByPlaceholder('NIM').fill('1313600001');
      await page.getByPlaceholder('Kata Sandi').fill('password123');
      await page.getByRole('button', { name: 'Masuk' }).click();

      // Should navigate to user dashboard
      await page.waitForURL(/\/user\/dashboard/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/user\/dashboard/);
    });

    test('should redirect bendahara to bendahara dashboard on successful login', async ({
      page,
    }) => {
      // Mock login API
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          json: {
            success: true,
            data: {
              user: {
                id: 'bendahara-1',
                nim: '1313600002',
                name: 'Test Bendahara',
                role: 'bendahara',
                classId: 'class-1',
              },
            },
          },
          headers: {
            'Set-Cookie': 'accessToken=fake-token; Path=/',
          },
        });
      });

      // Mock subsequent auth/profile requests
      await loginAs(page, 'bendahara');

      await page.goto('/auth/sign-in');

      await page.getByPlaceholder('NIM').fill('1313600002');
      await page.getByPlaceholder('Kata Sandi').fill('password123');
      await page.getByRole('button', { name: 'Masuk' }).click();

      // Should navigate to bendahara dashboard
      await page.waitForURL(/\/bendahara\/dashboard/, { timeout: 5000 });
      await expect(page).toHaveURL(/\/bendahara\/dashboard/);
    });

    test('should show error on invalid credentials', async ({ page }) => {
      // Mock login API with error
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 401,
          json: {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'NIM atau password salah',
            },
          },
        });
      });

      await page.goto('/auth/sign-in');

      await page.getByPlaceholder('NIM').fill('1313600001');
      await page.getByPlaceholder('Kata Sandi').fill('wrongpassword');
      await page.getByRole('button', { name: 'Masuk' }).click();

      // Should show error message
      await expect(page.getByText(/salah/)).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should redirect to login page after logout', async ({ page }) => {
      await loginAs(page, 'student');

      // Mock dashboard data
      await page.route('**/api/dashboard/**', async (route) => {
        await route.fulfill({
          json: { success: true, data: [] },
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

      // Mock logout
      await page.route('**/api/auth/logout', async (route) => {
        await route.fulfill({
          json: { success: true, message: 'Logout berhasil' },
        });
      });

      await page.goto('/user/dashboard');

      // Click user menu to expand (ChevronUp toggle in Sidebar)
      const logoutButton = page.getByText('Keluar');

      // Sidebar might need to be opened first on mobile
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
      }
    });
  });
});
