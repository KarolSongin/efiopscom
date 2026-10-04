# Build the new EFIops website

Act as an experienced frontend developer, product designer, technical SEO specialist and careful implementer. Build a complete, polished replacement marketing website for EFIops at efiops.com using the implementation brief appended below.

The requested deliverable is production-ready source, a working local/review preview and clear launch documentation. The current live domain is not part of this implementation step. Do not change live hosting, DNS or the current website.

## Working instructions

1. Read the entire appended brief before making design or stack decisions. Treat its page copy, evidence boundaries and release conditions as the source of truth.
2. Inspect the repository, its instructions, existing app, hosting configuration, package manager and reusable assets. Preserve unrelated work. If this is a new project, create the recommended Astro/TypeScript stack in the appropriate project directory.
3. Use current official documentation when resolving framework, deployment or provider details. Install supported stable dependencies and retain a lockfile.
4. Proceed through the build autonomously. Make reasonable reversible implementation choices, recording them. Do not stop after scaffolding, the homepage or a list of recommendations.
5. Implement all ten service pages and all specified supporting commercial pages with their complete copy. Shared layouts are encouraged; distinct page substance is required.
6. Keep copy in editable validated content/data files. Use the exact wording as the starting point. Make only small edits necessary for correct presentation, avoiding generic replacement text.
7. Separate public copy from internal notes. Never render the brief's “Evidence plan”, “Visual”, “Primary intent”, source numbers, release rules or other implementation annotations as marketing content.
8. Build a coherent responsive design from the visual specification. Use original CSS/SVG/HTML diagrams. Avoid replacing the design with a generic template.
9. Make the signature 3D composition readable and lightweight. All animated examples use deterministic fictional data, labelled clearly. They do not call AI APIs or private systems.
   Preserve the current efiops.com colours, style and actual logo. This is an explicit user constraint. Use the included logo asset or its verified source URL; do not invent a replacement identity.
10. Support reduced motion, keyboard navigation, meaningful headings and accessible form states. Ensure the page remains useful without JavaScript.
11. Implement honest form handling. Reuse an existing verified lead route where appropriate; otherwise create a configurable server-side integration. Do not expose keys or fabricate success. A missing backend is an explicit unresolved configuration, not a working enquiry system.
12. Create the case-study and article templates, content validation and draft examples as specified. Keep unpublished content out of routes, public bundles, links and sitemaps. Do not invent evidence or publish placeholders.
13. Implement preview and production build modes. Unknown legal/contact facts may remain documented blockers for preview; they must prevent a falsely complete production release.
14. Implement titles, descriptions, canonicals, structured data, sitemap, genuine 404 behaviour and a reviewed redirect mechanism. Do not invent legacy paths or ranking promises.
15. Do not make any claims of official Microsoft, TypeSafe, OpenAI or other vendor partnership. Technology names describe tools, not endorsements.

## Design quality bar

Create a premium, distinctive business-systems website within the current EFIops brand: bright blue, pale blue, deep navy, white and black; existing Lato typography; the unchanged current logo; generous spacing and rounded blue/white 3D illustrations. Use the extracted tokens and asset references in the brief. The site should make Karol's combination of operational understanding, data analysis and development visible.

Use a balanced asymmetrical desktop hero and a purposeful mobile composition. Vary the page sections with editorial rows, grouped services, a useful workflow illustration and a direct personal introduction. Avoid endless identical card grids, oversized decorative animations, stock laptop photography or unreadable dashboard ornament.

All illustrations should explain the relevant service. Never display synthetic counts or charts as achieved business results. Use the existing EFIops logo, provided in the build pack at assets/efiops-logo-current.png or available at its verified URL in the brief. Preserve its proportions, transparency and colours. New service illustrations should extend the existing visual language.

## Build and verify

Start the project's local preview and inspect rendered pages using the available browser tooling. Check the homepage, all ten service pages, contact and representative supporting pages at mobile and desktop sizes. Capture useful screenshots if the tooling supports it.

Run meaningful checks for:

- Build and type correctness.
- Commercial routes and genuine unknown-route handling.
- Complete static copy and metadata.
- Internal links, navigation and mobile menus.
- Draft exclusion from output and sitemap.
- Reduced motion, keyboard access and responsive overflow.
- Form invalid input, accepted submission, provider error and missing configuration.
- Preview/production indexing controls.
- JSON-LD consistency and canonical URLs.
- Performance under documented conditions.

Fix issues found. Do not claim a check passed if it was not run. If a browser, credentials or provider access is unavailable, complete the independent work and state exactly which verification remains.

## Required output

Deliver:

1. The complete source and content files.
2. A working local preview with the exact run commands.
3. README and the documentation listed in the brief.
4. A compact verification summary with actual checks and results.
5. Remaining owner decisions and configuration needed before release.

The final report should explain what was built, how to view it, what was verified and which specific facts still block a live release. Do not confuse the local preview with deployment or future organic rankings.

The full implementation brief follows. Everything after the marker is included for this build, so no earlier conversation is needed.

---

BEGIN EFIOPS IMPLEMENTATION BRIEF

# EFIops website blueprint

Prepared for Karol Songin • 4 October 2026 • UK English

This is a complete content and implementation brief for rebuilding efiops.com. It contains proposed business positioning, the page structure, publishable marketing copy, visual direction, technical architecture, SEO requirements and a case-study development plan. The separate Codex prompt includes this entire brief.

Marketing copy below describes the proposed offer. It is not evidence that every future service has already been sold or delivered. Internal notes, research references, evidence labels and instructions are not website copy.

## 1. The business the website should present

EFIops helps businesses improve three connected things: their online presence, the information they use to make decisions, and the work happening between their systems.

The brand's distinguishing combination is Karol's operational experience, analytical ability and hands-on development. The website should make that combination clear within the first screen. Visitors should see a capable independent specialist who understands the work before choosing the technology.

### Positioning

Business websites, dashboards and automation built around how your business works.

### Brand promise

Clearer information. Less repetitive work. Better digital experiences.

### Primary buyers

- Business owners who have outgrown disconnected spreadsheets, inboxes and generic software.
- Operations and departmental managers who need dependable reporting or workflow improvements.
- Small and medium businesses that need a stronger website and a clearer route from enquiry to delivery.

### Geographic approach

Based in Maidstone, Kent, working with businesses across the UK. Local relevance is especially useful for web design and SEO. Technical services can be delivered remotely. Previous international work can be mentioned where evidence supports it; do not imply offices in other countries.

### Commercial structure

1. Discover the problem and agree the first useful result.
2. Scope a dashboard, workflow, website, integration or pilot.
3. Implement and verify it.
4. Offer optional monitoring, maintenance and subsequent improvements.

Keep the service menu broad enough to represent Karol's skills. Keep each individual engagement narrow enough to scope and deliver well. There is no requirement to build an entire business operating system for a first customer.

### What to change from the current website

The retrieved EFIops homepage concentrates on websites, SEO and advertising. The new site should retain those capabilities and add the operations, data, software and AI work that now distinguishes EFIops. The homepage and contact page were reviewed as text; the public homepage HTML/styles and actual logo/hero illustration were also inspected. This was not a full rendered-page audit, technical crawl, backlink analysis or Search Console review. The pricing link and sitemap endpoints were not successfully retrieved. Do not infer their status from that retrieval failure.

ClickRebels is a reference for explaining business outcomes and connected systems. Use original EFIops copy, layout and visual assets. Its published claims are not independent market validation for EFIops.

### Voice

Clear, practical, confident and personal. Explain the problem, the work and the useful outcome. Use UK spelling. Use the brand voice “we” for EFIops, and “I” only in Karol's personal introduction. State that clients work directly with Karol. Avoid implying a large agency, a certified partnership or a workforce of autonomous agents.

Do not use generic phrases such as “unlock your potential”, “cutting-edge solutions”, “transform your digital journey”, “revolutionise”, “guaranteed results” or “10x your business”. Demonstrate expertise through useful explanations and verifiable work.

## 2. Evidence and capability boundaries

The current resume establishes experience with Power BI, SQL, Excel, Python, computer vision, Raspberry Pi, JavaScript, React, Node.js, REST APIs, Supabase, operations analysis, forecasting and business websites. Recent conversations establish Power Automate work and the developing voice/Jev integration in PWMS.

| Capability | Evidence available | How to describe it |
| --- | --- | --- |
| Power BI and operational reporting | Completed Loma/Yamato report; reporting work in resume; attendance, forecast and quality-report discussions | A core service with relevant experience; outcomes must be measured per project |
| Power Automate | Appraisal reminders and forecast-change alerts discussed and tested | A core workflow service; do not invent hours saved or email counts |
| Custom business applications | PWMS planning and analytics platform | Strong project foundation; distinguish Karol's work from an externally commissioned EFIops project |
| Data and systems integration | SQL/APIs/Supabase; Node.js machine-data processing; Yamato modification | A core service with concrete implementation examples |
| Websites and SEO | EFIops client work in the resume; existing EFIops and Cleaning Maidstone sites | Core services; ranking and conversion claims require original evidence |
| Jev and conversational AI | User reported integrating voice and Jev into PWMS on 29 September; development continues | Integration experience and an in-progress project, not a finished autonomous product |
| Computer vision and edge processing | Blueberry size/defect application in current resume | A specialist pilot service; no industrial certification, accuracy or throughput claim |
| Document AI, retrieval assistants, phone assistants, CRM-connected AI | Plausible extensions of existing development and integration skills | Scoped future builds and pilots; never present as completed client results |

The task record still lists the PWMS integrations as open despite the reported integration milestone. This brief does not change their status or award XP. Publication evidence should be refreshed when the case study is written.

For employer work, approval to publish is separate from having built the system. Use anonymised descriptions only after checking that they do not disclose protected business information. Do not use Winterwood's name, logo, customers, financials, payroll identifiers, internal URLs, machine screenshots or personal data without appropriate permission.

## 3. Page architecture and navigation

### Launch pages

Create all ten service pages. Keep specialist offers visible inside the services menu, with a clear explanation of when they fit. The pages below have different primary purposes; shared design does not mean shared or interchangeable copy.

