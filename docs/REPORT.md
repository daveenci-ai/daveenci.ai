# Funnel Improvement Run — Report

Branch: `improve/funnel-20260710` · Run date: 2026-07-10 · Companion docs: [DECISIONS.md](DECISIONS.md) (every judgment call, with reasoning) · [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md) (GA4 wiring + QA).

**Mission metric:** qualified engagement rate = visitors reaching demo interaction / next-case / booking ÷ total visitors. Before this run the site could not even measure that (zero analytics in source — DECISIONS GT-1); now it measures it and removes the three structural reasons visitors never got there: work buried 7th on the homepage, case pages that dead-ended, and one generic CTA repeated 33 times.

## 1. What changed and why

### Analytics & event layer (commits `8162cae`, `0e4b249`)

| Change | Files | Why |
|---|---|---|
| Typed GA4 module; gtag injected only when `VITE_GA_MEASUREMENT_ID` is set; `send_page_view: false` | `frontend/lib/analytics.ts` | One choke point; compile-time param checking; no credentials in code |
| Manual `page_view` at the router's three entry points (mount / `handleNavigate` / `popstate`); same-path navigations skipped; StrictMode-guarded; full-href `page_location` (UTM survives) | `frontend/App.tsx` | The custom pushState router with `replaceState` legacy redirects makes GA4 Enhanced Measurement double-count — EM history tracking must be OFF (ANALYTICS_SETUP §2.3) |
| `case_engaged` = 30 visible-tab seconds OR 50% scroll (+ real-scroll requirement), once per visit, from the five page wrappers | `frontend/lib/useCaseEngaged.ts`; wrappers in `CompoundIQPage.tsx`, `AutoPilotPage.tsx`, `PureCodePage.tsx`, `BrandOSPage.tsx`, `PulseNotePage.tsx` | One call site covers both trees (the wrapper renders the mobile variant) |
| `select_content` on case cards | `WorkPreview.tsx`, `WorkPage.tsx`, `mobile/MobileWorkPreview.tsx`, `mobile/MobileWorkPage.tsx` | Separates homepage-preview clicks (`surface: work_preview`) from /work clicks |
| `calendar_start` (first date/time pick) + `generate_lead` (booking POST ok) | `Calendar.tsx`, `BookingWidget.tsx`, `mobile/MobileCalendarPage.tsx` | Covers /calendar AND the inline booking widgets on BrandOS/PureCode/PulseNote |
| `demo_start`/`demo_complete` on the two demos that already existed | `BrandOSPage.tsx`, `mobile/MobileBrandOSPage.tsx`, `PureCodePage.tsx` (shared `TryItSimulator`) | GOAL Phase 1: instrument existing demos before building anything new |

The first Phase 1 commit was **failed** by the skeptic critic (7 defects: UTM stripping, same-page pageview inflation, StrictMode double-fire, scroll-depth false positive, PulseNote gap, path inconsistency — DECISIONS A-7); all were fixed in `0e4b249` and re-verified PASS.

### Structural funnel fixes (commit `0892f4c`)

