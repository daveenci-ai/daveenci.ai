# Design System — Tokens & JSX Standardization

**Date:** 2026-04-17
**Status:** Approved

## Motivation

The daveenci.ai frontend has partially-adopted tokens: Tailwind's `theme.extend` defines `base`, `ink`, `accent` and three fonts, and `bg-accent`/`text-ink` classes are used ~1000 times across components. But tokens leak:

- ~132 hardcoded hex values in SVGs and inline styles across 8 files (`#3f84c8`, `#222`, `#5A4A3A`, and an orphan `#C4B59D` that isn't in the theme at all).
- The body `background-color` and `::selection` in `src/index.css` hardcode the same hex values the theme defines.
- No tokens exist for spacing, radius, shadow, z-index, or transitions — magic numbers repeat across pages.

JSX has parallel drift:

- The same "eyebrow + h1 + description + CTAs" hero pattern is reimplemented in 6+ components with minor variance.
- 177 className strings exceed 120 characters; several 1000+ line pages (`BriefingDetailPage` 1782, `PulseLandingPage` 1278) bake in patterns that should live in shared primitives.
- Duplicated primitives (e.g., `CustomSelect` existed twice until a recent cleanup).
- `onNavigate` prop shape varies across components; two components typed it as `any`.

Goals, in priority order: **consistency**, future-proofing for theme flexibility, and velocity (shorter, more scannable components).

## Non-goals

- Dark mode, alternate themes, or client white-labeling. A single-theme setup with CSS custom properties is the right altitude.
- A primitive + semantic two-layer token system. Overkill for a ~5-color palette with one brand identity.
- Storybook, auto-generated component docs, or visual regression tooling.
- Rewriting existing `Button`, `Card`, or `Section` APIs. They get re-pointed at tokens but keep their current shape.

## Design

### Section 1 — Token layer

Tokens are defined as CSS custom properties in `frontend/src/index.css` and consumed by Tailwind via `var(--*)` references in `tailwind.config.js`. JSX continues to use Tailwind classes (`bg-accent`, `text-ink-muted`); SVG fills and inline styles reference `var(--*)` directly.

**Token categories:**

| Category | Tokens |
|---|---|
| Color | `--color-base`, `--color-alt`, `--color-ink`, `--color-ink-muted`, `--color-accent`, `--color-accent-light`, `--color-accent-hover`, `--color-paper-border` (new, replaces orphan `#C4B59D`) |
| Spacing | `--space-section-y`, `--space-section-y-lg`, `--space-card-p`, `--container-max` |
| Radius | `--radius-sharp`, `--radius-card`, `--radius-pill`, `--radius-widget-document`, `--radius-widget-product` |
| Shadow | `--shadow-card`, `--shadow-card-hover`, `--shadow-brand-glow`, `--shadow-widget`, `--shadow-widget-raised` |
| Z-index | `--z-base`, `--z-raised`, `--z-dropdown`, `--z-overlay`, `--z-modal` |
| Transition | `--ease-out-slow` (700ms), `--ease-base` (300ms) |

**Rule for adding a new token:** a value must repeat 3+ times OR represent a brand concept. Magic numbers used once stay literal.

**Initial values match current hex exactly** — Phase 1 is a no-visual-change refactor.

**Widget tier system** (added post-Phase-1 based on a visual audit):
Two intentional widget tiers encode the site's dual visual identity:
- **Document widgets** (`--radius-widget-document: 0.125rem`) — parchment/sketch feeling. Used for content that depicts *thinking*: Hero diagram, Solutions diagrams, Problem/Brief/Event cards.
- **Product widgets** (`--radius-widget-product: 0.5rem`) — modern UI feeling. Used for content that depicts *a product*: Pulse phone mockups, Pulse feature cards, Pulse dashboard screens.

A `<Surface>` primitive encapsulates the tier choice via a `kind: 'document' | 'product'` prop, with optional `raised` for the deeper shadow used on hero-scale surfaces.

### Section 2 — Primitives & JSX conventions

**New primitives in `frontend/components/Shared.tsx`:**

| Primitive | Purpose | API |
|---|---|---|
| `<Eyebrow>` | Script-font label above headings | `children`, `rotation?: 'left' \| 'right' \| 'none'` |
| `<PageHero>` | Hero block used on most pages | `eyebrow`, `title: ReactNode`, `description`, `actions?: ReactNode` |
| `<FeatureCard>` | 3-col feature grid item | `icon`, `title`, `description`, `href?` |
| `<FormField>` | Input with label + error | `label`, `name`, `type`, `required?`, `error?`, standard input props |
| `<ErrorAlert>` | Inline error banner with retry | `message`, `onRetry?` |
| `<Tag>` | Small label pill | `children`, `variant?: 'default' \| 'accent'` |
| `<Surface>` | Widget container with tier-based radius/shadow | `kind: 'document' \| 'product'`, `raised?: boolean`, `children`, `className?` |

**Existing primitives** (`Button`, `Card`, `BriefingCard`, `Section`, `SectionHeader`, `CustomSelect`) keep their APIs and get re-pointed at tokens.

**JSX conventions:**

1. **Prop order:** data props → event handlers → `className` → `children`.
2. **className length:** if a `className` exceeds ~8 utility classes or ~100 characters, split it across lines or extract the element into a primitive.
3. **`onNavigate` signature:** all page components use `(page: Page, hash?: string, id?: string) => void`. No `any`, no inconsistent arity.
4. **Top-level sections** use `<Section>` from `Shared`. Raw `<section>` with bespoke `py-*` is a lint smell.
5. **No hex values in `.tsx`** (enforced via ESLint warning — Section 4).
6. **Variant naming:** actions use `primary | secondary | ghost | outline`. Tonal surfaces use `default | accent | muted`. No one-off names.

### Section 3 — Rollout & PR sequence

Incremental, scheduled: foundation PRs first, then one page per PR.

**Phase 1 — Foundation (2 PRs):**

| # | PR | Scope |
|---|---|---|
| 1 | `tokens-plumbing` | Add `:root` custom properties; rewire `tailwind.config.js` color entries to `var(--color-*)`; replace hex in `body` and `::selection`. No `.tsx` changes. |
| 2 | `primitives-land` | Add `Eyebrow`, `PageHero`, `FeatureCard`, `FormField`, `ErrorAlert`, `Tag` to `Shared.tsx`. No existing pages migrated. |

**Phase 2 — Per-page migrations (9 PRs, smallest to largest):**

| # | PR | Pages |
|---|---|---|
| 3 | `migrate-simple` | `NotFoundPage`, `Footer`, `Hero` |
| 4 | `migrate-content-pages` | `WhoWeArePage`, `BriefingsPage` |
| 5 | `migrate-sections` | `Problems`, `Solutions`, `Events`, `Newsletter` |
| 6 | `migrate-admin` | `AdminPage` |
| 7 | `migrate-calendar` | `Calendar`, `Booking` |
| 8 | `migrate-brand-analyzer` | `BrandAnalyzerPage` |
| 9 | `migrate-pulse-part1` | `PulseLandingPage` hero + first half |
| 10 | `migrate-pulse-part2` | `PulseLandingPage` remainder |
| 11 | `migrate-briefing-detail` | `BriefingDetailPage` (may split into 2-3 PRs mid-work given 1782 lines) |

**Phase 3 — Enforcement & docs (1 PR):**

| # | PR | Scope |
|---|---|---|
| 12 | `tokens-enforce` | ESLint rule, `docs/STYLE_GUIDE.md`, cleanup of any orphaned duplications surfaced during migration. |

**Verification per PR:**

- `npm run build` passes in both `frontend/` and `backend/`.
- Browser smoke check on the affected page — visual diff should be zero in Phase 1; any pixel drift in Phase 2 is a bug.

**Rollback:** each PR is a single revertable commit. Phase 1 token values match current hex exactly, so reverting the plumbing PR is a no-op.

**Estimated elapsed time:** ~1-1.5 weeks at a cadence of one PR per working day.

### Section 4 — Enforcement & style guide

**ESLint rule** (added to existing config, warning level):

```js
{
  files: ['frontend/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-syntax': ['warn', {
      selector: 'JSXAttribute[value.value=/#[0-9A-Fa-f]{3,8}/]',
      message: 'Use a CSS token (var(--color-*)) or a Tailwind class instead of a hex literal.'
    }],
  }
}
```

The rule fires only on hex literals inside JSX attribute values. SVG `d=""` path data never matches (not hex). Genuine exceptions (rare off-palette gradient stops) use an inline `// eslint-disable-next-line` with justification.

**Baseline tracking:** at the start of PR 1, we run the rule ad-hoc (via `eslint --rule ...` on the command line, without committing config) to capture the current hex-literal warning count. That number goes into the PR 1 commit message as the baseline. The same one-liner is re-run before PRs 6, 9, and 12 to confirm the count trends toward zero. The rule is committed to `eslint.config.js` only in PR 12 once we're close to baseline zero.

**Style guide** (`docs/STYLE_GUIDE.md`, ~1 page):

1. Tokens — full table, "when to add a new token" rule, how to reference from `.tsx` / `.css` / SVG.
2. Primitives — inventory with one-line description + minimal example per primitive; "when to extract" rule.
3. JSX conventions — the 6 rules above with good/bad examples.
4. Migration checklist for per-page PRs:
   - [ ] Hex values replaced with tokens or removed
   - [ ] Repeated patterns replaced with primitives where they exist
   - [ ] Raw `<section>` replaced with `<Section>`
   - [ ] Props signatures normalized
   - [ ] `npm run build` passes
   - [ ] Visual smoke check in browser

## Out of scope (tracked separately)

- Hardcoded `localhost:3001` in `Calendar.tsx:259` (pre-existing bug, unrelated fix).
- 404 page returning HTTP 200 instead of 404 (SEO nit; requires Vercel config work).
- Image optimization (unrelated to tokens/primitives).

## Open questions

None at time of writing. Any ambiguity surfaced during implementation goes into a per-PR discussion, not a spec revision.
