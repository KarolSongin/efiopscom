import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const route of ['/articles/', '/articles/template-preview/']) {
  test(`article layout is accessible and responsive: ${route}`, async ({ page }) => {
    for (const width of [360, 390, 768, 801, 900, 1024, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} ${width}`,
      ).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
    }
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/screenshots/${route.includes('template') ? 'article-template' : 'articles'}-1440.png`,
      fullPage: true,
    });
  });
}
test('article contents work without JavaScript and progressive enhancement follows reading', async ({
  browser,
  page,
}) => {
  await page.goto('/articles/template-preview/');
  const contents = page.getByRole('navigation', { name: 'Article contents' });
  await contents.getByRole('link').nth(2).click();
  await expect(page.locator('#section-3')).toBeInViewport();
  await expect(contents.getByRole('link').nth(2)).toHaveAttribute('aria-current', 'location');
  expect(
    await page.locator('.reading-progress span').evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await context.newPage();
  await staticPage.goto('http://localhost:4321/articles/template-preview/');
  await staticPage
    .getByRole('navigation', { name: 'Article contents' })
    .getByRole('link')
    .nth(1)
    .click();
  await expect(staticPage.locator('#section-2')).toBeInViewport();
  await expect(staticPage.getByRole('table')).toBeVisible();
  await context.close();
});
