# DaVeenci.ai — Autonomous Funnel Improvement Run

**Invocation prompt (paste this into the agent):**

> Read the file GOAL.md and execute everything below the divider line as your goal. That file is your full instruction set — mission, guardrails, phases, deliverables, definition of done. Follow it exactly, including the never-ask rule. Do not report back to me until the definition of done is met. Start now.

---

## Mission

Increase qualified engagement on daveenci.ai — visitors who open a case study, engage with it, interact with a demonstration, and start or complete a booking. You are not starting from scratch: the site exists, the strategy is decided, and the ground truth below has been verified against this repo. Your job is to implement, verify, and package the improvements so the owner can review one branch and merge.

Primary metric this work must enable and improve:
**Qualified engagement rate = visitors reaching demo interaction / next-case / booking ÷ total visitors.**

This is a test of how far you can go on your own. Make every call yourself, write down why, and keep moving within the guardrails. Do your best work, not your safest work.

## Ground truth (verified against this repo on 2026-07-10 — re-verify in Phase 0, trust nothing stale)

- Frontend: React + Vite, TypeScript. **Custom pushState router** in `frontend/App.tsx` with a single `navigate()` choke point (uses `pushState`, `replaceState`, `popstate`). No react-router.
- **Two parallel component trees**: `frontend/components/*.tsx` (desktop) and `frontend/components/mobile/*.tsx`. Every user-facing change must land in BOTH.
- **No analytics instrumentation exists anywhere** in the source. No gtag, no GA4, nothing.
- Homepage section order (desktop `DaVeenciLandingPage.tsx` and mobile `MobileLanding.tsx`): Hero → Contrast → Method → FounderBlock → Advantage → Controls → **WorkPreview** → PartnerBlock → BookingPreview → Newsletter. Selected work is buried 7th of 10.
- "Talk to us" appears **33 times** across 20+ components — CTA monotony.
- Case pages (`CompoundIQPage`, `AutoPilotPage`, `PureCodePage`) dead-end with a "See all work" button.
- Interactivity: `CompoundIQPage.tsx` and `AutoPilotPage.tsx` have **zero `useState`** (pure editorial). `PureCodePage.tsx` (23) and `BrandOSPage.tsx` (18) are already interactive.
- Newsletter: the homepage "Newsletter" section is briefing cards, NOT a form. The only capture form is in `Footer.tsx`. Backend `POST /newsletter/subscribe` (`backend/src/routes.ts`, Express/TS) accepts **email only — no source field**.
- Backend also exposes `POST /calendar/book` and `POST /events/register` — the hooks for `calendar_start` / `generate_lead` events.

## Guardrails

1. **Never ask.** No questions mid-run. Every judgment call is yours; record it in `docs/DECISIONS.md` with reasoning.
2. **Branch only.** Create `improve/funnel-<YYYYMMDD>` from the default branch. Never commit to main. Commit per phase with clear messages.
3. **Publish nothing.** No deploys, no pushes to remotes, no external accounts, no new spending. Existing env vars are fair game; never invent or hardcode credentials — the GA4 measurement ID must be an env variable (`VITE_GA_MEASUREMENT_ID`) with setup documented.
4. **Invent nothing.** Every factual claim in your reports must cite a file path (with line refs) or a fetched source. Marketing copy you write must not claim results, clients, or numbers that don't exist in the repo's own case-study content.
5. **Preserve the voice.** The site has a distinctive editorial style (folios, eyebrows, specialist-team framing). New copy must match it. No generic SaaS-speak.
6. **Don't break anything.** `npm run build` must pass in `frontend/` after every phase. TypeScript strict. No backend schema-destructive changes; the only backend change permitted is additive (newsletter `source` field).
7. **Desktop + mobile parity.** A change shipped to one tree and not the other is an incomplete phase.

## Orchestration mandate

Use multi-agent workflows aggressively. Fan out parallel subagents for independent work: one per component tree, one per research question. Run a tournament for creative decisions — contextual CTA copy and the gate-simulator design each get 3 independent proposals scored by a judge agent against: voice fit, clarity, and likelihood to advance the funnel. Every phase ends with two critics: a **skeptic agent** whose only job is to refute your claims and find what you broke, and a **completeness critic** who checks the phase's deliverables against this file. A phase is not done until both pass. These patterns are a floor, not a ceiling — design whatever orchestration the work calls for.

