import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(fs.readFileSync('dist/build-manifest.json'));
const output = (route) => fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
test('all 17 required commercial and legal pages are built with unique metadata', () => {
  assert.equal(manifest.routes.length, 17);
  const titles = new Set();
  for (const route of manifest.routes) {
    const html = output(route);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert.ok(title);
    assert.ok(!titles.has(title), route);
    titles.add(title);
    assert.match(html, /name="description" content="[^"]+"/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.ok(html.includes(`href="https://efiops.com${route}"`));
    assert.doesNotMatch(
      html,
      /Illustrative example|fictional data|Proposed workflow example|Evidence plan:|Primary intent:|PRIVATE_EVIDENCE_SENTINEL|PRIVATE_ARTICLE_SENTINEL|\[CONFIRMED/,
    );
    const graph = JSON.parse(
      html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
    );
    assert.equal(graph['@context'], 'https://schema.org');
    assert.ok(graph['@graph'].some((x) => x['@type'] === 'Organization'));
  }
});
test('all ten distinct services retain complete supplied section and FAQ text', () => {
  const strip = (html) =>
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  const clean = (s) => s.replace(/\s+/g, ' ').trim();
  const files = fs.readdirSync('src/content/services');
  assert.equal(files.length, 10);
  for (const file of files) {
    const s = JSON.parse(fs.readFileSync('src/content/services/' + file));
    assert.deepEqual(
      s.journey.stages.map((x) => x.id),
      ['understand', 'agree', 'build', 'test', 'handover'],
    );
    const html = output('/services/' + s.slug + '/');
    const visible = strip(html);
    for (const str of [
      s.h1,
      s.lead,
      s.cta.heading,
      s.cta.text,
      ...s.sections.flatMap((x) => [
        x.heading,
        ...x.paragraphs,
        ...x.items,
        ...(x.caption ? [x.caption] : []),
      ]),
      ...s.faqs.flatMap((x) => [x.question, x.answer]),
      ...s.useCases.flatMap((x) => [x.audience, x.title, x.body]),
      s.journey.heading,
      s.journey.example,
      ...s.journey.stages.flatMap((x) => [x.title, x.body, x.output]),
      ...s.journey.handover.flatMap((x) => [x.title, x.body]),
    ])
      assert.ok(visible.includes(clean(str)), `${s.slug}: missing ${str}`);
    for (const related of s.relatedServices) assert.ok(html.includes(`/services/${related}/`));
    assert.match(html, /"@type":"Service"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
  }
});
test('draft content, unreleased indexes and confirmation pages are absent from all output', () => {
  function visit(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) visit(p);
      else if (/\.(html|js|json|xml)$/.test(p)) {
        const data = fs.readFileSync(p, 'utf8');
        assert.doesNotMatch(
          data,
          /PRIVATE_EVIDENCE_SENTINEL|PRIVATE_ARTICLE_SENTINEL|internalEvidenceNotes|loma-yamato-reporting|before-building-a-power-bi-dashboard/,
          p,
        );
      }
    }
  }
  visit('dist');
  for (const p of ['work/index.html', 'insights/index.html', 'thank-you/index.html'])
    assert.ok(!fs.existsSync('dist/' + p));
  assert.doesNotMatch(output('/'), /href="\/(work|insights)\//);
});
test('preview sitemap is empty, robots blocks and headers noindex', () => {
  assert.doesNotMatch(fs.readFileSync('dist/sitemap.xml', 'utf8'), /<loc>/);
  assert.match(fs.readFileSync('dist/robots.txt', 'utf8'), /Disallow: \//);
  assert.match(fs.readFileSync('dist/_headers', 'utf8'), /X-Robots-Tag: noindex, nofollow/);
  assert.ok(fs.existsSync('dist/404.html'));
});
test('production is blocked on real unresolved owner fields', () => {
  const result = spawnSync('node', ['scripts/build.mjs', '--production'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /legalController/);
  assert.match(result.stderr, /contactVerified/);
  assert.match(result.stderr, /RESEND_API_KEY/);
});
test('current logo is preserved byte for byte', () => {
  assert.equal(
    createHash('sha256')
      .update(fs.readFileSync('public/images/efiops-logo-current.png'))
      .digest('hex'),
    '187a54a50f705f070e4d618d9dcd3a5d2af9b3a8019c6d9a70a60bb0e47d9c6e',
  );
});