| URL | Page | Primary purpose / proposed search intent |
| --- | --- | --- |
| / | Home | EFIops brand; business websites, dashboards and automation |
| /services/ | Services | Compare services; business automation and digital systems |
| /services/power-bi/ | Power BI | Power BI consultant, dashboards, reporting and data modelling |
| /services/power-automate/ | Power Automate | Microsoft Power Automate consultant and workflow automation |
| /services/ai-assistants/ | AI assistants and system integration | AI assistants connected to business data and workflows |
| /services/jev-ai-integration/ | Jev integration | Jev / TypeSafe AI integration and decision routing |
| /services/custom-business-apps/ | Custom business applications | Internal business apps, planning tools and portals |
| /services/system-integrations/ | Systems and data integration | API integration, SQL data integration and connected systems |
| /services/web-design-development/ | Web design and development | Web design Maidstone; business website development |
| /services/website-optimisation/ | Website optimisation | Website performance, usability and conversion improvements |
| /services/seo/ | SEO | SEO services Maidstone / Kent; technical and on-page SEO |
| /services/computer-vision/ | Computer vision | Computer vision prototypes, visual measurement and edge AI |
| /how-it-works/ | Process | Scope, delivery, ownership and support expectations |
| /about/ | About | Karol's identity, relevant experience and way of working |
| /contact/ | Contact | Qualified enquiry, with a service-specific starting point |
| /privacy/ | Privacy | Accurate notice matching the actual business and services used |
| /cookies/ | Cookies | Accurate storage and optional-tracking information |

The first fifteen routes are commercial/content pages. Legal pages must be completed against the actual deployed configuration. Keyword targets are hypotheses, not measured search volumes or difficulty scores.

### Ready to build, released when content is ready

| URL | Release rule | Purpose |
| --- | --- | --- |
| /work/ | At least one approved, substantive public project | Case-study index |
| /work/[project-slug]/ | Approved evidence and truthful status | Individual project |
| /insights/ | At least two useful reviewed articles | Practical knowledge index |
| /insights/[article-slug]/ | Reviewed original content | Supporting search intent and expertise |
| /thank-you/ | Functional form integration | Confirmation; noindex |
| /404.html or host-native 404 | Always | Correct missing-page response; noindex |

Do not publish empty “coming soon” indexes. Do not create dummy articles or fake case studies to fill a layout. Code the templates and keep the drafts private. Omit unreleased links from navigation, related-content lists and sitemaps.

### Navigation

Desktop: EFIops wordmark; Services; How it works; About; optional Work and Insights when released; primary button “Talk through your project”.

The Services menu has four clearly labelled groups:

- Data and business tools: Power BI; Custom business apps.
- Automation and integration: Power Automate; System integrations.
- AI in your systems: AI assistants; Jev integration; Computer vision.
- Websites and search: Web design; Website optimisation; SEO.

Use a short, accessible menu with descriptions, not a full-screen wall of links. Mobile uses an ordinary menu button and expandable groups. Every service must also be reachable from the static services index without JavaScript.

### Intent boundaries

The Power BI page sells reporting and models. The apps page sells custom operational interfaces. The integrations page sells data exchange and system connections. Power Automate sells workflows in Microsoft's ecosystem. AI assistants sells conversation, retrieval and controlled actions. Jev sells structured decision routing.

Web design sells a new build or rebuild. Website optimisation sells improvements to an existing user experience. SEO sells discovery, crawlability and content relevance. Cross-link these pages where they genuinely meet, while retaining their separate purpose.

## 4. Shared conversion copy

Primary CTA: **Talk through your project**

Secondary CTA: **Explore the services**

Service-specific CTAs appear in each page specification.

Contact introduction: **Tell us what needs to work better.**

Supporting text: **A website that feels behind the business. Reporting that takes too long. A workflow that depends on someone remembering. Tell us where the friction is, and we can discuss a practical next step.**

Do not advertise a free audit, a fixed call duration, a delivery deadline, a response-time SLA or a starting price until Karol has chosen it. “Talk through your project” does not require a paid discovery engagement or a promise of unpaid consulting.

Reusable final CTA:

**Let's make the next improvement a useful one.**

**Describe the problem, the tools you use and what a better result would look like. We'll help you work out where to start.**

Button: **Talk through your project**

When quoting, separate implementation, ongoing support and third-party costs. Decide commercial terms before publishing promises about ownership, fixed-price delivery or maintenance.

## 5. Homepage: complete proposed copy

SEO title: **Websites, Power BI & Business Automation | EFIops**

Meta description: **EFIops builds business websites, Power BI dashboards, workflow automation and AI integrations. Based in Maidstone, working with businesses across the UK.**

### Hero

Eyebrow: **Websites • Data • Automation • AI**

H1: **Make your business work better.**

Lead: **Business websites, dashboards and automation built around the way you work. EFIops connects your online presence, your data and your everyday processes—so the next step is easier to see and easier to take.**

Primary button: **Talk through your project**

Secondary button: **Explore the services**

Location line: **Based in Maidstone, Kent. Working with businesses across the UK.**

### The problems we help solve

H2: **Where is work getting stuck?**

**You can't see the whole picture.** Reports live in separate spreadsheets. Different teams use different numbers. You spend time assembling information before you can act on it.

**Too much depends on manual work.** Someone has to copy the details, send the reminder, check the status or chase the next step. Important work moves only when somebody remembers.

**Your website isn't doing the business justice.** Visitors struggle to understand the offer, find what they need or get in touch. The site needs clearer structure, stronger content or better performance.

### Three useful outcomes

H2: **Clearer information. Smoother work. A stronger website.**

**See what is happening.** Power BI dashboards and custom business tools bring the information you need into a view your team can use.

**Connect the next step.** Workflow automation, system integrations and AI assistance help move work between the tools you already rely on.

**Make it easier to choose you.** Well-designed websites, practical optimisation and focused SEO help people understand your business and take action.

### Services

H2: **The right tool for the job.**

Intro: **Some problems need a better report. Others need a connected workflow, a clearer website or a purpose-built application. We start with the problem and choose the technology that fits.**

**Power BI** — Make complex data easier to understand with reporting built around real decisions.

**Power Automate** — Replace repetitive steps with workflows that know what should happen next.

**AI assistants** — Connect conversation to the records, knowledge and workflows your team uses.

**Jev integration** — Add structured AI decisions to software and route requests into defined workflows.

**Custom business apps** — Build the planning tools, portals and operational screens your business needs.

**System integrations** — Connect applications, APIs and databases so information moves more reliably.

**Web design and development** — Give your business a clear, distinctive website built to be useful.

**Website optimisation** — Improve speed, usability and the path from visit to enquiry.

**SEO** — Build a clearer structure and stronger content around how customers search.

**Computer vision** — Explore visual measurement and inspection with a focused prototype.

Link each card to its own service page. Show the first six as a considered grouped composition, with the full ten-item service directory below or alongside it; do not hide text behind a carousel.

### Interactive example

H2: **See how the pieces can work together.**

Text: **A request comes in. The system identifies what is needed, checks the relevant information and routes the next step. Your team can see the status and handle anything that needs a closer look.**

Caption: **Illustrative workflow using fictional data.**

Controls: **Reporting** / **Enquiry follow-up** / **AI request routing**

Reporting scenario: **Bring separate records into one reporting view.**

Enquiry scenario: **Capture the requirements and flag the next follow-up.**

AI scenario: **Route a stock question to a defined lookup, or hand it to a person.**

Use scripted examples only. The website does not call customer systems or use a live AI model to run this demonstration.

### Human expertise

H2: **Built with an understanding of the work behind the screen.**

Text: **EFIops is led by Karol Songin, an operations and data analyst and hands-on developer based in Maidstone. His experience includes production planning tools, operational dashboards, reporting automation, business websites and AI integration.**

**You work directly with the person understanding the problem and building the solution.**

Link: **Meet Karol**

### Process

H2: **Understand it. Build it. Make it useful.**

**Understand the work.** We look at the current process, the tools involved and the point where things become difficult.

**Agree the first improvement.** We define the scope, the inputs and what a useful result should look like.

**Build and check.** The solution is tested against the workflow it needs to support.

**Put it to work.** Your team gets a clear handover, with support options for keeping the system useful.

Link: **See how projects work**

Finish with the shared final CTA. Add a selected-work section only when approved public work exists. Do not substitute fictional metrics for that section.

## 6. Power BI service page

URL: /services/power-bi/

SEO title: **Power BI Consultant & Dashboard Development | EFIops**

Meta description: **Power BI dashboards, data models and reporting improvements for clearer business decisions. Work directly with a Maidstone-based operations and data specialist.**

Primary intent: Power BI consultant; Power BI dashboard development.

### Hero

Eyebrow: **Reporting that supports decisions**

H1: **Power BI dashboards that make the next decision clearer.**

Lead: **Bring your data into reporting that answers useful business questions. EFIops helps you define the measures, connect the sources and build dashboards your team can understand and use.**

CTA: **Discuss your reporting**

### Problems

H2: **The report should explain the work, not add to it.**

**If every meeting starts with rebuilding a spreadsheet, the reporting process needs attention. If two reports show different totals, the definitions need attention. And if a dashboard looks impressive but nobody acts on it, the questions need attention.**

**We start with what you need to know: what changed, where performance differs, what is causing the difference and what should happen next.**

### Offer

H2: **From raw records to a useful reporting view.**

- **Data preparation and modelling.** Organise source data, relationships and calculations around consistent definitions.
- **Dashboard design.** Build clear views of the measures that matter, with filters and comparisons that help people investigate.
- **Existing report improvements.** Review confusing visuals, unreliable measures, slow models and repetitive preparation.
- **Operational reporting.** Explore forecasts, capacity, staffing, production performance, quality checks and other business measures.
- **Refresh and handover.** Plan how data reaches the report, how access works and how the team maintains it.

### Delivery

H2: **A reporting project starts with a question.**

**We agree the decisions the report should support, inspect the available data and define the measures. A first reporting view is then checked against known records before the layout and interactions are refined.**

**The handover explains the definitions, source limitations and refresh process. Microsoft licensing and sharing requirements are reviewed as part of the scope.**

### FAQ copy

**Can you improve an existing Power BI report?** Yes. We can review its model, calculations, usability and refresh process, then agree which changes will be most useful.

**Can you work with SQL and spreadsheets?** Yes. Those are familiar starting points. The exact connection and refresh approach depends on where the data lives and how access is provided.

**What if our data is inconsistent?** We identify the gaps before presenting the report as dependable. Some projects need source cleanup or clearer definitions before dashboard development.

**Will the dashboard replace our planning application?** A dashboard is designed to analyse information. If your team needs to enter plans, assign work or manage records, a custom business application may be the better fit.

Final CTA heading: **What would you like your reporting to explain?**

Final CTA text: **Tell us which questions are difficult to answer and where the data currently lives.**

Related services: Custom business apps; System integrations; Power Automate.

Evidence plan: Loma/Yamato comparison is the first case-study candidate. Operational reporting and forecasting are additional candidates. No public efficiency, accuracy or hours-saved figures are currently approved.

Visual: A readable reporting composition with a trend chart, comparison table and annotated measure definitions. Fictional data must be labelled. Make the chart legend, period and unit readable; visuals are original examples, not screenshots of a private employer report.

## 7. Power Automate service page

URL: /services/power-automate/

SEO title: **Power Automate Consultant & Workflow Automation | EFIops**

Meta description: **Automate reminders, approvals, alerts and recurring admin with Microsoft Power Automate. Practical workflows scoped around your business process.**

