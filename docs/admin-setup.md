# EFIops customer dashboard

The first phase manages enquiries and the customer journey. Invoices, contracts, Stripe payments and client review links are reserved for a later phase; no Stripe credentials are needed now.

## Try it locally

In your existing checkout, stop the preview with Ctrl+C, then run:

```powershell
git pull origin main
npm.cmd ci
npm.cmd run build
npm.cmd run preview
```

Open **http://localhost:4321/admin/** and choose **Open demo dashboard**. No account is required for the explicitly labelled demo. Six sample customers demonstrate the stages. Add an enquiry, open its record, change its stage, add a note and set a next action/follow-up date. Use customer status to put work on hold, mark it completed or record that it is not proceeding. Closed customers remain available through the status filter.

Demo records persist in `.local/admin-demo.json`. That folder is ignored by Git and is not served by the website. It is sample data on one machine, not a production database. Demo sessions expire after eight hours and after restarting the server. To start over, stop the server and delete that file; the sample set is created again when the demo opens. Keep real customer information out of the demo.

The board has six columns, with buttons to jump to a stage and horizontal scrolling when required. The list view is selected initially on a small screen. Search, service, customer-status and follow-up filters operate over loaded records. Fetching is paginated in batches of 100: **Load more enquiries** includes older records, and **Refresh enquiries** reloads the newest batch. Counts describe loaded records rather than claiming to be global totals.

### Test the website-to-dashboard flow

The ordinary preview keeps its existing unavailable contact response. To opt into the local sample flow, create a `.env` file in the repository root:

```dotenv
ADMIN_MODE=demo
ADMIN_ALLOWED_ORIGIN=http://localhost:4321
CONTACT_ALLOWED_ORIGIN=http://localhost:4321
PREVIEW_CONTACT_MODE=dashboard
```

Restart `npm.cmd run preview`. Submit a test enquiry at `/contact/`, then open the admin demo and choose **Refresh enquiries**. It appears at **Opportunity**, with the original message and a created event. The form explicitly confirms local demo storage; no email is sent. The preview contact notice still identifies the website as a review environment. Removing `PREVIEW_CONTACT_MODE=dashboard` restores the default unavailable preview behaviour. Existing `success`/`failure` contact simulations continue to work separately.

## Connect your Supabase project

1. Create a Supabase project, choosing a suitable region and storing the database password securely. Supabase is the proposed application database/auth provider; its region, retention and privacy arrangements still need to be included in the website’s launch review.
2. In **SQL Editor**, run [the migration](../supabase/migrations/202610040001_customer_pipeline.sql) once. It creates enquiries, activity history, the private admin list, row-level policies and the protected enquiry-intake function. Alternatively, apply it with the Supabase CLI’s migration workflow.
3. In **Authentication → Users**, create your own email/password account. Use a confirmed email you control. The server requires the account’s email to be confirmed. Configure your password securely; never add it to the repository or chat.
4. Copy that user’s UUID and run this separate SQL statement, replacing the placeholder:

   ```sql
   insert into private.admin_users(user_id)
   values ('YOUR-AUTH-USER-UUID');
   ```

   Email alone is not enough: dashboard access requires this database membership as well. Do not register other users in this first, single-owner setup. Disable public user signup in the Auth configuration. No signup form is provided by the website.

