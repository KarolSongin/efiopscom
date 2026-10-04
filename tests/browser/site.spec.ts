import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const routes = JSON.parse(fs.readFileSync('dist/build-manifest.json', 'utf8')).routes as string[];
for (const width of [360, 390, 768, 1024, 1440])
  test(`all pages render without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
      for (const selector of ['.hero-copy', '.service-hero .hero-lead']) {
        const element = page.locator(selector);
        if (await element.count()) {
          const box = await element.boundingBox();
          expect(box!.x + box!.width, route + ' readable hero copy').toBeLessThanOrEqual(width + 1);
        }
      }
      expect(await page.locator('meta[name=robots]').getAttribute('content')).toBe(
        'noindex, nofollow',
      );
      if (width === 390 || width === 1440) {
        fs.mkdirSync('artifacts/screenshots', { recursive: true });
        await page.screenshot({
          path: `artifacts/screenshots/${route === '/' ? 'home' : route.replaceAll('/', '-').slice(1, -1)}-${width}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
test('every internal navigation link resolves, including real missing pages', async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')!))) {
      if (href.startsWith('/') && !href.startsWith('//')) links.add(href);
    }
  }
  for (const href of links) {
    const r = await request.get(href);
    expect(r.status(), href).toBe(200);
  }
  for (const path of [
    '/a-page-that-does-not-exist/',
    '/work/',
    '/insights/',
    '/work/loma-yamato-reporting/',
    '/thank-you/',
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A different');
  }
  const response = await request.get('/services/power-bi', { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('/services/power-bi/');
});
test('native menu, Escape, mobile navigation and workflow controls', async ({ page }) => {
  await page.goto('/');
  await page.locator('.services-menu > summary').click();
  await expect(page.locator('.mega')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mega')).not.toBeVisible();
  await expect(page.locator('.services-menu > summary')).toBeFocused();
  await page.getByRole('tab', { name: /A customer question/ }).click();
  await expect(page.locator('#panel-questions')).toBeVisible();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: /A busy week/ })).toBeFocused();
  await expect(page.locator('#panel-planning')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('#navigation')).toBeVisible();
  await page.getByRole('link', { name: 'How it works', exact: true }).click();
  expect(page.url()).toContain('/how-it-works/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
  await expect(page.locator('#navigation')).not.toBeVisible();
});
test('static copy and native navigation work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const route of [
    '/',
    '/services/',
    '/services/jev-ai-integration/',
    '/about/',
    '/contact/',
  ]) {
    await page.goto('http://localhost:4321' + route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'How it works', exact: true })).toBeVisible();
  }
  await page.goto('http://localhost:4321/services/power-bi/');
  await page.locator('.faq-list summary').first().click();
  await expect(page.locator('.faq-list details').first().locator('p')).toBeVisible();
  await context.close();
});
test('invalid form and missing backend preserve fields with associated errors', async ({
  page,
}) => {
  await page.goto('/contact/?service=power-bi');
  await expect(page.locator('#service')).toHaveValue('power-bi');
  await page.getByRole('button', { name: 'Send your enquiry' }).click();
  await expect(page.locator('#name-error')).toContainText('Please');
  await expect(page.locator('#name')).toBeFocused();
  await page.locator('#name').fill('Example Person');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#message').fill('A fictional question about reporting.');
  await page.getByRole('button', { name: 'Send your enquiry' }).click();
  await expect(page.locator('.form-status')).toContainText('This preview cannot send enquiries');
  await expect(page.locator('#message')).toHaveValue('A fictional question about reporting.');
  await expect(page.locator('.form-status')).toBeFocused();
});
for (const mode of ['success', 'failure'])
  test(`form renders explicitly simulated ${mode} response`, async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: mode === 'success' ? 200 : 502,
        json:
          mode === 'success'
            ? { accepted: true, preview: true }
            : {
                message:
                  'Preview test: the simulated provider rejected this enquiry. No enquiry was sent.',
              },
      }),
    );
    await page.goto('/contact/');
    await page.locator('#name').fill('Example Person');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('A fictional enquiry used only for testing.');
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    await expect(page.locator('.form-status')).toContainText(
      mode === 'success' ? 'Preview test only' : 'simulated provider rejected',
    );
    await expect(page.locator('#message')).toHaveValue(
      'A fictional enquiry used only for testing.',
    );
  });
test('reduced motion and keyboard skip link', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(
    await page
      .locator('.button')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
});
for (const route of [
  '/',
  '/services/power-bi/',
  '/services/jev-ai-integration/',
  '/services/power-automate/',
  '/services/ai-assistants/',
  '/services/custom-business-apps/',
  '/services/system-integrations/',
  '/services/web-design-development/',
  '/services/website-optimisation/',
  '/services/seo/',
  '/services/computer-vision/',
  '/contact/',
  '/about/',
])
  test(`automated accessibility: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    fs.mkdirSync('artifacts/accessibility', { recursive: true });
    fs.writeFileSync(
      `artifacts/accessibility/${route === '/' ? 'home' : route.replaceAll('/', '-')}.json`,
      JSON.stringify(results, null, 2),
    );
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