Primary intent: Power Automate consultant; Microsoft workflow automation.

### Hero

Eyebrow: **Less chasing. Clearer next steps.**

H1: **Power Automate workflows that keep everyday work moving.**

Lead: **Replace repeated checks, copied details and forgotten reminders with a workflow built around your process. EFIops designs Microsoft Power Automate solutions with clear triggers, conditions and a way to handle exceptions.**

CTA: **Discuss a workflow**

### Problems

H2: **Some work only happens because somebody remembers.**

**A review becomes due. A forecast changes. An approval is waiting. Someone opens a spreadsheet, checks the dates and sends the same message again.**

**That routine is a good place to look for automation—provided the rules are clear and somebody can see when an exception needs attention.**

### Offer

H2: **Useful automation starts with a dependable process.**

- **Scheduled reminders.** Trigger the next step from dates, status changes or defined business rules.
- **Approvals and routing.** Send requests to the right person and keep the decision attached to the record.
- **Change alerts.** Compare information and notify people when an agreed threshold or condition is met.
- **Connected admin.** Move suitable information between Microsoft tools, databases, forms and supported services.
- **Existing flow repairs.** Investigate failed conditions, missing values, duplicate actions and unreliable runs.

### Delivery

H2: **Built for the ordinary day—and the awkward one.**

**We define the trigger, the records involved, the people responsible and what should happen when information is missing. The workflow is then tested with ordinary cases, date boundaries, repeated runs and exceptions.**

**You receive a clear explanation of the flow and its dependencies. Any licensing or connector requirements are checked before the implementation is agreed.**

### FAQ copy

**Can you fix a flow we already use?** Yes. We can inspect the intended process, reproduce the issue where access allows and propose a focused repair.

**Can reminders be sent to different managers?** Yes. Routing can follow defined data and rules, with an agreed fallback when the usual recipient is missing.

**Can a workflow connect to SQL?** It can be scoped around supported connections and appropriate permissions. Access, hosting and licensing need to be checked for the particular database.

**How do we avoid sending the same notification twice?** The design should track what has already happened and test repeated runs. The exact method depends on the workflow and its record system.

Final CTA heading: **Which repeated task would you like to stop chasing?**

Final CTA text: **Describe the trigger, the steps and the tools involved. We can work out whether the process is ready to automate.**

Related services: System integrations; Power BI; AI assistants.

Evidence plan: Appraisal reminders and forecast-change alerts. Refresh the latest logic and show tests before publication. Use anonymised dummy employees and forecast data in diagrams. No employee email, start date or payroll record belongs in a public demo.

Visual: A clear four-step workflow showing Trigger, Condition, Action and Review. Display an exception branch as part of the design. Build as HTML/SVG rather than a private Power Automate screenshot.

## 8. AI assistants and integration service page

URL: /services/ai-assistants/

SEO title: **AI Assistants & Business System Integration | EFIops**

Meta description: **Connect AI assistants to business knowledge, records and defined workflows. Scope a practical text or voice assistant with clear limits and human handover.**

Primary intent: AI business assistant development; AI integration into existing systems.

### Hero

Eyebrow: **Conversation connected to useful work**

H1: **AI assistants connected to the systems your business uses.**

Lead: **Give people a simpler way to find information and start the right workflow. EFIops builds scoped assistants that can use authorised business data, ask for missing details and pass requests to a person when needed.**

CTA: **Explore an AI use case**

### Problems

H2: **The useful answer often lives behind another screen.**

**Someone needs a stock location, a job update, a procedure or the next person to contact. The information exists, but finding it means switching tools, asking colleagues or waiting for a reply.**

**An assistant can provide a more convenient starting point when its knowledge, permissions and actions are carefully defined.**

### Offer

H2: **Start with a task worth making easier.**

- **Business-data assistants.** Retrieve approved records through defined queries and APIs.
- **Knowledge assistants.** Help people find relevant procedures and documents, with references where the source supports them.
- **Request routing.** Collect the required details and send a request into the appropriate workflow or queue.
- **Text and voice interfaces.** Explore an interface inside an existing application, or a focused voice pilot.
- **Human review dashboards.** Show unresolved requests, conversation summaries and work that needs attention.

### Delivery

H2: **Clear access. Defined actions. A visible handover.**

**We agree the assistant's job, identify the sources it may use and define the actions it may request. Access checks and workflow rules stay in the application. Important actions can require review, and uncertain requests can be handed to a person with the relevant context.**

**A pilot is tested on representative questions, incomplete requests and cases outside its scope. That establishes what works before the assistant is expanded.**

### FAQ copy

**Can an assistant use our SQL data?** Yes, through a suitable integration. The application should expose authorised lookups rather than give a model unrestricted database access.

**Can it work inside an application we already have?** That is often the best starting point. We review the application's architecture and available APIs before choosing the integration.

**Can it make changes as well as answer questions?** Potentially. Each action needs a defined scope, permission checks and an appropriate confirmation or review step.

**Can you build an AI phone assistant?** A scoped phone or voice pilot is a possible project. Call handling, provider costs, consent requirements and human escalation need to be agreed before it becomes a live service.

Final CTA heading: **Which question or request keeps interrupting your team?**

Final CTA text: **Tell us what people ask, where the answer lives and what should happen after the conversation.**

Related services: Jev integration; System integrations; Custom business apps.

Evidence plan: PWMS voice/Jev integration is in progress. Describe the current milestone accurately. Phone handling, document retrieval and document extraction are future pilot ideas, not completed client implementations.

Visual: A clearly labelled example request next to the authorised source and a human handover queue. No real chat records. Never show a fictional success counter or pretend this public demo is connected to a live business.

## 9. Jev integration service page

URL: /services/jev-ai-integration/

SEO title: **Jev AI Integration for Business Workflows | EFIops**

Meta description: **Integrate TypeSafe's Jev into applications for intent routing and structured decisions. Define workflows, evaluate uncertain cases and keep action rules in your code.**

Primary intent: Jev integration; TypeSafe AI developer; structured AI workflow decisions.

### Hero

Eyebrow: **Structured decisions inside your software**

H1: **Put Jev to work inside your business workflows.**

Lead: **EFIops helps you explore where TypeSafe's Jev can support a defined decision: identifying an intent, routing a request or evaluating a candidate against clear criteria. The result connects to application logic you can inspect and test.**

CTA: **Discuss a Jev integration**

### Explain the role

H2: **Give each part of the system a clear job.**

**Jev is designed to return structured decisions from a supplied state and typed questions. In an assistant, a conversational model can handle dialogue while Jev helps identify a route. The application then checks permissions, retrieves the relevant information and decides which workflow may run.**

### Offer

H2: **Where a Jev integration may fit.**

- **Intent classification.** Distinguish a request for information from a request for action or human help.
- **Workflow routing.** Map a supported intent to a defined next step.
- **Candidate evaluation.** Explore scoring or selection against explicit criteria, with business rules applied separately.
- **Review handling.** Use uncertainty signals alongside validation and permission checks to decide when a person should look.
- **Application integration.** Connect the decision layer to an existing interface, API and monitoring view.

### Example

H2: **One request. A defined route.**

**A team member asks where to find material for a job. The system identifies the request, checks the user's access and runs an approved lookup. It presents the retrieved information or sends the unresolved request to a person.**

Caption: **Proposed workflow example. This is not a claim of a completed client deployment.**

### Delivery

H2: **A pilot built around your own examples.**

**We define the supported routes, assemble representative requests and test both clear and ambiguous cases. The pilot records what route was chosen, whether the result was useful and when human review was needed.**

**Thresholds are selected from evaluation results and the consequences of a mistake. A confidence value does not replace access control or establish that a decision is correct.**

### FAQ copy

**Do we need to replace our conversational AI?** Not necessarily. A structured decision layer can be evaluated alongside an existing conversational interface.

**Can Jev directly authorise an action?** Authorisation belongs in your application. A model output may suggest a route; the software must still check whether the user and workflow are allowed to take it.

**What happens when a request is ambiguous?** The application can ask for clarification, collect more context or hand the request to a person.

**Are you an official TypeSafe partner?** EFIops is an independent integration provider. No official partnership or endorsement is claimed.

Final CTA heading: **What decision would your software benefit from making?**

Final CTA text: **Bring a few real examples and the possible outcomes. We can evaluate whether Jev is a useful fit.**

Related services: AI assistants; System integrations; Custom business apps.

Evidence plan: The developing PWMS integration provides relevant experience. Candidate stock selection was explored in the Jev playground. Neither becomes a public deployment case study until its current scope, evaluation and publication permission are documented.

Visual: State → decision → application rules, with branches to approved lookup, clarification and human review. The paths are a deterministic illustration. Do not manufacture Jev probability distributions or benchmark claims.

Internal source note: Current TypeSafe documentation describes Choice, Score and Noul. Choice and Score expose uncertainty information; confidence is a derived statistic, not a permission token. Keep API details in technical articles, not in the main buyer journey. Re-check the provider's docs when implementing. [S13–S16]

## 10. Custom business applications service page

URL: /services/custom-business-apps/

SEO title: **Custom Business Apps & Internal Tools | EFIops**

Meta description: **Purpose-built planning tools, operational applications and portals. EFIops develops business software around your workflow, data and users.**

Primary intent: custom business application developer; internal tools development.

### Hero

Eyebrow: **Software that fits the work**

H1: **Custom business apps for the way your team works.**

Lead: **When the process has outgrown a spreadsheet and existing software doesn't fit, a focused application can bring the work into one useful place. EFIops builds planning tools, operational interfaces and portals around the people using them.**

CTA: **Discuss your application**

### Problems

H2: **You shouldn't need five workarounds to complete one job.**

**A plan lives in one spreadsheet. Actual results come from another system. Staff requirements are calculated elsewhere. People copy the same information between tools and lose track of which version is current.**

**A custom application can connect the relevant information and give each person a clear view of the work they need to do.**

### Offer

H2: **Build the tool your workflow is missing.**

- **Planning and scheduling tools.** Work with forecasts, capacity, staffing and operational requirements.
- **Internal portals.** Give teams a clearer way to enter, review and manage information.
- **Operational dashboards.** Combine current status with the actions people need to take.
- **Customer or supplier interfaces.** Scope a controlled portal for an agreed exchange of information.
- **Existing app improvements.** Add a missing feature, improve usability or connect an application to another system.

### Delivery

H2: **Prove the important workflow first.**

**We map the users, the information and the steps the application needs to support. A first version focuses on the core workflow, with access rules and data handling included in the design.**

**Testing uses realistic tasks rather than only checking whether the screens look right. The handover covers the application, its dependencies and options for maintaining it.**

### FAQ copy

**Can you work on an existing React application?** Yes. React and JavaScript are part of Karol's practical development experience. We inspect the codebase and current architecture before agreeing changes.

**Can the app use our existing database?** Often, through a suitable API or integration. Access, performance and the data's structure need to be considered.

