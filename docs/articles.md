# Writing EFIops articles

Articles are static, code-managed content. No CMS, database or dashboard is needed.

- Public library: `/articles/`
- Published article: `/articles/<slug>/`
- Private layout preview: `/articles/template-preview/` (review builds only; never generated in production)
- Layout: `src/layouts/Article.astro`
- Styles: `src/styles/articles.css`
- Content: `src/content/articles/*.json`
- Reusable starter: `templates/article.json`

## Add an article

1. Copy `templates/article.json` to `src/content/articles/your-article-slug.json`.
2. Change `slug`, `title`, `description`, `category`, `takeaway`, sections and sources. Optionally set `seoTitle` for a shorter search title while keeping a more expressive on-page heading. Use an original, specific title and a concise description that explains what the reader will learn. Keep the author as Karol Songin.
3. Keep `publicationState: "draft"`, `reviewed: false` and `publishedDate: null` while writing. Drafts are excluded from the public index, navigation, generated article pages and sitemap.
4. Review the factual claims, examples, sources and service links. Never claim an example is a client result unless it is documented and permitted. Change the state to `published`, set `reviewed: true`, and supply the actual publication date as `YYYY-MM-DD`.
5. Run `npm run verify`. On Windows PowerShell, build with `npm.cmd run build` and run content tests with `npm.cmd test`.

One reviewed article is sufficient to populate the library and make it indexable in a production build. Until then the library has an honest coming-soon state and is excluded from the production sitemap. All local/review builds remain noindex under the existing release policy. An SEO-ready page cannot guarantee a search ranking; usefulness, competition, links and indexing still matter.

## Content blocks

Every article needs at least two sections with a `heading` and `body`. Separate paragraphs inside `body` with `\n\n`. All content is escaped text rather than executable HTML.

Optional section fields:

- `bullets`: array of useful points.
- `callout`: `{ "title": "A useful question", "body": "Your explanation" }`.
- `table`: `{ "columns": ["Option", "When it helps"], "rows": [["First option", "Useful context"]] }`. Each row must match the number of columns. The layout supplies column/row headers, a caption and mobile scrolling.

Categories: `Data & reporting`, `Automation & AI`, `Websites & SEO`, `Business systems`. Set `relatedServices` to actual service slugs; unknown slugs fail the build. `sources` contains `{ "label": "Source title", "url": "https://..." }` entries. Cite real references that support the article.

Publication and update dates are validated; impossible and future dates fail the build. Set `substantiveUpdatedDate` only when the substance changes, otherwise leave it null. The published date remains unchanged. The sitemap uses that actual date for `lastmod`.

## Included SEO and reading features

Server-rendered text and links; one H1; unique titles/descriptions; canonical HTTPS URLs; breadcrumbs; Article schema with author, publisher, image, language and dates; Open Graph and Twitter previews; actual article dates in the sitemap; author bio and relevant service links; responsive tables; accessible contents navigation; reading progress; no JavaScript dependency for reading or navigation. Published entries sort newest first. No pretend article titles or fake publication dates are added to the public library.

The reusable preview is deliberately unpublished and separate from the content collection. Editing an article draft does not make it visible. Existing release checks still apply before a real production launch.
