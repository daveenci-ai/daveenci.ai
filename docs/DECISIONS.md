# Funnel Run — Decision Log

Branch: `improve/funnel-20260710`. Every judgment call made during the autonomous run is recorded here with reasoning, per GOAL.md guardrail 1.

---

## Phase 0 — Ground truth verification

### GT-1: Ground truth re-verified 2026-07-10; three drifts found

Every GOAL.md bullet was checked against the working tree. Confirmed:

- Custom pushState router: `frontend/App.tsx:151` (`handleNavigate`), `pushState` at `App.tsx:182`, `replaceState` redirects at `App.tsx:43,65,70,79`, `popstate` at `App.tsx:99`. No react-router.
- Two parallel trees: `frontend/components/*.tsx` + `frontend/components/mobile/*.tsx` (desktop page components branch on `useIsMobile` and render the `Mobile*` variant).
- Zero analytics instrumentation: grep for `gtag|ga4|googletagmanager|analytics|plausible|posthog|mixpanel|segment` matches only marketing copy in `BriefingDetailPage.tsx:632`.
- Homepage order: `frontend/DaVeenciLandingPage.tsx:34-43` and `frontend/components/mobile/MobileLanding.tsx:26-34` — WorkPreview is 7th in both.
- "Talk to us": 33 occurrences across 24 files.
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