**Should we build an app or use an existing product?** That is a discovery question. If a suitable existing product solves the problem well, custom development may not be necessary.

**Can we add AI later?** Potentially. A clear data model, permission system and API make it easier to evaluate a useful AI feature without rebuilding the whole application.

Final CTA heading: **What is your team working around?**

Final CTA text: **Show us the spreadsheets, screens or steps that make the job harder than it needs to be.**

Related services: Power BI; System integrations; AI assistants.

Evidence plan: PWMS planning and analytics. Document the features Karol implemented and the current use. Do not imply ownership of the employer's code or permission to sell it.

Visual: Three connected operational screens: forecast input, capacity view and review queue. Use recognisable, simple UI patterns and labelled example data.

## 11. Systems and data integration service page

URL: /services/system-integrations/

SEO title: **API, SQL & Business System Integration | EFIops**

Meta description: **Connect business applications, APIs and databases. EFIops builds focused integrations for data exchange, reporting and more dependable workflows.**

Primary intent: business system integration; API integration developer; SQL integration.

### Hero

Eyebrow: **Connect the tools. Improve the flow.**

H1: **Business system integrations that reduce the work between tools.**

Lead: **Make information easier to move, combine and use. EFIops connects suitable applications, APIs and databases so your team spends less effort transferring the same details by hand.**

CTA: **Discuss your systems**

### Problems

H2: **The gap between two systems becomes somebody's job.**

**Orders arrive in one place. Reporting needs them somewhere else. Machine exports have a different format. Another spreadsheet joins it all together.**

**We examine the handoff: what data is needed, which system is responsible for it and what should happen when a transfer is delayed or incomplete.**

### Offer

H2: **Useful connections, with clear ownership.**

- **API integrations.** Exchange suitable information between applications and supported services.
- **Database connections.** Provide controlled access to the records a report or application needs.
- **Data preparation pipelines.** Consolidate exports, normalise formats and prepare records for analysis.
- **Event and workflow connections.** Connect an agreed change in one system to the next step in another.
- **Integration repairs.** Investigate mismatched records, failed transfers and repetitive manual fixes.

### Delivery

H2: **Build for the transfer and the exception.**

**We agree the source of truth, the mapping and the direction of each connection. The implementation includes appropriate validation, error handling and a way to identify failed work.**

**Testing covers missing values, repeated requests, format changes and interrupted transfers. The handover explains what is connected and how the integration is monitored.**

### FAQ copy

**Do both systems need an API?** An API is often useful, but some projects work with database access or structured exports. We review the options and their limitations first.

**Can you combine machine exports for reporting?** Yes. Industrial data processing is part of Karol's experience. The source format and required output define the scope.

**Will this replace our existing systems?** The first question is whether they can be connected effectively. A focused integration may be enough to improve the handoff.

**What happens if a provider changes its API?** Integrations need maintenance. Monitoring and support can be scoped so failures are visible and changes can be addressed.

Final CTA heading: **Where are people moving the same information twice?**

Final CTA text: **Tell us which systems are involved, which records need to move and what currently happens between them.**

Related services: Power Automate; Custom business apps; Power BI.

Evidence plan: Node.js machine-data processing and CW/MD/Yamato integration; PWMS API/SQL connections. Show the transformation with invented records, not real production identifiers.

Visual: A clean source-to-output composition with a visible mapping table and an exception tray. Show a specific connection, rather than decorative lines joining twenty technology logos.

## 12. Web design and development service page

URL: /services/web-design-development/

SEO title: **Web Design in Maidstone & Kent | EFIops**

Meta description: **Distinctive business websites with clear content, thoughtful design and fast performance. Maidstone-based web development for businesses in Kent and across the UK.**

Primary intent: web design Maidstone; business website development.

### Hero

Eyebrow: **A website that does your business justice**

H1: **Web design in Maidstone, built around your business.**

Lead: **Give people a clearer picture of what you do and a better reason to choose you. EFIops combines content, design and development to create business websites that feel distinctive and work well.**

CTA: **Discuss your website**

### Problems

H2: **Your business has moved forward. Has your website?**

**An outdated layout, unclear offer or difficult mobile experience can make a good business harder to understand. A rebuild is a chance to organise the message, improve the experience and create a stronger foundation for search and enquiries.**

### Offer

H2: **A complete website, with the important details considered.**

- **Structure and content.** Give each page a clear purpose and help visitors find the right information.
- **Distinctive design.** Create a considered visual identity and layouts that fit the business.
- **Responsive development.** Build an experience that works across phones, tablets and desktop screens.
- **Technical foundations.** Include sensible metadata, crawlable content, accessibility and performance work.
- **Useful connections.** Scope forms, booking tools, CRM connections or other appropriate integrations.

### Delivery

H2: **Design and development should agree on the same goal.**

**We start with the offer, the audience and the actions people should be able to take. The page structure and copy shape the design. The build is then checked for content, usability, links, forms and performance.**

**For a replacement website, existing URLs and valuable content are reviewed before launch so the transition can be planned properly.**

### FAQ copy

**Do you work only with Maidstone businesses?** EFIops is based in Maidstone and works with businesses across the UK. Remote collaboration is available where it fits the project.

**Can you rebuild our current website?** Yes. We review the existing site, its content and its technical setup before recommending the approach.

**Can you help with the words as well as the design?** Content structure and copy can be included in the scope, with your business facts and claims reviewed before publication.

**Will the new website rank immediately?** A well-built site provides a useful foundation. Search visibility also depends on content, competition, authority and ongoing work; a rebuild alone does not establish a ranking result.

Final CTA heading: **What should people understand when they visit your website?**

Final CTA text: **Tell us about the business, the current site and what the next version needs to achieve.**

Related services: Website optimisation; SEO; System integrations.

Evidence plan: Existing EFIops client websites, after identifying their URLs, scope and publication permission. Cleaning Maidstone can provide an owned-business example, accurately identified as such. The EFIops rebuild itself can later become an independently measured technical case.

Visual: An original website composition shown across desktop and mobile frames. Use real approved work or an explicitly labelled design example. Avoid stock photos of hands on laptops.

## 13. Website optimisation service page

URL: /services/website-optimisation/

SEO title: **Website Optimisation: Speed, UX & Conversion | EFIops**

Meta description: **Improve an existing website's performance, usability and enquiry journey. EFIops identifies practical changes and checks their impact against a baseline.**

Primary intent: website optimisation services; website speed and conversion improvements.

### Hero

Eyebrow: **Make more of the website you have**

H1: **A faster, clearer website with an easier next step.**

Lead: **Improve the parts of your website that create friction. EFIops reviews performance, usability, content and conversion paths, then implements focused changes based on what the site needs.**

CTA: **Discuss website improvements**

### Problems

H2: **A useful improvement may be smaller than a rebuild.**

**Visitors may struggle to read the page on mobile, understand the offer, find the contact button or finish the form. The site may load more slowly than it should.**

**We look for the specific problem before deciding whether to improve the existing site or recommend a larger change.**

### Offer

H2: **Find the friction. Improve the experience.**

- **Performance work.** Investigate heavy assets, unnecessary scripts and other causes of slow loading or interaction.
- **Mobile usability.** Improve readability, navigation, controls and forms on smaller screens.
- **Conversion paths.** Review the steps between arriving, understanding the offer and making an enquiry.
- **Content clarity.** Improve headings, service explanations and calls to action.
- **Measurement.** Establish a baseline and choose meaningful checks for the change.

### Delivery

H2: **Measure the starting point, then improve it.**

**We review the current experience and any available analytics, agree the priority changes and implement them in a reviewable version. Technical checks show whether performance and usability have improved.**

**When traffic and tracking support it, enquiries or other conversions can be compared over a suitable period. Small samples and changes in traffic quality are considered when interpreting the result.**

### FAQ copy

**Do we need a new website?** Not always. The review should establish whether focused improvements are practical or whether the current platform is limiting the work.

**Can you guarantee more enquiries?** No. We can improve the experience and measure available outcomes, but traffic quality, the offer and customer demand also affect enquiries.

**Is website optimisation the same as SEO?** They overlap, but this service focuses on the visitor's experience and the site's performance. SEO work also considers search discovery, page intent and content relevance.

**Can you work with our existing platform?** We first check access, the platform and any limitations. The scope depends on what can be changed safely and effectively.

Final CTA heading: **Where does your website make things harder?**

Final CTA text: **Share the URL and the part of the experience you want to improve.**

Related services: SEO; Web design and development; System integrations.

Evidence plan: Run a before/after technical and usability project on EFIops or Cleaning Maidstone. Save identical-condition performance runs, a dated change log and enquiry data where available. A Lighthouse score is a technical measurement, not evidence of higher sales.

Visual: A side-by-side mobile journey or annotated performance improvement. All displayed measurements must come from the documented project or be labelled as an example without implying actual results.

## 14. SEO service page

URL: /services/seo/

SEO title: **SEO Services in Maidstone & Kent | EFIops**

Meta description: **Technical SEO, clearer service pages and practical local-search improvements. EFIops helps businesses in Maidstone, Kent and across the UK build stronger search foundations.**

Primary intent: SEO services Maidstone; technical SEO consultant.

### Hero

Eyebrow: **Make the right pages easier to find**

H1: **SEO built around what your customers need to know.**

Lead: **Help people find and understand the services your business offers. EFIops combines technical improvements, useful page content and local relevance with measurement that shows how search visibility develops.**

CTA: **Discuss your search visibility**

### Problems

H2: **A good service needs a page that explains it properly.**

**Your website may describe several services on one short page, miss the questions customers ask or make important content difficult to find. Technical issues may also prevent the right version of a page from being discovered and understood.**

**We review the site and the available search data before agreeing the next useful improvement.**

### Offer

H2: **A stronger foundation for search.**

- **Technical review.** Examine crawlability, indexing signals, page structure and important errors.
- **Service-page strategy.** Give different customer needs clear, useful pages without duplicating the same offer.
- **On-page improvements.** Refine titles, descriptions, headings, internal links and relevant content.
- **Local relevance.** Improve accurate business information and the pages supporting local customers.
- **Search measurement.** Use available Search Console data to review visibility, queries and page performance.

### Delivery

H2: **Start with evidence. Build useful pages. Keep learning.**

**We look at the current site, its search performance and the terms people use to describe the problem. The first work addresses technical barriers and important gaps in the service content.**

**As data becomes available, we review which pages attract relevant searches and which questions still need a better answer. Original case studies and practical articles can then strengthen the site.**

### FAQ copy

**Can you help a Maidstone business appear in local searches?** We can improve the website's local relevance and review accurate business information. Results depend on the market and the site's current position.

**How long does SEO take?** It varies with the starting point, the changes and the competition. We review progress against agreed measures rather than promising a fixed ranking date.

