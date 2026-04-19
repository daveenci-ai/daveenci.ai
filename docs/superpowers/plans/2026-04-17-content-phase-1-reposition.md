# Content restructure — Phase 1 (reposition)

**Source:** content restructure document provided by Anton (services → product-company reposition).

**Goal:** Smallest change that stops the site actively fighting the new brand thesis ("AI teams, not AI tools"). Single cohesive PR — no half-states between merges.

## Decisions (defaulted)

1. **Copy:** use verbatim from Anton's doc §3.1 / §3.2 / §3.3 / §3.4 / §3.5 / §3.7 / §3.8.
2. **Waitlist:** reuse existing `/api/newsletter/subscribe` endpoint. No backend changes.
3. **/briefings → /codex:** server-side 301 via `vercel.json` routes + in-app route handling.
4. **Nav:** simple link list for Phase 1 (no dropdown): PureCode · ShootOS · Codex · About. Primary CTA: "Join the waitlist."
5. **Homepage section removals:** Problems (replaced by Contrast), Solutions, Booking, Brand Analyzer promo (moves off-homepage entirely — still reachable at `/brand-analyzer`).
6. **Events:** demote to bottom of homepage, above Footer.
7. **Newsletter section:** stays; copy tweaked per §3.6.
8. **Product pages:** `/purecode` and `/shootos` ship as one-screen stubs with waitlist capture (they get the full build in Phase 2).

## File map

**Create:**
- `frontend/components/Contrast.tsx` — the "Industry Is Wrong" section
- `frontend/components/PureCodeTeaser.tsx` — homepage PureCode block
- `frontend/components/ShootOSTeaser.tsx` — homepage ShootOS block
- `frontend/components/NextTeams.tsx` — "three more teams in design" tease
- `frontend/components/FounderBlock.tsx` — Anton founder moment
- `frontend/components/CTAStack.tsx` — three-card CTA stack
- `frontend/components/PureCodePage.tsx` — stub /purecode
- `frontend/components/ShootOSPage.tsx` — stub /shootos

**Modify:**
- `frontend/components/Hero.tsx` — new H1/sub/CTAs/footnote
- `frontend/components/Header.tsx` — new tagline + new nav + "Join the waitlist" CTA
- `frontend/components/Footer.tsx` — 4-column rebuild
- `frontend/components/Newsletter.tsx` — rename "Join the Guild" → "Subscribe to the Codex"
- `frontend/DaVeenciLandingPage.tsx` — new section order
- `frontend/App.tsx` — routes for `/purecode`, `/shootos`, `/codex` (301 from `/briefings`)
- `frontend/components/types.ts` — Page type adds `'purecode'`, `'shootos'`, `'codex'`
- `vercel.json` — 301 redirect `/briefings` → `/codex`, new route allowlist
- `frontend/public/sitemap.xml` — add new routes, rename briefings → codex

**Leave as-is this PR:**
- `BriefingsPage.tsx` — keep file, just route it under both `/briefings` (redirect) and `/codex`. Rename to `CodexPage.tsx` in a follow-up to avoid file moves in this PR.
- `Problems.tsx`, `Solutions.tsx` — files stay (not imported on homepage anymore). Delete in a follow-up cleanup.
- `Booking.tsx` — same. Used on `/calendar` still; homepage no longer imports.
- `WhoWeArePage.tsx` — Phase 3 rewrite.

## Homepage section order (new)

1. `<Header>`
2. `<Hero>` — thesis + CTAs
3. `<Contrast>` — Folio II (new)
4. `<PureCodeTeaser>` — Folio III (new)
5. `<ShootOSTeaser>` — Folio IV (new)
6. `<NextTeams>` — Folio V (new)
7. `<Newsletter>` — Codex (existing, copy tweaked)
8. `<FounderBlock>` — Anton moment (new)
9. `<CTAStack>` — three CTAs (new)
10. `<Events>` — demoted, above footer
11. `<Footer>` — new 4-column

Current homepage structure (Hero → Problems → Solutions → BrandAnalyzerPromo → Events → WhoWeArePage → Booking → Newsletter) collapses to the above.

## Hex / lint impact

- No new hex literals.
- Lint baseline stays at 21 (Google brand + Pulse brand exceptions only).

## Out of scope (Phase 2-4)

- Full PureCode page (cast cards, demo video, pipeline diagram)
- Thesis essay (`/thesis`)
- Studio playbook (`/studio`)
- Build Log sub-feed on Codex
- About rewrite (Anton-first)
- Tools page (`/tools`) — Brand Analyzer stays at its current URL for Phase 1
- Contact page (`/contact`)
- Waitlist infrastructure (per-product tables/routes)
- Case studies page (where the 43%/120+/14days stats could live)
