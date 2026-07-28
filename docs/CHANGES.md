# Audit fixes — priorities 1 to 3

**Date:** 2026-07-25
**Branch:** `audit/site-20260725`
**Companion document:** `docs/AUDIT.md` (the findings these changes address)

Priorities 1, 2 and 3 from the audit, implemented across both component trees. Priorities 4 to 10 are untouched. `npm run build` and `tsc --noEmit` are clean; nothing was pushed to a remote.

---

## Priority 1 — invented statistics

**The "Calibrated Trust" figure** (`components/Advantage.tsx`, `components/mobile/MobileAdvantage.tsx`). The four hardcoded accuracy percentages — 92, 74, 86, 58 — no longer render as numeric labels. The bars remain as a schematic of relative weighting, which is what they always actually were. The eyebrow changed from "accuracy · track record · weighted" to "schematic · track record", and the caption changed from *"Each specialist carries a trust score from actual outcomes"* to a description of the mechanism: *"Each specialist accumulates a track record inside the system it runs in. When specialists disagree, the one with the better record on that call carries more weight."* The visual is unchanged apart from the missing numbers.

**PulseNote** (`components/PulseNotePage.tsx`, `components/mobile/MobilePulseNotePage.tsx`). A labelled note now sits directly under the hero on both trees: *"PulseNote is a product demonstration. The transcripts, posts and figures shown throughout this page are generated from one example meeting — not from client work."* The demo content itself is unchanged — the $40K, the 60%, the 200+ conversations are all output of a fictional meeting inside product mockups, and they read correctly once the page says so. This matches how CompoundIQ already handles the same problem.

**PureCode's ticket simulator** (`components/PureCodePage.tsx`). The shared `TryItSimulator` component now ends with *"Illustrative — the tickets and results are worked examples, not client work"*, so PR #247 and the −92% query result carry a label. Because the component is shared, this appears on both trees automatically.

**The specialist count** (`components/CompoundIQPage.tsx`, `components/mobile/MobileCompoundIQPage.tsx`). The stat rail read "5 specialist roles" while the same page's heading read "Four specialists. One constrained loop." and the data below defined four. Changed to 4.

**Not changed, and why.** The f8 Real Estate Media reference stays — you confirmed it is a real client with permission. Two things follow from that which are worth doing later: the name currently appears in exactly one clause of one paragraph on each tree, which is far less weight than a real named client deserves, and a logo or a quote would turn the site's weakest-evidenced case page into its best-evidenced one. Separately, `PulseNotePage.tsx:224` states that PulseNote *"automatically pulls the transcripts of your meeting recorders like Fathom, Fireflies or Otter"* — I left the wording alone because I have no way to tell whether those integrations exist. If they don't yet, that line needs the same treatment as the rest of the page.

---

## Priority 2 — colour contrast

The base accent `#3F84C8` gives 3.93:1 with white text, below the 4.5:1 WCAG AA threshold, and it filled every primary button on the site.

A new token `--color-accent-strong: #1E5A94` joins the palette (`src/index.css`, `tailwind.config.js`). The base accent is unchanged, so decorative use — diagram strokes, borders, large display type — keeps the brand blue exactly as it was. What changed is text and fills:

Primary buttons now fill with `accent-hover` (`#2F6CA8`, 5.48:1 with white) and darken to `accent-strong` (7.13:1) on hover or press — `components/Shared.tsx`, `components/mobile/MobileButton.tsx`. The ghost button variant moved to `accent-strong` text.

The hero pricing line dropped its `/60` opacity modifier and now uses full `text-ink-muted` — 6.65:1 instead of 2.74:1. On mobile that line is 9px, so it was the worst offender on the site (`components/Hero.tsx`, `components/mobile/MobileHero.tsx`).

The mobile hero's "See the work" link moved from `text-accent` (3.08:1) to `text-accent-strong` (5.59:1), and the mobile founder label from `text-canvas/50` (4.33:1) to `/70`.

Lighthouse's colour-contrast audit now passes with zero violations, and the accessibility score moved from 96 to 100.

---

## Priority 3 — first-screen performance

**Fonts are now self-hosted.** The render-blocking `fonts.googleapis.com` stylesheet is gone. It requested eight static faces across two families and Lighthouse attributed 780 ms of blocked render to it. In its place: three variable woff2 files in `public/fonts/` (Playfair Display roman and italic, Inter roman — latin subset, 125 KB total), declared with `@font-face` in `src/index.css` where the CSS the page already loads picks them up. Variable fonts cover every weight the site uses rather than the eight discrete faces that were requested before, including the weights that were previously being synthesised by the browser.