**Do we need a separate page for every town?** Usually a page needs a distinct purpose and useful content. Repeating the same service page with different place names is not a sound content plan.

**Do you guarantee first place on Google?** No. We explain the work, measure what can be measured and avoid ranking guarantees.

Final CTA heading: **Which services are difficult for customers to find?**

Final CTA text: **Share your website, the services you want to grow and any search data you already have.**

Related services: Web design and development; Website optimisation.

Evidence plan: Recover original EFIops SEO project records before publishing any historic ranking improvement. Alternatively, document the EFIops rebuild's indexing and search development from a dated baseline. Separate branded from non-branded traffic.

Visual: A simple map of a service page, supporting article and case study, with visible internal links. An example search-result preview is labelled “Preview”; Google may display different titles and descriptions.

## 15. Computer vision service page

URL: /services/computer-vision/

SEO title: **Computer Vision Prototypes & Edge AI | EFIops**

Meta description: **Explore camera-based measurement and inspection with a focused computer vision prototype. Python, image processing and edge-device integration around a defined use case.**

Primary intent: computer vision prototype developer; edge AI proof of concept.

### Hero

Eyebrow: **A focused test of what a camera can help you see**

H1: **Computer vision prototypes for practical inspection and measurement.**

Lead: **Explore whether image processing or AI can support a defined visual task. EFIops develops scoped prototypes that combine camera input, analysis and useful output for your workflow.**

CTA: **Discuss a vision prototype**

### Problems

H2: **Start with the observation you need to make.**

**A visual task might involve measuring an object, identifying a defect or turning images into records that can be reviewed. The right approach depends on the material, lighting, camera position and the consequences of a wrong result.**

**A prototype establishes what is practical before a larger deployment is considered.**

### Offer

H2: **From sample images to a useful feasibility test.**

- **Visual measurement.** Explore repeatable measurements under defined conditions.
- **Defect identification.** Test image processing or a suitable model against labelled examples.
- **Edge processing.** Evaluate local analysis on an appropriate device, including Raspberry Pi where it fits.
- **Workflow output.** Connect the result to a review screen, record or reporting process.
- **Evaluation.** Record successful cases, difficult conditions and the limitations of the prototype.

### Delivery

H2: **Test the conditions, not only the demonstration.**

**We define the task, gather representative images and establish a reference for checking results. The prototype is evaluated against variation in the conditions that matter to the use case.**

**The next step depends on that evidence. Production reliability, maintenance and any sector-specific validation need their own scope.**

### FAQ copy

**Have you worked on a real production-related vision project?** Karol's experience includes a Python and Raspberry Pi application for blueberry size analysis and defect identification. Publication of project materials depends on permission and a clear description of its scope.

**Can a prototype be deployed straight into production?** A prototype establishes feasibility. A live deployment may need additional engineering, evaluation and operational checks.

**Will it replace a quality inspector?** That is not a default assumption. A scoped system may support measurement or review; its appropriate role follows from evaluation and the process requirements.

**Can it connect to reporting or another application?** A suitable output can be designed as part of the prototype so the result is useful beyond the camera view.

Final CTA heading: **What do you need the camera to recognise or measure?**

Final CTA text: **Describe the material, the environment and what the result would be used for.**

Related services: System integrations; Power BI; Custom business apps.

Evidence plan: The blueberry vision project in the resume. Confirm the current scope, measurement method and model evaluation. Public images should be approved or newly created using suitable owned materials. Do not claim accuracy, throughput, food-safety certification or autonomous acceptance decisions.

Visual: An approved image or original technical illustration with labelled measurement overlays. Decorative boxes must not be presented as a model's actual predictions.

## 16. Services index: proposed copy

SEO title: **Business Automation, Data & Website Services | EFIops**

Meta description: **Explore EFIops services: Power BI, Power Automate, AI and Jev integration, custom apps, system connections, web design, optimisation, SEO and computer vision.**

H1: **Find the right starting point.**

Lead: **A business problem rarely arrives with a technology label. Start with what needs to improve, then explore the service that fits.**

Group heading: **Make information useful.**

Group text: **Bring reporting into focus or give your team a better tool for planning and managing work.**

Links: Power BI; Custom business apps.

Group heading: **Keep work moving.**

Group text: **Automate a repeated process or connect the systems involved in getting the job done.**

Links: Power Automate; System integrations.

Group heading: **Add AI where it earns its place.**

Group text: **Explore a connected assistant, a structured decision layer or a focused visual prototype.**

Links: AI assistants; Jev integration; Computer vision.

Group heading: **Build a stronger online presence.**

Group text: **Create a distinctive website, improve the one you have or make important services easier to find in search.**

Links: Web design; Website optimisation; SEO.

Use the ten service summaries from the homepage as the card copy. Do not repeat the whole contents of the service pages.

Closing heading: **Not sure which service you need?**

Closing text: **Describe the problem in your own words. We can work out whether the first step is a report, a workflow, a website or something else.**

CTA: **Talk through your project**

## 17. How it works: proposed copy

SEO title: **How EFIops Projects Work | Scope, Build & Support**

Meta description: **See how an EFIops project moves from understanding the problem to an agreed scope, tested implementation and useful handover.**

H1: **A clear process, from the first conversation to useful work.**

Lead: **The aim is to solve a defined problem with a solution your business can understand, use and maintain.**

H2: **1. Understand the current process.**

**We discuss the work, the people involved and the tools you use. The useful starting point is the place where information is missing, a step is repeated or a customer experience becomes difficult.**

H2: **2. Agree the first result.**

**We define what the project will deliver, what it depends on and how the result will be checked. The scope explains what is included, the expected costs and any third-party services or access required.**

H2: **3. Build in reviewable steps.**

**You see the important parts while they are being developed. Feedback is considered against the agreed purpose so the project stays focused.**

H2: **4. Test the work it needs to support.**

**A website is checked as a visitor journey. A report is checked against its records and definitions. A workflow is checked against normal runs and exceptions. An AI pilot is checked against representative requests and clear limits.**

H2: **5. Hand over and plan the next step.**

**The handover explains how the solution works, its dependencies and what needs maintaining. Monitoring, support and further improvements can be agreed where they are useful.**

H2: **Start with the improvement that matters.**

**You do not need a complete technology overhaul to begin. A focused first project can establish value and give the next decision a better foundation.**

FAQ:

**What should I bring to the first conversation?** A description of the problem, the tools involved and an example of the work if you can share one.

**How is a project priced?** The price follows from the agreed scope. Implementation, third-party costs and any continuing support should be clear before work starts.

**Can we start with a small pilot?** Yes, where a pilot is an appropriate way to establish feasibility and useful results.

**What happens to the existing tools?** We review what is worth keeping and where a connection or focused improvement can help.

**Who will I work with?** You work directly with Karol, who understands the process and carries out the development.

CTA: **Talk through your project**

## 18. About: proposed copy

SEO title: **About EFIops | Karol Songin, Maidstone**

Meta description: **Meet Karol Songin: operations and data analyst, developer and the person behind EFIops. Practical experience across reporting, automation, websites and AI.**

H1: **Understanding the business is part of building the technology.**

Lead: **I'm Karol Songin, the person behind EFIops. I'm based in Maidstone, Kent, and combine operational analysis with hands-on software development.**

H2: **My work starts with how things happen.**

**In operational work, a useful report needs more than attractive charts. A workflow needs more than a successful test run. An application needs to fit the people using it.**

**That experience shapes how I approach EFIops projects: understand the process, identify the difficult part and build the improvement that will be useful in practice.**

H2: **From production data to business websites.**

**My experience includes planning and analytics applications, Power BI reports, SQL investigations, workflow and machine-data automation, business websites and practical AI projects.**

**I've also worked on camera-based fruit measurement and defect identification, and I'm developing voice and structured AI integration inside an operational application.**

**EFIops brings those skills together for businesses that need clearer information, connected systems or a stronger online presence.**

H2: **A direct way of working.**

**You speak with the person doing the work. I explain the options in plain language, define the scope and keep the result connected to the problem you wanted to solve.**

H2: **Based in Maidstone. Built for collaboration.**

**EFIops works with businesses in Kent and across the UK. Projects can be scoped for remote collaboration, with the approach agreed around the work.**

CTA: **Tell me about your project**

Portrait: use a real photo supplied or selected by Karol. If none is available, use a clean type-led introduction. No generated headshot, invented biography dates, certifications, employer endorsement or unnamed “expert team”.

## 19. Contact: proposed copy and behaviour

SEO title: **Contact EFIops | Discuss Your Website or Business System**

Meta description: **Talk to EFIops about a website, Power BI dashboard, automation, AI integration or custom business application. Based in Maidstone, serving UK businesses.**

H1: **Tell us what needs to work better.**

Lead: **You don't need a finished specification. A clear description of the problem is a good place to start.**

Form labels:

- **Your name** — required.
- **Email address** — required.
- **Business or organisation** — optional.
- **What would you like help with?** — optional service selector, including “Not sure yet”.
- **Website or relevant link** — optional.
- **What is happening now, and what would you like to improve?** — required.

Message placeholder: **For example: we rebuild the same report every week, and we'd like a clearer view of staffing and capacity.**

Supporting copy: **Please leave out passwords, personal records and other sensitive information. We can agree a suitable way to share project materials later.**

Privacy link text: **Read how EFIops handles your enquiry.**

Button: **Send your enquiry**

Pending: **Sending your enquiry…**

Confirmed server success: **Thank you. Your enquiry has been received.**

Error: **Your enquiry could not be sent. Please try again or use the email link below.**

Do not show success before the server accepts the enquiry. Preserve the typed message on an error.

Secondary contact: **Prefer email? Write to karol@efiops.com.**

The email is established in prior context; Karol must confirm it remains the monitored public destination before launch. Do not add an unverified phone number, office address or booking link.

What happens next:

**We'll review the problem you've described and discuss whether EFIops is a useful fit. If the project moves forward, the next step is a clear scope and an agreed approach.**

Service page CTAs may preselect the service using a short allowlisted query parameter. Do not put enquiry text or personal information in the URL.

Thank-you page:

H1: **Thanks for getting in touch.**

Body: **Your enquiry has been received. In the meantime, you can explore the services or read more about how projects work.**

Links: **Explore the services** and **How projects work**.

Only route here after actual submission success. A direct visit must not manufacture a lead event.

## 20. Privacy and cookies: configuration-dependent copy

The marketing copy is ready for design and implementation. Legal notices depend on facts not supplied here: the legal controller identity, final contact destination, retention practice, host, form provider and tracking setup. Prepare the pages in staging and complete them against the actual configuration before production release. Do not invent those facts or present a generic notice as a verified compliance document.

### Privacy draft

SEO title: **Privacy Notice | EFIops**

H1: **How EFIops handles your information.**

**This notice explains how [CONFIRMED CONTROLLER NAME], trading as EFIops, handles personal information collected through this website. You can contact us at [CONFIRMED PRIVACY CONTACT].**

