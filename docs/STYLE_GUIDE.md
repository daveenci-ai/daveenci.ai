# DaVeenci Design System — Style Guide

> Short playbook for keeping the frontend visually and structurally consistent.
> Companion to `docs/superpowers/specs/2026-04-17-design-system-tokens-primitives.md`.

## TL;DR

1. **No hex values in `.tsx` files.** Use tokens or Tailwind classes. Justified brand exceptions (Google, LinkedIn, etc.) use inline `eslint-disable-next-line` with a reason.
2. **Every widget declares its tier.** Structural widgets use `<Surface kind="document|product">`; article content widgets use `<Callout variant>`. No freelance card styling.
3. **Top-level sections use `<Section>`.** Raw `<section>` with bespoke `py-*` is a smell.
4. **Run `npm run lint` before PRs.** The hex rule catches drift.

---

## Tokens

Single source of truth: `frontend/src/index.css` `:root` block. Tailwind consumes them via `rgb(var(--color-*) / <alpha-value>)` in `frontend/tailwind.config.js`.

### Colors

| Token | Hex | Tailwind class |
|---|---|---|
| `--color-base` | `#EEE3C8` | `bg-canvas`, `text-canvas` |
| `--color-alt` | `#8B6F47` | `bg-alt` |
| `--color-ink` | `#1A1A1A` | `text-ink`, `border-ink/N` |
| `--color-ink-muted` | `#5A4A3A` | `text-ink-muted` |
| `--color-accent` | `#3f84c8` | `bg-accent`, `text-accent` |
| `--color-accent-light` | `#64a1e0` | `bg-accent-light` |
| `--color-accent-hover` | `#2f6ca8` | `hover:bg-accent-hover` |
| `--color-paper-border` | `#8B6F47` | `border-paper-border` |
| `--color-pulse-surface` | `#FAF8F4` | `bg-pulse-surface` |

Semantic status colors use `--color-status-success`, `--color-status-danger`, and
`--color-status-critical`. Exact platform/demo colors (LinkedIn, Facebook,
Instagram, and PulseNote’s sample brand palette) are also named tokens; they are
exceptions to the DaVeenci palette, but not exceptions to tokenization.

### Referencing from different contexts

- **JSX Tailwind**: `className="bg-accent text-ink-muted"`. The parchment
  color is aliased as `canvas` because Tailwind reserves `text-base` for font
  sizing; use `bg-canvas` or `text-canvas` for the color.
- **Inline SVG fill/stroke**: `fill="rgb(var(--color-accent))"`, `stroke="rgb(var(--color-ink))"`
- **Canvas / inline JS**: read once in `useEffect` with `getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim()` and cache the triple — see `NodeNetworkBackground` in `Shared.tsx` for the pattern.

### Spacing, radius, shadow

| Category | Tokens |
|---|---|
| Spacing | `--space-section-y`, `--space-section-y-lg`, `--space-card-p`, `--container-max` |
| Radius | `--radius-sharp`, `--radius-card`, `--radius-pill`, `--radius-widget-document` (0.125rem, parchment), `--radius-widget-product` (0.5rem, UI) |
| Shadow | `--shadow-widget-document` (lg), `--shadow-widget-product` (xl), `--shadow-widget-raised` (2xl + ink tint) |
| Z-index | `--z-base`, `--z-raised`, `--z-dropdown`, `--z-overlay`, `--z-modal` |
| Transition | `--ease-base` (300ms), `--ease-out-slow` (700ms) |

### When to add a new token

A value becomes a token when it either:
- Repeats 3+ times across the codebase, OR
- Represents a brand concept (e.g., Pulse's product surface).

One-off values stay as literals.

---

## Primitives

All in `frontend/components/Shared.tsx`.

### Layout

| Primitive | Purpose |
|---|---|
| `<Section id pattern overflow>` | Top-level page section. `pattern` optionally renders a `GridPattern`, `VitruvianBackground`, or `NodeNetworkBackground`. |
| `<PageHero eyebrow title description actions size centered>` | Hero block: eyebrow + title + description + optional actions. `eyebrow` accepts a string (wraps in `<Eyebrow>`) OR a ReactNode (rendered as-is, for Pulse-style pill eyebrows). |
| `<SectionHeader eyebrow title subtitle>` | Section title block. |

### Widgets

| Primitive | Purpose | When to use |
|---|---|---|
| `<Surface kind="document" raised?>` | Structural widget with parchment aesthetic (sharp corners) | Diagrams, cards, document mockups |
| `<Surface kind="product" raised?>` | Structural widget with modern UI aesthetic (rounded corners) | Phone/screen mockups, product UIs |
| `<Callout variant="default\|muted\|alt\|warning" size="sm\|md">` | Article content widget | Stat boxes, list containers, highlighted info, warnings |
| `<Card title label image>` | Document-tier card with built-in title/image/label | Problems/Solutions content cards |
| `<BriefingCard>` | Article index card | Briefings page and Newsletter featured grid |

### Labels and actions

| Primitive | Purpose |
|---|---|
| `<Eyebrow>` | Script-font label above headings |
| `<Tag variant="default\|accent">` | Small pill label |
| `<Button variant="primary\|secondary\|ghost">` | All action buttons |

### Forms

| Primitive | Purpose |
|---|---|
| `<FormField label type required icon optionalLabel error>` | Labeled input or textarea |
| `<CustomSelect label options icon required>` | Styled dropdown |
| `<ErrorAlert message onRetry>` | Inline error banner with optional retry |

### When to extract a new primitive

Same rule as tokens: **3+ uses or a brand concept**. One-off UIs stay inline.

---

## JSX conventions

1. **Prop order:** data props → event handlers → `className` → `children`.
2. **className length:** if the class string exceeds ~8 utility classes or ~100 chars, split across lines or extract into a primitive.
3. **`onNavigate` signature:** all page-level components use `(page: Page, hash?: string, id?: string) => void`. No `any`.
4. **Top-level sections use `<Section>`.** Raw `<section>` with bespoke `py-*` is a smell.
5. **No hex in `.tsx`.** Enforced via ESLint warning.
6. **Variant naming:** actions use `primary | secondary | ghost`. Tonal surfaces use `default | accent | muted | alt`. No one-off names.

---

## Hex exceptions

The expected baseline is zero unexplained warnings. Third-party brand colors and
demo palettes belong in named CSS tokens so their intent is explicit and their
use remains searchable. If a literal truly cannot be tokenized, add a narrow
inline suppression with a reason; never add blanket file-level disables.

---

## Running the lint

```bash
cd frontend && npm run lint
```

Warnings are non-blocking in CI, but the expected baseline is zero. Any warning
should be fixed or explicitly justified before merge.

---

## Migration checklist (for per-page work in legacy areas)

- [ ] All hex values replaced with tokens OR justified with inline ESLint suppressions
- [ ] Repeating card patterns use `<Surface>` or `<Callout>`
- [ ] Hero block uses `<PageHero>`
- [ ] Top-level page wrapper uses `<Section>`
- [ ] Form inputs use `<FormField>`/`<CustomSelect>`
- [ ] Error banners use `<ErrorAlert>`
- [ ] `onNavigate` prop typed as `(page: Page, hash?: string, id?: string) => void`
- [ ] `npm run build` passes (frontend + backend)
- [ ] `npm run lint` — zero unexplained warnings
- [ ] Visual smoke test in browser on the affected pages
