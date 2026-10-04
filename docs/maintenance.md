# Maintenance and handover

Use the existing checkout in each isolated cloud task. Do not create a Git worktree unless explicitly requested. Run `npm ci` with the retained lockfile; Node and npm minimums are in README. `ASTRO_TELEMETRY_DISABLED=1` is set in Astro commands so cloud tools do not need a writable home-directory telemetry configuration.

## Content updates

Edit service JSON or `src/data/core.json`. Preserve each service’s distinct purpose. Run schema/type checks and build; then inspect the affected page at mobile and desktop sizes. Complete static text and FAQ checks compare generated HTML with the editable service files. Update related-service slugs together.

Case and article templates are implemented, but private drafts stay excluded. Collect substantive original content and permissions before changing publication state. Case release needs affirmative evidence review and permission. Insight dates must be real, and material updates use substantiveUpdatedDate rather than automatically replacing the date on every build. The index needs two reviewed articles.

## Dependencies and assets

Use mutually compatible stable updates, review the lockfile and rerun relevant checks. Lato regular/bold are served as WOFF2 via Fontsource; license is retained in `public/fonts/Lato-LICENSE.txt`. The native logo remains byte-identical with reserved dimensions. The existing raster 3D reference informs the original code diagrams; it is not falsely presented as installed client software.

`npm run check`, `npm run build`, `npm test` and `npm run test:browser` are the review checks. `node scripts/production-fixture.mjs` builds confirmed fictional production and publishing fixtures outside the checkout and removes them afterwards. It must never be treated as owner approval or real provider verification. Regenerate the social PNG with `node scripts/social-preview.mjs` after intentional visual changes.

## Runtime and contact

Snapshot files/dependencies can persist; live servers cannot be assumed to survive a restored task. Restart `npm run preview` from `/workspace/efiopscom`, then request Home, a service and an unknown path to verify 200/404 and noindex. Stop only the process you started. Use `npm run dev` for editing; rebuild and use the preview for the contact endpoint.

The preview always disables production sending, even if production variables are present. Local success/failure simulations are explicitly labelled and do not count as leads. The shared fallback relay validates and limits input, restricts origin, uses a honeypot, bounds provider timeouts and requests provider idempotency. It never logs enquiry content or credentials. Successful acknowledgement requires a provider response ID; it proves provider acceptance, not inbox delivery. Review serverless abuse controls before launch as described in the checklist.

Production changes need real-host validation and secure variables. Monitor delivery failures, review dependency/API changes and keep privacy/provider information accurate. Optional analytics need a new reviewed consent implementation; the current production guard rejects enabling analytics without that work.

## Redirects and monitoring

The CSV accepts only reviewed 301/308 mappings to actual released routes. Do not invent unseen paths, loops or homepage catch-alls. Recheck host-native unknown-route status, canonicals and headers on deployment. Keep verification files/tags from the existing host after inventory. Track real accepted enquiries and qualified follow-ups; never interpret a direct confirmation-page visit as a lead.
