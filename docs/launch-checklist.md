# Launch checklist

Launch is a separately authorised action. No live hosting or DNS changes were performed.

- Confirm all fields in `src/config/release.json` from actual owner decisions; review wording against the chosen configuration.
- Confirm canonical HTTPS host, host-variant redirects and trailing-slash behaviour. Keep `efiops.com`; no domain migration is proposed.
- Review existing pages and important downloads, redirects and verification tags/files. Preserve valuable paths. Add only reviewed direct 301/308 rows to `docs/redirects.csv`. Do not redirect every removed path to Home. Retain useful mappings for at least a year and test the deployed responses for loops and relevant destinations.
- Select the host; on Netlify keep the optional function adapter and switch build command to `npm run build:production`. Do not deploy the review configuration as an indexable release.
- For the fallback relay, set `BUILD_MODE=production`, `CONTACT_ALLOWED_ORIGIN=https://efiops.com`, secure `RESEND_API_KEY`, a verified `CONTACT_FROM` and confirmed `CONTACT_TO`. Verify ordinary input, invalid input, provider errors/timeouts, duplicate delivery, cross-origin requests and abuse controls on the real host. Verify a **real accepted test enquiry**, not a mocked success, before marking `contactVerified`.
- The in-process rate limiter is per warm function instance. Before launch add/review host-level rate limiting or challenge protection; test retries and concurrent serverless instances. Resend’s idempotency header protects matching request IDs across instances within the provider’s retention window. Decide protection against a user generating new IDs for repeated content.
- Validate production titles, descriptions, canonicals and JSON-LD, 200 commercial routes, 404 unknown routes, indexable headers, robots and sitemap. Thank-you/API/drafts are excluded from the sitemap. Confirm no private notes or bracketed placeholders reach public output.
- Review keyboard, touch, reduced motion, errors, labels, contrast, native disclosure and disabled-JavaScript behaviour. Repeat mobile/device checks on the real host. Automated checks are not accessibility certification.
- Re-run performance on the deployed site with identical conditions. Field Core Web Vitals require actual visits; lab scores are not real-user INP or enquiry evidence.
- Publish Work only with at least one substantive approved case. Articles is available now; publish each original article only after review, sources and a real publication date. The empty Articles library remains noindex and outside the sitemap until the first article is published. The template preview must be absent from production. See [article guide](articles.md).
- Register the sitemap in Search Console after launch, inspect important URLs and compare branded/non-branded visibility against the dated baseline. Do not claim rankings or lead growth from the redesign alone.