H2: **Enquiries**

**When you contact us, we receive the details you submit, such as your name, email address, organisation and message. We use them to understand your enquiry, reply and discuss a possible project.**

H2: **How the website works**

**The website and its supporting services process the technical information needed to deliver pages, protect the service and handle enquiries. [DESCRIBE THE ACTUAL HOST, FORM PROCESSING AND OPTIONAL ANALYTICS IN PLAIN LANGUAGE.]**

H2: **Why information is used**

**[STATE THE ACTUAL PURPOSES AND APPROPRIATE LEGAL BASES AFTER REVIEW. DO NOT ASSUME CONSENT IS THE BASIS FOR EVERY ENQUIRY.]**

H2: **Service providers**

**[IDENTIFY THE PROVIDER CATEGORIES AND MATERIAL PROCESSING/TRANSFER ARRANGEMENTS THAT MATCH THE LIVE CONFIGURATION.]**

H2: **Keeping information**

**[STATE THE ACTUAL RETENTION PERIOD OR THE CRITERIA USED TO DECIDE IT.]**

H2: **Your rights**

**You may have rights to access, correct, delete or restrict the use of your personal information, depending on the circumstances. Contact [CONFIRMED PRIVACY CONTACT] to ask about your information. You can also raise a concern with the Information Commissioner's Office.**

H2: **Changes**

**This notice was last reviewed on [ACTUAL REVIEW DATE]. We update it when our use of information changes.**

### Cookies draft

SEO title: **Cookies & Website Storage | EFIops**

H1: **Cookies and similar technologies.**

**[DESCRIBE THE COOKIES, LOCAL STORAGE AND OTHER TECHNOLOGIES THE LIVE WEBSITE ACTUALLY USES.]**

**[IF OPTIONAL SERVICES ARE ENABLED: EXPLAIN THEIR PURPOSE, PROVIDERS, DURATION AND AVAILABLE CONTROLS.]**

Default implementation: optional analytics, advertising pixels, booking widgets and external media embeds are disabled. Static self-hosted fonts and graphics require no optional tracking. If optional tracking is enabled, use a reviewed consent mechanism and accurate notice. Do not label an embedded third-party form “cookie-free” without testing it.

Cookie controls, if needed: **Accept optional cookies** / **Reject optional cookies** / **Choose settings**. Make choices equally usable. Footer link: **Cookie settings**. Do not show a meaningless banner when no relevant optional technology exists.

All bracketed notices are production release blockers. They are not visible placeholder copy for a live website.

## 21. Case studies: evidence plan and page system

### Page template

Each case study needs:

1. A specific problem and the project context.
2. Karol's exact role and the implementation scope.
3. The starting workflow or measurement.
4. The solution, including the important implementation choices.
5. Evidence that it behaves as described.
6. Measured outcomes, qualitative observations or an explicit statement that a result has not yet been measured.
7. Limitations, current project status and the next step.
8. Approved images, captions and relevant service links.

Use “Internal project”, “Owned-business project”, “Client project” or “Demonstration” as the project type. Separately use “Completed”, “In progress”, “Pilot” or “Concept” as status. A public approved in-progress project may explain the current milestone; it must not be presented as a completed case.

No client result is inferred from a demo. No “hours saved” figure is calculated from guessed volume. Never invent a testimonial, client count, revenue improvement, approval status or before/after metric.

### Work index copy, when release conditions are met

SEO title: **Business Systems & Website Projects | EFIops**

Meta description: **Explore documented EFIops and Karol Songin projects across reporting, automation, applications and websites, with clear scope, evidence and project status.**

H1: **The problem, the build and the evidence.**

Lead: **Useful project stories explain what needed to change, what was built and how the result was checked. Explore the work by service and see the status of each project.**

Filter labels: **All work** / **Data and reporting** / **Automation** / **Applications and AI** / **Websites**.

CTA heading: **Have a similar problem?**

CTA text: **Tell us how the work happens in your business, and we can discuss a useful next step.**

### First case-study candidates

| Service | Existing candidate | Evidence to collect | New project if needed |
| --- | --- | --- | --- |
| Power BI | Loma versus Yamato reporting | Report scope, measure definitions, approved visuals, reconciliation examples | Synthetic operational reporting model with documented calculations |
| Power Automate | Forecast-change alert; appraisal reminders | Current flow, repeat-run tests, date boundaries, anonymised outcome records | Cleaning-business follow-up workflow with activity tracking |
| AI assistants | Developing PWMS voice assistant | Current working intents, lookup results, unresolved cases, clear status | Assistant for a small owned knowledge base with source references |
| Jev integration | PWMS integration; playground stock-choice exploration | Question definitions, representative cases, routing evaluation, human-review behaviour | Fictional stock-request routing pilot with an evaluation set |
| Custom apps | PWMS planning and analytics | Karol's role, approved feature scope, representative task walkthrough | Cleaning operations portal for enquiry status and recurring work |
| System integrations | Machine-data processing and Yamato adaptation | Input/output samples, mappings, duplicate and failure tests | API-to-report pipeline using a safe owned or public dataset |
| Web design | Existing EFIops client sites; Cleaning Maidstone | URLs, exact role, dated screenshots and permission | EFIops rebuild with a documented content and design process |
| Website optimisation | Existing web improvement work; retrieve evidence | Comparable performance tests, usability changes, conversion data where available | Owned-site performance and enquiry-journey improvement |
| SEO | Historic EFIops local-search work in resume | Original query records, dates, geography, scope and client permission | EFIops service-page rollout measured in Search Console |
| Computer vision | Blueberry vision application | Approved setup, sample images, reference measurements and limitations | Controlled object-measurement demo with documented error |

Suggested future slugs: loma-yamato-reporting; forecast-change-alerts; appraisal-reminder-workflow; pwms-planning-platform; ai-stock-request-pilot; machine-data-integration; cleaning-maidstone-website; efiops-website-rebuild; local-seo-project; visual-measurement-prototype.

These are draft filenames, not authorised published URLs. None should be generated as an indexed case study solely because it is listed here.

### Measuring results honestly

For reporting: reconciliation errors, preparation steps, refresh behaviour and answers to agreed business questions.

For workflows: qualifying events, successful runs, duplicates, failures and manual interventions.

For AI/Jev: correct routes, wrong routes, clarification rate, unresolved requests and performance on representative cases. Separate ordinary and difficult inputs.

For websites: comparable performance measurements, verified form events, usability findings and enquiry outcomes over a defined period.

For SEO: indexed pages, relevant impressions, non-branded clicks and qualified organic enquiries, with dates and context.

For vision: reference measurement errors, missed/incorrect identifications and sensitivity to conditions.

Record the baseline, measurement method, sample size and observation period. Publish counts and context together; a percentage without a denominator can mislead.

## 22. Further offers that fit Karol's skills

These are project possibilities within the ten service families. Do not create a separate landing page for each before there is a clear buyer intent, distinct content and delivery evidence.

| Opportunity | Service home | First useful scope |
| --- | --- | --- |
| Voice stock or job-status assistant | AI assistants + Jev | One read-only lookup and a human handover queue |
| Missed-call / phone enquiry assistant | AI assistants | One business's intake process; review actual telephony and privacy requirements |
| Meeting assistant and application navigation | AI assistants + custom apps | User-controlled navigation and draft notes for a defined meeting |
| Document / invoice extraction | AI assistants + integration | One document type, validated fields and a review step |
| Internal document search | AI assistants | One approved knowledge collection, access checks and source references |
| Management brief and exception alerts | Power BI + automation | One daily or weekly view with clear triggers |
| Forecast and capacity planning | Custom apps + Power BI | One team's volumes, capacity and staffing assumptions |
| Machine-data consolidation | Integrations | One export family and an agreed reporting output |
| Forms-to-CRM and enquiry follow-up | Integrations + Power Automate | One lead source, one pipeline and tracked status |
| Customer/supplier portal | Custom apps | One authorised exchange of information |
| Local business website + enquiry pipeline | Web design + integrations | A clear service site and reliable enquiry handling |
| Visual inspection support | Computer vision | One visual task evaluated under controlled conditions |

Marketing creative, social content and paid advertising remain possible supporting work, given Karol's Cleaning Maidstone experience. They should not dilute the launch navigation. Reintroduce a dedicated offer only after deciding the delivery scope and documenting evidence.

## 23. Visual design specification

### Direction: the existing EFIops brand, developed further

Karol explicitly requires the current efiops.com colours, visual style and logo to remain. This is a brand-preserving redesign. The new site should look recognisably like EFIops, with improved composition, richer content, clearer navigation and more carefully developed 3D elements.

Retain the existing blue, pale-blue, navy, white and black identity; bold Lato headings; and rounded, softly modelled 3D illustration language. The beauty should come from composition, spacing, responsive typography and craftsmanship within that identity.

### Design tokens

| Token | Value | Use |
| --- | --- | --- |
| Bright blue | #188BF6 / rgb(24, 139, 246) | Existing accent; illustration details and appropriate highlights |
| Pale blue | #CCE2FF / rgb(204, 226, 255) | Existing main section background |
| Deep navy | #082F49 | Existing footer identity; contrast-rich text and selected dark sections |
| White | #FFFFFF | Existing header, panels and light content surfaces |
| Black | #000000 | Existing main heading text |
| Body grey | #4A4A4A | Existing body text token |
| Link blue | #334862 | Existing link token |
| Theme blue | #446084 | Existing theme primary/footer-section token |
| Light grey | #F1F1F1 | Existing supporting header surface |
| Heading font | Lato, self-hosted, bold | Preserve current type identity |
| Body font | Lato, self-hosted | Preserve current type identity |

The colour values above were extracted from current public site styles on 4 October 2026. They are observations of the current website, not a separate formal brand manual. Distinguish visible page colours from theme defaults when applying them.

Use the actual existing logo without redrawing, recolouring, changing lettering or removing its proportions. The supplied build pack includes assets/efiops-logo-current.png, downloaded from https://efiops.com/wp-content/uploads/2024/02/efiops-logo-544-x-180-px.png. Its native dimensions are 544 × 180px. Preserve transparency and size it proportionately. Put it on a light surface where it remains legible.

The public site uses Lato for body and headings and an uppercase main-heading treatment. Preserve the recognisable typography while improving sizing, line length and mobile wrapping. The theme also declares Dancing Script; do not introduce it into new areas simply because a declaration exists.

Verify contrast for actual sizes and states. Bright blue on white is not automatically suitable for small text. Use the existing navy/black for essential reading and navy/white for contrast-rich controls; keep bright blue as the recognisable accent.

### Layout

