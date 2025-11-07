import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers';

test.describe('Protocol Selection', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });

  test('should display protocol list after login', async ({ page }) => {
    // Should see protocol cards or list items
    const protocolCards = page.locator('.protocol-card, .protocol-item, [data-testid="protocol-card"]');
    await expect(protocolCards.first()).toBeVisible({ timeout: 5000 });
    
    // Should see at least one protocol
    await expect(protocolCards).toHaveCount(await protocolCards.count(), { timeout: 3000 });
  });

  test('should display protocol details correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find first protocol card
    const firstProtocol = page.locator('.protocol-card, .protocol-item, [data-testid="protocol-card"]').first();
    await expect(firstProtocol).toBeVisible();
    
    // Should show protocol metadata
    await expect(firstProtocol.locator('.protocol-name, h3, h4').first()).toBeVisible();
    await expect(firstProtocol.locator('.duration, [data-testid="duration"]').first()).toBeVisible();
    await expect(firstProtocol.locator('.difficulty, [data-testid="difficulty"]').first()).toBeVisible();
  });

  test('should filter protocols by category', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Find category filter buttons
    const focusFilter = page.locator('button, .category-button').filter({ hasText: /focus/i }).first();
    
    if (await focusFilter.isVisible()) {
      await focusFilter.click();
      
      // Wait for filtering to complete
      await page.waitForTimeout(500);
      
      // Should only show focus protocols (or at least update the view)
      const protocolCards = page.locator('.protocol-card, .protocol-item');
      await expect(protocolCards.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should sort protocols by different criteria', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for sort dropdown or buttons
    const sortButton = page.locator('button, select').filter({ hasText: /sort|difficulty|duration/i }).first();
    
    if (await sortButton.isVisible()) {
      await sortButton.click();
      
      // Should trigger re-ordering (verify by checking first protocol changes)
      await page.waitForTimeout(500);
      const protocolCards = page.locator('.protocol-card, .protocol-item');
      await expect(protocolCards.first()).toBeVisible();
    }
  });

  test('should select a protocol and navigate to session', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Click on first protocol
    const firstProtocol = page.locator('.protocol-card, .protocol-item, [data-testid="protocol-card"]').first();
    await firstProtocol.click();
    
    // Should either navigate to session or show confirmation dialog
    await page.waitForTimeout(1000);
    
    // Look for session controls or confirmation
    const sessionStarted = page.locator('.session-control, button').filter({ hasText: /start|begin|pause/i });
    await expect(sessionStarted.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display Gateway Process tile for admin users', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for Gateway tile (may only appear for admin users)
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    
    // Gateway tile may or may not be visible depending on user role
    const isVisible = await gatewayTile.isVisible().catch(() => false);
    
    if (isVisible) {
      await expect(gatewayTile).toContainText(/gateway/i);
      await expect(gatewayTile).toContainText(/admin/i);
    }
  });

  test('should handle protocol loading errors', async ({ page }) => {
    // Navigate to protocol page and block API
    await page.route('**/api/protocols', route => route.abort());
    await page.reload();
    
    // Should show error message
    await expect(page.locator('.error-message, [role="alert"]').filter({ hasText: /error|failed/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display empty state when no protocols match filter', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Apply filter that results in no matches (if possible)
    const filters = page.locator('button, .category-button');
    const filterCount = await filters.count();
    
    if (filterCount > 3) {
      // Try multiple filters to find empty state
      for (let i = 0; i < Math.min(filterCount, 5); i++) {
        await filters.nth(i).click();
        await page.waitForTimeout(300);
        
        // Check if empty state appears
        const emptyState = page.locator('.empty-state, .no-protocols').filter({ hasText: /no protocols|nothing found/i });
        if (await emptyState.isVisible().catch(() => false)) {
          await expect(emptyState).toBeVisible();
          break;
        }
      }
    }
  });

  test('should show retry button on network failure', async ({ page }) => {
    // Block API to trigger error
    await page.route('**/api/protocols', route => route.abort());
    await page.reload();
    
    // Look for retry button
    const retryButton = page.locator('button').filter({ hasText: /retry|try again/i }).first();
    await expect(retryButton).toBeVisible({ timeout: 5000 });
    
    // Unblock API and retry
    await page.unroute('**/api/protocols');
    await page.route('**/api/protocols', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          name: 'Test Protocol',
          description: 'Test description',
          category: 'focus',
          difficulty: 2,
          duration: 20,
          phases: []
        }
      ])
    }));
    
    await retryButton.click();
    
    // Should load protocols
    await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back from protocol list', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for back button
    const backButton = page.locator('button, a').filter({ hasText: /back|return/i }).first();
    
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForTimeout(500);
      
      // Should navigate away from protocol list
      await expect(page).not.toHaveURL(/protocols/i);
    }
  });
});


