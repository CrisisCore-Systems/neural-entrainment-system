import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form on initial load', async ({ page }) => {
    // Check for Auth component elements
    await expect(page.locator('h1')).toContainText(/CrisisCore Neural Interface/i);
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to login without filling fields
    const loginButton = page.getByRole('button', { name: /login|sign in/i });
    await loginButton.click();
    
    // Check for HTML5 validation or custom error messages
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpassword');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for error message (adjust selector based on actual implementation)
    await expect(page.locator('.error-message, .auth-error, [role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in valid credentials (use test account)
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();

    // Wait for authentication - app shows protocol selector after login
    await expect(page.locator('.app-header, .protocol-selector, h2')).toBeVisible({ timeout: 5000 });

    // Verify logged in state - should see protocol selector or navigation
    await expect(page.locator('body')).toContainText(/protocols|logout/i, { timeout: 5000 });
  });

  test('should toggle between login and signup modes', async ({ page }) => {
    // Look for toggle button/link
    const toggleButton = page.locator('button, a').filter({ hasText: /sign up|register|create account/i }).first();
    await expect(toggleButton).toBeVisible();
    
    await toggleButton.click();
    
    // Should show signup form with additional fields
    await expect(page.getByRole('textbox', { name: /name|username/i })).toBeVisible({ timeout: 2000 });
    await expect(page.getByRole('button', { name: /sign up|register/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // URL does not change - single page app
    
    // Find and click logout button (might be in menu or header)
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i }).first();
    await logoutButton.click();
    
    // Should return to login page
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible({ timeout: 3000 });
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // URL does not change - single page app
    
    // Reload page
    await page.reload();
    
    // Should still be logged in (not redirected to login)
    await expect(page.getByRole('button', { name: /login|sign in/i })).not.toBeVisible({ timeout: 2000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept network request to simulate failure
    await page.route('**/api/auth/login', route => route.abort());
    
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Should show network error message
    await expect(page.locator('.error-message, .auth-error, [role="alert"]')).toBeVisible({ timeout: 3000 });
  });
});


