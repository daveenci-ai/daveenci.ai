# Site Audit — daveenci.ai

**Date:** 2026-07-25
**Commit audited:** `3bf2d24` (main)
**Scope:** the whole public site, judged against the owner's Core Website Experience Requirements.

Every claim below was verified by reading the source or by a measurement run. File references are `path:line` against the audited commit. Nothing here is inferred from screenshots or from a previous run's documentation.

---

## How this was measured

The frontend was built clean (`npm ci` equivalent + `npm run build`) and served from the production `dist/` bundle. Lighthouse 13.4.1 ran against that build under its standard mobile emulation (Moto G Power class device, 4× CPU throttle, simulated slow 4G).

One caveat that makes the numbers below **optimistic rather than pessimistic**: the audit sandbox has no route to the public internet, so the Google Fonts request failed instead of completing. The measured Largest Contentful Paint of 2.9 s therefore excludes the cost of the render-blocking font stylesheet, which Lighthouse separately estimated at 780 ms of delay. The live site is very likely slower than what was measured. The live URL itself could not be fetched from the sandbox (403 at the egress proxy), so all findings come from the source and the local production build.

Measured scores: performance 90, accessibility 96, best practices 96, SEO 100. First Contentful Paint 2.1 s, Largest Contentful Paint 2.9 s, Speed Index 4.3 s, Total Blocking Time 110 ms, Cumulative Layout Shift 0.

Two of those miss the targets in the requirements: LCP needs to be under 2.5 s and is at 2.9 s before the font cost is added back. CLS reads 0 only because the fonts never arrived and the images below the fold never loaded; the structural risk for both is still present in the code and is covered in finding 3.

---

## Priority 1 — Invented statistics presented as real results

This is first because it is the only category of finding that breaks a rule the owner set explicitly ("Do not invent clients, testimonials, statistics, partnerships, certifications, or results") and because it is the kind of thing a prospective client can catch.

**The "Calibrated Trust" figure on the homepage.** `components/Advantage.tsx:120-125` hardcodes four accuracy bars — 92%, 74%, 86%, 58% — and the caption directly beneath them at `Advantage.tsx:178` reads: *"Each specialist carries a trust score from actual outcomes. When specialists disagree, track record decides."* The numbers are decorative constants in a React component. The caption tells the visitor they came from actual outcomes. On the homepage, above the fold on a tall screen, in the section that exists to establish differentiation.

**PulseNote's business case.** `components/PulseNotePage.tsx` carries a set of specific financial and percentage claims with nothing behind them: *"That would save us roughly $40K monthly"* (line 28), *"Onboarding Time Cut by 60%"* and *"$40K/month saved through automation"* (lines 427-428), *"Compliance checks slow down 60% of cases"* (line 248), and *"After analyzing 200+ client conversations, one pattern stood out — companies that implemented a 3-touch proactive outreach system reduced churn by 34% in the first quarter alone"* (line 463). Meanwhile `content/workCatalog.ts:57` classifies PulseNote's own status as "Product demonstration" — the site's own catalog says this is a demo, and the page reads as a case study with a proven ROI.

**PureCode's ticket simulator.** `components/PureCodePage.tsx:527-572` runs a scripted animation containing a specific pull request number (`#247`, line 532), a specific performance result (`−92% queries`, line 549), a test count and a contrast ratio. It is a beautiful demo and it is entirely fictional, with no "illustrative" label anywhere near it. Compare this to how CompoundIQ handles the same problem at `CompoundIQPage.tsx:315` — *"These labels describe engineering progress, not investment performance"* — which is exactly the right instinct, applied on one page and not the others.

**One named client with no substantiation.** `components/AutoPilotPage.tsx:165` and `components/mobile/MobileAutoPilotPage.tsx:72` both state that AutoPilot is *"the governed operations system DaVeenci built for f8 Real Estate Media."* That may well be true, but the name appears nowhere else on the site — no logo, no quote, no permission note, no linked artifact. This is flagged not as an invention but as a question: if it is a real client with permission, it deserves far more weight than one clause in a paragraph; if permission was never asked for, the name should come out.