- Main content width: approximately 1,240px, centred.
- Prose width: approximately 65–72 characters, with comfortable line height.
- Desktop horizontal padding: 32–48px; mobile: 20–24px.
- Section spacing: 88–120px desktop; 56–72px mobile.
- Body text: generally 18px desktop and 16–18px mobile.
- Hero heading: responsive 44–88px; service headings 40–64px.
- Use a controlled 8px spacing rhythm and consistent radii around 12–20px.
- Thin separators, considered alignments and restrained shadows give structure.
- Service pages need a strong hero and readable explanation, not the visual density of the homepage.

### Homepage first screen

Use a light/pale-blue first screen and the existing logo on a white header, consistent with the current EFIops identity. At desktop widths, use an asymmetric composition: the left 52–56% holds the eyebrow, H1, lead, buttons and location. The right holds the signature system visual. Keep the headline readable and the primary action above the fold on a typical laptop.

At mobile widths, put text and action first, then a simplified visual. The illustration must not push the service explanation far below the first screen or create horizontal scrolling.

### Signature 3D visual

Create an original “connected work” composition using layered HTML panels, SVG and CSS perspective. Follow the current rounded blue-and-white 3D illustration language, with controlled bevels, depth and soft shadows. The main panel shows a fictional operational view. Two smaller panels represent a request and the next action. Fine connecting lines and controlled depth imply the work moving through the system.

Make the content concrete:

- Request: **Where is the material for this job?**
- Route: **Stock information**
- Source: **Approved lookup**
- Outcome: **Information found** or **Needs review**
- Small, readable caption: **Illustrative example**

Use no fake revenue, client logos, exaggerated success rate, live indicator or customer identity. The scene is an illustrative diagram, not evidence of an installed product.

Build the composition in code. A heavy WebGL scene, full-screen video or large externally hosted 3D embed is unnecessary. A static fallback must look complete.

### Motion

One short entrance and small interaction feedback are enough. Panels can reveal in sequence when the visitor chooses a scenario. Keep idle motion subtle, stop it offscreen and offer a pause control for any animation that continues.

Support reduced motion. All information is present without animation. Do not hide body copy at opacity zero waiting for a scroll library. Native scrolling stays native.

### Homepage composition

1. Pale-blue/light hero with the current logo and signature system visual.
2. White, editorial three-column problem section.
3. Broad outcome section with three distinct illustrations.
4. Grouped service directory using text, dividers and a few strong cards.
5. Interactive workflow example on a pale-blue or existing-navy panel.
6. Karol's introduction with a real portrait or type-led treatment.
7. Four-step process.
8. A focused final contact invitation.

Introduce visual variety with editorial rows, a horizontal process and a large illustrated panel. Do not render every section as the same three-card grid.

### Service page composition

1. Breadcrumbs and a distinctive hero illustration.
2. Problem explanation.
3. Deliverables or suitable tasks.
4. How the engagement works.
5. Approved project evidence, when available.
6. Page-specific FAQ.
7. Related services and the focused CTA.

Use the exact service visuals described earlier. A repeated template provides consistency; the diagram, copy and evidence provide specificity.

### Component behaviour

Buttons have clear hover, focus and pending states. Whole-card links have one clear accessible name. Use real links for navigation and buttons for actions.

FAQ uses accessible disclosure elements; answers are in the HTML. Do not add FAQ schema for promised search-result features.

The header is compact and may be sticky if it does not obscure content. Menus support keyboard, focus, Escape and touch. A mobile menu must not prevent access to page content when scripting fails.

The footer includes the short positioning line, service links, About, Contact, legal links and a copyright year. Show only confirmed contact details and social profiles.

### Asset plan

- Real Karol portrait: optional until supplied.
- Existing EFIops logo: actual asset included; preserve it exactly.
- Original SVG diagrams: create for every service.
- Approved screenshots: only after evidence/publication checks.
- Self-hosted, licensed WOFF2 fonts: use a small number of files.
- Original social-preview graphics: typography plus the system visual, 1,200 × 630px.

Keep explanatory diagrams vector-based and their important labels in readable HTML where practical. Use an AI image tool only if a later request needs an original raster illustration; generated images must not stand in for real project evidence.

## 24. Recommended technical stack

### Decision

Use **Astro + TypeScript + Tailwind CSS, with React only for useful interactive islands**.

This is primarily a content and lead-generation website. Astro renders the commercial content as HTML, while selected interactive components can use React. This fits a visual marketing site and Karol's JavaScript experience. It does not create a special ranking advantage by itself. [S17]

| Layer | Recommendation | Reason |
| --- | --- | --- |
| Rendering | Astro static output | Fast, portable HTML pages |
| Language | TypeScript | Clear component and content contracts |
| Styling | Tailwind CSS through current supported Vite integration, plus custom CSS | Consistent tokens and precise layouts |
| Content | Validated local content collections; Markdown/MDX and structured service data | Easy editing and later case studies |
| Interactivity | Native HTML/JS first; small React islands where justified | Keep client work proportionate |
| Diagrams / 3D | SVG, HTML, CSS perspective and transforms | Original, light and inspectable |
| Icons | Small consistent SVG set | Accessible, economical assets |
| Contact | Existing verified lead receiver through a secure integration | Preserve a working business workflow |
| Default hosting option | Netlify static hosting with a separate function if needed | Straightforward preview and backend support |
| Measurement | Search Console; optional analytics configured separately | SEO baseline and verified conversion tracking |
| Tests | Build/type checks, route/content validation, focused browser checks | Verify actual release behaviour |

Inspect the existing repository and hosting before implementation. Preserve a suitable established setup rather than replace it mechanically. If this is a fresh repository, use the stack above. Install stable mutually compatible versions, check current official docs and commit a lockfile. Do not hard-code recalled package versions or use an outdated Astro/Tailwind integration. [S18–S20]

No database, login system, customer dashboard or live AI API is required for this marketing site. Those are services being described, not features to install in its public frontend.

### Suggested repository layout

~~~text
src/
  components/        navigation, buttons, disclosures, service visuals
  layouts/           base, service, case study, article
  pages/             static pages and collection-backed routes
  content/
    services/        ten reviewed service entries
    case-studies/    evidence-gated entries
    insights/        reviewed article entries
  content.config.ts validated collection definitions
  config/            identity, navigation, release and integration settings
  styles/            tokens, typography and visual treatments
public/
  fonts/             licensed self-hosted fonts
  images/            approved images and original social graphics
netlify/functions/   contact relay only if this hosting route is selected
docs/
  launch-checklist.md
  redirects.csv
  evidence-register.md
  seo-baseline.md
  owner-decisions.md
  maintenance.md
~~~

### Content contracts

Services: slug, title, metaDescription, h1, eyebrow, lead, sections, FAQs, CTA, relatedServices, visualKey, primaryIntent, publicationState.

Case studies: slug, title, description, projectType, projectStatus, publicationState, permissionConfirmed, evidenceReviewed, role, dates, relatedServices, images, metrics and internalEvidenceNotes.

Insights: slug, title, description, author, publishedDate, substantiveUpdatedDate, relatedServices, publicationState and sources.

The build must filter unpublished entries before creating routes, navigation, related links, sitemap entries or public data payloads. Internal evidence notes and private materials must not appear in the built output. Publishing a case study requires affirmative permission and evidence review, not merely changing a draft flag.

Define build modes explicitly:

- Preview: noindex pages/headers; no real outgoing enquiries by default; incomplete owner fields allowed as internal launch blockers.
- Production: confirmed identity and notices, verified contact handling, complete metadata and approved public content required.

Do not leave visible bracketed placeholders in a purported production build.

### Contact implementation

The current homepage links to LeadConnector forms, which suggests an existing lead route worth checking. Reuse it if Karol confirms it and it can be integrated correctly. Do not assume a public form URL is a private backend API or an authenticated webhook.

A fallback contact relay uses a server-side provider configured through environment variables. Keep credentials on the server. Validate fields and lengths, restrict accepted origins, add appropriate abuse protection and handle provider timeouts or rejections. Repeated submission should not create uncontrolled duplicates.

An unconfigured backend returns an honest unavailable state; it never returns pretend success. In preview, a deterministic mock can support testing only when explicitly labelled and isolated from production.

The form remains keyboard usable, shows associated error messages and keeps its data when a submission fails. Do not send raw message content into analytics or browser logs.

If the existing host is retained, adapt the contact endpoint to that host and document the change. A static Astro build alone cannot run a server-side contact handler.

## 25. SEO implementation plan

### A. Establish the baseline before replacing the site

Keep efiops.com. A redesign does not require a new domain.

Record the existing reachable URLs, titles, content, canonical host, redirects and form destinations. Where access is available, export Search Console's queries and pages, indexed URLs, sitemap information and analytics landing pages. Note important backlinks and any downloads that need preserving.

The current public homepage and /contact/ were verified. Other paths still need inventory. Do not invent a redirect mapping for an unseen pricing slug. Keep valuable pages on their current paths where practical; map changed pages to the closest relevant replacement.

For URL changes, implement direct server-side permanent HTTP 301 or 308 redirects and verify destinations. Do not send all removed pages to the homepage. Keep the redirect record and retain useful redirects over the long term. Google's migration guidance recommends at least a year for changed URLs. A same-domain path change does not require the domain Change of Address tool. [S6]

### B. Give each page one clear buyer question

| Service | Buyer question | Supporting content idea |
| --- | --- | --- |
| Power BI | Can someone make our reporting useful and dependable? | What to define before building an operational dashboard |
| Power Automate | Can this recurring process run without repeated manual checks? | How reminder workflows handle dates, missing recipients and duplicates |
| AI assistants | Can AI help people find information or start a workflow in our systems? | What an assistant needs before it can answer from business records |
| Jev | Can structured AI decisions improve routing inside our application? | Evaluating intent routes using Jev and defined application rules |
| Custom apps | Can we replace these workarounds with a focused tool? | When an internal app is more useful than another spreadsheet |
| Integrations | Can these tools exchange the information we need? | Mapping records and handling interrupted transfers |
| Web design | Can someone build a better business website? | Planning service pages before starting the design |
| Website optimisation | Can we improve the website we already have? | Separating performance measurements from conversion outcomes |
| SEO | Can customers find and understand the right service pages? | Building local relevance without duplicate town pages |
| Computer vision | Is this visual task practical to automate or support? | Evaluating a visual measurement prototype under changing conditions |

Use these as research hypotheses. Validate wording against customer conversations and available search data. Do not fabricate volume, difficulty, competitive position or forecast traffic.

### C. Page and HTML requirements

Every released commercial page has unique title and description copy provided in this brief, one clear main heading, descriptive subheadings, a readable introduction, relevant internal links and an appropriate CTA.

The main copy, links and FAQ answers are present in the built HTML. Controls may add interaction; they do not supply the only version of important content.

Titles and descriptions should be clear and useful rather than forced to a fixed character count. Check likely display truncation, but recognise that Google can select different title links and snippets. [S4–S5]

