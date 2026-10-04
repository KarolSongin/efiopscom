// Exercise production indexing in an isolated fixture; never change real owner confirmations.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'efiops-production-fixture-'));
const root = process.cwd();
try {
  for (const p of [
    'src',
    'public',
    'scripts',
    'docs',
    'astro.config.mjs',
    'tsconfig.json',
    'package.json',
    'package-lock.json',
  ])
    fs.cpSync(path.join(root, p), path.join(temp, p), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
  const config = JSON.parse(fs.readFileSync(path.join(temp, 'src/config/release.json')));
  for (const [key, value] of Object.entries(config))
    config[key] = typeof value === 'boolean' ? key !== 'analyticsEnabled' : 'Fixture review text';
  Object.assign(config, {
    legalController: 'Fixture Controller (test only)',
    privacyContact: 'fixture@example.com',
    host: 'Fixture host',
    formProvider: 'Fixture provider',
    noticeReviewDate: '2026-10-04',
  });
  fs.writeFileSync(path.join(temp, 'src/config/release.json'), JSON.stringify(config));
  config.contactVerified = false;
  fs.writeFileSync(path.join(temp, 'src/config/release.json'), JSON.stringify(config));
  const launch = spawnSync('node', ['scripts/build.mjs', '--production', '--verify-contact'], {
    cwd: temp,
    encoding: 'utf8',
    env: {
      ...process.env,
      BUILD_MODE: 'production',
      CONTACT_ALLOWED_ORIGIN: 'https://efiops.com',
      CONTACT_FROM: 'fixture@example.com',
      CONTACT_TO: 'fixture@example.com',
      RESEND_API_KEY: 'fixture-only-not-a-real-credential',
    },
  });
  assert.equal(launch.status, 0, launch.stderr + launch.stdout);
  assert.match(
    fs.readFileSync(path.join(temp, 'dist/index.html'), 'utf8'),
    /name="robots" content="noindex, nofollow"/,
  );
  assert.match(
    fs.readFileSync(path.join(temp, 'dist/_headers'), 'utf8').split('/admin/*')[0],
    /noindex/,
  );
  assert.match(fs.readFileSync(path.join(temp, 'dist/robots.txt'), 'utf8'), /Disallow: \//);
  assert.doesNotMatch(fs.readFileSync(path.join(temp, 'dist/sitemap.xml'), 'utf8'), /<loc>/);
  assert.ok(fs.existsSync(path.join(temp, 'dist/thank-you/index.html')));
  assert.ok(!fs.existsSync(path.join(temp, 'dist/articles/template-preview/index.html')));
  config.contactVerified = true;
  fs.writeFileSync(path.join(temp, 'src/config/release.json'), JSON.stringify(config));
  console.log(
    'PASS: launch-verification fixture enables the real-form pages while all three indexing controls remain blocked.',
  );
  const result = spawnSync('node', ['scripts/build.mjs', '--production'], {
    cwd: temp,
    encoding: 'utf8',
    env: {
      ...process.env,
      BUILD_MODE: 'production',
      CONTACT_ALLOWED_ORIGIN: 'https://efiops.com',
      CONTACT_FROM: 'fixture@example.com',
      CONTACT_TO: 'fixture@example.com',
      CONTACT_STORAGE: 'supabase',
      SUPABASE_URL: 'https://fixture.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture',
      SUPABASE_SECRET_KEY: 'sb_secret_fixture',
      ADMIN_EMAIL: 'fixture@example.com',
    },
  });
  assert.equal(result.status, 0, result.stderr + '\n' + result.stdout);
  const manifest = JSON.parse(fs.readFileSync(path.join(temp, 'dist/build-manifest.json')));
  assert.equal(manifest.mode, 'production');
  assert.equal(manifest.indexableRoutes.length, 17);
  const sitemap = fs.readFileSync(path.join(temp, 'dist/sitemap.xml'), 'utf8');
  assert.equal((sitemap.match(/<loc>/g) || []).length, 17);
  assert.doesNotMatch(sitemap, /thank-you|\/work\/|\/insights\//);
  const home = fs.readFileSync(path.join(temp, 'dist/index.html'), 'utf8');
  assert.match(home, /name="robots" content="index, follow"/);
  const headers = fs.readFileSync(path.join(temp, 'dist/_headers'), 'utf8');
  assert.doesNotMatch(headers.split('/admin/*')[0], /noindex/);
  assert.match(headers, /\/admin\/\*\n  X-Robots-Tag: noindex, nofollow/);
  assert.doesNotMatch(sitemap, /\/admin\//);
  const confirmation = fs.readFileSync(path.join(temp, 'dist/thank-you/index.html'), 'utf8');
  assert.match(confirmation, /noindex, nofollow/);
  assert.match(fs.readFileSync(path.join(temp, 'dist/robots.txt'), 'utf8'), /Allow: \//);
  console.log(
    'PASS: isolated production fixture; 17 indexable URLs, correct robots and headers, no draft or confirmation sitemap entries. No real release fields changed; no provider calls.',
  );

  const casePath = path.join(temp, 'src/content/case-studies/loma-yamato-reporting.json');
  const fixtureCase = JSON.parse(fs.readFileSync(casePath));
  Object.assign(fixtureCase, {
    publicationState: 'published',
    permissionConfirmed: true,
    evidenceReviewed: true,
    title: 'Fixture reviewed project',
    role: 'Fixture test role',
    dates: '2026-10-04',
  });
  fs.writeFileSync(casePath, JSON.stringify(fixtureCase));
  const articlePath = path.join(
    temp,
    'src/content/articles/before-building-a-power-bi-dashboard.json',
  );
  const fixtureArticle = JSON.parse(fs.readFileSync(articlePath));
  Object.assign(fixtureArticle, {
    publicationState: 'published',
    reviewed: true,
    publishedDate: '2026-10-04',
    title: 'Fixture reviewed article',
    sources: [{ label: 'Fixture source', url: 'https://example.com/' }],
    sections: [
      {
        heading: 'Fixture question',
        body: 'A substantive fixture section used only to test rendering.',
      },
      {
        heading: 'Fixture explanation',
        body: 'A second fixture section used only to test rendering.',
      },
    ],
  });
  fs.writeFileSync(articlePath, JSON.stringify(fixtureArticle));
  fs.writeFileSync(
    path.join(temp, 'src/content/articles/second-fixture.json'),
    JSON.stringify({
      ...fixtureArticle,
      slug: 'second-fixture',
      title: 'Second fixture reviewed article',
    }),
  );
  const templates = spawnSync('node', ['scripts/build.mjs', '--production'], {
    cwd: temp,
    encoding: 'utf8',
    env: {
      ...process.env,
      BUILD_MODE: 'production',
      CONTACT_ALLOWED_ORIGIN: 'https://efiops.com',
      CONTACT_FROM: 'fixture@example.com',
      CONTACT_TO: 'fixture@example.com',
      RESEND_API_KEY: 'fixture-only-not-a-real-credential',
    },
  });
  assert.equal(templates.status, 0, templates.stderr + '\n' + templates.stdout);
  const caseHtml = fs.readFileSync(
    path.join(temp, 'dist/work/loma-yamato-reporting/index.html'),
    'utf8',
  );
  assert.match(caseHtml, /Fixture reviewed project/);
  assert.doesNotMatch(caseHtml, /PRIVATE_EVIDENCE_SENTINEL|internalEvidenceNotes/);
  const articleHtml = fs.readFileSync(
    path.join(temp, 'dist/articles/second-fixture/index.html'),
    'utf8',
  );
  assert.match(articleHtml, /@type":"Article"/);
  assert.match(articleHtml, /Second fixture reviewed article/);
  assert.ok(fs.existsSync(path.join(temp, 'dist/work/index.html')));
  assert.ok(fs.existsSync(path.join(temp, 'dist/articles/index.html')));
  assert.ok(!fs.existsSync(path.join(temp, 'dist/articles/template-preview/index.html')));
  assert.match(articleHtml, /article:published_time/);
  assert.match(articleHtml, /name="robots" content="index, follow"/);
  assert.match(articleHtml, /href="https:\/\/efiops.com\/articles\/second-fixture\/"/);
  assert.match(articleHtml, /"publisher":/);
  assert.match(
    fs.readFileSync(path.join(temp, 'dist/articles/index.html'), 'utf8'),
    /"@type":"CollectionPage"/,
  );
  assert.match(
    fs.readFileSync(path.join(temp, 'dist/sitemap.xml'), 'utf8'),
    /<lastmod>2026-10-04<\/lastmod>/,
  );
  assert.equal(
    (fs.readFileSync(path.join(temp, 'dist/sitemap.xml'), 'utf8').match(/<loc>/g) || []).length,
    22,
  );
  console.log(
    'PASS: isolated approved-content fixtures; work and article indexes, case and Article templates render, private evidence notes stay excluded. No draft approval flags changed in the real checkout.',
  );

  const child = spawn('node', [path.join(root, 'server/preview.mjs')], {
    cwd: temp,
    env: { ...process.env, PORT: '4322', HOST: '127.0.0.1' },
    stdio: 'ignore',
  });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 40; i++) {
      try {
        ready = (await fetch('http://localhost:4322/')).ok;
        if (ready) break;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    assert.ok(ready, 'Fixture server readiness');
    browser = await chromium.launch({
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:4322/thank-you/');
    assert.ok(
      (await page.locator('#confirmation').textContent()).includes('If you have not submitted one'),
    );
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, json: { accepted: true } }),
    );
    await page.goto('http://localhost:4322/contact/');
    await page.locator('#name').fill('Fixture Person');
    await page.locator('#email').fill('fixture@example.com');
    await page.locator('#message').fill('A fictional enquiry for the isolated browser test only.');
    await page.getByRole('button', { name: 'Send your enquiry' }).click();
    await page.waitForURL('**/thank-you/');
    await page.waitForFunction(() =>
      document
        .querySelector('#confirmation')
        ?.textContent?.startsWith('Your enquiry has been received.'),
    );
    assert.equal(await page.evaluate(() => sessionStorage.getItem('efiopsAcceptedAt')), null);
    await page.reload();
    assert.ok(
      (await page.locator('#confirmation').textContent()).includes('If you have not submitted one'),
    );
    console.log(
      'PASS: isolated browser acceptance fixture; accepted response routes to confirmation, consumes temporary acceptance state, and direct/repeated visits do not assert a new enquiry. Provider response intercepted; no real enquiry sent.',
    );
  } finally {
    if (browser) await browser.close();
    child.kill('SIGTERM');
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
