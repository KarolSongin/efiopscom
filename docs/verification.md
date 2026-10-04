# Verification — 4 October 2026

The review website is implemented and running locally. The live website, hosting and DNS were not changed. All ten service pages retain the detailed scope and FAQs, with buyer-focused headlines and three practical use cases per service; the core commercial pages and legal-review pages are included. Legal and contact configuration remains a production-release prerequisite.

| Check                              | Actual result                                                                                                                                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen dependency installation     | `npm ci` passed with the retained package lock, Node 24.19.0 and npm 11.9.0                                                                                                                                                                                   |
| Type/content check                 | `npm run check`: 55 files, zero errors, warnings or hints                                                                                                                                                                                                     |
| Review build                       | `npm run build` passed: 17 commercial/legal pages and the 404 document                                                                                                                                                                                        |
| Build and contact tests            | `npm test`: 29 passed; zero failed, skipped or cancelled                                                                                                                                                                                                      |
| Chromium browser suite             | `npm run test:browser`: 63 passed; all 17 public pages at 360, 390, 768, 1,024 and 1,440px                                                                                                                                                                    |
| Interactive scenario checks        | Hero order/reset, staffing inputs, all ten service scenarios and keyboard tabs passed; sales and workload arithmetic reconcile                                                                                                                                |
| Complete service copy              | Every service heading, lead, section, use case, deliverable, FAQ and CTA is checked against the editable JSON in generated HTML                                                                                                                               |
| Internal links and missing routes  | All discovered internal navigation links resolve; unknown paths and unreleased Work/Insights/Thank-you return HTTP 404; slash normalisation returns 308                                                                                                       |
| No JavaScript                      | Home, Services, Jev, About and Contact main content and navigation visible; native Power BI FAQ works                                                                                                                                                         |
| Navigation and interaction         | Desktop disclosure, Escape/focus return, mobile menu, expandable service groups and deterministic workflow scenario controls passed                                                                                                                           |
| Accessibility                      | Home, all ten services, Contact and About have no axe violations; How it works passes at 390px and 1,440px after switching scope and exception states in the selected WCAG A/AA tags; keyboard skip/focus, form associations and reduced-motion checks passed |
| Forms                              | Invalid input, missing configuration, explicitly simulated success/failure, provider rejection, missing provider acknowledgement, timeout, retries, duplicate requests, origin, size limits and rate limit tested                                             |
| Accepted response and confirmation | Isolated production browser fixture routes to confirmation after intercepted acceptance, consumes temporary acceptance state and avoids received assertions on direct/repeated visits                                                                         |
| Non-JavaScript form failure        | Shared handler retains and escapes input in an HTML response; real provider success has its own confirmation HTML                                                                                                                                             |
| Draft/privacy exclusion            | No private sentinels, internal evidence notes, draft slugs or unreleased links in generated HTML, JS, JSON or sitemap                                                                                                                                         |
| Preview SEO                        | All pages have noindex metadata and HTTP headers; robots blocks crawling and sitemap contains no indexable URLs                                                                                                                                               |
| Production SEO fixture             | Isolated fictional confirmations generate 17 indexable URLs, correct robots/headers and noindex confirmation; no drafts or confirmation/API entries in sitemap                                                                                                |
| Approved publishing fixture        | One approved fictional case and two reviewed fictional articles exercise index and detail templates, Article JSON-LD and 22 released sitemap entries; internal evidence notes stay private                                                                    |
| Real production gate               | Actual `npm run build:production` remains blocked on unresolved owner fields and contact configuration; expected failure tested                                                                                                                               |
| Logo integrity                     | Supplied and public logo SHA-256 exactly match `187a54a50f705f070e4d618d9dcd3a5d2af9b3a8019c6d9a70a60bb0e47d9c6e`                                                                                                                                             |
| Current preview readiness          | Fresh process: Home/service HTTP 200, unknown path 404, noindex headers, default enquiry HTTP 503 with honest unavailable message                                                                                                                             |

