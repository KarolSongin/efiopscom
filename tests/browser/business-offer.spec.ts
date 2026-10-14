import { test, expect } from '@playwright/test';
test('connected business example keeps human decisions visible and sends the selected offer to the form', async ({
  page,
}) => {
  await page.goto('/services/custom-business-apps/');
  const system = page.locator('[data-business-system]');
  await system.getByRole('button', { name: 'Quote accepted', exact: true }).click();
  await expect(system.locator('[data-system-panel="job"]')).toBeVisible();
  await expect(system.locator('[data-system-panel="enquiry"]')).toBeHidden();
  await expect(system.getByRole('status')).toContainText('job handover');
  await system.getByRole('button', { name: 'AI assistance', exact: true }).click();
  await expect(system.locator('[data-system-panel="ai"]')).toContainText(
    'Verify details before quoting',
  );
  await expect(system.getByRole('button', { name: 'AI assistance', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page
    .locator('.business-hero-copy')
    .getByRole('link', { name: 'Talk through your business', exact: true })
    .click();
  await expect(page.locator('#service')).toHaveValue('custom-business-apps');
});
test('business offer examples remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/services/custom-business-apps/');
  await expect(page.locator('.system-example-controls')).toBeHidden();
  for (const id of ['enquiry', 'job', 'ai'])
    await expect(page.locator(`[data-system-panel="${id}"]`)).toBeVisible();
  await context.close();
});