**A stat that contradicts its own page.** `components/CompoundIQPage.tsx:39` shows a stat rail reading `5` / "specialist roles", while the same page's section heading at line 259 reads *"Four specialists. One constrained loop."* and the underlying data at lines 46-79 defines exactly four.

The fix in every case is the same shape and it is cheap: either attach a real artifact, or relabel the element as illustrative in the voice CompoundIQ already uses, or delete the number. The Advantage chart can keep its visual form with the caption rewritten to describe the mechanism ("specialists are weighted by track record") rather than asserting outcomes that were never measured.

Effort: about half a day across both trees. Highest value per hour of anything in this document.

---

## Priority 2 — Every primary button on the site fails colour contrast

The accent fill is `--color-accent: 63 132 200` (`src/index.css`), used with white text by the shared desktop button at `components/Shared.tsx:274` and the mobile button at `components/mobile/MobileButton.tsx:16`. White on `#3F84C8` computes to a contrast ratio of **3.93:1**. WCAG AA requires 4.5:1 for text at this size. This was confirmed both by Lighthouse (which flagged the hero CTA specifically) and by recomputing the relative luminance by hand.

This affects every conversion button on every page in both trees. It is simultaneously an accessibility failure and a conversion issue — the primary action is the lowest-contrast interactive element on a page whose body text sits at very high contrast.

Two other contrast failures worth fixing in the same pass. The hero pricing line uses `text-ink-muted/60` at `components/Hero.tsx:122` and `components/mobile/MobileHero.tsx:61`, computing to **2.74:1** — at 9px on mobile, this is the price of the service rendered close to invisible. And the mobile hero's secondary link "See the work" (`MobileHero.tsx:55`) uses accent text on the cream background at **3.08:1**.

The cheapest correct fix is to darken the accent used for fills to roughly `#1E5A94`, which clears 4.5:1 against white, and to drop the opacity modifiers on the two text cases. That is a change to two shared components plus two hero files.

Effort: an hour, plus a visual pass to confirm the darker blue still reads as the brand.

---

## Priority 3 — The first screen waits on four sequential round trips

The requirement says the first visible section should load immediately. Right now the browser has to complete this chain before a single word of the hero appears: HTML (1.2 KB, contains an empty `<div id="root">`) → `index.js` (68 KB gzipped) → `DaVeenciLandingPage.js` (18.5 KB gzipped) → render. The CSS (13.7 KB gzipped) and the Google Fonts stylesheet block in parallel with the first step.

Four specific causes, each independently fixable:

**The font stylesheet is render-blocking and third-party.** `index.html:31-35` loads Playfair Display in six weights and styles plus Inter in two, from `fonts.googleapis.com`, as a blocking `<link rel="stylesheet">`. Lighthouse attributes 780 ms of render delay to it and estimates 450 ms of recoverable savings. Self-hosting the fonts as woff2 in `public/`, preloading only the two faces the hero actually uses, and dropping the weights nothing renders would remove both the third-party connection and most of the blocking cost. Eight font faces is more than this site's typography needs.

**Nothing is preloaded.** The built `dist/index.html` contains zero `<link rel="modulepreload">` tags, so the landing page chunk is not discovered until `index.js` has downloaded, parsed and executed. On a slow connection that is a full extra round trip added to LCP for no reason. Adding a modulepreload for the landing chunk, or eagerly importing it rather than lazy-loading the entry route, removes it.

**The homepage is empty HTML.** Everything above is a consequence of shipping a client-rendered SPA for what is, on the first visit, a static marketing page. Prerendering the homepage and the case pages to static HTML at build time (`vite-plugin-prerender`, or a small Puppeteer step in the existing build script) would put the hero text in the initial HTML response and change LCP from "after the JavaScript runs" to "on the first paint". This is the single largest available win and also the largest piece of work.