- **WorkPreview moved from 7th to 4th** — directly after Method: `DaVeenciLandingPage.tsx:36-37`, `mobile/MobileLanding.tsx:28-29`. The skeptic confirmed no scroll-anchor or folio-numbering breakage (numbered folios stay monotonic; WorkPreview's eyebrow is unnumbered).
- **Next-case chain** `CompoundIQ → AutoPilot → PureCode → BrandOS → CompoundIQ` (why BrandOS, not a loop-to-start: DECISIONS S-1 — momentum flows toward the site's strongest live demo, and BrandOS ends on a booking widget). New `NextCase.tsx` / `mobile/MobileNextCase.tsx` strips end all 8 case-page instances with a one-line hook, fire `next_case_click`, and keep a secondary "All work" link. The old "See all work" dead-ends at page endings are gone.
- **Contextual CTAs**, chosen by a 3-proposer + judge tournament (slate + scores + fact-flags: DECISIONS S-2): homepage "Walk us through your workflow" (`Hero.tsx:117`, `MobileHero.tsx`), CompoundIQ "Map where autonomy stops", AutoPilot "Name the handoff that breaks", PureCode "Bring us a real ticket" (hero + closing). "Talk to us" retained in `Header.tsx`, `Footer.tsx`, and the `MobileShell` bottom bar.

### Newsletter source (commits `d512cb0`, `ef1b70e`)

- Desktop: `Footer.tsx` gained optional `newsletterHeading/Body/Source` props; the four case pages pass case-framed Codex copy (`compoundiq`/`autopilot`/`purecode`/`brandos`); all nine other Footer call sites are untouched byte-identical defaults.
- Mobile: the tree had **no capture form at all** (DECISIONS GT-1 drift 1) — new `mobile/MobileSubscribe.tsx` closes that gap on all four mobile case pages. One newsletter field per page everywhere.
- Copy honesty: GOAL's example ("weekly CompoundIQ build log") would have invented a product; the shipped copy frames the real Tuesday Codex letter per case (DECISIONS N-2).
- Backend (additive only): `routes.ts` accepts optional `source` (trimmed, 100-char cap, surrogate-safe); `newsletter.ts` inserts `(email, source)` with a `42703` fallback to email-only so a code deploy can't outrun the migration; owner email includes the source, HTML-escaped (skeptic finding, DECISIONS N-4). Migration: `backend/migrations/2026-07-10-newsletter-source.sql`.

### CompoundIQ gate simulator (commit `13772a8`)

`GateSimulator.tsx` (274 lines) + `MobileGateSimulator.tsx` (246 lines), placed right after the "operating system" section that specifies the policy gate. Design chosen by tournament (Console Ledger, 17/20, with judge-directed borrowings — DECISIONS G-1): toggle Approved?/Enabled?/Unexpired?, send a signal, watch it stop at the first blocking gate or land a paper fill; every run appends an audit line. Real `role="switch"` toggles, `aria-live` outcome, `prefers-reduced-motion` honored, never color-alone. Fires `demo_start`/`demo_complete` (`compoundiq_gate_sim`) once per visit. Every phrase traces to existing page copy; the plate carries the page's own "illustrative only" honesty line.

## 2. Expected effect per funnel step, and how to measure it

Baseline caveat: **there is no historical data** (analytics didn't exist). The first 2–4 weeks after deploy ARE the baseline; effects below are measured as ratios between the new events, then compared across subsequent periods. Mark `generate_lead` (minimum), `demo_complete`, `calendar_start` as key events; register the custom dimensions listed in ANALYTICS_SETUP §4.

| Funnel step | Change expected to move it | Measure |
|---|---|---|
| Visitor → opens a case | WorkPreview at position 4 instead of 7; clearer homepage CTA | `select_content(surface=work_preview)` ÷ `page_view(/)`. Compare weeks 1-2 vs 3-4; if the owner can note the deploy date, sessions before/after |
| Case opened → engaged | (measurement newly possible) | `case_engaged` ÷ `select_content` per `case_id`; `trigger` split shows whether people read (active_time) or skim-scroll |
| Engaged → demo interaction | Gate simulator on CompoundIQ (a page that had zero interactivity); existing demos now measured | `demo_start` and `demo_complete` ÷ case `page_view`, per `demo_id`. CompoundIQ's `compoundiq_gate_sim` is the headline number — it was structurally 0 before |
| Case → next case (new step) | NextCase chain replacing dead-ends | `next_case_click` ÷ case `page_view`; the `from_case`/`to_case` matrix shows where the chain leaks |
| Anywhere → booking | Contextual CTAs; chain terminating at BrandOS's booking widget | `calendar_start` ÷ total `page_view`s, then `generate_lead` ÷ `calendar_start`, split by `booking_type` |
| Anywhere → newsletter | Contextual framing + mobile form that didn't exist | `newsletter_subscribe` by `source` — `footer` vs case sources isolates the framing's contribution; any mobile volume is net-new |

**Primary metric assembly:** qualified engagement rate ≈ unique visitors with any of `demo_start`, `next_case_click`, `calendar_start` ÷ total visitors (GA4 exploration, segment per event; or a simple "qualified" audience with an OR condition).

## 3. Verification performed

- `npm run build` + `tsc --noEmit` clean after every phase (frontend and backend); lint at the pre-run warning baseline; nothing committed to `main` (`bff55bc` untouched); nothing pushed or deployed.
- Live dev-server walk with Chrome automation (DECISIONS V-1): exactly one `page_view` per load/nav/Back (StrictMode guard observed working in dev); `select_content`, `case_engaged` (both triggers), `demo_start`→`demo_complete` on the gate simulator (both outcome paths exercised visually), `next_case_click`, `calendar_start` — all fired once, when expected, and only then. `generate_lead`/`newsletter_subscribe` success paths need the backend; their `response.ok` gating was verified by critics in code.
- Every phase passed a skeptic critic AND a completeness critic; two phases initially failed (Phase 1: 7 analytics defects; Phase 3: HTML-injection in the owner email) and were fixed and re-verified — see DECISIONS A-7, N-4.

## 4. Merge checklist

1. Review the branch: `git log main..improve/funnel-20260710 --oneline` (note: the first commit `a0864b8` is your own pre-existing uncommitted WIP, captured as the baseline — DECISIONS GT-2).
2. Create the GA4 property + web data stream; **turn OFF Enhanced Measurement → "Page changes based on browser history events"** (ANALYTICS_SETUP §2.3 — skipping this double-counts every SPA navigation).
3. Set `VITE_GA_MEASUREMENT_ID` in Vercel (Production; leave Preview unset) and in `frontend/.env.local` for local QA.
4. Run `backend/migrations/2026-07-10-newsletter-source.sql` against the Supabase DB (additive; the code works before the migration too, it just skips recording the source).
5. Run the DebugView QA checklist (ANALYTICS_SETUP §5) and the duplicate-pageview check (§6) on a preview deploy.
6. Mark key events + custom dimensions (ANALYTICS_SETUP §4).
7. Merge; note the deploy date as the analytics epoch.

## 5. What I'd do next run (prioritized)

1. **AutoPilot mini-interaction** (GOAL asked for a proposal, not a build): reuse the gate-simulator pattern almost verbatim as **"Route the exception"** — an inbound order email with a toggleable defect (bad address / missing product / price mismatch); the visitor sends it through Order Review and watches it get auto-fixed, routed to a human, or passed. Same toggle-rail-ledger components, AutoPilot's own vocabulary (safe actions, exception queues, morning report), `demo_id: 'autopilot_order_review'`. Est. well under the 300-line budget since the interaction model is proven.
2. **Bring PulseNote into the funnel.** It's a `CaseId` with `case_engaged` but sits outside the next-case ring and has no inbound chain link (Phase 2 skeptic note). Either extend the ring (BrandOS → PulseNote → CompoundIQ) or add a "More from the workshop" pair under NextCase.
3. **Booking-flow funnel depth**: `calendar_start` → `generate_lead` is a long gap; instrument the intermediate step (details form reached) to find where bookings die.
4. **Newsletter double-opt-in + confirmation state** — the current success copy promises Tuesday delivery; there's no verification loop. Also surface the `source` column in the admin dashboard.
5. **Consolidate the two gate-simulator implementations** if they need a third variant (skeptic S3: duplicated logic invites drift; two trees was the right cost line for two variants, not three).
6. **Session-quality dimension**: wire `case_engaged`'s `trigger` + count of cases engaged into a GA4 audience ("read two cases") for remarketing once traffic justifies it.
