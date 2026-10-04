import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const enter = async (page: Page) => {
  await page.goto('/admin/');
  await page.getByRole('button', { name: 'Open demo dashboard' }).click();
  await expect(page.locator('.customer-card').first()).toBeVisible();
};
test('dashboard protects records before opening the demo and after sign-out', async ({ page }) => {
  await page.goto('/admin/');
  await expect(page.locator('#dashboard-view')).toBeHidden();
  const before = await page.request.get('/api/admin/enquiries');
  expect(before.status()).toBe(401);
  await page.getByRole('button', { name: 'Open demo dashboard' }).click();
  await expect(page.locator('.customer-card').first()).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open demo dashboard' })).toBeVisible();
  expect((await page.request.get('/api/admin/enquiries')).status()).toBe(401);
});
test('create, move, annotate, follow up and complete a customer enquiry', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Add enquiry', exact: false }).click();
  const dialog = page.getByRole('dialog');
  const unique = 'Pipeline test ' + Date.now();
  await dialog.locator('[name=name]').fill(unique);
  await dialog.locator('[name=email]').fill('customer@example.com');
  await dialog.locator('[name=organisation]').fill(unique);
  await dialog.locator('[name=message]').fill('We need a more useful weekly reporting view.');
  await dialog.locator('[name=service]').selectOption('power-bi');
  await dialog.getByRole('button', { name: 'Create opportunity' }).click();
  await expect(dialog.getByRole('button', { name: 'Save changes' })).toBeVisible();
  await expect(dialog.locator('[name=stage]')).toHaveValue('opportunity');
  for (const stage of ['understand', 'agree', 'build', 'test', 'handover']) {
    await dialog.locator('[name=stage]').selectOption(stage);
    await dialog.locator('[name=next_action]').fill('Review the next decision.');
    await dialog.getByRole('button', { name: 'Save changes' }).click();
    await expect(dialog.locator('.activity-list')).toContainText('→ ' + stage);
  }
  await dialog
    .locator('#note-form textarea')
    .fill('<img src=x onerror=alert(1)> A useful private note.');
  await dialog.getByRole('button', { name: 'Add note', exact: true }).click();
  await expect(dialog.locator('.activity-list')).toContainText('<img src=x onerror=alert(1)>');
  await expect(dialog.locator('.activity-list img')).toHaveCount(0);
  await dialog.locator('[name=follow_up_date]').fill('2026-01-01');
  await dialog.getByRole('button', { name: 'Save changes' }).click();
  await expect(dialog.locator('[name=follow_up_date]')).toHaveValue('2026-01-01');
  await dialog.getByRole('button', { name: 'Close enquiry' }).click();
  await page.locator('#customer-search').fill(unique);
  await page.locator('#followup-filter').selectOption('due');
  await expect(page.locator('.customer-card')).toHaveCount(1);
  await page.locator('.customer-card').click();
  await dialog.locator('[name=status]').selectOption('completed');
  await dialog.getByRole('button', { name: 'Save changes' }).click();
  await expect(dialog.locator('.activity-list')).toContainText('completed');
  await dialog.getByRole('button', { name: 'Close enquiry' }).click();
  await expect(page.locator('.customer-card')).toHaveCount(0);
  await page.locator('#followup-filter').selectOption('all');
  await page.locator('#status-filter').selectOption('completed');
  await expect(page.locator('.customer-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#dashboard-view')).toBeVisible();
  await page.locator('#customer-search').fill(unique);
  await page.locator('#status-filter').selectOption('completed');
  await expect(page.locator('.customer-card')).toHaveCount(1);
});
test('failed saves preserve edited fields and show an honest error', async ({ page }) => {
  await enter(page);
  await page.locator('.customer-card').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('[name=next_action]').fill('Keep this unsaved decision.');
  await page.route('**/api/admin/enquiries/*', (route) =>
    route.request().method() === 'PATCH'
      ? route.fulfill({
          status: 409,
          json: { message: 'This enquiry changed in another session. Reload it before saving.' },
        })
      : route.continue(),
  );
  await dialog.getByRole('button', { name: 'Save changes' }).click();
  await expect(dialog.locator('#record-status')).toContainText('another session');
  await expect(dialog.locator('[name=next_action]')).toHaveValue('Keep this unsaved decision.');
});
for (const width of [390, 1440])
  test(`admin layout, keyboard dialog and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/admin/');
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.getByRole('button', { name: 'Open demo dashboard' }).click();
    await expect(page.locator('.customer-card').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await page.locator('.customer-card').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

test('configured Supabase login handles rejection and opens an empty customer workspace', async ({
  page,
}) => {
  await page.route('**/api/admin/config', (route) => route.fulfill({ json: { mode: 'supabase' } }));
  await page.route('**/api/admin/session', (route) =>
    route.fulfill({ status: 401, json: { message: 'Please sign in.' } }),
  );
  let correct = false;
  await page.route('**/api/admin/login', (route) =>
    correct
      ? route.fulfill({ json: { mode: 'supabase', email: 'owner@example.com' } })
      : route.fulfill({ status: 401, json: { message: 'Unable to sign in with these details.' } }),
  );
  await page.route('**/api/admin/enquiries?offset=0', (route) =>
    route.fulfill({ json: { items: [], hasMore: false } }),
  );
  await page.goto('/admin/');
  await expect(page.locator('#login-form')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open demo dashboard' })).toBeHidden();
  await page.getByLabel('Email address').fill('owner@example.com');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('#login-status')).toContainText('Unable to sign in');
  correct = true;
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('#dashboard-view')).toBeVisible();
  await expect(page.locator('#demo-banner')).toBeHidden();
  await expect(page.locator('#result-count')).toContainText('0 enquiries');
});
test('an expired session clears customer data and returns to the access screen', async ({
  page,
}) => {
  await enter(page);
  await page.locator('.customer-card').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.route('**/api/admin/enquiries/*', (route) =>
    route.request().method() === 'PATCH'
      ? route.fulfill({ status: 401, json: { message: 'Please sign in again.' } })
      : route.continue(),
  );
  await dialog.locator('[name=next_action]').fill('An edited action');
  await dialog.getByRole('button', { name: 'Save changes' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('#dashboard-view')).toBeHidden();
  await expect(page.locator('.customer-card')).toHaveCount(0);
  await expect(page.locator('#login-status')).toContainText('session expired');
});
