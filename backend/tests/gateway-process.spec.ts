import { test, expect } from '@playwright/test';

test.describe('Gateway Process (Admin Only)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('admin@example.com'); // Admin account
    await page.getByLabel(/password/i).fill('Admin123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
  });

  test('should display Gateway Process tile for admin users', async ({ page }) => {
    // Look for Gateway tile
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await expect(gatewayTile).toBeVisible({ timeout: 5000 });
    
    // Should contain "Gateway" text
    await expect(gatewayTile).toContainText(/gateway/i);
    
    // Should indicate admin access
    await expect(gatewayTile).toContainText(/admin|synthetic/i);
  });

  test('should open Gateway dashboard when clicking Gateway tile', async ({ page }) => {
    // Click Gateway tile
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    
    // Should navigate to Gateway dashboard or open modal
    await page.waitForTimeout(1000);
    
    // Look for Gateway-specific elements
    const gatewayElements = page.locator('h1, h2, h3').filter({ hasText: /gateway|dashboard/i });
    await expect(gatewayElements.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display Gateway session controls', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Should see Gateway-specific controls
    const controls = page.locator('.gateway-controls, [data-testid="gateway-controls"]').first();
    
    if (await controls.isVisible({ timeout: 3000 })) {
      // Gateway controls should include frequency/phase inputs
      await expect(controls).toContainText(/frequency|phase|carrier|binaural/i);
    }
  });

  test('should allow manual frequency adjustment', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Look for frequency input/slider
    const frequencyInput = page.locator('input[type="number"], input[type="range"]').filter({ 
      has: page.locator('label').filter({ hasText: /frequency|carrier/i })
    }).first();
    
    if (await frequencyInput.isVisible({ timeout: 3000 })) {
      // Adjust frequency
      await frequencyInput.fill('440');
      await page.waitForTimeout(300);
      
      // Value should be set
      await expect(frequencyInput).toHaveValue('440');
    }
  });

  test('should allow binaural beat adjustment', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Look for binaural beat input
    const binauralInput = page.locator('input').filter({ 
      has: page.locator('label').filter({ hasText: /binaural|beat/i })
    }).first();
    
    if (await binauralInput.isVisible({ timeout: 3000 })) {
      // Adjust binaural beat frequency (should be < 40 Hz for safety)
      await binauralInput.fill('10');
      await page.waitForTimeout(300);
      
      // Value should be set
      await expect(binauralInput).toHaveValue('10');
    }
  });

  test('should start Gateway session with custom parameters', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Set custom parameters if inputs exist
    const frequencyInput = page.locator('input').filter({ 
      has: page.locator('label').filter({ hasText: /frequency|carrier/i })
    }).first();
    
    if (await frequencyInput.isVisible({ timeout: 2000 })) {
      await frequencyInput.fill('432');
    }
    
    // Start Gateway session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Should enter active session
    const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
    await expect(stopButton).toBeVisible({ timeout: 5000 });
  });

  test('should enforce safety limits on frequency input', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Try to set unsafe frequency
    const frequencyInput = page.locator('input[type="number"]').filter({ 
      has: page.locator('label').filter({ hasText: /frequency|carrier/i })
    }).first();
    
    if (await frequencyInput.isVisible({ timeout: 3000 })) {
      // Try to set frequency above safety limit (e.g., > 1000 Hz)
      await frequencyInput.fill('2000');
      await frequencyInput.blur();
      await page.waitForTimeout(300);
      
      // Should either:
      // 1. Clamp to max safe value
      // 2. Show validation error
      // 3. Prevent form submission
      
      const value = await frequencyInput.inputValue();
      const numValue = parseInt(value);
      
      // Value should be clamped or validation shown
      const errorMessage = page.locator('.error, [role="alert"]').filter({ hasText: /frequency|limit|range/i });
      const isError = await errorMessage.isVisible({ timeout: 1000 }).catch(() => false);
      const isClamped = numValue <= 1000;
      
      expect(isError || isClamped).toBeTruthy();
    }
  });

  test('should display real-time waveform visualization', async ({ page }) => {
    // Navigate to Gateway and start session
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Should show visualization canvas
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 5000 });
  });

  test('should save Gateway session presets', async ({ page }) => {
    // Navigate to Gateway
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    // Look for save preset button
    const saveButton = page.locator('button').filter({ hasText: /save|preset/i }).first();
    
    if (await saveButton.isVisible({ timeout: 3000 })) {
      // Set some parameters
      const frequencyInput = page.locator('input').first();
      if (await frequencyInput.isVisible({ timeout: 1000 })) {
        await frequencyInput.fill('440');
      }
      
      // Save preset
      await saveButton.click();
      await page.waitForTimeout(500);
      
      // Should show confirmation or preset list
      const confirmation = page.locator('.success, [role="alert"]').filter({ hasText: /saved|success/i });
      const presetList = page.locator('.preset-list, [data-testid="presets"]');
      
      const hasConfirmation = await confirmation.isVisible({ timeout: 2000 }).catch(() => false);
      const hasPresetList = await presetList.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(hasConfirmation || hasPresetList).toBeTruthy();
    }
  });

  test('should not show Gateway tile for non-admin users', async ({ page }) => {
    // Logout
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i }).first();
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
    } else {
      await page.goto('/');
    }
    
    // Login as regular user
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|protocols|home)/i, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    
    // Gateway tile should NOT be visible
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await expect(gatewayTile).not.toBeVisible({ timeout: 3000 });
  });

  test('should handle Gateway session interruption', async ({ page }) => {
    // Navigate to Gateway and start session
    const gatewayTile = page.locator('.gateway-tile, [data-testid="gateway-protocol"]').first();
    await gatewayTile.click();
    await page.waitForTimeout(1000);
    
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Press Escape for emergency stop
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    
    // Session should stop
    const stopConfirmation = page.locator('button').filter({ hasText: /start|begin|select/i }).first();
    await expect(stopConfirmation).toBeVisible({ timeout: 5000 });
  });
});