Screenshots of every public page at desktop/mobile widths are in `artifacts/screenshots/`, with additional homepage first-view and mobile-menu captures. Desktop/mobile screenshots were visually reviewed. Chromium browser and axe reports are under `artifacts/`; these generated files are ignored by Git and can be regenerated. Automated accessibility tests do not establish full WCAG certification.

## Visual and copy refresh

The supplied logo, EFIops blue/navy palette and self-hosted Lato remain. The homepage now uses dimensional cards, three larger service stories, an interactive business-day section and a clearer personal introduction. Every service hero has its own interactive scenario and three relatable use cases. Repeated fictional-data captions were removed at the owner’s request; scenario values remain local demonstration inputs and are not presented as client results or independently verified outcomes.

Sales totals, channel costs and orders reconcile. Planning uses four minutes per unit and 32 available hours per person; 1,200 units require 80 hours against 96 available, while an added 300 units requires 100 hours. The daily chart highlights Friday’s workload; the four-hour gap is the weekly total, not a claim that four hours alone resolve Friday’s schedule. Follow-up, missing-field, source-reference and review states explain what the service does.

## Performance

Final homepage lab run: Lighthouse 13.5.0, local built preview with compression, system Chromium, default simulated mobile settings (412 × 823, simulated network ~1.6Mbps/150ms RTT, 4× CPU slowdown). Report: `artifacts/lighthouse-redesign.report.html` and `.json`.

| Metric                   | Final lab result                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Performance              | 99                                                                                                                                  |
| Accessibility            | 100                                                                                                                                 |
| Best practices           | 100                                                                                                                                 |
| SEO                      | 69, because the review site is deliberately blocked from indexing                                                                   |
| First contentful paint   | 1.1 seconds                                                                                                                         |
| Largest contentful paint | 1.5 seconds                                                                                                                         |
| Speed index              | 2.3 seconds                                                                                                                         |
| Total blocking time      | 0ms                                                                                                                                 |
| Cumulative layout shift  | 0                                                                                                                                   |
| Total measured transfer  | 103KiB                                                                                                                              |
| First-view fonts         | 46,620 bytes total (two WOFF2 files)                                                                                                |
| Homepage JavaScript      | Three module requests: 4,738 measured transfer bytes including headers; 1,575 inline source characters (672 bytes gzipped together) |

The JavaScript gzip figure is a budget calculation; inline scripts transfer inside compressed HTML; the three module requests are measured separately. All stated project budgets passed in this run. Lab results do not establish real-user INP, field Core Web Vitals, production-network performance, rankings or business outcomes. A real host can add latency or scripts, so repeat the same checks after any separately authorised deployment.

## Illustrated How it works page

The original five-stage sequence remains: understand, agree, build, test and hand over. A continuous quote-management scenario now illustrates each stage, with questions to resolve and a tangible output. The page includes a project overview, current-process map, interactive scope boundaries, a reviewable quote board, three test conditions and expandable handover information. Guidance before the first conversation and the original FAQs remain available.

Six additional browser tests verify stage navigation, scope/reset behaviour, waiting/replied/missing-email outcomes, keyboard handover details, JavaScript-disabled content, and accessibility/readable content at desktop/mobile widths. The process-page update passed 43 browser tests and 20 build/contact/calculation tests; the Astro check and build also pass. Full-page desktop/mobile screenshots were reviewed.

How it works Lighthouse mobile lab run: performance 98, accessibility 100, best practices 100, SEO 69 (deliberate preview noindex); FCP 1.0s, LCP 1.6s, speed index 3.6s, TBT 0ms, CLS 0, total transfer 101KiB. Report: `artifacts/lighthouse-process.report.html` and `.json`. The same lab limitations described above apply.

## Five-stage examples on every service

All ten service pages now include the understand → agree → build → test → handover flow, tailored to a single practical example. Fifty illustrated stages explain the inputs, project boundaries, reviewable working view, acceptance checks and handover. Each stage has a specific output. Thirty selectable test conditions change the expected result; handover documents expand with native disclosure controls. Without JavaScript, all three test conditions remain available as static content.

