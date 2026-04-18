# Phase 2 PR #9 — migrate-pulse (part 1: tokens only)

**Goal:** Tokenize the design-palette hex literals in `PulseLandingPage.tsx` (54 total hex). Third-party brand literals (LinkedIn blue, Facebook gradients, etc.) stay as-is and will be documented as exceptions in Phase 3's style guide.

**Scope:**
1. Add new token `--color-pulse-surface` for `#FAF8F4` (Pulse's brand off-white — used on many "phone/screen" card backgrounds across the page).
2. Replace standard design palette hex in PulseLandingPage:
   - `#FAF8F4` → `rgb(var(--color-pulse-surface))` (SVG fills) / `bg-pulse-surface`, `border-pulse-surface` (classNames)
   - `#C4B59D` → `rgb(var(--color-paper-border))`
   - `#222` → `rgb(var(--color-ink))`
   - `#3f84c8` → `rgb(var(--color-accent))`
3. Keep as literals (brand exceptions):
   - `#0A66C2` (LinkedIn), `#1a3d54` + `#2D5A7B` (LinkedIn gradient)
   - `#ef4444` (Tailwind red, SVG fill)
   - `#E8A849` (Pulse amber highlight, single-use)
   - `#000000` (line 593 — forces higher-contrast black vs ink; intentional)
   - Any Facebook/Instagram/social brand colors
4. Hashtag strings (`#PipelineOps`, etc.) are data content, not hex — no-ops.

**Out of scope:** JSX primitives migration (hero → PageHero, errors → ErrorAlert, inline buttons). Deferred to PR #10.

**Hex baseline target:** 60 → ~30.

**File map:**
- Modify: `frontend/src/index.css` (add `--color-pulse-surface`)
- Modify: `frontend/tailwind.config.js` (add `pulse-surface` to colors map)
- Modify: `frontend/components/PulseLandingPage.tsx` (swap eligible hex)