Only the serif is preloaded from `index.html`. It renders the hero `h1`, which is the LCP element. Preloading Inter as well measured 0.2 s worse — it contends for the same bandwidth without being on the critical paint path.

The site now makes **zero third-party network requests** on the homepage.

**The landing chunk is preloaded.** A small Vite plugin in `vite.config.ts` emits `<link rel="modulepreload">` for the landing page chunk. It was a lazy route, so the browser could not discover it until the entry bundle had downloaded, parsed and executed — a full round trip in front of the homepage's paint. The plugin preloads only that one chunk and lets the browser walk its dependency graph; hand-preloading all eighteen transitive chunks measured worse, since they contend with the CSS and font the first paint actually waits on.

**The calendar API no longer fires on page load.** `BookingPreview` and `MobileBooking` both requested `/api/calendar/availability` from a mount effect, for a section near the bottom of the page. A new `lib/useNearViewport.ts` hook holds the request until the section comes within 400px of the viewport. It falls back to fetching immediately where `IntersectionObserver` is unavailable, and it latches so scrolling past twice does not refetch. This also removes a backend hit from every homepage view.

**Image dimensions.** The founder and partner portraits now carry explicit `width`/`height` on both trees, plus the two booking-section thumbnails — the images Lighthouse flagged. The `unsized-images` audit passes.

---

## Measurements

Lighthouse 13.4.1, mobile emulation, against the production build served locally.

| | before | after |
|---|---|---|
| Performance | 90 | 90 |
| Accessibility | 96 | **100** |
| Best practices | 96 | **100** |
| SEO | 100 | 100 |
| Speed Index | 4.3 s | **2.4 s** |
| Total Blocking Time | 110 ms | **90 ms** |
| First Contentful Paint | 2.1 s | 2.4 s |
| Largest Contentful Paint | 2.9 s | 3.1 s |
| Cumulative Layout Shift | 0 | 0.007 |
| Third-party requests | 1 (render-blocking) | **0** |

**The LCP and FCP columns are not a fair comparison, and the direction is misleading.** The audit sandbox has no route to the public internet, so in the "before" run the Google Fonts request failed instantly and the hero painted in Georgia with no web font ever loading. The "after" run downloads and applies real fonts. The baseline was measured doing strictly less work than the browser does in production. Production today pays the font cost *and* the 780 ms third-party round trip that the sandbox never charged it.

What the numbers do support: Speed Index nearly halved, the third-party dependency is gone, blocking time is down, and the accessibility and best-practice failures are fixed.

**LCP is still around 3 s and this change did not fix it.** The Lighthouse breakdown attributes 28 ms to time-to-first-byte and 623 ms to element render delay. The hero `h1` cannot paint until React has booted, because the served HTML contains an empty `<div id="root">`. That is the prerendering item in the audit — the largest remaining performance lever and a one-to-two-day piece of work on its own, since the custom pushState router needs to hydrate cleanly over prerendered markup. Nothing short of it will get this site under 2.5 s.

---

## Verification

`npm run build` passes and `tsc --noEmit` reports no errors. Rendered screenshots at 1440px and 390px confirm the fonts load correctly, the darker buttons still read as brand blue, the pricing line is legible, and the Calibrated Trust figure still works visually without its numeric labels. Lighthouse's colour-contrast, unsized-images and console-error audits all pass. Nothing was committed to `main` and nothing was pushed.

## Files touched

Changed: `index.html`, `src/index.css`, `tailwind.config.js`, `vite.config.ts`, `components/Advantage.tsx`, `components/BookingPreview.tsx`, `components/CompoundIQPage.tsx`, `components/FounderBlock.tsx`, `components/Hero.tsx`, `components/PartnerBlock.tsx`, `components/PulseNotePage.tsx`, `components/PureCodePage.tsx`, `components/Shared.tsx`, `components/mobile/MobileAdvantage.tsx`, `components/mobile/MobileBooking.tsx`, `components/mobile/MobileButton.tsx`, `components/mobile/MobileCompoundIQPage.tsx`, `components/mobile/MobileFounderBlock.tsx`, `components/mobile/MobileHero.tsx`, `components/mobile/MobilePartnerBlock.tsx`, `components/mobile/MobilePulseNotePage.tsx`.

Added: `lib/useNearViewport.ts`, `public/fonts/playfair-display-latin-var.woff2`, `public/fonts/playfair-display-latin-var-italic.woff2`, `public/fonts/inter-latin-var.woff2`.
