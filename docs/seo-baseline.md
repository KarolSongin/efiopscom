# SEO baseline — 4 October 2026

The supplied brief previously verified the public homepage and `/contact/`, noted LeadConnector form links, and extracted the current brand tokens. Other legacy paths, including pricing and sitemap destinations, remain unverified. During this build, read-only HTTPS requests to `https://efiops.com/` and `/contact/` returned proxy CONNECT 403 denials. This is a network-policy observation, not evidence that the live site or those URLs are broken.

No Search Console, analytics, backlink or private project records were supplied. No search volumes, difficulty estimates, traffic improvements or ranking claims have been fabricated. `docs/redirects.csv` is deliberately header-only until the old URLs and relevant replacements have been reviewed.

New page architecture: fifteen commercial pages plus two legal-review pages. Unique supplied titles/descriptions, self-referencing `https://efiops.com` candidate canonicals, a consistent Organization/Person/WebSite/WebPage graph, service markup and nested breadcrumbs. No fake address, ratings, prices or partnerships; FAQs are native disclosures, not rich-result promises.

Preview has noindex meta and headers, blocked robots and an empty sitemap. In the isolated production fixture, seventeen confirmed fixture URLs appear in the sitemap; drafts, unreleased indexes, API and confirmation URLs do not. The fixture demonstrates the implementation, not a completed live migration.

Astro official documentation was checked through the maintained `withastro/docs` GitHub source on 4 October 2026 because direct `docs.astro.build` access was denied. The styling guide confirms the current Tailwind Vite plugin; content collection guidance confirms `src/content.config.ts`, Zod schemas and local glob loaders; Netlify guidance confirms static output and separate native functions. URLs: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/styling.mdx ; https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/content-collections.mdx ; https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/deploy/netlify.mdx .
