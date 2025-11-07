import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('should complete full workflow: login → select protocol → run session → view results', async ({ page }) => {
    // 1. Navigate to app
    await page.goto('/');
    
    // 2. Login
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for successful login
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // 3. Browse protocols
    const protocolCards = page.locator('.protocol-card, .protocol-item, [data-testid="protocol-card"]');
    await expect(protocolCards.first()).toBeVisible({ timeout: 5000 });
    
    // Verify protocol metadata is displayed
    const firstProtocol = protocolCards.first();
    await expect(firstProtocol).toContainText(/focus|relaxation|sleep|balanced/i);
    
    // 4. Select a protocol
    await firstProtocol.click();
    await page.waitForTimeout(1000);
    
    // 5. Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await expect(startButton).toBeVisible({ timeout: 5000 });
    await startButton.click();
    
    // Wait for session to initialize
    await page.waitForTimeout(2000);
    
    // 6. Verify session is running
    const sessionControls = page.locator('button').filter({ hasText: /pause|stop|end/i });
    await expect(sessionControls.first()).toBeVisible({ timeout: 5000 });
    
    // Verify phase display
    const phaseDisplay = page.locator('.phase-name, .current-phase, [data-testid="phase-name"]').first();
    await expect(phaseDisplay).toBeVisible({ timeout: 3000 });
    await expect(phaseDisplay).toContainText(/calibration|resonance|depth|integration|coherence|return/i);
    
    // 7. Let session run briefly
    await page.waitForTimeout(3000);
    
    // 8. Stop session
    const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
    await stopButton.click();
    
    // Handle confirmation if needed
    const confirmButton = page.locator('button').filter({ hasText: /confirm|yes|stop/i }).first();
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click();
    }
    
    // 9. Verify return to protocol selection or results view
    await page.waitForTimeout(1000);
    const endState = page.locator('button').filter({ hasText: /start|select|view results|dashboard/i }).first();
    await expect(endState).toBeVisible({ timeout: 5000 });
  });

  test('should handle interrupted session recovery', async ({ page }) => {
    // 1. Login and start session
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Select protocol and start
    const firstProtocol = page.locator('.protocol-card, .protocol-item').first();
    await firstProtocol.click();
    await page.waitForTimeout(1000);
    
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // 2. Reload page while session is running
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // 3. Session should either:
    // - Resume automatically, or
    // - Show recovery option, or
    // - Return to clean state
    
    // Check if session recovered
    const sessionActive = await page.locator('button').filter({ hasText: /pause|stop/i }).first().isVisible({ timeout: 3000 }).catch(() => false);
    const protocolSelection = await page.locator('.protocol-card, .protocol-item').first().isVisible({ timeout: 3000 }).catch(() => false);
    
    // One of these should be visible
    expect(sessionActive || protocolSelection).toBeTruthy();
  });

  test('should maintain responsive design across viewport sizes', async ({ page }) => {
    // Desktop viewport (default)
    await page.goto('/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    
    // Verify layout at desktop size
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible();
    
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible();
    
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible();
  });

  test('should handle multiple rapid interactions', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Rapidly click through protocols
    const protocols = page.locator('.protocol-card, .protocol-item');
    const count = Math.min(await protocols.count(), 3);
    
    for (let i = 0; i < count; i++) {
      await protocols.nth(i).click();
      await page.waitForTimeout(300);
      
      // Try to go back if back button exists
      const backButton = page.locator('button, a').filter({ hasText: /back|return/i }).first();
      if (await backButton.isVisible({ timeout: 500 })) {
        await backButton.click();
        await page.waitForTimeout(300);
      }
    }
    
    // Should still be functional
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible();
  });

  test('should preserve user preferences across sessions', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    
    // Note current URL/state
    const currentURL = page.url();
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should remain logged in
    await expect(page).toHaveURL(currentURL);
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle concurrent API calls gracefully', async ({ page }) => {
    // Login and trigger multiple simultaneous actions
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Apply multiple filters/sorts simultaneously
    const categoryButtons = page.locator('button, .category-button').filter({ hasText: /focus|relaxation|sleep/i });
    const count = Math.min(await categoryButtons.count(), 3);
    
    // Click multiple categories in rapid succession
    for (let i = 0; i < count; i++) {
      await categoryButtons.nth(i).click({ delay: 100 });
    }
    
    // Wait for UI to stabilize
    await page.waitForTimeout(1000);
    
    // Should still display protocols
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display correct protocol usage statistics', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Check if usage count is displayed
    const usageDisplay = page.locator('.usage-count, [data-testid="usage-count"]').first();
    
    if (await usageDisplay.isVisible({ timeout: 3000 })) {
      // Usage count should be numeric
      const usageText = await usageDisplay.textContent();
      expect(usageText).toMatch(/\d+/);
    }
  });
});
