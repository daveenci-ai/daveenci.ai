# Funnel Run — Decision Log

Branch: `improve/funnel-20260710`. Every judgment call made during the autonomous run is recorded here with reasoning, per GOAL.md guardrail 1.

---

## Phase 0 — Ground truth verification

### GT-1: Ground truth re-verified 2026-07-10; three drifts found

Every GOAL.md bullet was checked against the working tree. Confirmed:

- Custom pushState router: `frontend/App.tsx:151` (`handleNavigate`), `pushState` at `App.tsx:182`, `replaceState` redirects at `App.tsx:43,65,70,79`, `popstate` at `App.tsx:99`. No react-router.
- Two parallel trees: `frontend/components/*.tsx` + `frontend/components/mobile/*.tsx` (desktop page components branch on `useIsMobile` and render the `Mobile*` variant).
- Zero analytics instrumentation: grep for `gtag|ga4|googletagmanager|analytics|plausible|posthog|mixpanel|segment` matches only marketing copy (`BriefingDetailPage.tsx:632,1472,1480`, `BriefingsPage.tsx:105`). `frontend/package.json` has no analytics or router dependency.
- Homepage order: `frontend/DaVeenciLandingPage.tsx:34-43` and `frontend/components/mobile/MobileLanding.tsx:26-34` — WorkPreview is 7th in both.
- "Talk to us": 33 occurrences across 24 files within `frontend/components/` (38/26 if PLAN.md and OG html files are counted).
- Dead-ends: "See all work" at `CompoundIQPage.tsx:329`, `AutoPilotPage.tsx:282`, `PureCodePage.tsx:862,1025`, `MobilePureCodePage.tsx:95`.
- Interactivity: `CompoundIQPage.tsx` and `AutoPilotPage.tsx` have 0 `useState`; `PureCodePage.tsx` has 23; `BrandOSPage.tsx` has 18.
- Newsletter: only capture form is `Footer.tsx:14-32` (`handleSubscribe`, sends `{ email }` only). Backend `backend/src/routes.ts:11-31` destructures `email` only; `backend/src/services/newsletter.ts:48-67` inserts email only.
- Booking hooks: `POST /calendar/book` at `routes.ts:50`, `POST /events/register` at `routes.ts:33`.

**Drifts from GOAL.md ground truth (plan updated accordingly):**

1. **Mobile has no newsletter form anywhere.** `MobileShell.tsx` renders no footer; the only mobile "newsletter" matches are copy mentions (`MobileWorkPage.tsx:41`, `MobilePulseNotePage.tsx:100`). Phase 3 must therefore *add* a mobile capture component, not just thread `source` through an existing one.
2. **Mobile PureCode has no demo.** `MobilePureCodePage.tsx` has a single `useState` (FAQ accordion). The PureCode interactive demos (ticket simulator etc.) are desktop-only. Phase 1 demo instrumentation on mobile applies to BrandOS only (full analyzer exists at `MobileBrandOSPage.tsx:71-108`); the Phase 4 gate simulator restores demo parity for CompoundIQ.
3. **Mobile case pages don't share the desktop dead-end.** `MobileCompoundIQPage.tsx` / `MobileAutoPilotPage.tsx` end in a "Talk to us" section with no "See all work" — still a dead-end (no next case), so Phase 2(b) applies to both trees, but the mobile edit is an *addition*, not a replacement.

Also noted: `BrandOSPage.tsx:972-982` embeds a `BookingWidget` (inline calendar, `bookingType="demo-brandos"`) — an extra `calendar_start`/`generate_lead` surface beyond `/calendar`.

### GT-2: Pre-existing uncommitted work committed as baseline

The working tree on `main` was dirty: ~20 modified files and 8 untracked files, including the very case pages GOAL.md's ground truth describes (`CompoundIQPage.tsx`, `AutoPilotPage.tsx` were untracked). GOAL.md's ground truth was clearly verified against this dirty state, so it is the intended baseline.

