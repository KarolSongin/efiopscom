import fs from 'node:fs';
import { z } from 'zod';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const coreSchema = z.object({
  seoTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  h1: z.string().min(1),
  lead: z.string().min(1),
  sections: z.array(
    z.object({ heading: z.string().min(1), paragraphs: z.array(z.string().min(1)) }),
  ),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
});
for (const page of Object.values(JSON.parse(fs.readFileSync('src/data/core.json', 'utf8'))))
  coreSchema.parse(page);
const sharedSchema = z.object({
  primaryCTA: z.string().min(1),
  secondaryCTA: z.string().min(1),
  finalCTA: z.object({ heading: z.string().min(1), text: z.string().min(1) }),
  location: z.string().min(1),
  positioning: z.string().min(1),
  contactSupport: z.string().min(1),
  contactNext: z.string().min(1),
});
sharedSchema.parse(JSON.parse(fs.readFileSync('src/data/shared.json', 'utf8')));
const production = process.argv.includes('--production');
const release = JSON.parse(fs.readFileSync('src/config/release.json', 'utf8'));
const read = (dir) =>
  fs
    .readdirSync(dir)
    .filter((x) => x.endsWith('.json'))
    .map((x) => JSON.parse(fs.readFileSync(path.join(dir, x), 'utf8')));
const services = read('src/content/services');
const cases = read('src/content/case-studies');
const articles = read('src/content/articles');
const required = [
  'power-bi',
  'power-automate',
  'ai-assistants',
  'jev-ai-integration',
  'custom-business-apps',
  'system-integrations',
  'web-design-development',
  'website-optimisation',
  'seo',
  'computer-vision',
];
const failures = [];
for (const slug of required)
  if (!services.some((s) => s.slug === slug && s.publicationState === 'published'))
    failures.push(`Missing required service: ${slug}`);
for (const entries of [services, cases, articles]) {
  const slugs = new Set();
  for (const entry of entries) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug))
      failures.push(`Invalid or duplicate slug: ${entry.slug}`);
    slugs.add(entry.slug);
    if (entry.relatedServices.some((s) => !required.includes(s)))
      failures.push(`Unknown related service in ${entry.slug}`);
  }
}
for (const c of cases)
  if (c.publicationState === 'published' && (!c.permissionConfirmed || !c.evidenceReviewed))
    failures.push(`Published case lacks evidence or permission: ${c.slug}`);
