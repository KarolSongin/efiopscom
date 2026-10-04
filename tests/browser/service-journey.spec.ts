import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const services = fs
  .readdirSync('src/content/services')
  .map((file) => JSON.parse(fs.readFileSync('src/content/services/' + file, 'utf8')));
for (const service of services)
  test(`five-stage service journey: ${service.slug}`, async ({ page }) => {
    await page.goto(`/services/${service.slug}/`);
    const journey = page.locator('[data-service-journey]');
    await expect(journey.locator('[data-journey-stage]')).toHaveCount(5);
    await expect(journey.locator('.project-output')).toHaveCount(5);
    await journey
      .getByRole('navigation', { name: 'Service project stages' })
      .getByRole('link', { name: /Test/ })
      .click();
    await expect(page).toHaveURL(/#service-test$/);
    const card = journey.locator('[data-journey-tests]');
    for (const [i, scenario] of service.journey.tests.entries()) {
      await card.locator(`[data-journey-test="${i}"]`).click();
      await expect(card.locator('[data-journey-test-input]')).toHaveText(scenario.input);
      await expect(card.locator('[data-journey-test-result]')).toHaveText(scenario.result);
      await expect(card.locator('[data-journey-test-reason]')).toHaveText(scenario.reason);
      await expect(card.locator(`[data-journey-test="${i}"]`)).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    }
    await journey.locator('.handover-files summary').first().click();
    await expect(journey.locator('.handover-files details').first().locator('p')).toHaveText(
      service.journey.handover[0].body,
    );
    await expect(journey.locator('.handover-files details').first().locator('p')).toBeVisible();
  });
for (const width of [390, 1440])
  test(`all service journeys remain readable and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const service of services) {
      await page.goto(`/services/${service.slug}/`);
      const journey = page.locator('[data-service-journey]');
      for (const selector of ['.journey-story', '.journey-intro h2'])
        for (const element of await journey.locator(selector).all()) {
          const box = await element.boundingBox();
          expect(box!.x, service.slug).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width, service.slug).toBeLessThanOrEqual(width + 1);
        }
      await journey.locator('[data-journey-test="2"]').click();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
        service.slug,
      ).toEqual([]);
    }
  });
test('service process and exception examples work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4321/services/power-automate/');
  const journey = page.locator('[data-service-journey]');
  await expect(journey.locator('[data-journey-stage]')).toHaveCount(5);
  await expect(journey.locator('.journey-static-tests')).toContainText('Hold for review');
  await journey.locator('.handover-files summary').first().click();
  await expect(journey.locator('.handover-files details').first().locator('p')).toBeVisible();
  await context.close();
});