Examples cover retail margin reporting, quote follow-up, order-support answers, stock-request routing, packing capacity, order-field mapping, renovation enquiries, garden-care usability, search intent and fruit-width measurement. No example is presented as a completed client engagement or a measured client outcome. The existing service content, FAQs and hero interactions remain available.

Thirteen additional browser tests exercise every flow, its three test conditions and handover; all ten pages are checked for readable content and axe violations at both 390px and 1,440px after switching to an exception state. The complete browser suite passes 56 tests. The static checks also verify stage order and full rendering of stage/handover text. The shared Astro check, build and 20 unit/static tests pass.

Representative Power BI page Lighthouse mobile lab run: performance 99, accessibility 100, best practices 100, SEO 69 (preview noindex); LCP 1.8s, TBT 0ms, CLS 0, total transfer 107KiB. Report: `artifacts/lighthouse-service-journey.report.html` and `.json`. This is a lab measurement of one representative service page, not a performance claim for every page or real-user conditions.

## Customer dashboard — first phase

`/admin/` now provides a branded customer workspace with Opportunity → Understand → Agree → Build → Test → Hand over. It includes board/list views, stage jump controls, manual enquiry creation, contact details, search/service/status/follow-up filters, priority, next actions, private notes and an automatically generated activity history. Customer status is separate from stage, including active, on hold, completed and not proceeding. Paging and loaded-record counts are explicit.

The default built preview offers a labelled local demo with persistent sample records in the Git-ignored `.local/` folder. Opt-in `PREVIEW_CONTACT_MODE=dashboard` saves test public-form submissions into that demo; the default preview remains unavailable for real enquiries. Supabase email/password sign-in and protected database intake are implemented, but no live project or credentials were supplied. Setup is documented in [admin setup](admin-setup.md), including the SQL migration and sole-owner membership registration. No Stripe integration, contracts or invoices were added.

The actual migration was executed in embedded PostgreSQL (PGlite). Tests verify anonymous/unapproved access denial, private admin membership, service-role-only intake, persistent submission deduplication, version conflicts, generated stage history and immutable activity. API tests use controlled Supabase responses to verify confirmed owner identity, membership, user-JWT reads, HTTPS/Secure cookies, expired sessions, sign-out and confirmed database acceptance. These do not establish connectivity to a hosted Supabase project.

Seven admin browser tests pass, covering the complete stage progression, creation, notes, XSS-safe rendering, due/closed filters, persistence after reload, failed-save preservation, sign-in rejection, session expiry and desktop/mobile axe/keyboard checks. The full browser suite passes 63 tests; unit/static/database checks pass 29. The Astro check is clean and the build includes 17 commercial/legal routes, a 404 and the separate noindex admin shell. Isolated production/publishing/confirmation fixtures pass; the admin is excluded from the commercial sitemap and receives its own noindex/no-store headers.

Admin screenshots were reviewed at desktop and mobile widths. No existing logo or other supplied brand asset was changed. Tokens are held in server-set HttpOnly cookies, and customer APIs apply authentication and RLS; static admin HTML contains no customer records. Real deployment still needs the existing launch confirmations, actual-project verification and a defined customer-data retention process.

## Not verified as a live service

- No real enquiry provider is configured or accepted a real enquiry. Provider-response and production browser tests used controlled local/intercepted fixtures; no messages were sent to anyone.
- Legal identity, legal bases, provider arrangements, retention, public email confirmation and hosting choice remain open. Production does not pass with the real configuration.
- Proxy CONNECT 403 denied new requests to the live EFIops site; legacy URLs, redirects, verification assets, analytics/Search Console and existing form ownership require review before launch. The denial does not prove a broken live site.
- No legacy redirects exist yet: the reviewed CSV is deliberately empty. The build validates future reviewed mappings but no real migration mapping can be tested until the inventory exists.
- No public case or article is approved. The template checks used fictional approvals only in temporary copies; real draft flags remain private and unchanged.
- Environment `install_script` and `start_skill` were saved as a confirmed configuration draft. They reproduce dependency installation/build and restart the preview. Saving did not publish a new environment snapshot or deploy the website.