for (const a of articles) {
  const validDate = (value) =>
    /^\d{4}-\d{2}-\d{2}$/.test(value || '') &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value;
  if (a.slug === 'template-preview') failures.push('Reserved article slug: template-preview');
  if (
    a.publicationState === 'published' &&
    (!validDate(a.publishedDate) || a.publishedDate > new Date().toISOString().slice(0, 10))
  )
    failures.push(`Invalid or future publication date: ${a.slug}`);
  if (
    a.substantiveUpdatedDate &&
    (!validDate(a.substantiveUpdatedDate) ||
      a.substantiveUpdatedDate < a.publishedDate ||
      a.substantiveUpdatedDate > new Date().toISOString().slice(0, 10))
  )
    failures.push(`Invalid article update date: ${a.slug}`);
  if (
    a.sections.some(
      (section) =>
        section.table &&
        section.table.rows.some((row) => row.length !== section.table.columns.length),
    )
  )
    failures.push(`Article table columns do not match rows: ${a.slug}`);
  if (a.publicationState === 'published' && (!a.reviewed || !a.publishedDate || !a.sources.length))
    failures.push(`Published article lacks review, date or sources: ${a.slug}`);
}
if (production) {
  for (const [key, value] of Object.entries(release)) {
    if (key === 'analyticsEnabled') {
      if (value)
        failures.push('Optional analytics require a separately implemented consent system.');
      continue;
    }
    if (!value) failures.push(`Owner confirmation required: ${key}`);
  }
  for (const field of [
    'legalController',
    'privacyContact',
    'host',
    'formProvider',
    'legalBasis',
    'retention',
    'transferArrangements',
    'noticeReviewDate',
  ])
    if (/\[|\]|placeholder|confirm|TODO/i.test(release[field]))
      failures.push(`Unresolved legal content: ${field}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(release.noticeReviewDate))
    failures.push('Notice review date must be a real ISO date.');
  if (process.env.BUILD_MODE !== 'production')
    failures.push('Production host requires BUILD_MODE=production.');
  for (const key of process.env.CONTACT_STORAGE === 'supabase'
    ? [
        'SUPABASE_URL',
        'ADMIN_EMAIL',
        ...(process.env.SUPABASE_PUBLISHABLE_KEY
          ? ['SUPABASE_PUBLISHABLE_KEY']
          : ['SUPABASE_ANON_KEY']),
        ...(process.env.SUPABASE_SECRET_KEY
          ? ['SUPABASE_SECRET_KEY']
          : ['SUPABASE_SERVICE_ROLE_KEY']),
      ]
    : ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO'])
    if (!process.env[key]) failures.push(`Production enquiry configuration required: ${key}`);
  if (process.env.CONTACT_ALLOWED_ORIGIN !== 'https://efiops.com')
    failures.push('Confirm canonical production contact origin.');
}
if (failures.length) {
  console.error('Build blocked:\n' + failures.map((x) => ' - ' + x).join('\n'));
  process.exit(1);
}
const result = spawnSync('node', ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    PUBLIC_BUILD_MODE: production ? 'production' : 'preview',
  },
});
if (result.status !== 0) process.exit(result.status || 1);
const canonical = 'https://efiops.com';
const routes = [
  '/',
  '/services/',
  ...required.map((s) => `/services/${s}/`),
  '/how-it-works/',
  '/about/',
  '/articles/',
  '/contact/',
  '/privacy/',
  '/cookies/',
];
const publicCases = cases.filter(
  (c) => c.publicationState === 'published' && c.permissionConfirmed && c.evidenceReviewed,
);
const publicArticles = articles.filter(
  (a) => a.publicationState === 'published' && a.reviewed && a.publishedDate,
);
if (publicCases.length) routes.push('/work/', ...publicCases.map((c) => `/work/${c.slug}/`));
routes.push(...publicArticles.map((a) => `/articles/${a.slug}/`));
const indexableRoutes = production
  ? routes.filter((p) => p !== '/articles/' || publicArticles.length)
  : [];
const lastModified = new Map(
  publicArticles.map((a) => [`/articles/${a.slug}/`, a.substantiveUpdatedDate || a.publishedDate]),
);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  indexableRoutes
    .map(
      (p) =>
        `<url><loc>${canonical + p}</loc>${lastModified.has(p) ? `<lastmod>${lastModified.get(p)}</lastmod>` : ''}</url>`,
    )
    .join('') +
  '</urlset>\n';
fs.writeFileSync('dist/sitemap.xml', sitemap);
fs.writeFileSync(
  'dist/robots.txt',
  production
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /thank-you/\nSitemap: ${canonical}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n',
);
fs.writeFileSync(
  'dist/_headers',
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}/admin/*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-store\n/api/admin/*\n  Cache-Control: no-store\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n/images/*\n  Cache-Control: public, max-age=86400\n`,
);
const rows = fs.readFileSync('docs/redirects.csv', 'utf8').trim().split('\n').slice(1);
const mappings = rows.filter(Boolean).map((row) => {
  const [source, destination, status, reviewed] = row.split(',');
  if (
    reviewed !== 'true' ||
    !['301', '308'].includes(status) ||
    !/^\/[^\s]*$/.test(source) ||
    !routes.includes(destination) ||
    source === destination ||
    routes.includes(source)
  )
    throw Error('Invalid or unreviewed redirect: ' + row);
  return `${source} ${destination} ${status}`;
});
fs.writeFileSync('dist/_redirects', mappings.join('\n') + (mappings.length ? '\n' : ''));
fs.writeFileSync(
  'dist/build-manifest.json',
  JSON.stringify(
    {
      mode: production ? 'production' : 'preview',
      routes,
      indexableRoutes,
    },
    null,
    2,
  ),
);
console.log(
  `Built ${routes.length} commercial/legal pages in ${production ? 'production' : 'review preview'} mode. Draft routes excluded.`,
);
