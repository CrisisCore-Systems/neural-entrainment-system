/**
 * E2E Test Helpers
 * Shared utilities for Playwright tests
 */

import { Page, expect } from '@playwright/test';

export async function loginAsUser(page: Page, email: string = 'testuser@example.com', password: string = 'TestPass123!') {
  await page.goto('/');

  const emailInput = page.locator('input[type="email"], input[name="email"], [data-testid="email-input"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"], [data-testid="password-input"]').first();
  // Use form button[type="submit"] to avoid clicking tab buttons
  const loginButton = page.locator('form button[type="submit"]').first();

  await emailInput.fill(email);
  await passwordInput.fill(password);
  await loginButton.click();

  try {
    await Promise.race([
      page.waitForURL('**/dashboard**', { timeout: 8000 }),
      page.waitForURL('**/protocols**', { timeout: 8000 }),
      page.waitForSelector('.dashboard, .protocols, [data-testid="dashboard"]', { timeout: 8000 }),
      page.waitForSelector('.user-menu, .logout-button, [data-testid="user-menu"]', { timeout: 8000 })
    ]);
  } catch (e) {
    await page.waitForLoadState('networkidle');
  }
}

export async function waitForAppToLoad(page: Page) {
  console.log('waitForAppToLoad: Starting...');
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  console.log('waitForAppToLoad: Network idle');

  // Give React time to initialize, check localStorage token, and render authenticated UI
  await page.waitForTimeout(3000);
  console.log('waitForAppToLoad: Waited for React initialization');

  // Check if we're stuck on login page
  const loginSelectors = [
    '[data-testid="login-form"]',
    '.login-form',
    'input[type="email"]',
    'input[type="password"]',
    'button:has-text("Login")',
    'button:has-text("Sign In")'
  ];

  // Check if we have a token in localStorage - if we do, we're authenticated
  const hasToken = await page.evaluate(() => {
    return !!localStorage.getItem('auth_token');
  }).catch(() => false);

  console.log('waitForAppToLoad: Token in localStorage:', hasToken ? 'YES' : 'NO');

  if (hasToken) {
    console.log('waitForAppToLoad: Token found in localStorage, user is authenticated');
    // Even if login form is visible, if we have a token, the app is just initializing
    // Don't throw error, let the fallback check handle it
  } else {
    console.log('waitForAppToLoad: No token found, checking if on login page...');
    // Only check for login page if there's no token
    for (const selector of loginSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible().catch(() => false)) {
        console.log(`waitForAppToLoad: Login element found: ${selector}`);
        const isLoginPage = await page.locator('body').evaluate((body: any) => {
          return body.innerText.includes('Login') || 
                 body.innerText.includes('Sign In') ||
                 body.innerText.includes('Email') ||
                 body.innerText.includes('Password');
        }).catch(() => false);

        console.log('waitForAppToLoad: Body contains login text:', isLoginPage);

        if (isLoginPage) {
          throw new Error('Still on login page after authentication. Check frontend routing.');
        }
      }
    }
  }

  // Extended app selectors with more possibilities
  const appSelectors = [
    // Layout components
    '.app-header',
    '.header',
    '.navbar',
    '.nav-bar',
    '.sidebar',
    '.main-content',
    
    // Dashboard components
    '.dashboard',
    '.user-dashboard',
    '.protocol-list',
    '.protocol-grid',
    '.entrainment-app',
    
    // User components
    '.user-menu',
    '.user-profile',
    '[data-testid="user-avatar"]',
    
    // Data-testid selectors
    '[data-testid="protocol-list"]',
    '[data-testid="dashboard"]',
    '[data-testid="main-content"]',
    '[data-testid="user-menu"]',
    '[data-testid="nav-menu"]',
    
    // Text content that indicates app is loaded
    'text=Welcome',
    'text=Dashboard',
    'text=Protocols',
    'text=Entrainment',
    'text=Settings',
    'text=Logout'
  ];

  const selectorString = appSelectors.join(', ');
  console.log(`waitForAppToLoad: Looking for selectors: ${selectorString}`);

  try {
    await expect(page.locator(selectorString)).toBeVisible({ timeout: 15000 });
    console.log('waitForAppToLoad: App loaded successfully!');
  } catch (error) {
    console.log('waitForAppToLoad: Primary selectors not found, trying fallback...');
    
    // Fallback: check if any meaningful content is visible
    const hasContent = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      // Check if there's substantial content (not just login form)
      return bodyText.length > 200 && 
             !bodyText.includes('Login') && 
             !bodyText.includes('Sign In');
    }).catch(() => false);
    
    if (hasContent) {
      console.log('waitForAppToLoad: Fallback check passed - content detected');
      return;
    }
    
    console.log('waitForAppToLoad: All checks failed');
    throw error;
  }
}

export async function loginAsTestUser(page: Page) {
  return loginAsUser(page, process.env.TEST_USER_EMAIL || 'testuser@example.com', process.env.TEST_USER_PASSWORD || 'TestPass123!');
}

export async function loginAsAdmin(page: Page) {
  return loginAsUser(page, process.env.TEST_ADMIN_EMAIL || 'admin@example.com', process.env.TEST_ADMIN_PASSWORD || 'TestPass123!');
}
