# EFIops website

Brand-preserving Astro + TypeScript marketing site for EFIops. The supplied logo is unchanged. All ten service pages retain the brief’s detailed service scope and FAQs, with refreshed headlines and practical business use cases. Original interactive HTML/SVG scenes demonstrate sales margins, staffing capacity, follow-ups, support questions and connected workflows. Fonts are licensed, self-hosted Lato; optional tracking and external widgets are disabled.

## Run the review preview

Requires Node ≥22.12 and npm ≥9.6.5. Developed and checked with Node 24.19.0 and npm 11.9.0.

```sh
cd /workspace/efiopscom
export npm_config_cache=/workspace/.npm-cache
npm ci
npm run check
npm run build
npm run preview
```

Open `http://localhost:4321` on a machine with access to the running environment. The preview listens on `0.0.0.0:4321`. It serves the built site with a real 404 and noindex headers; it includes the local contact handler. `npm run dev` runs the Astro editing server, but the development server alone does **not** run `/api/contact`: use the built preview for form integration checks.

Preview does not send real enquiries. The default form returns an honest unavailable response and preserves input. `PREVIEW_CONTACT_MODE=success npm run preview` and `PREVIEW_CONTACT_MODE=failure npm run preview` enable clearly labelled local simulations; they are ignored in production. For a different port, set `PORT` and matching `CONTACT_ALLOWED_ORIGIN`.

On Windows PowerShell, use `npm.cmd` to avoid the system’s blocked `npm.ps1` script:

```powershell
git pull origin main
npm.cmd ci
npm.cmd run build
npm.cmd run preview
```

## Verify

```sh
npm run check
npm run build
npm test
npm run test:browser
node scripts/production-fixture.mjs
```

Browser checks use `/usr/bin/chromium` with Playwright and include all public pages at five widths, navigation, JavaScript-disabled content, forms, 404s all ten interactive service scenarios, keyboard tabs, arithmetic consistency and axe checks across Home, every service, Contact and About. Configure `playwright.config.ts` for a different browser location. Screenshots and reports go into ignored `artifacts/`. `node scripts/social-preview.mjs` regenerates the original 1,200 × 630 social graphic using the unchanged supplied logo.

## Content and routes

- `src/content/services/*.json`: complete validated service copy, FAQs, related services, focused CTAs and each service’s five-stage illustrated project example.
- `src/data/core.json`: editable home, services, process, about and contact copy.
- `src/data/process.json`: How it works stories, five illustrated stages, clear outputs and preparation guidance.
- `src/styles/process.css`: responsive process-page compositions.
- `src/data/experience.json`: homepage feature stories and interactive scenario descriptions.
- `src/data/scenarios.json`: reconciled sales, order and planning inputs for the interactive cards.
- `src/lib/planning.mjs`: shared workload/capacity calculations.
- `src/styles/experience.css`: visual refresh and responsive interactive compositions.
- `src/config/site.ts`: navigation groups, confirmed public biography and canonical host candidate.
- `src/config/release.json`: owner confirmations; unresolved fields block production.
- `src/content/case-studies/` and `src/content/insights/`: private editorial drafts and validated contracts. Case publication requires both permission and evidence review. Insights require review, sources and real publication dates; the index releases after two articles. Internal evidence notes are never rendered.
- `src/components/`: layout elements and original diagrams; `ServiceJourney.astro` renders the tailored stages and interactive test conditions. No model APIs run in public examples.
- `server/contact.mjs`: shared validated contact relay; `netlify/functions/contact.mjs` adapts it to the optional Netlify host.

The review build includes Home, Services, all ten services, How it works, About, Contact, draft Privacy, Cookies and a genuine 404. Work, Insights and Thank you remain absent until their release conditions are met. No empty indexes or fictional case studies are published.

## Production is a separate step

`npm run build:production` intentionally fails until reviewed identity, privacy, retention, hosting, contact and migration fields are complete. See [owner decisions](docs/owner-decisions.md) and the [launch checklist](docs/launch-checklist.md). Never mark confirmations true merely to bypass the guard.

Netlify is an implementation option, **not a selected live host**. The provided `netlify.toml` defaults to a noindex review build. A separately authorised production deployment must use the production command, `BUILD_MODE=production`, a confirmed HTTPS origin and secure contact variables. Resend is an optional configurable fallback, not an existing verified EFIops lead receiver. No hosting, DNS, live website or real lead route has been changed.

See [verification](docs/verification.md), [maintenance](docs/maintenance.md), [SEO baseline](docs/seo-baseline.md) and [evidence register](docs/evidence-register.md).
