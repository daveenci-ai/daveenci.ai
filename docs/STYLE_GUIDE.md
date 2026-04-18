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
| `--color-base` | `#F5F0E6` | `bg-base`, `text-base` |
| `--color-alt` | `#E4D6BD` | `bg-alt` |
| `--color-ink` | `#222222` | `text-ink`, `border-ink/N` |
| `--color-ink-muted` | `#5A4A3A` | `text-ink-muted` |
| `--color-accent` | `#3f84c8` | `bg-accent`, `text-accent` |
| `--color-accent-light` | `#64a1e0` | `bg-accent-light` |
| `--color-accent-hover` | `#2f6ca8` | `hover:bg-accent-hover` |
| `--color-paper-border` | `#C4B59D` | `border-paper-border` |
| `--color-pulse-surface` | `#FAF8F4` | `bg-pulse-surface` |

### Referencing from different contexts

- **JSX Tailwind**: `className="bg-accent text-ink-muted"`
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
| `<PageHero eyebrow title description actions size centered eyebrowRotation>` | Hero block: eyebrow + title + description + optional actions. `eyebrow` accepts a string (wraps in `<Eyebrow>`) OR a ReactNode (rendered as-is, for Pulse-style pill eyebrows). |
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
| `<Eyebrow rotation tone>` | Script-font label above headings |
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

## Justified hex exceptions

The ESLint rule warns on 21 hex literals across the codebase, all intentional:

| File | Count | Reason |
|---|---|---|
| `AdminPage.tsx` | 5 | Google logo SVG + Sign-in button spec (Google brand palette, not ours) |
| `PulseLandingPage.tsx` | ~16 | LinkedIn/Facebook/Instagram brand colors, Pulse amber highlight, intentional black, Tailwind-equivalent inline SVG reds |

When a new brand exception is introduced, add an inline suppression with a reason:

```tsx
// eslint-disable-next-line no-restricted-syntax -- Google brand palette (not tokenized)
<path fill="#4285F4" />
```

**Do not add blanket disables** at the file level.

---

## Running the lint

```bash
cd frontend && npm run lint
```

Warnings are non-blocking in CI. The expected baseline is 21 — if you see more, you've introduced a new hex literal that should be tokenized (or get a justified exception).

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
- [ ] `npm run lint` — warning count unchanged from baseline
- [ ] Visual smoke test in browser on the affected pages