## Phases

**Phase 0 — Re-verify ground truth.** Confirm every bullet above against the current repo state. If anything has drifted, update your plan and log it. Create the branch.

**Phase 1 — Analytics & event layer.** Build a small typed analytics module (`frontend/lib/analytics.ts` or similar). Fire manual `page_view` from the `navigate()` choke point in `App.tsx` — do NOT rely on GA4 Enhanced Measurement history tracking (the router's `replaceState` redirects make it unreliable; document that EM history tracking must be disabled). Implement events: `select_content` (case card click), `case_engaged` (30 active seconds OR 50% scroll depth — visibility-aware timer + IntersectionObserver), `demo_start` / `demo_complete`, `next_case_click`, `calendar_start` (date/time selection begins), `generate_lead` (booking API success), `newsletter_subscribe` (API success, with source). Instrument the two demos that ALREADY exist (BrandOS analyzer, PureCode) before building anything new. Deliver `docs/ANALYTICS_SETUP.md`: GA4 property steps, env var, DebugView QA checklist, duplicate-pageview verification.

**Phase 2 — Structural funnel fixes.** (a) Move WorkPreview directly after Method in both landing files. (b) Replace the "See all work" dead-end on each case page with a specific next-case link: CompoundIQ → AutoPilot → PureCode → (loop or BrandOS — your call, log it), each with a one-line hook; keep a secondary "All work" link. Wire `next_case_click`. (c) Contextual CTAs: keep "Talk to us" in header/footer, but give each case page and the homepage a context-specific primary CTA (starting points, improve via tournament: CompoundIQ "Design a governed system", AutoPilot "Map your operations workflow", PureCode "Bring us a ticket", homepage "Find the team for your workflow").

**Phase 3 — Newsletter capture with source.** Add contextual subscribe framing on each case page above or near the footer form (e.g., CompoundIQ "Follow the weekly CompoundIQ build log"). Frontend sends a `source` string; backend `routes.ts` + newsletter service accept and record/forward it additively. One email field everywhere.

**Phase 4 — CompoundIQ gate simulator.** Build the miniature interactive: Signal → Approved? → Enabled? → Unexpired? → Paper fill / Rejected, with toggleable conditions and visible outcome. Match site aesthetics. Desktop + mobile. Wire `demo_start` / `demo_complete`. Keep it under ~300 lines per tree; it's a teaser, not a product. If AutoPilot can get a cheap interaction from the same pattern, propose it in the report — do not build it this run.

**Phase 5 — Verify & package.** Full build passes. Walk every changed route via the dev server if runnable; otherwise static analysis + skeptic review of every diff. Produce `docs/REPORT.md`: what changed and why (with file refs), expected effect on each funnel step, how to measure it (which events, what baseline period), a merge checklist, and a prioritized list of what you'd do next run. Final skeptic + completeness pass against the definition of done.

## Deliverables

Branch `improve/funnel-<YYYYMMDD>` containing: the analytics module + instrumentation, section reorder, next-case chaining, contextual CTAs, newsletter source (frontend + backend), gate simulator (both trees), `docs/ANALYTICS_SETUP.md`, `docs/DECISIONS.md`, `docs/REPORT.md`.

## Definition of done

- [ ] All 8 events implemented and firing through one typed module; pageviews manual via `navigate()`
- [ ] WorkPreview directly after Method — desktop AND mobile
- [ ] Every case page ends with a specific next case; `next_case_click` wired
- [ ] Contextual primary CTA on homepage + each case page; "Talk to us" retained in header/footer
- [ ] Newsletter `source` flows end to end; backend change is additive only
- [ ] Gate simulator works on desktop AND mobile with demo events
- [ ] `npm run build` passes; no TypeScript errors; nothing committed to main; nothing published
- [ ] REPORT.md, DECISIONS.md, ANALYTICS_SETUP.md complete, every claim cited
- [ ] Skeptic and completeness critics have passed every phase, final pass included

Only report back when every box is checked.
