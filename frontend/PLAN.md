# DaVeenci Mobile Landing — Implementation Plan

> Living document. Safe to resume from this file alone if context is lost.

## Philosophy

**Desktop is a magazine *spread*. Mobile is a magazine *read*.**

Mobile is NOT a responsive scale of desktop. It's a parallel, mobile-native layout composed scene-by-scene for portrait orientation and thumbs. Brand (colors, fonts, voice) is inherited verbatim from desktop; layout is rebuilt.

## Scope

**In scope (v1):**

- Landing page (`/`) — full mobile-native tree
- Navigation (header + full-screen menu takeover + persistent bottom CTA)
- Booking preview → bottom-sheet date/time picker
- Calendar page — step-indexed mobile flow
- About page — portrait-first founder blocks
- Thesis page — reader-mode essay
- Codex list + article — story/reader style

**Out of scope (v1):**

- Admin, Pulse, Brand analyzer, Events, Work subpages (PureCode/AutoPilot). These can follow once landing is shipped.

## Architecture

**Breakpoint:** `md` (768px).

- `< 768px` → mobile layout (new tree)
- `≥ 768px` → existing desktop layout (unchanged)

**Render strategy:** a single `useIsMobile()` hook drives which component tree mounts. Not dual-render; not CSS hiding. Only one tree is instantiated. The hook uses `matchMedia` with an SSR-safe default (assumes desktop until the media query resolves client-side).

```tsx
const isMobile = useIsMobile();
return isMobile ? <MobileLanding /> : <DaVeenciLandingPage />;
```

**File structure:**

```
frontend/
  components/
    mobile/
      useIsMobile.ts              # matchMedia hook
      MobileShell.tsx             # sticky header + menu trigger + bottom CTA
      MobileMenu.tsx              # full-screen takeover
      MobileFolioScene.tsx        # reusable snap-scroll scene primitive
      MobileLanding.tsx           # orchestrator for landing folios
      MobileHero.tsx              # Folio I
      MobileContrast.tsx          # Folio II
      MobileMethod.tsx            # Folio III (vertical station scrub)
      MobileFounderBlock.tsx      # Anton
      MobileAdvantage.tsx         # Folio IV (swipeable cards)
      MobileControls.tsx          # Folio V (tap channel chips)
      MobilePartnerBlock.tsx      # Astrid
      MobileBooking.tsx           # Folio VI scene
      MobileBookingSheet.tsx      # bottom sheet picker
      MobileCodex.tsx             # Folio VII
      MobileCalendarPage.tsx      # /calendar
      MobileWhoWeArePage.tsx      # /who-we-are
      MobileThesisPage.tsx        # /thesis
      MobileBriefingsPage.tsx     # /codex
      MobileBriefingDetailPage.tsx# /codex/:id
```

App-level routing (`App.tsx`) stays; inside each route, we branch to mobile/desktop via the hook.

## Brand constraints (inherited, unchanged)

