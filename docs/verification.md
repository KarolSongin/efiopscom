# Verification — 4 October 2026

The review website is implemented and running locally. The live website, hosting and DNS were not changed. All ten service pages use the supplied complete copy; the core commercial pages and legal-review pages are included. Legal and contact configuration remains a production-release prerequisite.

| Check                              | Actual result                                                                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen dependency installation     | `npm ci` passed with the retained package lock, Node 24.19.0 and npm 11.9.0                                                                                                                                       |
| Type/content check                 | `npm run check`: 35 files, zero errors, warnings or hints                                                                                                                                                         |
| Review build                       | `npm run build` passed: 17 commercial/legal pages and the 404 document                                                                                                                                            |
| Build and contact tests            | `npm test`: 17 passed; zero failed, skipped or cancelled                                                                                                                                                          |
| Chromium browser suite             | `npm run test:browser`: 17 passed; all 17 public pages at 360, 390, 768, 1,024 and 1,440px                                                                                                                        |
| Final diagram checks               | Six targeted browser tests passed after the last visual adjustments: all widths and homepage axe                                                                                                                  |
| Complete service copy              | Every service heading, lead, section, deliverable, FAQ and CTA is checked against the editable JSON in generated HTML                                                                                             |
| Internal links and missing routes  | All discovered internal navigation links resolve; unknown paths and unreleased Work/Insights/Thank-you return HTTP 404; slash normalisation returns 308                                                           |
| No JavaScript                      | Home, Services, Jev, About and Contact main content and navigation visible; native Power BI FAQ works                                                                                                             |
| Navigation and interaction         | Desktop disclosure, Escape/focus return, mobile menu, expandable service groups and deterministic workflow scenario controls passed                                                                               |
| Accessibility                      | Five representative pages have no axe violations in the selected WCAG A/AA tags; keyboard skip/focus, form associations and reduced-motion checks passed                                                          |
| Forms                              | Invalid input, missing configuration, explicitly simulated success/failure, provider rejection, missing provider acknowledgement, timeout, retries, duplicate requests, origin, size limits and rate limit tested |
| Accepted response and confirmation | Isolated production browser fixture routes to confirmation after intercepted acceptance, consumes temporary acceptance state and avoids received assertions on direct/repeated visits                             |
| Non-JavaScript form failure        | Shared handler retains and escapes input in an HTML response; real provider success has its own confirmation HTML                                                                                                 |
| Draft/privacy exclusion            | No private sentinels, internal evidence notes, draft slugs or unreleased links in generated HTML, JS, JSON or sitemap                                                                                             |
| Preview SEO                        | All pages have noindex metadata and HTTP headers; robots blocks crawling and sitemap contains no indexable URLs                                                                                                   |
| Production SEO fixture             | Isolated fictional confirmations generate 17 indexable URLs, correct robots/headers and noindex confirmation; no drafts or confirmation/API entries in sitemap                                                    |
| Approved publishing fixture        | One approved fictional case and two reviewed fictional articles exercise index and detail templates, Article JSON-LD and 22 released sitemap entries; internal evidence notes stay private                        |
| Real production gate               | Actual `npm run build:production` remains blocked on unresolved owner fields and contact configuration; expected failure tested                                                                                   |
| Logo integrity                     | Supplied and public logo SHA-256 exactly match `187a54a50f705f070e4d618d9dcd3a5d2af9b3a8019c6d9a70a60bb0e47d9c6e`                                                                                                 |
| Current preview readiness          | Fresh process: Home/service HTTP 200, unknown path 404, noindex headers, default enquiry HTTP 503 with honest unavailable message                                                                                 |

Screenshots of every public page at desktop/mobile widths are in `artifacts/screenshots/`, with additional homepage first-view and mobile-menu captures. Desktop/mobile screenshots were visually reviewed. Chromium browser and axe reports are under `artifacts/`; these generated files are ignored by Git and can be regenerated. Automated accessibility tests do not establish full WCAG certification.

## Performance

Final homepage lab run: Lighthouse 13.5.0, local built preview with compression, system Chromium, default simulated mobile settings (412 × 823, simulated network ~1.6Mbps/150ms RTT, 4× CPU slowdown). Report: `artifacts/lighthouse-final.report.html` and `.json`.

| Metric                   | Final lab result                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Performance              | 100                                                                                                                            |
| Accessibility            | 100                                                                                                                            |
| Best practices           | 100                                                                                                                            |
| SEO                      | 69, because the review site is deliberately blocked from indexing                                                              |
| First contentful paint   | 0.8 seconds                                                                                                                    |
| Largest contentful paint | 1.3 seconds                                                                                                                    |
| Speed index              | 0.8 seconds                                                                                                                    |
| Total blocking time      | 0ms                                                                                                                            |
| Cumulative layout shift  | 0                                                                                                                              |
| Total measured transfer  | 85KiB                                                                                                                          |
| First-view fonts         | 46,620 bytes total (two WOFF2 files)                                                                                           |
| Homepage JavaScript      | 1,955 inline source characters; 854 bytes when those inline scripts are gzipped together; no separate script resource requests |

The JavaScript gzip figure is a budget calculation; the scripts transfer inside compressed HTML rather than as a separate gzip resource. All stated project budgets passed in this run. Lab results do not establish real-user INP, field Core Web Vitals, production-network performance, rankings or business outcomes. A real host can add latency or scripts, so repeat the same checks after any separately authorised deployment.

## Not verified as a live service

- No real enquiry provider is configured or accepted a real enquiry. Provider-response and production browser tests used controlled local/intercepted fixtures; no messages were sent to anyone.
- Legal identity, legal bases, provider arrangements, retention, public email confirmation and hosting choice remain open. Production does not pass with the real configuration.
- Proxy CONNECT 403 denied new requests to the live EFIops site; legacy URLs, redirects, verification assets, analytics/Search Console and existing form ownership require review before launch. The denial does not prove a broken live site.
- No legacy redirects exist yet: the reviewed CSV is deliberately empty. The build validates future reviewed mappings but no real migration mapping can be tested until the inventory exists.
- No public case or article is approved. The template checks used fictional approvals only in temporary copies; real draft flags remain private and unchanged.
- Environment `install_script` and `start_skill` were saved as a confirmed configuration draft. They reproduce dependency installation/build and restart the preview. Saving did not publish a new environment snapshot or deploy the website.
