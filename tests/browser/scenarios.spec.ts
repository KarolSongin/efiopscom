import { test, expect } from '@playwright/test';
test('new order changes capacity and resets without changing other cards', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('[data-operations]');
  await scene.locator('[data-order-change]').click();
  await expect(scene.locator('[data-plan-units]')).toHaveText('1,500');
  await expect(scene.locator('[data-plan-hours]')).toHaveText('100');
  await expect(scene.locator('[data-decision-detail]')).toContainText('4 more staff hours');
  await expect(page.locator('[data-revenue]').first()).toHaveText('£42,600');
  await scene.locator('[data-order-change]').click();
  await expect(scene.locator('[data-plan-units]')).toHaveText('1,200');
});
test('planner updates workload and capacity independently', async ({ page }) => {
  await page.goto('/services/custom-business-apps/');
  const card = page.locator('[data-business-card]');
  await card.locator('[data-volume]').fill('1800');
  await expect(card.locator('[data-required]')).toHaveText('120');
  await expect(card.locator('[data-plan-balance]')).toHaveText('24 h to cover');
  await card.getByRole('button', { name: 'Add one person' }).click();
  await expect(card.locator('[data-available]')).toHaveText('128');
  await expect(card.locator('[data-plan-balance]')).toHaveText('8 h spare');
});
const cases = [
  ['power-bi', 'data-channel', 'online', 'data-revenue', '£24,320'],
  ['power-automate', 'data-enquiry', 'replied', 'data-enquiry-status', 'Reminder stopped'],
  ['ai-assistants', 'data-question', 'missing', 'data-chat-next', 'human review'],
  ['jev-ai-integration', 'data-route', 'change', 'data-routing-action', 'request approval'],
  ['system-integrations', 'data-record', 'missing', 'data-record-status', 'Transfer held'],
  ['web-design-development', 'data-website', 'local', 'data-website-heading', 'A garden'],
  ['website-optimisation', 'data-journey', 'before', 'data-journey-count', '4 steps'],
  ['seo', 'data-search', 'question', 'data-search-title', 'How Often'],
  ['computer-vision', 'data-vision', 'difficult', 'data-vision-width', 'Not accepted'],
];
for (const [slug, control, value, result, text] of cases)
  test(`business scenario: ${slug}`, async ({ page }) => {
    await page.goto(`/services/${slug}/`);
    const card = page.locator('[data-business-card]');
    await card.locator(`[${control}="${value}"]`).click();
    await expect(card.locator(`[${result}]`)).toContainText(text);
    await expect(card.locator(`[${control}="${value}"]`)).toHaveAttribute('aria-pressed', 'true');
  });
test('mobile hero copy and interactive controls stay inside the viewport', async ({ page }) => {
  for (const width of [360, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    for (const selector of ['.hero-copy', '.hero-lead', '[data-order-change]']) {
      const box = await page.locator(selector).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  }
});
