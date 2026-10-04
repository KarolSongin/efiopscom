import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('social media approval example, contact selection and accessibility', async ({ page }) => {
  await page.goto('/services/social-media/');
  const card = page.locator('[data-business-card="social-media"]');
  await card.getByRole('button', { name: 'Awaiting approval', exact: true }).click();
  await expect(card.locator('[data-social-result]')).toHaveText('Keep as draft');
  await card.getByRole('button', { name: 'Needs a reply', exact: true }).click();
  await expect(card.locator('[data-social-result]')).toHaveText('Escalate to the owner');
  await card.getByRole('button', { name: 'Approved', exact: true }).click();
  await expect(card.locator('[data-social-result]')).toHaveText('Ready to schedule');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
  await page.locator('.service-hero').getByRole('link', { name: 'Discuss your social media', exact: true }).click();
  await expect(page.locator('#service')).toHaveValue('social-media');
});
