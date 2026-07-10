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
2. **Mobile PureCode reuses the desktop simulator.** ~~Original claim: mobile PureCode has no demo.~~ Corrected by the Phase 1 completeness critic: `MobilePureCodePage.tsx:11` imports `TryItSimulator` from `../PureCodePage` and renders it at `:158`, so the ticket-simulator demo exists on mobile via the shared component. Instrumenting `TryItSimulator` at the component level (Phase 1) therefore covers both trees with one call site. Mobile BrandOS has its own full analyzer (`MobileBrandOSPage.tsx:71-108`), instrumented separately.
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

Per GOAL Phase 1: BrandOS analyzer (desktop + mobile) and the PureCode user-driven ticket simulator (`TryItSimulator` — a shared component, so instrumenting it once covers desktop AND mobile; see corrected GT-1 drift 2). The auto-playing hero loops are deliberately NOT instrumented — they measure nothing about visitor intent.

### A-6: `select_content` on both card surfaces

GOAL names "case card click"; cards exist on the homepage WorkPreview and on /work. Both fire `select_content` with a `surface` param (`work_preview` / `work_page`) so the two entry points are separable in reports.

### A-7: Phase 1 skeptic found 7 defects; all fixed before the phase closed

The skeptic critic FAILED the first Phase 1 commit (`8162cae`). Confirmed defects and fixes (fix commit follows it):

1. **UTM stripping** — `trackPageView` rebuilt `page_location` from origin+pathname, discarding query/hash → campaign attribution loss. Fixed: `page_location` is now full `window.location.href`; `trackPageView` takes no argument and reads location at fire time (`lib/analytics.ts`).
2. **Same-page nav inflated pageviews** — `handleNavigate` pushed history + fired `page_view` even when the path didn't change (footer link to current page). Fixed: push+pageview skipped when normalized path is unchanged (`App.tsx`). This also stops redundant history entries — a deliberate routing behavior change, judged an improvement (Back no longer walks through duplicate entries).
3. **Landing anchor clicks inflated `/` pageviews** — same root cause as (2); covered by the same guard (hash never changes the path).
4. **StrictMode double initial pageview in dev** — mount effect has no cleanup and runs twice under StrictMode. Fixed: ref guard on the initial pageview + `onpopstate` cleanup returned from the effect.
5. **`case_engaged` false positive on load** — the 50% sentinel could sit inside the viewport before lazy content loads, firing `scroll_depth` with zero scrolling. Fixed: trigger now requires sentinel-in-view AND `scrollY > 8`, re-evaluated on scroll (`lib/useCaseEngaged.ts`).
6. **PulseNote had no `case_engaged`** — `pulsenote` is a `CaseId` reachable from /work cards but its page wasn't hooked. Fixed: `useCaseEngaged('pulsenote')` in the `PulseNotePage` wrapper (`PulseNotePage.tsx:1595`).
7. **`page_path` inconsistency** — mount/popstate sent raw pathname (possible trailing slash), navigate sent canonical path → one page could split into two GA rows. Fixed: normalization moved inside `trackPageView`, all call sites identical.

`docs/ANALYTICS_SETUP.md` updated to match (StrictMode note, UTM QA step, same-path no-fire QA step).

---

## Phase 2 — Structural funnel fixes (decisions made ahead of implementation)

### S-1: Case chain closes through BrandOS

`CompoundIQ → AutoPilot → PureCode → BrandOS → CompoundIQ`. GOAL left PureCode's successor open ("loop or BrandOS — your call"). BrandOS wins because (a) it has the site's strongest live interactive (the analyzer) — momentum flows toward a demo, which is itself a funnel metric; (b) BrandOS ends in an inline `BookingWidget` (`BrandOSPage.tsx:972`), so the chain's last hop lands on a booking surface. BrandOS then loops back to CompoundIQ so no case dead-ends.

### S-2: CTA copy + next-case hooks decided by tournament

