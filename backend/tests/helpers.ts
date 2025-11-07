/**
 * E2E Test Helpers
 * Shared utilities for Playwright tests
 */

import { Page, expect } from '@playwright/test';

/**
 * Login helper - handles the login flow and waits for successful auth
 */
export async function loginAsUser(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: /login|sign in/i }).click();
  
  // Wait for app to render (no URL change - single page app)
  await expect(page.locator('.app-header, .protocol-selector')).toBeVisible({ timeout: 5000 });
}

/**
 * Login as test user
 */
export async function loginAsTestUser(page: Page) {
  return loginAsUser(page, 'test@example.com', 'Test123!@#');
}

/**
 * Login as admin user
 */
export async function loginAsAdmin(page: Page) {
  return loginAsUser(page, 'admin@example.com', 'Admin123!@#');
}
