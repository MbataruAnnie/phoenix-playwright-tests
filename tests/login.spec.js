const { test, expect } = require('@playwright/test');

test('User can log in to PAIX SACCO portal', async ({ page, browserName }) => {
  // Skip WebKit because the PAIX SACCO portal does not support it
  test.skip(browserName === 'webkit', 'WebKit not supported by PAIX SACCO portal');

  await page.context().tracing.start({ screenshots: true, snapshots: true });

  try {
    await page.goto('https://paix.centrino.co.ke/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Fill fields
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('Pa$$word123');

    // Click login and wait
    await Promise.all([
      page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {
        console.log(`[${browserName}] Network idle not reached, continuing...`);
      }),
      page.getByRole('button', { name: 'Login' }).click(),
    ]);

    // Check for Companion App error
    const errorMessage = page.getByText('Companion App Not Running', { exact: true });
    if (await errorMessage.isVisible().catch(() => false)) {
      console.log(`[${browserName}] Page content: ${await page.content()}`);
      await page.screenshot({ path: `test-results/error-screenshot-${browserName}-${Date.now()}.png` });
      throw new Error('Login failed: Companion App Not Running detected');
    }

    // Wait for dashboard heading
    const dashboardHeading = page.getByRole('heading', { name: /dashboard/i });
    await dashboardHeading.waitFor({ timeout: 30000 });

    // Verify dashboard content
    await expect(dashboardHeading).toBeVisible();
    await expect(page.getByRole('heading', { level: 4, name: /dashboard/i })).toContainText(/dashboard/i);

  } finally {
    await page.context().tracing.stop({ path: `test-results/trace-${browserName}.zip` });
  }
});
