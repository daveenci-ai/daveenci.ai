# Layered homepage — evaluation and plan

**Date:** 2026-09-02 · **Branch:** `improve/layers-20260902` · **Owner:** Anton
**Decisions taken before this run:** add Marketing Analytics OS as a fourth offer + case, publish the agent control plane as a thesis-style piece (codename never named publicly), homepage only (desktop + mobile), "editorial depth" motion, no new dependencies.

---

## 1. Evaluation

### What already works
The site has a real identity — the Renaissance-workshop parchment, folio numbering, tilted figure plates, serif display type — and it does not overclaim: status labels are honest, three demos run against real code, fonts are self-hosted, the hero is prerendered for LCP, GA4 events are in place, and the desktop/mobile trees are kept in parity by discipline. Nothing here should be thrown away.

### Why it does not feel layered
The reference (premium "layered" sites, the technique the video calls layered scroll effects) gets its feel from **three planes moving at different speeds** and from **scenes that hold still while the visitor reads them**. The current homepage has neither.

1. **One plane.** All twelve sections use the same 500 ms fade-up reveal. Scaffold drawings, plates, pills and copy all travel at scroll speed, so 12,000 px of page reads as a single flat sheet.
2. **Sameness.** Contrast, Controls and Booking are the same plate-left-copy-right layout. FounderBlock and PartnerBlock are the same dark band twice. By the middle of the page the eye stops registering new sections.
3. **The best animation is invisible.** Method's 18.5 s specialist choreography only plays for a visitor who stops scrolling. It should be driven by the scroll itself.
4. **The funnel's key step is the weakest visual.** The Work cards are text with a status pill; no case has a picture of what it is.
5. **Mobile has no scroll motion at all**, and the scene model in `frontend/PLAN.md` was never implemented (`MobileFolioScene` is plain flow).
6. **The frame budget is spent on decoration.** Four canvas node-networks run an O(n²) loop every frame whether or not they are on screen. Scroll-linked motion needs that budget.
7. **The newest work is absent.** Measurement / experimentation engagements and the governed-agent control plane are the two things the workshop is building right now; neither appears on the site.

Two structural blockers for any pinned scene: `Section` defaults to `overflow-hidden`, and the landing root uses `overflow-x-hidden`, which makes it a scroll container and neutralises `position: sticky`. Both are fixed in Layer 0 (`overflow-x: clip`, explicit `overflow` on pinned sections).

---

## 2. Design rules for the layered system

- **Three planes per scene.** *Scaffold* (construction drawings, slowest, ~0.25× scroll), *Plate* (the figure, ~0.8×), *Annotation* (pills, ~1.2×). Copy stays in normal flow at 1×. Depth comes from the speed difference, not from blur or 3D.
- **Scenes hold still to explain.** Only two scenes pin: Work (stacking cards) and Method (scrubbed rail). Everything else is parallax in normal flow, so total page length stays close to today's.
- **Scroll is the timeline.** Progress is written to CSS custom properties (`--p`) from one passive scroll listener + `requestAnimationFrame`; no React re-render per frame. Existing SMIL and CSS keyframes are scrubbed with `svg.setCurrentTime()` and `Animation.currentTime`, so the Method choreography is reused, not rebuilt.
- **Reduced motion is a first-class path.** `prefers-reduced-motion: reduce` disables parallax and pinning; scenes render as static stacked layouts. Nothing depends on JS to be readable.
- **Zero new requests.** No animation library, no external assets. Bundle growth target: under 6 kB gzipped for the landing chunk.
- **The prerender shell stays truthful.** Hero markup at progress 0 must equal the SSR output (identity transforms as defaults, `ScrollReveal immediate` kept on the h1 path).

---

## 3. Layers (in build order)

| Layer | Scene | What changes | Files |
|---|---|---|---|
| 0 | Foundation | `useScrollProgress` hook (IO-gated, rAF-throttled, writes `--p`), `Parallax`, `Pinned`, `StackCard` primitives, motion tokens, reduced-motion switch, canvas visibility gating, overflow fixes, single smooth-scroll rule | `lib/useScrollProgress.ts`, `components/motion/*`, `Shared.tsx`, `src/index.css`, `DaVeenciLandingPage.tsx`, `index.html` |
| 1 | Hero + ProofRail | Scaffold, plate and pills move at three speeds; pointer tilt on the plate (desktop); copy settles as ProofRail slides up over the hero's lower edge | `Hero.tsx`, `ProofRail.tsx` |
| 2 | Work | Stacking-card scene: four cases pin and slide over each other, each with a mini schematic (PureCode PR flow, ShootOS order-to-delivery, CompoundIQ gated loop, Analytics OS ad-to-verdict) | `WorkPreview.tsx`, `content/workCatalog.ts`, `components/CaseSchematics.tsx` |
| 3 | Method | Pinned 2.5-viewport scene; scroll drives the specialist along the six stations and scrubs the plate SMIL/CSS timelines; autoplay fallback | `Method.tsx`, `lib/scrubTimeline.ts` |
| 4 | Contrast · Controls · Booking | Plates and pills on separate planes; numbered lists reveal progressively with scroll; Controls mirrored to plate-right so the three plate scenes stop looking identical | `Contrast.tsx`, `Controls.tsx`, `BookingPreview.tsx` |
| 5 | Principals · Offers · Footer | One dark "spread" replaces the two founder bands: sticky portrait column that swaps Anton → Astrid as their quotes pass; Offers become a sticky-header tier ladder with the new Analytics OS tier; footer revealed from beneath the page | `Principals.tsx` (new, replaces FounderBlock/PartnerBlock on the homepage), `CommercialOffers.tsx`, `content/commercialOffers.ts`, `Footer.tsx` |
| C | Content | Analytics OS offer + case page (client unnamed, status "New engagement · Scoped Sep 2026" until the client consents), control-plane piece "How we run our own agents" (status: architecture v9, Phase 0 in build), routes, metadata, sitemap, OG | `content/*`, `components/AnalyticsOSPage.tsx`, Codex entry, `App.tsx`, `lib/routeMetadata.ts`, `public/sitemap.xml` |
| M | Mobile | Same scenes, lighter: stacking cards, scrubbed Method rail, principals swap, footer reveal; parallax reduced to one plane; sticky CTA bar preserved | `components/mobile/*` |

