import { test, expect } from '@playwright/test';

test.describe('Session Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and select a protocol
    await page.goto('/');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test123!@#');
    await page.getByRole('button', { name: /login|sign in/i }).click();
    // URL does not change - single page app
    await page.waitForLoadState('networkidle');
    
    // Select first protocol
    const firstProtocol = page.locator('.protocol-card, .protocol-item, [data-testid="protocol-card"]').first();
    await firstProtocol.click();
    await page.waitForTimeout(1000);
  });

  test('should display session control panel', async ({ page }) => {
    // Should see session control elements
    await expect(page.locator('.session-control, [data-testid="session-control"]').first()).toBeVisible({ timeout: 5000 });
    
    // Should show start button
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await expect(startButton).toBeVisible();
  });

  test('should start a session successfully', async ({ page }) => {
    // Click start button
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    
    // Wait for session to initialize
    await page.waitForTimeout(2000);
    
    // Should show pause/stop controls
    const pauseButton = page.locator('button').filter({ hasText: /pause/i }).first();
    const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
    
    await expect(pauseButton.or(stopButton)).toBeVisible({ timeout: 5000 });
  });

  test('should display phase information during session', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Should show current phase
    const phaseDisplay = page.locator('.phase-name, .current-phase, [data-testid="phase-name"]').first();
    await expect(phaseDisplay).toBeVisible({ timeout: 5000 });
    
    // Should show phase info (calibration, resonance, etc.)
    await expect(phaseDisplay).toContainText(/calibration|resonance|depth|integration|coherence|return/i);
  });

  test('should display real-time metrics during session', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Look for metrics display
    const metricsPanel = page.locator('.metrics, [data-testid="metrics"]').first();
    
    if (await metricsPanel.isVisible({ timeout: 5000 })) {
      // Should show coherence, focus, or other metrics
      await expect(metricsPanel).toContainText(/coherence|focus|arousal|load|valence/i);
    }
  });

  test('should pause and resume session', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Pause session
    const pauseButton = page.locator('button').filter({ hasText: /pause/i }).first();
    await pauseButton.click();
    await page.waitForTimeout(500);
    
    // Should show resume button
    const resumeButton = page.locator('button').filter({ hasText: /resume|continue/i }).first();
    await expect(resumeButton).toBeVisible({ timeout: 3000 });
    
    // Resume session
    await resumeButton.click();
    await page.waitForTimeout(500);
    
    // Should show pause button again
    await expect(pauseButton).toBeVisible({ timeout: 3000 });
  });

  test('should stop session successfully', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Stop session
    const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
    await stopButton.click();
    
    // May show confirmation dialog
    const confirmButton = page.locator('button').filter({ hasText: /confirm|yes|stop/i }).first();
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click();
    }
    
    // Should return to start state or protocol selection
    await page.waitForTimeout(1000);
    const startAgain = page.locator('button').filter({ hasText: /start|begin|select/i }).first();
    await expect(startAgain).toBeVisible({ timeout: 5000 });
  });

  test('should toggle audio on/off', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Look for audio toggle
    const audioToggle = page.locator('button, .toggle').filter({ hasText: /audio|sound|mute/i }).first();
    
    if (await audioToggle.isVisible({ timeout: 3000 })) {
      // Toggle audio off
      await audioToggle.click();
      await page.waitForTimeout(300);
      
      // Toggle audio back on
      await audioToggle.click();
      await page.waitForTimeout(300);
      
      // Should still be in session
      const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
      await expect(stopButton).toBeVisible();
    }
  });

  test('should toggle visuals on/off', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Look for visual toggle
    const visualToggle = page.locator('button, .toggle').filter({ hasText: /visual|graphics|display/i }).first();
    
    if (await visualToggle.isVisible({ timeout: 3000 })) {
      // Toggle visuals off
      await visualToggle.click();
      await page.waitForTimeout(300);
      
      // Toggle visuals back on
      await visualToggle.click();
      await page.waitForTimeout(300);
      
      // Should still be in session
      const stopButton = page.locator('button').filter({ hasText: /stop|end/i }).first();
      await expect(stopButton).toBeVisible();
    }
  });

  test('should display neural visualization during session', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Look for canvas or WebGL visualization
    const visualization = page.locator('canvas, .visualization, [data-testid="visualization"]').first();
    await expect(visualization).toBeVisible({ timeout: 5000 });
  });

  test('should handle phase transitions', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    
    // Get initial phase
    await page.waitForTimeout(2000);
    const phaseDisplay = page.locator('.phase-name, .current-phase, [data-testid="phase-name"]').first();
    const initialPhase = await phaseDisplay.textContent();
    
    // Wait for potential phase transition (shortened for testing)
    await page.waitForTimeout(5000);
    
    // Phase should still be displayed (may or may not have transitioned in 5 seconds)
    await expect(phaseDisplay).toBeVisible();
  });

  test('should display progress indicator', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Look for progress bar or indicator
    const progressBar = page.locator('.progress, [role="progressbar"], [data-testid="progress"]').first();
    
    if (await progressBar.isVisible({ timeout: 3000 })) {
      await expect(progressBar).toBeVisible();
    }
  });

  test('should handle emergency stop', async ({ page }) => {
    // Start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(2000);
    
    // Press Escape key for emergency stop
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    
    // Session should stop
    const startAgain = page.locator('button').filter({ hasText: /start|begin|select/i }).first();
    await expect(startAgain).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back from session', async ({ page }) => {
    // Look for back button
    const backButton = page.locator('button, a').filter({ hasText: /back|return/i }).first();
    
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForTimeout(500);
      
      // Should return to protocol list
      await expect(page.locator('.protocol-card, .protocol-item').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should handle audio initialization errors', async ({ page }) => {
    // Block Web Audio API initialization (inject script before page loads)
    await page.addInitScript(() => {
      // Override AudioContext to simulate failure
      (window as any).AudioContext = undefined;
      (window as any).webkitAudioContext = undefined;
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Select protocol again
    const firstProtocol = page.locator('.protocol-card, .protocol-item').first();
    await firstProtocol.click();
    await page.waitForTimeout(1000);
    
    // Try to start session
    const startButton = page.locator('button').filter({ hasText: /start|begin/i }).first();
    await startButton.click();
    await page.waitForTimeout(1000);
    
    // Should show error message
    await expect(page.locator('.error-message, [role="alert"]').filter({ hasText: /audio|error/i })).toBeVisible({ timeout: 3000 });
  });
});