Use semantic HTML, descriptive image text where it helps and sensible page hierarchy. Do not add a meta-keywords field or keyword stuffing. There is no magic word count to target; the page should fully explain its offer. [S2]

### D. Crawl and indexing configuration

- Production commercial URLs return real HTTP 200 responses and use consistent trailing slashes.
- Unknown routes return a genuine 404; no universal SPA fallback returning 200.
- Self-referencing absolute canonicals use the chosen production host and path.
- Redirect host variants consistently; avoid multiple separately accessible copies.
- Keep tracking parameters out of canonical URLs.
- Generate an XML sitemap containing only released, canonical, indexable pages.
- Use meaningful last-modified dates only for actual content changes.
- Exclude draft cases, draft articles, APIs, confirmation pages and unreleased indexes.
- Production robots configuration permits relevant crawling; preview has noindex headers/meta or access protection.
- Do not rely on robots.txt alone to prevent preview indexing.
- Preserve existing verification files or tags when replacing hosting.
- Register the new sitemap and inspect important URLs in Search Console after launch.

Canonical choices and redirects should agree. Canonicals are signals, not a substitute for removing contradictory routing. [S7]

### E. Structured data

Use a small consistent JSON-LD graph with stable identifiers:

- Organization for EFIops, with verified name, URL, logo and contact details.
- Person for Karol, using the real public biography.
- WebSite and WebPage for site/page identity.
- Service on service pages, describing the visible offer and its provider.
- BreadcrumbList on suitable nested pages.
- Article on reviewed published insights.

Only include facts that are true and represented appropriately in the page. Do not add invented price, reviews, ratings, clients, business registration or address fields. Prefer Organization over a fabricated physical LocalBusiness presence. Organization and breadcrumb guidance supports clearer identity and hierarchy; generic Service markup is not a promised Google rich result or ranking boost. [S9–S10]

Keep FAQ content for visitors. Do not sell FAQ markup as a rich-result tactic: Google's current documentation says the FAQ rich-result feature stopped appearing from May 2026. [S12]

### F. Internal linking

Home links to Services and the ten service pages. Services links to all ten. Each service links to two or three relevant siblings. A released project links to its service pages, and those services link back where the evidence is relevant.

Each article supports a distinct question and links to its relevant service and, when available, a real project. Use descriptive, natural anchors. Do not force the same keyword into every link.

No orphaned public page. No broken related-project links. Breadcrumbs reflect the actual hierarchy.

### G. Local search

Use truthful Maidstone/Kent information on Home, About, Contact and the locally relevant website/SEO pages. Do not invent offices or produce mass near-identical pages for surrounding towns. Distinct local pages should wait for genuine local demand and substantive original content. Doorway pages and manipulative content scaling are contrary to Google's spam guidance. [S8]

Review any existing EFIops Google Business Profile for accuracy and eligibility before changing it. A remote-only business is not automatically eligible; follow Google's actual business-representation requirements. Do not invent a physical address to qualify. [S22]

Use verified directory profiles and real business relationships where they help people discover EFIops. No bought ranking links, automated directory spam or mandatory keyword-rich client footer links.

### H. AI search visibility

Answer the relevant question clearly, explain the practical scope and provide evidence when it exists. This makes the content useful regardless of how a visitor finds it.

Google says ordinary SEO requirements remain relevant to its AI search features and does not require special AI text files or special markup. Do not make an “AI search guarantee” or treat llms.txt as a launch requirement. [S11]

### I. Supporting article plan

These are editorial assignments, not publishable articles. Build their templates now; write and review the content when its evidence is available.

| Priority | Proposed article | Service supported |
| --- | --- | --- |
| 1 | What to define before building a Power BI dashboard | Power BI |
| 1 | How to design a reminder workflow that handles missing information | Power Automate |
| 1 | AI assistants and SQL: what belongs in the application layer | AI assistants |
| 1 | Jev intent routing: from a question to a tested workflow | Jev |
| 1 | How we planned the EFIops service website | Web design |
| 2 | When a spreadsheet has become an internal application | Custom apps |
| 2 | Connecting machine exports to operational reporting | Integrations |
| 2 | Website speed, conversion and SEO: three different measurements | Optimisation |
| 2 | Service pages for a local business: structure before town lists | SEO |
| 2 | Forecast changes: measuring and alerting on a meaningful difference | Power BI + automation |
| 3 | Evaluating a computer vision measurement prototype | Computer vision |
| 3 | Human handover in an AI assistant: what the team needs to see | AI assistants + apps |

Use Karol as the real author where appropriate, with a short relevant biography and honest dates. Ground implementation articles in original work, code or measurements. Avoid fabricated experts or case evidence. [S3]

## 26. Performance, accessibility and measurement

### Performance targets

Aim for good Core Web Vitals at the 75th percentile of real visits: LCP at or below 2.5 seconds, INP at or below 200ms and CLS at or below 0.1. These are field targets; Lighthouse lab runs do not establish real-user INP or field performance. [S21]

Project budgets, to be validated during implementation:

- Initial JavaScript on the homepage: aim below 60KB compressed before optional integrations.
- First-view fonts: aim below 150KB total; reduce families/weights if needed.
- Initial mobile page transfer: aim below 700KB, with no large video or 3D embed.
- Reserve visual and image dimensions to avoid layout shifts.
- Do not lazy-load the actual largest first-view image.
- Load optional widgets and heavier interactions only when useful.
- Target strong mobile Lighthouse performance, ideally 95+, while documenting conditions and investigating regressions.

These budgets are engineering choices, not universal SEO rules or guaranteed scores. Adjust decorative complexity to preserve usability and loading.

### Accessibility

Target WCAG 2.2 AA for implemented interactions. Verify keyboard navigation, focus visibility, text contrast, headings, labels and error associations. Aim for approximately 44px touch targets in the design.

Respect reduced motion. Do not require hover, dragging, animation or colour alone to understand the page. Provide appropriate alternative text and a text equivalent for meaningful diagrams.

Check representative pages with automated tools and manual keyboard/mobile review. Do not claim complete accessibility certification from an automated score.

### Measurement plan

Primary business measures: qualified enquiries, useful sales conversations, proposals and won projects. Search traffic is a supporting measure.

SEO measures: released/indexed commercial pages; relevant non-branded impressions and clicks; query/page alignment; organic enquiries by service.

Optional analytics events: service CTA click, contact start, actual contact success and visible submission error. Events must not contain names, emails or message contents.

An enquiry is counted only after actual acceptance by the configured backend. A thank-you page view alone is not a lead.

Maintain a dated baseline and change log. Review technical launch behaviour immediately; review search trends after enough observations exist. Do not interpret a few days of traffic or a handful of enquiries as proof of SEO success.

## 27. Build sequence and release criteria

### Sequence

1. Inspect the existing repository, hosting and reusable assets.
2. Record the current-site inventory and unknown owner decisions.
3. Implement tokens, layout, navigation, footer and metadata.
4. Build the homepage and one service page; review the design at desktop and mobile sizes.
5. Complete all ten distinct service pages and the remaining core copy.
6. Implement the illustrative diagrams and deterministic workflow examples.
7. Add validated content collections and draft case/article templates.
8. Connect and test the contact path.
9. Validate indexing, canonicals, sitemap, redirects and preview controls.
10. Produce a reviewable preview, checks and an owner decision list.
11. Launch only as a separate authorised step after configuration is complete.
12. Collect original project evidence and publish supporting content over time.

### Meaningful acceptance checks

- Every specified commercial route exists and has its own complete copy.
- Navigation, mobile menus, CTA destinations and sibling links work.
- Main content is present with JavaScript disabled.
- No horizontal overflow at 360px, 390px, 768px, 1,024px and 1,440px.
- Focus, disclosure controls, form errors and reduced motion work.
- Form success, provider failure, invalid input and an unconfigured backend behave honestly.
- Actual title, description, canonical, robots and JSON-LD outputs are checked.
- Production and preview indexing settings are different and correct.
- Sitemap excludes drafts and non-indexable routes.
- Drafts/private notes do not appear in built HTML, generated feeds or client bundles.
- Unknown routes produce a genuine missing-page response.
- Reviewed legacy redirects reach relevant real destinations without loops.
- Build and type checks pass; representative browser checks are documented.
- Performance findings include conditions and unresolved causes.
- All owner-dependent production fields are resolved before production mode succeeds.

### Owner decisions before launch

These do not block building the preview:

- Confirm the current public contact email and lead destination.
- Use the supplied current EFIops logo; obtain a real portrait if desired.
- Confirm legal identity, notices and retention practice.
- Confirm hosting and optional analytics choices.
- Provide current Search Console/analytics data if available.
- Confirm which project materials may be published.
- Agree commercial promises: quoting, ownership, support and any prices.

Do not request new accounts, credentials or subscriptions merely to create the local build. Produce the concrete preview first; ask only for the configuration needed for the next dependent step.

## 28. Official sources checked

The business positioning, proposed copy, information architecture and design are original recommendations. Technical facts were checked against the primary sources below on 4 October 2026. Framework and provider details should be checked again when the build is implemented.

- **S1:** [Current EFIops homepage](https://efiops.com/) and [contact](https://efiops.com/contact/).
- **S2:** [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- **S3:** [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- **S4:** [Google title links](https://developers.google.com/search/docs/appearance/title-link).
- **S5:** [Google snippets and descriptions](https://developers.google.com/search/docs/appearance/snippet).
- **S6:** [Google URL migration guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- **S7:** [Google canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- **S8:** [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
- **S9:** [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization).
- **S10:** [Google breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).
- **S11:** [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features).
- **S12:** [Google documentation updates, including FAQ rich-result removal](https://developers.google.com/search/updates).
- **S13:** [TypeSafe/Jev introduction](https://docs.typesafe.ai/introduction).
- **S14:** [TypeSafe confidence](https://docs.typesafe.ai/confidence).
- **S15:** [TypeSafe Choice](https://docs.typesafe.ai/primitives/choice).
- **S16:** [TypeSafe patterns](https://docs.typesafe.ai/patterns).
- **S17:** [Astro islands](https://docs.astro.build/en/concepts/islands/).
- **S18:** [Astro content collections](https://docs.astro.build/en/guides/content-collections/).
- **S19:** [Astro styling and Tailwind integration](https://docs.astro.build/en/guides/styling/).
- **S20:** [Astro deployment to Netlify](https://docs.astro.build/en/guides/deploy/netlify/).
- **S21:** [Google Web Vitals](https://web.dev/articles/vitals).
- **S22:** [Google Business Profile eligibility and representation](https://support.google.com/business/answer/3038177).
- **S23:** [Microsoft Power BI sharing](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-share-dashboards).

User evidence: current Karol_Songin_Mercor_Resume.pdf; the current Karol-Tasks.md; the visible project discussions and reported integration milestones. These are self-reported/project records, not externally audited results.


END EFIOPS IMPLEMENTATION BRIEF
