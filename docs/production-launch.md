# EFIops controlled launch

Owner confirmed Netlify hosting at efiops.com, GoDaddy DNS, working inbound/outbound email, Supabase-only website intake, London eu-west-2, karol@efiops.com privacy contact and a 30-day unsuccessful-enquiry policy. The old site had only the main website; no additional paths or GoHighLevel forms were identified. Brand: EfiOps, operated by Karol Songin; no limited-company status is claimed.

## Apply retention in Supabase

Run `supabase/migrations/202610040002_enquiry_retention.sql` once in SQL Editor. Then enable **pg_cron / Supabase Cron** and run:

```sql
select cron.schedule(
  'efiops-unsuccessful-enquiry-retention',
  '0 * * * *',
  'select private.purge_unsuccessful_enquiries();'
);
```

This hourly job permanently deletes records and their cascading activity only when they have continuously been **Not proceeding** for at least 30 days. Closing unsuccessful enquiries starts the clock. Reopening clears it. Editing notes/details does not postpone expiry. Active, paused and completed records are excluded. Review the job run history; do not claim cleanup is operational until the migration and schedule have actually been applied. Do not add pg_cron as a frontend dependency or expose this private function through the API. Provider backups have their own retention; deleting live records is not a claim that every backup copy disappears immediately.

## Deploy and test the real form

`netlify.toml` now builds `npm run build:production`, following the owner’s successful live Supabase enquiry test. The earlier `npm run build:launch` mode remains available for future controlled verification. Set these Netlify variables, retaining the Supabase credentials already configured:

```dotenv
BUILD_MODE=production
CONTACT_STORAGE=supabase
ADMIN_MODE=supabase
ADMIN_ALLOWED_ORIGIN=https://efiops.com
CONTACT_ALLOWED_ORIGIN=https://efiops.com
```

During the earlier launch-verification phase, that build renders real production copy and the thank-you page and enables the production Supabase intake, while metadata, HTTP headers and robots still block indexing. This permits a real public-form test before confirming acceptance. Submit your own test enquiry, check that it appears once at Opportunity, open its message and verify dashboard persistence. This saves a real record; it sends no email or GoHighLevel event. Report any error before marking acceptance verified.

## Enable indexing after the test

The owner confirmed that correcting the server secret key made the real enquiry form work. `contactVerified` is now true and the committed Netlify build command is `npm run build:production`. A normal production build continues to block while contact verification is false. Deployment uses the command in netlify.toml; changing only the Netlify UI may not override it.

Verify homepage meta is `index, follow`, homepage response has no noindex X-Robots-Tag, robots permits crawling and sitemap contains published URLs. Admin, thank-you, drafts and the empty Articles library remain nonindexable as appropriate. Re-run Lighthouse against efiops.com, not the netlify.app alias. Netlify should redirect www and the default project alias to the primary efiops.com domain; check this without changing the preserved email DNS records.

Commercial terms remain a separate business document and have not been reviewed. No prices or binding contract terms are published by this enquiry-only website, so that former generic confirmation does not gate publishing the marketing site. Contract/payment features require their own terms when implemented.

## Netlify secret-scanner configuration

Set `SECRETS_SCAN_OMIT_KEYS` to `ADMIN_MODE,BUILD_MODE,ADMIN_EMAIL,ADMIN_ALLOWED_ORIGIN,CONTACT_ALLOWED_ORIGIN,CONTACT_STORAGE` in Netlify's environment settings. These are public modes, owner contact, URLs and storage-provider names, not credentials. The repository provides this default, but an existing UI environment variable may override it. Keep scanning enabled for Supabase secret/service-role keys; do not omit paths broadly.
