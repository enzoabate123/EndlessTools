import { test, expect } from '@playwright/test';

test.describe('Cover Filters', () => {
  test('should allow toggling individual filters and overlapping them without errors', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout since 3D render takes time

    // Navigate to the app
    await page.goto('/');

    // Give it a moment to render the 3D scene
    await page.waitForTimeout(4000);

    // Navigate to the "Cover Filters" tab in the sidebar
    await page.getByRole('button', { name: 'Cover Filters' }).click({ force: true });

    // Wait for Leva panel to appear
    await page.waitForTimeout(2000);

    // Verify there are no console errors during the process
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      // Ignore NextJS warnings and ThreeJS deprecations
      if (msg.type() === 'error' && !msg.text().includes('favicon') && !msg.text().includes('NotAllowedError')) {
        errors.push(msg.text());
      }
    });

    // We will check all checkboxes in Leva panel
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    // Enable all filters
    for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).check({ force: true });
        await page.waitForTimeout(1000);
    }

    // Take a screenshot of the overlapping filters
    await expect(page).toHaveScreenshot('stacked-filters.png', {
      maxDiffPixelRatio: 0.2, // 3D canvas rendering can be slightly non-deterministic
    });

    // Check for any application errors
    expect(errors).toHaveLength(0);
  });
});