---

## 4. Verification (done before handover)

1. `tsc --noEmit`, `npm run lint` (zero new warnings), `npm run build` (prerender step passes).
2. Playwright screenshots at 1440×900 and 390×844 at every scene, scrolled incrementally so observers fire; reduced-motion run at both widths.
3. Lighthouse mobile on the production build before/after; LCP must not regress beyond noise, CLS stays 0.
4. Manual check of: header anchor offsets (`#services`, `#book`), booking preselect flow, GA4 events still firing (`work_preview_viewed`, `cta_click`, `practice_open`).
5. Four commits on the branch (foundation, content, desktop layers, mobile layers), each one building on its own; nothing pushed or deployed.

## 5. Out of scope for this run
Case pages, Work page, Codex layout, backend. The prerender shell is regenerated by the build, not edited by hand.

---

## 6. Delivered in this run (2026-09-02)

All layers in §3 are on the branch, desktop and mobile. Verification as run in a clean container build:

| Check | Result |
|---|---|
| `tsc --noEmit`, `eslint .` | clean, zero warnings |
| `npm run build` incl. prerender step | passes; hero shell 15.1 kB (was 14.8) |
| Landing chunk | 113.7 kB gz (was 107.5) — +6.2 kB for the hook, primitives, four schematics and the principals spread |
| Lighthouse mobile, production build, same machine | performance 75 → **83**, LCP 2.8 s → **2.4 s**, TBT 610 → 480 ms, Speed Index 4.2 → 2.2 s, CLS 0 → 0.007; a11y / best-practices / SEO 100 unchanged. The gain is mostly the four canvas loops no longer running off-screen. |
| Screenshots | 1440×900 and 390×844 at 45 %-viewport steps through the whole page; reduced-motion run at both widths renders every scene static and fully readable |
| Routes | `/analytics-os` (desktop + mobile), `/codex/governed-agent-operations` render; header/footer/sitemap/metadata updated |

What changed on the homepage, in order: hero planes + pointer tilt → ProofRail rides over the hero → four stacking Work cards with schematics → Contrast (plate/pill planes, progressive list) → pinned, scroll-scrubbed Method → one Principals spread with a sticky portrait swap (replaces FounderBlock + PartnerBlock, now deleted) → Advantage unchanged → Controls mirrored to plate-right → Offers as a sticky-header ladder with the fourth tier → Booking planes → Codex teaser leads with No. 046 → footer revealed from beneath the page. Mobile mirrors every scene except pinning (stacking cards, scrubbed rail, inline principals, footer reveal).

### Decisions Anton should confirm before merge
1. **Analytics OS public price** — the offer card says "From $6,500 · five weeks to the first verdict" (the Measure tier). Remove the figure if the offer should be quoted only.
2. **Case status** — `content/workCatalog.ts` and `AnalyticsOSPage.tsx` carry "New engagement · Scoped Sep 2026" and describe "a direct-to-consumer telehealth brand". Flip to "In delivery" and name the client only with their consent.
3. **Codex No. 046** is signed by Anton and dated 2026-09-02; it names no codename and states Phase 0 is in build. Read it once before it goes live — it is the most specific public statement of how the workshop operates.
4. **Chips** under Operations Systems now include "Marketing measurement".

### Follow-ups (not in this run)
- Case pages and the Work page have no layered treatment yet (second pass).
- OG images for `/analytics-os` and No. 046 fall back to the site default.
- `BriefingDetailPage` uses a `prose` class without the typography plugin; a two-line CSS rule now spaces paragraphs, but the articles would benefit from real typographic defaults.
- `MobileFounderBlock` / `MobilePartnerBlock` remain for `MobileWhoWeArePage`; the desktop Who We Are page could adopt `Principals` too.