- Colors: `base`, `alt`, `ink`, `ink-muted`, `accent` (#3f84c8) from `tailwind.config.js`
- Fonts: IM Fell English (serif), Inter (sans), La Belle Aurore (script)
- Parchment body gradient and paper texture
- Accent italic color pattern (title phrase in `.italic.text-accent`)
- Editorial voice (no product-y sans-heavy copy)

## Mobile-specific design decisions

### Typography scale

- Hero display: `text-[3.5rem] leading-[1.05]` (~56px)
- Folio title: `text-[2.75rem] leading-[1.08]` (~44px)
- Body: `text-[17px] leading-[1.65]`
- Eyebrow: `text-[11px] tracking-[0.25em] uppercase`
- Numerals in lists: `font-serif italic text-lg text-accent`

### Spacing rhythm

- Scene padding: `px-6 py-12`
- Between blocks within a scene: `space-y-8`
- Respect iOS safe area: `pb-[env(safe-area-inset-bottom)]` on bottom bar

### Scroll-snap

- Parent: `scroll-snap-type: y mandatory` on the landing container
- Each scene: `scroll-snap-align: start` + `min-h-screen`
- Disabled when user is inside a bottom sheet (prevents body scroll)

### Animation posture

- Cut particle counts on mobile NodeNetworkBackground to ~30%
- Prefer CSS keyframes over SMIL where possible (battery, perf)
- Respect `prefers-reduced-motion`
- Simplify SVG illustrations: drop detail labels, keep one hero motif per scene

### Interactions

- Minimum tap target: 44×44
- Primary CTA lives in thumb zone (bottom ~30% of screen)
- Persistent bottom CTA bar: appears after hero scrolls past, hides on booking scene and on all non-landing routes
- Tap-to-expand for lists (not auto-open)
- Horizontal swipe for carousels (Folio IV), scroll for everything else

### Header

- Sticky minimal bar: logo (left) + ☰ (right)
- Transparent over hero, solid parchment once scrolled past
- Menu: full-screen takeover with large serif folio list + Talk to us primary CTA

## Phase breakdown

### Phase 1 — Shell (foundation)

**Goal:** mobile layout renders, snap-scroll works, header + menu + persistent CTA work. Content is placeholder scenes.

**Tasks:**

1. Create `components/mobile/` directory.
2. Create `useIsMobile.ts` hook (matchMedia, SSR-safe default false).
3. Create `MobileFolioScene.tsx` — reusable `<section>` with `min-h-screen`, snap alignment, optional eyebrow/title/children props.
4. Create `MobileMenu.tsx` — full-screen takeover with folio list + CTA.
5. Create `MobileShell.tsx` — sticky header, menu state, persistent bottom CTA bar, `children` slot.
6. Create `MobileLanding.tsx` — uses MobileShell; renders 7 placeholder scenes (one per folio).
7. Update `DaVeenciLandingPage.tsx` to branch: `isMobile ? <MobileLanding /> : <existing tree>`.
8. Smoke test at 375px and 768px widths.

### Phase 2 — Hero + Folio I (the hook)

**Goal:** real mobile hero scene.

**Tasks:**

1. `MobileHero.tsx` with eyebrow "FOLIO I · THE THESIS", display headline "AI teams. *Not AI tools.*", short sub, CTA "Talk to us".
2. Simplified "Fig. i" SVG — controller + 3 orbital agents (no labels, no dashed circle).
3. Subtle vitruvian partial at low opacity.
4. Wire into MobileLanding (replace placeholder).

### Phase 3 — Content folios (II–V + founder/partner)

Per-scene treatments:

- **Folio II (Contrast):** headline-led; "the 3 symptoms" collapsed, tap to expand as i/ii/iii accordion.
- **Folio III (Method):** vertical station scrub. Six stations stack; sticky right-edge indicator marks current. Dot moves as you scroll.
- **Folio IV (Advantage):** horizontal swipeable carousel, one card per advantage, pager dots.
- **Folio V (Controls):** eyebrow + headline + three channel chips. Tap a chip → that channel's demo expands below.
- **Founder block (Anton):** portrait fills upper ~55% of screen, quote overlays bottom edge, prose below. Dark background preserved.
- **Partner block (Astrid):** same pattern, light background.

### Phase 4 — Booking + Calendar

**Tasks:**

1. `MobileBooking.tsx` — scene with 4-day chip strip + prominent "Book a call" button.
2. `MobileBookingSheet.tsx` — bottom sheet with full date picker then time chips.
3. `MobileCalendarPage.tsx` — full-screen version of `Calendar.tsx` with step pager (01 Time → 02 Details → 03 Confirm), sticky progress top, sticky CTA bottom.
4. Preserve sessionStorage handoff from landing preview.

### Phase 5 — About / Thesis / Codex

**Tasks:**

1. `MobileWhoWeArePage.tsx` — portrait founder blocks + distinction as horizontal swipeable cards.
2. `MobileThesisPage.tsx` — reader mode: big serif sections, fixed progress bar at top, minimal chrome.
3. `MobileBriefingsPage.tsx` — story cards with big imagery, tap opens detail.
4. `MobileBriefingDetailPage.tsx` — article reader with sticky top progress and floating back button.

## Conventions

- All mobile components prefixed `Mobile<Thing>`.
- Don't edit desktop components while building mobile. If a shared primitive needs a mobile variant, create the variant in `components/mobile/` rather than mutating `Shared.tsx`.
- Prefer tailwind utilities; avoid inline styles except for dynamic values (e.g. safe-area env()).
- Test at 375px (iPhone SE) and 390px (iPhone 14). Don't worry about iPad (tablet falls back to desktop layout).

## Status log

### Initial build
- [✓] Phase 1 — Shell (useIsMobile hook, MobileShell, MobileMenu, MobileFolioScene, MobileLanding with placeholders, DaVeenciLandingPage routing)
- [✓] Phase 2 — Hero / Folio I (MobileHero with headline, Fig. i mini-plate illustration, "See the work" thumb-zone link)
- [✓] Phase 3 — Content folios + Founder/Partner (MobileContrast accordion, MobileMethod vertical station rail, MobileFounderBlock dark portrait, MobileAdvantage swipeable carousel, MobileControls tap-chip demos, MobilePartnerBlock light portrait)
- [✓] Phase 4 — Booking scene + mobile Calendar page (MobileBooking folio VI with day-tab pattern + time chips, MobileCalendarPage full-screen step flow — datetime → details → success — with sticky top step indicator and bottom CTA, Calendar.tsx routes by viewport)
- [✓] Phase 5 — About / Thesis / Codex mobile pages (MobileWhoWeArePage with Folio 0 hero, Anton/Astrid blocks, distinction carousel, Fig. d CTA widget; MobileThesisPage reader mode with scroll progress bar, numbered chapters, pull quotes, cinematic dark Section III; MobileBriefingsPage with sticky category filter + story cards; MobileBriefingDetailPage with scroll progress, Quick Answer callout, sections, FAQ, end CTA. WhoWeArePage / ThesisPage / BriefingsPage / BriefingDetailPage all branch by viewport.)

### Audit remediation
- [✓] Round 1 polish — Astrid bg-white→/50, Advantage cards /80→/70, MobileFolioScene pb-28→pb-24, Hero subtitle leading normalized, tracking-tight across all scene headlines, Anton/Astrid portraits w-52→w-56
- [✓] Phase A (a11y) — [data-mobile] focus-visible outline, prefers-reduced-motion collapse, MobileMenu role=dialog + aria-modal + focus trap + Escape close + focus return to trigger
- [✓] Phase B (rhythm) — WhoWeAre subtitle leading 1.65→1.6, WhoWeAre distinction cards /80→/70
- [✓] Phase C (design primitives) — MobileButton (primary/secondary/dark variants), MobileScenePlate (3-dot chrome + Fig label), MobileSceneTitle/MobileSceneSubtitle; migrated across all mobile pages/scenes
- [✓] Phase D (cleanup) — Method rail-mote keyframe extracted from inline <style> into .method-rail-mote utility in index.css

### Remaining polish (resolved)
- [✓] Error boundary wrapping mobile routes (MobileErrorBoundary inside MobileShell)
- [✓] Menu scroll restore (MobileMenu saves/restores window.scrollY)
- [✓] Progress-bar scrollY fallback (Thesis + BriefingDetail use `window.scrollY ?? documentElement.scrollTop ?? body.scrollTop ?? 0`)
- [✓] WebP portraits (Anton 875 KB → 199 KB; Astrid 910 KB → 233 KB; ~1.4 MB saved)
- [✓] Route-level code splitting via React.lazy (initial bundle dropped from 1.13 MB to ~280 KB — 75% reduction for landing visitors; every other page loads its own chunk on demand)
- [~] MobileCalendarPage split: file is 451 lines but works, tests cleanly, and the state-sharing between steps would require threading 10+ props per child. Kept as one file — refactor risk > cleanup reward at this stage. Revisit if/when the file grows further.
- [~] Skeleton states: browser-native `loading="lazy"` + aspect-ratio containers already prevent layout shift on the briefings list and article images. Booking availability fetch is fast enough that skeleton day-tabs would flash. Not worth adding complexity.
- [~] MobileBookingSheet: originally planned as a bottom-sheet picker for the landing booking scene. The direct-to-calendar navigation (via sessionStorage preselect) turned out to be simpler and better UX. Removed from plan.

## Open questions (decide later)

- Bottom nav tabs vs menu-only? Deferred until after Phase 1.
- Dark mode? Not in scope unless requested.
- PWA install prompt? Not in scope.
