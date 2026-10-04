# Owner decisions before a live release

The complete review site can run without these decisions. Production is deliberately blocked by `src/config/release.json`.

1. Confirm that `https://efiops.com` is the canonical host, and `karol@efiops.com` is monitored and appropriate as the public contact destination.
2. Confirm the existing LeadConnector route and its supported integration. A public form URL is not an authenticated webhook. Alternatively select and verify the supplied Resend relay, including sender-domain ownership and recipient. No provider is currently connected.
3. Supply the legal controller name, privacy contact, reviewed purposes/legal bases, actual retention practice, provider/transfer arrangements and real notice review date. Review Privacy and Cookies against the final deployed configuration.
4. Choose the actual host. Netlify support is supplied as an option. Check redirects, headers, serverless request limits, spam controls, observability and ongoing operational costs on that host.
5. Review commercial terms: implementation, third-party costs, ownership and support. No price, deadline, free-audit offer or response-time guarantee has been invented.
6. Review the legacy URL inventory and redirect mappings with Search Console/analytics exports, verification assets and backlink/download information where available. Current-site requests were denied by this environment's network proxy; no legacy mappings have been guessed.
7. Obtain separate publication permissions and evidence for case studies. A project’s existence is not permission to publish employer materials. Optional portrait must be a real supplied/selected photograph.

`RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`, `BUILD_MODE` and `CONTACT_ALLOWED_ORIGIN` are required only if the fallback relay and a production host are chosen. Enter credentials in the host/environment’s secure settings, never content files or chat. No new account or secret is needed to review the local build.

The real production build remains blocked. The production test uses isolated fictional fixtures and does not establish real provider acceptance, legal compliance or a published environment.
