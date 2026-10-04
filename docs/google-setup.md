# Google Analytics and Search Console

The existing GA4 stream is `G-P6T446WBEN` (a public ID), configured in `src/config/analytics.json`. Production enables optional analytics; review, launch-verification and admin pages do not load it. An optional Netlify `PUBLIC_GA_MEASUREMENT_ID` overrides the repository ID. No new Google property is required. No Google credentials or account access were supplied to this workspace.

## Analytics checks after deployment

1. In the existing Analytics property, Admin → Data streams → web stream, ensure the website URL is `https://efiops.com`. Avoid a second GA/Tag Manager installation on Netlify to prevent duplicate counting.
2. Disable Enhanced Measurement **Form interactions** and **Site search** if enabled; this site provides its own `generate_lead` event only after the backend confirms a saved enquiry, and avoids collecting query strings. Review Google Signals, ads links and user-provided data settings; the site's tag does not enable advertising consent/signals/personalisation.
3. Review Data retention; choose an appropriate period for analytics events (for example two months). This is separate from the 30-day Supabase unsuccessful-enquiry policy.
4. Visit the public site in a fresh browser profile. Before consent there must be no request to Google Analytics or Tag Manager. Reject analytics, reload, and confirm it remains off. Accept analytics via Cookie settings; open Analytics → Reports → Realtime to verify a page visit. Ad blockers can prevent the test, and Realtime can take a few minutes.
5. A successfully saved contact form emits `generate_lead` only with analytics consent. No name, email, organisation or message is sent as event data. Only the current page's query-free URL is included. Count these as consented conversions, not all enquiries; Supabase remains the source of truth for intake.
6. Mark `generate_lead` as a key event in Analytics if desired. Avoid using the thank-you page as an additional lead event, which would double-count.

Choice storage is versioned with a 180-day expiry. Acceptance loads the Google tag; rejection makes no Google request. Withdrawal deletes accessible GA cookies and reloads the page. Blocked browser storage fails closed. Admin HTML has no Analytics integration. Consent records stay in the browser; they are not a server consent ledger. Google's cookie/event retention is configured in the Google account, not by Supabase cleanup.

## Search Console

The owner confirmed a verified **Domain property** for efiops.com. The supplied GoDaddy export retained its google-site-verification TXT record; moving the website while preserving that record should preserve DNS verification. Keep the existing property and its history. Google account property status still needs checking there.

1. Open Search Console and select the existing `efiops.com` Domain property.
2. In Settings → Ownership verification, verify it still shows ownership verified. Leave the GoDaddy verification TXT record unchanged.
3. In Indexing → Sitemaps, submit `https://efiops.com/sitemap.xml` (or `sitemap.xml` if the UI supplies the prefix). If that exact URL is already listed, check its status; no second submission URL is needed. Google can fetch the updated XML at the same address.
4. Confirm status Success after processing. Older submissions can be retained while reviewing whether they still exist; a sitemap file does not automatically remove old URLs from Google's index.
5. Use URL inspection on `https://efiops.com/` → Test live URL and Request indexing. Repeat for important service pages. Indexing is Google's decision and isn't immediate.

For an HTML-verified URL-prefix property only, the layout supports `PUBLIC_GOOGLE_SITE_VERIFICATION`. Do not copy a DNS token into that variable unless Google explicitly provides it as the HTML meta value. The confirmed Domain property does not need this setting.

This workspace has no Google Analytics/Search Console connector or account session. It cannot verify Realtime/account ownership or submit the sitemap directly. Those account actions are carried out by the owner using the steps above.