**The homepage fires a calendar API call on load.** `components/BookingPreview.tsx:68-72` and `components/mobile/MobileBooking.tsx:69-73` both call `/api/calendar/availability` from a `useEffect` that runs on mount — for a booking section that sits near the bottom of the page. It competes for connection and bandwidth during the LCP window and it hits the backend on every homepage view. Deferring it behind an IntersectionObserver until the section approaches the viewport is a few lines in each file.

Two supporting items in the same area. All 21 `<img>` elements across both trees lack explicit `width`/`height` attributes (Lighthouse flagged the founder and partner portraits specifically), which is a layout-shift risk that today's measurement did not catch because the images never loaded. And `frontend/images/` ships 7 MB of source images including two 900 KB JPEGs (`Anton_Sketch.jpg`, `Astrid_Sketch.jpg`) that are superseded by the `.webp` versions actually bundled — dead weight in the repo, worth removing, and the three event JPEGs at 410-470 KB each are still shipped unoptimized.

Effort: font self-hosting and preload, half a day. Deferred availability fetch and image dimensions, two hours. Prerendering, one to two days including verification that the custom pushState router hydrates cleanly.

---

## Priority 4 — The mobile homepage has no footer

`components/mobile/MobileLanding.tsx` imports no `Footer` and no `MobileSubscribe` (verified against its import block, lines 1-16). The page ends on a "Read the Codex" folio. Desktop ends with a full footer containing the newsletter form, the Work and Company navigation, and the only link to the privacy policy.

So on mobile: no newsletter capture on the homepage at all, no secondary navigation at the point where a visitor has finished reading, and no route to `/privacy` anywhere in the mobile UI — `components/mobile/MobileMenu.tsx:12-19` has no privacy entry either. For a site that collects email addresses and books calls, an unreachable privacy policy on the majority-traffic device is worth fixing on its own terms.

Effort: two to three hours, mostly deciding what a mobile footer should contain rather than porting the desktop one wholesale.

---

## Priority 5 — The homepage asks for money before it explains the problem

The requirement describes the journey as Attention → Understanding → Relevance → Trust → Proof → Confidence → Action, and says the site should not pressure visitors to make contact before they understand whether the service is relevant.

The actual order (`DaVeenciLandingPage.tsx:36-49`, mirrored in `MobileLanding.tsx:26-65`) is: Hero → ProofRail → CommercialOffers → WorkPreview → Contrast → Method → FounderBlock → Advantage → Controls → PartnerBlock → BookingPreview → Newsletter.

`CommercialOffers` is the pricing grid, and it sits third — before `Contrast`, which is the section that explains what problem exists, and before `Method`, which explains how the work is done, and four sections before `FounderBlock`, which is the first time a human appears. The hero already carries a price line (`Hero.tsx:122`) and a booking CTA. A visitor who has not yet been told what problem this solves has been quoted $5,000 twice.

`ProofRail` and `WorkPreview` are well placed and should stay early. Moving `CommercialOffers` down to sit just before `BookingPreview` — after Method, the founder, and the proof sections have done their work — costs one line in each landing file and matches the journey the owner described.

There is also a redundancy worth noting: Hero, CommercialOffers and Contrast make overlapping arguments about tools-versus-systems in three consecutive sections before Method finally explains mechanics.

Effort: one hour for the reorder, plus judgement on whether to trim the overlap.

---

## Priority 6 — The same action has six names

Every one of these routes to `/calendar`: "Talk to us" (`Header.tsx:161`, `MobileShell.tsx:60`), "Start with a Workflow Blueprint" (`Hero.tsx:117`), "Discuss a Workflow Blueprint" (`CommercialOffers.tsx:80`), "Map where autonomy stops" (`CompoundIQPage.tsx:339`), "Name the handoff that breaks" (`AutoPilotPage.tsx:287`), "Bring us a real ticket" (`PureCodePage.tsx:874`).

