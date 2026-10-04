import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('project stages link to useful outputs and explain scope boundaries', async ({ page }) => {
  await page.goto('/how-it-works/');
  await expect(page.locator('.project-stage')).toHaveCount(5);
  await expect(page.locator('.project-output')).toHaveCount(5);
  await page
    .getByRole('navigation', { name: 'Project stages' })
    .getByRole('link', { name: /Agree/ })
    .click();
  await expect(page).toHaveURL(/#agree$/);
  const scope = page.locator('[data-process-scene="scope"]');
  await scope.getByRole('button', { name: 'Discuss separately' }).click();
  await expect(scope.locator('[data-scope-list]')).toContainText('A full customer portal');
  await expect(scope.locator('[data-scope-check]')).toHaveText('Additions need a separate scope.');
  await scope.getByRole('button', { name: 'Included now' }).click();
  await expect(scope.locator('[data-scope-list]')).toContainText('Capture enquiry details');
  await expect(scope.locator('[data-scope-check]')).toContainText('reply stops the reminder');
});
test('workflow conditions produce the expected next action and retain the record owner', async ({
  page,
}) => {
  await page.goto('/how-it-works/#test');
  const checks = page.locator('[data-process-scene="checks"]');
  await checks.getByRole('button', { name: 'Reply arrives' }).click();
  await expect(checks.locator('[data-test-action]')).toHaveText('Stop the reminder');
  await expect(checks.locator('[data-test-reason]')).toContainText('Alex');
  await checks.getByRole('button', { name: 'Email missing' }).click();
  await expect(checks.locator('[data-test-action]')).toHaveText('Hold for review');
  await expect(checks.locator('[data-test-email]')).toHaveText('Missing');
  await expect(checks.locator('[data-test-reason]')).toContainText('Do not attempt to send');
  await checks.getByRole('button', { name: 'No reply', exact: true }).click();
  await expect(checks.locator('[data-test-action]')).toHaveText('Prepare follow-up');
  await expect(checks.locator('[data-test-email]')).toHaveText('Present');
});
test('handover documents reveal practical information with keyboard controls', async ({ page }) => {
  await page.goto('/how-it-works/#handover');
  const files = page.locator('.handover-files');
  await files.locator('summary').first().focus();
  await page.keyboard.press('Enter');
  await expect(files.locator('details').first().locator('p')).toBeVisible();
  await expect(files.locator('details').first().locator('p')).toContainText('resolve a held task');
});
for (const width of [390, 1440])
  test(`project page accessibility and readable content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/how-it-works/');
    for (const selector of ['.project-hero-copy', '.project-stage-copy', '.project-example']) {
      for (const element of await page.locator(selector).all()) {
        const box = await element.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
    }
    await page.getByRole('button', { name: 'Discuss separately' }).click();
    await page.getByRole('button', { name: 'Email missing' }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
test('five illustrated stages and handover work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/how-it-works/');
  await expect(page.locator('.project-stage')).toHaveCount(5);
  await expect(page.locator('[data-test-action]')).toHaveText('Prepare follow-up');
  await page.locator('.handover-files summary').first().click();
  await expect(page.locator('.handover-files details').first().locator('p')).toBeVisible();
  await context.close();
});