Three independent proposer agents (A operator voice / B diagnostic voice / C manuscript voice) each produced a full slate; a judge agent scored voice fit, clarity, and funnel advancement (1-5 each) and picked per-slot winners, fact-checking every hook against the case pages. Winning slate (all fact-clean per the judge):

| Slot | Winner | Copy |
|---|---|---|
| Homepage hero primary | A | "Walk us through your workflow" |
| CompoundIQ closing CTA | A | "Map where autonomy stops" + sub "Bring the decision you don't dare fully automate. We'll design the gate around it, together." |
| AutoPilot closing CTA | B | "Name the handoff that breaks" (existing paragraph kept — it already carries B's diagnostic line almost verbatim) |
| PureCode CTA (hero + closing) | A | "Bring us a real ticket" |
| Hook CompoundIQ→AutoPilot | B | "Governance works in trading. See it hold a real-estate delivery line together — from order email to the final gate." |
| Hook AutoPilot→PureCode | B | "Gates caught the bad order. Watch them catch bad code — a feature request in, a shipped pull request out." |
| Hook PureCode→BrandOS | C | "Before you name the thing you shipped — a specialist that scores a brand name across ten weighted dimensions." |
| Hook BrandOS→CompoundIQ | C | "From naming to capital — a governed research team that proposes freely, yet can't act until every gate agrees." |

Notable judge fact-flags on losing lines (why they lost): "from order email to delivery" overclaims (Delivery reschedule is Shadow-gated, not live); "in seconds" is a speed claim no page makes; "handle money" contradicts paper-first. Guardrail 4 upheld.

### S-3: Placement judgment calls

- **Homepage sub-line dropped.** The hero's existing description already covers the winning sub-line's content; stacking both would clutter the folio. Label-only swap in `Hero.tsx`.
- **Mobile homepage CTA**: `MobileShell`'s fixed bottom bar keeps "Talk to us" (it's persistent chrome ≈ header/footer, which GOAL says must retain it). The contextual primary lives in `MobileHero`'s thumb zone as a full-width button above "See the work".
- **PureCode hero keeps its secondary "See all work"** — the dead-end GOAL targets is the page *ending*; an early-page route to /work is navigation, not a dead-end. The closing section's duplicate secondary is removed and replaced by the NextCase strip.
- **BrandOS CTAs untouched** — GOAL's contextual-CTA list names homepage/CompoundIQ/AutoPilot/PureCode; BrandOS already ends in a contextual `BookingWidget` ("Book a BrandOS intro"). It gets the NextCase strip (loop back to CompoundIQ) only.
- **NextCase / MobileNextCase extracted as components** (4 uses per tree — meets the style guide's 3+ rule, `docs/STYLE_GUIDE.md:97-99`); the component owns the `next_case_click` event so no call site can forget it.

### S-4: Phase 2 critic outcomes

Skeptic PASS (confirmed: anchors/folio numbering unbroken by the reorder, chain complete on 8 pages, "Talk to us" intact in Header/Footer/MobileShell, hooks fact-clean, tsc+build+lint clean). Completeness PASS. One cosmetic note fixed (stale `MobileHero.tsx` doc comment). Two flagged non-regressions accepted: mobile landing intentionally shows two calendar entry points (hero CTA + persistent bar); PulseNote sits outside the 4-case ring — GOAL's chain names the ring cases, PulseNote stays reachable from /work; folded into the next-run list in REPORT.md.

---

## Phase 3 — Newsletter capture with source

### N-1: Contextual framing reuses the ONE form per surface

GOAL demands "one email field everywhere." Desktop case pages already end in `Footer.tsx`, whose newsletter bar IS the form — so contextual framing is delivered as new optional Footer props (`newsletterHeading`, `newsletterBody`, `newsletterSource`) rather than a second form above it. Mobile has no form at all (GT-1 drift 1), so `MobileSubscribe.tsx` was created and appended to the four mobile case pages after the NextCase strip (mirroring the desktop order: content → next case → subscribe/footer). Exactly one email field per page on every surface.

### N-2: Copy stays honest — the newsletter is the Codex, not a per-case log

GOAL's example framing ("Follow the weekly CompoundIQ build log") would invent a product: no per-case log exists. The only letter is the Tuesday Codex (`Footer.tsx` default copy; Codex description in `MobileLanding.tsx:41-44`). The shipped headings ("Follow the CompoundIQ build", "Follow the operations work", "Follow the shipping log", "Follow the workshop") frame the SAME letter through each case's lens and every body line names the Codex + Tuesday cadence. Guardrail 4 over GOAL's illustrative example. Sources: `compoundiq`, `autopilot`, `purecode`, `brandos`, default `footer` — identical on both trees so device splits live in GA, not in the source taxonomy.

### N-3: Backend is additive AND migration-safe

`routes.ts` accepts an optional `source` (trimmed, capped at 100 chars, non-strings ignored). `newsletter.ts` inserts `(email, source)` but catches Postgres error `42703` (undefined column) and retries email-only, so the API keeps working even if the owner deploys code before running `backend/migrations/2026-07-10-newsletter-source.sql` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS source TEXT` — additive, nullable, safe live). The owner-notification email now includes the source (the "forward" path). I could not verify whether the column already exists: the Supabase MCP connection is unauthorized in this session; the fallback makes that unknown harmless. Migration listed in the REPORT.md merge checklist.

---

## Phase 4 — CompoundIQ gate simulator

### G-1: Design chosen by tournament — "Console Ledger" with borrowed elements

Three design proposals (mechanical Signal Bench / Console Ledger / manuscript Gate Plate) were judged on voice fit, first-timer clarity, funnel advancement, and implementability inside ~300 lines per tree. The Console Ledger won (17/20 vs 13 and 11): toggle rows + one send button + outcome banner is the only control model a first-time visitor decodes instantly, and it fits the line budget. Borrowed per the judge: the "Fig. ii · The action gate" plate label (Gate Plate) — the site already ships "Fig. i" plates, so Fig. ii is native continuation; plain-English outcome lines ("Stopped at Enabled? — venue not enabled."); and the Signal Bench's traveling accent pulse that visibly stops at the blocking gate.

### G-2: Implementation judgment calls

- **Placement**: directly after the "operating system" section on both trees (`CompoundIQPage.tsx` before the Guardrails Section; `MobileCompoundIQPage.tsx` before the Guardrails section) — the reader has just read the policy-gate spec (item 02: approved / enabled / unexpired), then immediately handles it.
- **Vocabulary is the page's own**: gate labels "Approved? / Enabled? / Unexpired?", "paper fill", "fees and slippage", "live disabled", "Rejected" all come from `CompoundIQPage.tsx:58-67` and the buildStatus data. No invented claims; the plate carries "Illustrative only — labels describe engineering behavior, not investment performance," echoing the page's own honesty line.
- **Judge's accessibility musts implemented**: toggles are real `role="switch"` buttons with `aria-checked` + focus rings; the outcome banner is an `aria-live="polite"` region; `prefers-reduced-motion` skips the travel animation and renders the outcome immediately; pass/block is never color-alone (icon + text token + plain-English line); ledger capped (5 desktop / 4 mobile lines) with fixed short tokens; amber-800 for text on parchment.
- **Judge's trap avoided**: no full dark terminal — the audit ledger is an ink-bordered inset on the parchment surface and the plain-English banner leads; the log corroborates.
- **demo events**: `demo_start` on first interaction (toggle OR send), `demo_complete` on first resolved outcome; both ref-guarded once per visit, `demo_id: 'compoundiq_gate_sim'` (typed in `AnalyticsEventMap` since Phase 1).
- **Line budget kept**: `GateSimulator.tsx` 274 lines, `MobileGateSimulator.tsx` 246 lines — under ~300 per tree.
- **Two implementations, not one shared**: the trees' layouts genuinely differ (two-column vs stacked); sharing would mean a props/branching layer that costs more than the ~120 duplicated logic lines. Precedent exists in both directions; the teaser stays self-contained.
- **AutoPilot cheap interaction**: proposed in REPORT.md as next-run work (GOAL: propose, don't build).