The contextual phrasing was a deliberate decision in the previous run and the copy itself is good — it is much better than six instances of "Talk to us". The problem is quantity per screen, not the idea. On the homepage a visitor can see "Talk to us" in the sticky header, "Start with a Workflow Blueprint" in the hero, and "Discuss a Workflow Blueprint" in the pricing grid within one scroll. Three different names for one action reads as three different offers.

The requirement asks for one clear primary call to action supported by a lower-commitment secondary. The straightforward reading: keep "Talk to us" as the persistent low-commitment nav link, use exactly one in-page conversion phrase per page, and keep the page-specific phrasing (which is the good part) as that one phrase.

A related item: `PureCodePage`, `BrandOSPage` and `PulseNotePage` each expose two separate booking mechanisms — a CTA that navigates to the full calendar page, and an embedded `BookingWidget` further down with its own two-step form. A visitor who used the first one and then scrolls into the second has reason to wonder whether they actually booked.

Effort: two to three hours across both trees.

---

## Priority 7 — The BrandOS tool behaves differently on desktop and mobile, and desktop contradicts its own page

`components/BrandOSPage.tsx:41-51` weights ten dimensions including `emotionalAppeal: 0.7`, with no `trust` dimension. `components/mobile/MobileBrandOSPage.tsx:29-39` weights `trust: 1.3` and `negativeRisk: 0.6`, with no `emotionalAppeal`.

The desktop page's own body copy at line 859 lists the dimensions as *"Clarity, Relevance, Trust, Industry Fit..."* and its FAQ at line 979 states *"Negative Risk ×0.6 is the lightest"*. Both describe the mobile implementation. So a desktop visitor reads a paragraph promising Trust, runs the live analyzer, and gets a scorecard with Emotional Appeal on it instead — on the page that is the site's single strongest proof asset, because it calls a real backend and produces real output the visitor can check.

Mobile matches the copy, so the fix is to bring `BrandOSPage.tsx`'s constants into line with `MobileBrandOSPage.tsx`, and to confirm which set the backend `/analyze-brand` endpoint actually returns.

Effort: an hour, plus a check against the backend.

---

## Priority 8 — Parity gaps between the two trees

Besides the footer (finding 4) and BrandOS (finding 7), these diverge:

`PulseNotePage.tsx` defines a complete FAQ component at lines 1528-1539 that is never rendered — `PulseNotePageDesktop` at lines 1598-1611 does not include it. Mobile shows a full FAQ (`MobilePulseNotePage.tsx:198-228`). Dead code on desktop, and a content gap on the page that most needs to answer objections.

`PulseNotePage.tsx:1560-1587` has a closing CTA band with no mobile equivalent. `PureCodePage.tsx:1023-1040` has a closing section ("Want a team like this for your stack?") absent from mobile. `AutoPilotPage.tsx:169` has a "See the workflow" secondary CTA absent from mobile. `BookingPreview.tsx:204-213` has a "What we cover" expectations list with no equivalent in `MobileBooking.tsx` — which is the exact "tell them what happens next" content the requirements ask for, missing on the device most people will book from.

Effort: half a day.

---

## Priority 9 — No way to contact the company except by booking a call

There is no email address, phone number or postal address anywhere in the source. A search across the whole frontend for `mailto:`, `@daveenci` and phone patterns returns only form placeholders. The footer's legal row (`Footer.tsx:124-133`) carries a copyright line and a privacy link and nothing else. `PrivacyPage.tsx:47` directs data requests to "the Talk to us page" — that is, to a calendar booking form, which is not a workable channel for a deletion request and is thin as a privacy contact.

