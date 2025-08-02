import { test, expect } from '@playwright/test';

test('redirects to login when not authenticated', async ({ page }) => {
  await page.goto('http://localhost:5173/avatar-profile');
  await expect(page.locator('form')).toBeVisible();
  await expect(page.locator('input[type="email"]')).toBeVisible();
});

test('login and view avatar profile', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  await page.goto('http://localhost:5173/avatar-profile');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page.locator('h1', { hasText: 'ChronoNaut_042' })).toBeVisible();
});
