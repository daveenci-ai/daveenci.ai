# Phase 2 PR #10 — Widget surface tiers (Surface primitive)

**Goal:** Encode the site's two widget aesthetics as explicit tiers, so every card/diagram/mockup across all pages declares whether it's a *document widget* (parchment/sketch) or a *product widget* (modern UI). Standardizes radius + shadow consistently within each tier.

**Scope:** Tokens + primitive + full migration of widget-class surfaces in one PR.

**Why one PR:** visual regression is easier to narrow down when the whole change lands together. Splitting would leave the site visually inconsistent between merges.

## Tokens

Add to `frontend/src/index.css`:

```css
--radius-widget-document: 0.125rem;  /* sharp parchment feel */
--radius-widget-product: 0.5rem;     /* soft modern UI feel */
--shadow-widget: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-widget-raised: 0 25px 50px -12px rgb(var(--color-ink) / 0.2);
```

Wire via `tailwind.config.js` arbitrary-value-free utilities (preferred) or consumed directly by the `Surface` primitive via inline style. Decision: **`Surface` reads tokens directly via CSS var references in the className** (no new Tailwind config entries needed; keeps the wiring lean).

## Primitive

New `Surface` component in `Shared.tsx`:

```tsx
export const Surface: React.FC<{
  kind: 'document' | 'product';
  raised?: boolean;
  as?: 'div' | 'section' | 'article';
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kind, raised = false, as: Tag = 'div', className = '', children, style }) => {
  const radius = kind === 'document' ? 'rounded-[0.125rem]' : 'rounded-[0.5rem]';
  const shadow = raised ? 'shadow-2xl shadow-ink/20' : 'shadow-lg';
  return (
    <Tag className={`${radius} ${shadow} ${className}`} style={style}>
      {children}
    </Tag>
  );
};
```

Notes:
- Uses Tailwind arbitrary values referencing the *measurement value* directly rather than forcing a new Tailwind theme entry — simpler, still token-driven via CSS vars when we wire them.
- Actually, to keep tokens as the source of truth, reference the CSS vars through inline style: `style={{ borderRadius: 'var(--radius-widget-document)' }}`. Cleaner; zero Tailwind churn. That's what I'll ship.

Refined primitive:

```tsx
export const Surface: React.FC<{
  kind: 'document' | 'product';
  raised?: boolean;
  as?: 'div' | 'section' | 'article';
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ kind, raised = false, as: Tag = 'div', className = '', children, style }) => {
  const radiusVar = kind === 'document'
    ? 'var(--radius-widget-document)'
    : 'var(--radius-widget-product)';
  const shadowVar = raised ? 'var(--shadow-widget-raised)' : 'var(--shadow-widget)';
  return (
    <Tag
      className={className}
      style={{ borderRadius: radiusVar, boxShadow: shadowVar, ...style }}
    >
      {children}
    </Tag>
  );
};
```

## Migration targets

**Document widgets** (kind="document"):
- `Hero.tsx` — `HeroDiagram` (raised)
- `Solutions.tsx` — `CRMFlowDiagram`, `MarketingEngineDiagram`, `OpsDiagram` (all raised)
- `Shared.tsx` — `Card` primitive (non-raised by default)
- `Shared.tsx` — `BriefingCard` (keep its custom glow shadow as `className` override; switch radius to document-tier)
- `Events.tsx` — `CodexEventCard` (document tier; keeps custom inset shadow)

**Product widgets** (kind="product"):
- `PulseLandingPage.tsx` — all phone/screen mockups (raised for hero, standard for feature cards)
  - `PulseHeroDiagram` wrapper (raised)
  - Meeting Analyzer animation wrapper (standard)
  - Idea-to-Content animation wrapper (standard)
  - Schedule animation wrapper (standard)
  - Branding animation wrapper (standard)
  - Insights Dashboard diagram wrapper (standard)
  - Any other mockup-like wrappers

**Left alone:**
- `Button`, `Tag`, `FormField`, `CustomSelect` — not widget-class. Radii stay as is.
- `ErrorAlert` — semantic (error banner), not a widget.
- `Section` — layout primitive, no radius.

## Tasks

1. Add the 4 new tokens to `src/index.css`.
2. Add `Surface` primitive to `Shared.tsx`.
3. Refactor `Card` primitive to use `Surface` internally.
4. Refactor `BriefingCard` to use `Surface`.
5. Migrate `Hero.tsx` `HeroDiagram` wrapper.
6. Migrate `Solutions.tsx` — all three diagrams.
7. Migrate `Events.tsx` event card.
8. Migrate `PulseLandingPage.tsx` — all product mockups.
9. `npm run build` passes.
10. Visual smoke on all affected pages: landing, /briefings, /who-we-are, /calendar, /book-demo, Events section.
11. Commit + PR.

## Out of scope

- PulseLandingPage hero → `PageHero` swap (originally PR #10's plan). Gets bumped to PR #11.
- BriefingDetailPage migration. PR #12.
- ESLint rule + style guide. Phase 3.

## Expected visual impact

- Document widgets: **no visible change** (already used `rounded-sm` ≈ 0.125rem and similar shadows).
- Product widgets (Pulse): **no visible change** (already used `rounded-lg` ≈ 0.5rem and similar shadows).
- The goal of this PR is *formalization and future-proofing*, not a visual redesign. If the smoke test reveals pixel drift, the token values need tweaking to match the pre-PR look exactly.

## Hex baseline

Unchanged at 33.