**Decision:** commit that WIP as-is on the new branch (`a0864b8 wip: baseline`) before any funnel work. Reasoning: (a) per-phase commits are required and impossible over a dirty tree; (b) my work directly edits those files; (c) `main` the ref stays untouched — the owner can inspect the baseline commit separately from funnel commits. Alternative (stashing) rejected: it would remove files the run depends on.

### GT-3: Baseline build passes

`npm run build` in `frontend/` succeeds at baseline (Vite, 2.13s, no TS errors). Any post-phase failure is therefore caused by this run.

---

## Phase 1 — Analytics & event layer

### A-1: Module shape

One module, `frontend/lib/analytics.ts`, typed via an `AnalyticsEventMap` interface so `track('event', params)` fails to compile with wrong params. gtag.js is injected at runtime only when `VITE_GA_MEASUREMENT_ID` is set (guardrail 3: env var, no hardcoded credentials); unset, events log to console in dev and no-op in prod. `send_page_view: false` — all pageviews manual.

### A-2: Pageview call sites (three, all in `App.tsx`)

1. After `handleLocationChange()` on mount — deliberately *after*, so the legacy-path `replaceState` redirects (`/briefings→/codex` etc.) resolve and the pageview carries the canonical path.
2. In the `popstate` handler (covers back/forward for both the state-hydrated and fallback branches — one call after the if/else).
3. In `handleNavigate` immediately after `pushState`.

This is the entire router surface; there is no fourth way a route changes. GA4 Enhanced Measurement history tracking must be OFF (documented in `docs/ANALYTICS_SETUP.md` §2.3 and §6) or every `replaceState`/`pushState` would double-fire.

### A-3: `case_engaged` lives in the page wrappers, not per tree

Each case page's default export is a wrapper that branches on `useIsMobile` and returns the `Mobile*` variant early (`CompoundIQPage.tsx:341`, `AutoPilotPage.tsx:294`, `BrandOSPage.tsx:720`, `PureCodePage.tsx:17`). Calling `useCaseEngaged()` in the wrapper *before* that branch instruments desktop and mobile with one call site and zero double-fire risk. The 50% scroll trigger uses an IntersectionObserver on a sentinel repositioned by a ResizeObserver (lazy content changes page height); the 30s timer only counts seconds while `document.visibilityState === 'visible'`.

### A-4: Demo events fire once per visit

`demo_start`/`demo_complete` use ref guards — first run / first completion per page mount. Reasoning: the funnel metric is "visitors who interact with a demonstration", not run counts; once-per-visit keeps event volume proportional to visitors and makes DebugView QA deterministic. Logged in ANALYTICS_SETUP so nobody "fixes" it into per-run firing without intent.

### A-5: Existing demos instrumented before anything new is built

Per GOAL Phase 1: BrandOS analyzer (desktop + mobile — the only mobile demo that exists, see GT-1 drift 2) and the PureCode user-driven ticket simulator (desktop only; the auto-playing hero loops are deliberately NOT instrumented — they measure nothing about visitor intent).

### A-6: `select_content` on both card surfaces

GOAL names "case card click"; cards exist on the homepage WorkPreview and on /work. Both fire `select_content` with a `surface` param (`work_preview` / `work_page`) so the two entry points are separable in reports.

---

## Phase 2 — Structural funnel fixes (decisions made ahead of implementation)

### S-1: Case chain closes through BrandOS

`CompoundIQ → AutoPilot → PureCode → BrandOS → CompoundIQ`. GOAL left PureCode's successor open ("loop or BrandOS — your call"). BrandOS wins because (a) it has the site's strongest live interactive (the analyzer) — momentum flows toward a demo, which is itself a funnel metric; (b) BrandOS ends in an inline `BookingWidget` (`BrandOSPage.tsx:972`), so the chain's last hop lands on a booking surface. BrandOS then loops back to CompoundIQ so no case dead-ends.

### S-2: CTA copy + next-case hooks decided by tournament

Three independent proposer agents (operator voice / diagnostic voice / manuscript voice) each produced a full slate; a judge agent scores voice fit, clarity, funnel advancement per GOAL's orchestration mandate. Winning slate recorded below once judged.