5. Get the project URL and **publishable key** (or legacy anon key). Get the server **secret key** (or legacy service-role key) for enquiry intake. These stay in server environment variables. Never use a `PUBLIC_` prefix for any of these configuration names. The secret key must never be placed in browser code.
6. In your root `.env`, set:

   ```dotenv
   ADMIN_MODE=supabase
   ADMIN_ALLOWED_ORIGIN=http://localhost:4321
   CONTACT_ALLOWED_ORIGIN=http://localhost:4321
   ADMIN_EMAIL=YOUR-CONFIRMED-OWNER-EMAIL
   SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
   SUPABASE_SECRET_KEY=YOUR-SERVER-SECRET-KEY
   ```

   Legacy `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are supported in place of the respective new key names. Use one key convention consistently. `.env` is ignored by Git; keep local file access restricted.

7. Restart the preview. `/admin/` now offers real email/password sign-in; demo access is disabled. Create a test enquiry and move it through the stages. Refresh or reopen the record to verify persistence in your project.

Existing local sample customers are **not** uploaded to Supabase. A new project starts empty. Supabase’s account recovery can be managed through its Auth administration; the website does not include a public password-reset or user-invitation flow in this phase.

## Real enquiry intake and deployment

The ordinary review preview never writes public form submissions to a live database. After completing the existing identity/privacy/hosting/contact launch prerequisites, configure the production host with:

```dotenv
BUILD_MODE=production
ADMIN_MODE=supabase
ADMIN_ALLOWED_ORIGIN=https://efiops.com
CONTACT_ALLOWED_ORIGIN=https://efiops.com
ADMIN_EMAIL=YOUR-CONFIRMED-OWNER-EMAIL
CONTACT_STORAGE=supabase
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR-PUBLISHABLE-KEY
SUPABASE_SECRET_KEY=YOUR-SERVER-SECRET-KEY
```

The production build accepts Supabase storage instead of requiring Resend email configuration. It still enforces the existing owner/release checks; do not bypass them. Changing the configured storage does not deploy the website or complete those confirmations. Supabase intake confirms success only after the database returns the saved record ID. A repeated request with the same submission identifier and content returns the original record; changed content under that identifier is rejected. New website records always start at Opportunity.

`CONTACT_STORAGE=supabase` makes the database the enquiry receiver. This first phase does not send an email notification. Check the dashboard for new enquiries. Email alerts can be scoped separately later.

The provided Netlify adapter exposes `/api/admin/*` and the existing `/api/contact`. Netlify remains an implementation option rather than a confirmed live host. A static-only file host cannot run the authenticated dashboard API: deploy its server functions or provide an equivalent Node API integration. The local preview includes both handlers. `npm run dev` on its own runs neither API; use the built preview for the dashboard.

## Data and access

- Every customer starts as an **Opportunity**, then progresses through **Understand → Agree → Build → Test → Hand over**. Stage and customer status are separate: handover can be complete, paused or still active.
- Each record includes contact details, service, original message, priority, next action, follow-up date and timestamps. Follow-up dates are interpreted as UK calendar dates. They are reminders within the dashboard, not scheduled emails.
- Stage/status/detail changes generate activity automatically. Private notes append to the history. The record view loads the latest 500 activity entries; older entries remain in the database. Individual notes and activity cannot be edited or removed separately. The owner can permanently delete a contact and all associated notes/history using the confirmed Delete contact action. The owner selected a 30-day policy for unsuccessful enquiries. Apply migration `202610040002_enquiry_retention.sql` and configure the scheduled job as described in [production launch](production-launch.md). Records continuously marked Not proceeding are deleted with their activity after 30 days. The contact-deletion action requires migration `202610040003_social_media_and_contact_deletion.sql`.
- Concurrent edits use the record version. If a record changed elsewhere, saving fails clearly and keeps your entered fields. Use **Reload record** to discard those fields and review the newer record.
- The login exchanges the password with Supabase on the server. Access and refresh tokens are held in HttpOnly, SameSite=Strict cookies scoped to `/api/admin`; production requires HTTPS and sets Secure cookies. No token is stored in localStorage.
- Each protected API request verifies the Supabase user, confirmed owner email and private admin membership. Customer reads/changes use that user’s JWT under row-level security. The server secret is used only by the public form intake adapter, never by admin CRUD requests.
- Anonymous visitors and authenticated accounts that lack admin membership cannot read enquiries or history. The intake function is executable only by the service role. The public `/admin/` HTML is a sign-in shell, contains no customer data and is excluded from search indexing and the commercial sitemap.
- Mutation endpoints require the configured origin. Sign-in is throttled per running instance, in addition to Supabase Auth’s own limits. The existing public contact validation, honeypot and rate checks are retained. If deploying across multiple instances, evaluate host-level/shared rate limiting as part of the launch setup.

## Verification and boundaries

`npm run verify` covers the marketing site and admin UI. Admin tests cover private API access, demo persistence, all stage transitions, notes, closed-record filtering, failed-save preservation, mobile/desktop layout, keyboard dialogs and automated accessibility. `npm test` also executes the actual SQL migration in embedded PostgreSQL (PGlite), testing RLS, private membership, service-only intake, retry deduplication, version conflicts and immutable activity. Supabase auth/API tests use controlled response fixtures and do not establish a successful connection to your future hosted project.

No Supabase project or account was created for you; no remote credentials were supplied or stored. Before using real data, follow the setup above and verify sign-in, RLS, enquiry intake and session expiry against your actual project and deployment. Invoices, contracts, payments, client logins, files, multi-user roles, notifications and retention scheduling controls are outside this phase.

## Delete a contact

Apply `supabase/migrations/202610040003_social_media_and_contact_deletion.sql` once in SQL Editor, after the earlier migrations. This adds the social-media service value and an owner-only RLS delete policy. It deletes no existing records when applied.

Open a record and scroll to **Delete this contact**. The confirmation names the contact and email and explains that the enquiry, every private note and activity history will be permanently removed. Cancel makes no delete request. Confirm uses the signed-in owner's JWT, matching record version and origin checks. If another session changed the record, reload it before deleting. A failed delete keeps the record open. Other contacts are unaffected.

Deletion removes live database rows, including submission identifiers, through the existing foreign-key cascade. It does not delete the owner's Supabase login or Google Analytics aggregates. Provider backups are subject to their own retention as described in the privacy notice. There is no undo/recycle bin. Local demo deletion also removes its persisted notes/history.