Related trust gaps, all of which should be filled with real content or an explicitly labelled placeholder, never invented material: there are no testimonials and no placeholder acknowledging that; the founder narratives on `WhoWeArePage.tsx` are specific and human, which is a real strength, but carry no factual background (prior companies, roles, years); there is no confidentiality statement covering what happens to the business process details a prospect describes on a discovery call; and post-launch support is described only inside a pricing tier's bullet list (`content/commercialOffers.ts:47-53`) rather than as a plain answer to "what happens after you ship".

Effort: an hour of implementation once the actual facts are decided. The decisions are the work here, not the code.

---

## Priority 10 — Smaller accessibility items

Text inputs across the site strip the focus outline with `focus:outline-none` and replace it only with a one-pixel border colour change: `Shared.tsx:249` and `Shared.tsx:636` (the shared `FormField`, used widely), `BookingWidget.tsx:327,333,340,346,362`, `Events.tsx:108,122`, `BrandOSPage.tsx:169,186`, `Footer.tsx:77`, `MobileSubscribe.tsx:63`, `MobileBrandOSPage.tsx:287,304`, `MobileEventsPage.tsx:123,140`. The buttons and links in the same codebase already do this correctly with `focus-visible:ring-2 focus-visible:ring-accent`, so the fix is to apply the existing pattern to the input classes.

The reduced-motion rule in `src/index.css:120-129` only overrides CSS animation and transition durations. The decorative SVG `<animate>` elements in `Hero.tsx:75-81` and `MobileHero.tsx:46-48` loop indefinitely regardless — the CSS file's own comment at line 119 acknowledges this. `GateSimulator.tsx:89-92` already shows the right pattern using `matchMedia`.

Tap targets under 44px: the gate simulator toggles at `GateSimulator.tsx:157` (28px) and `MobileGateSimulator.tsx:154` (32px), and the booking widget's month chevrons (~28px) and day cells (40px) at `BookingWidget.tsx:241-242,259`, which is the shared widget mobile visitors use.

One skipped heading level: `BookingPreview.tsx:204` uses `<h4>` directly under an `<h2>`. Every other page checked has exactly one `h1` and correct nesting.

Effort: half a day for all of it.

---

## What is already working

Worth stating plainly, because it is unusual. The case pages are disciplined about not overclaiming — CompoundIQ repeatedly labels itself paper-only and in development and explicitly states that its status badges describe engineering progress rather than investment performance. AutoPilot's evidence ledger in `content/shootosEvidence.ts` gives concrete, checkable specifics tied to Live/Shadow status. The BrandOS analyzer calls a real endpoint and produces real output a visitor can verify themselves, which is the strongest kind of proof a site like this can carry. Every form checked has properly associated labels, `aria-invalid`, `aria-describedby` and `role="alert"` error announcements. Alt text is correct throughout, including correctly empty alt on decorative images. No interactive element is built from a `div` with an onClick. No hype vocabulary appears anywhere in the marketing copy. The founder narratives read like people rather than a template. The bundle is well code-split, Total Blocking Time is a healthy 110 ms, and SEO scores 100.

The gap between the site's honest, specific voice on the CompoundIQ and AutoPilot pages and the invented numbers on PulseNote and the Advantage chart is the sharpest inconsistency in the whole audit. Closing it is mostly a matter of applying an instinct the site already has.

---

## Suggested sequence

The first three findings are worth doing before anything else and total roughly two days: the invented statistics, the button contrast, and the font and preload work. They are independent of each other, they carry the most risk and the most measurable upside, and none of them requires a decision the owner has not already made.

Findings 4 through 8 are a second block of about two days — the mobile footer, the section reorder, CTA consolidation, the BrandOS reconciliation and the parity gaps.

Findings 9 and 10 need input on facts (what contact address, what confidentiality commitment, what founder background is publishable) before the code changes are worth writing.

Prerendering the marketing routes is the largest remaining performance lever and should be scoped on its own once the cheaper wins in finding 3 are measured.
