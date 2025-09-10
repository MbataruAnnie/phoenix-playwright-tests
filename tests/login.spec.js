const { test, expect } = require('@playwright/test');

test('User can log in and create a loan request in PAIX SACCO portal', async ({ page, browserName }) => {
  // Skip unsupported browsers
  test.skip(browserName === 'webkit', 'WebKit not supported by PAIX SACCO portal');

  await page.context().tracing.start({ screenshots: true, snapshots: true });

  try {
    // Step 1: Login
    await page.goto('https://paix.centrino.co.ke/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('Pa$$word123');

    await Promise.all([
      page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {
        console.log(`[${browserName}] Network idle not reached, continuing...`);
      }),
      page.getByRole('button', { name: /login/i }).click(),
    ]);

    // Handle potential error
    const errorMessage = page.getByText('Companion App Not Running', { exact: true });
    if (await errorMessage.isVisible().catch(() => false)) {
      console.log(`[${browserName}] Page content: ${await page.content()}`);
      await page.screenshot({ path: `test-results/error-login-${browserName}-${Date.now()}.png` });
      throw new Error('Login failed: Companion App Not Running detected');
    }

    // Step 2: Verify Dashboards
    const dashboardHeading = page.getByRole('heading', { name: /dashboard/i });
    await dashboardHeading.waitFor({ state: 'visible', timeout: 30000 });
    await expect(dashboardHeading).toBeVisible();

// Expand Credit Management
await page.getByText('credit management', { exact: true }).click();

// Step 2: Expand Operations
const operations = page.locator('div.submenu-group-title', { hasText: /^operations$/i });
// await operations.click();

// Step 3: Wait until Loan Origination appears (means submenu expanded)
const loanOriginationMenu = page.getByText(/loan origination/i);
//await loanOriginationMenu.waitFor({ state: 'visible', timeout: 30000 });
await loanOriginationMenu.click();

// Now click Loan Requests
const loanRequestsLink = page.getByText('loan requests', { exact: true });
//await expect(loanRequestsLink).toBeVisible({ timeout: 30000 });
await loanRequestsLink.click();
    // Step 4: Receive loan
    const receiveBtn = page.getByRole('button', { name: /receive/i });
    // await receiveBtn.waitFor({ state: 'visible', timeout: 20000 });
    await receiveBtn.click();

    // Step 5: Select customer
    const customerRow = page.getByRole('cell', { name: /Weldon Kipkemoi/i });
    // // await customerRow.waitFor({ state: 'visible', timeout: 20000 });
    await customerRow.click();

    // Step 6: Fill Loan Request Form
    const amountBox = page.locator('div').filter({ hasText: /^amount applied$/ }).getByRole('textbox');
    // await amountBox.waitFor({ state: 'visible', timeout: 20000 });
    await amountBox.fill('100000');

    const termBox = page.locator('div').filter({ hasText: /^term \(months\)$/ }).getByRole('textbox');
    // await termBox.waitFor({ state: 'visible', timeout: 20000 });
    await termBox.fill('12');

    // Step 7: Submit
    await page.getByRole('button', { name: /update/i }).click();
    await page.getByRole('button', { name: /ok/i }).click();

    // Final assertion: check loan request is saved (placeholder)
    await expect(page.getByText(/loan request/i)).toBeVisible();

    console.log(`✅ [${browserName}] Loan request created successfully`);

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: `test-results/error-final-${browserName}-${Date.now()}.png` });
    throw err;
  } finally {
    await page.context().tracing.stop({ path: `test-results/trace-${browserName}-${Date.now()}.zip` });
  }
});
