# Phase 2 PR #3 — migrate-simple (NotFoundPage, Footer, Hero)

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** First real validation of the Phase 1 primitives. Migrate three small components (`NotFoundPage`, `Footer`, `Hero`) to use `Eyebrow`, `PageHero`, and tokens. Tokenize the 14 hex literals in Hero's diagram SVG.

**Architecture:** Drop-in replacements — each Shared primitive captures an existing pattern, so JSX gets shorter with identical visual output. SVG fills/strokes switch from hex to `rgb(var(--color-*))`.

**Tech Stack:** React 19, TypeScript, Tailwind 3.4 (tokens landed in PR #1).

**Spec reference:** `docs/superpowers/specs/2026-04-17-design-system-tokens-primitives.md`
**Phase 1 plan:** `docs/superpowers/plans/2026-04-17-phase-1-tokens-and-primitives.md`

**Scope notes:**
- `Footer.tsx` analysis: no hex literals, already uses `bg-ink`/`text-base` tokens, no Eyebrow or PageHero pattern. Nothing to migrate. Included in this PR only as a verification step.
- `NotFoundPage.tsx` has a script-font label that becomes `<Eyebrow rotation="none">`. Centered 404 layout doesn't match `PageHero` (which is left-aligned), so we skip `PageHero` for this page.
- `Hero.tsx` is the main target — eyebrow + h1 + description + actions pattern maps directly to `PageHero`, and its SVG diagram owns all 14 hex literals.

**Hex baseline target:** before this PR: 130. After this PR: 116.

**File map:**
- Modify: `frontend/components/NotFoundPage.tsx` (swap `<span>` eyebrow for `<Eyebrow>`)
- Modify: `frontend/components/Hero.tsx` (swap hero block for `<PageHero>`; tokenize SVG hex)
- Unchanged: `frontend/components/Footer.tsx` (verified already conformant)

---

### Task 1: Migrate NotFoundPage to use `<Eyebrow>`

**Files:**
- Modify: `frontend/components/NotFoundPage.tsx`

- [ ] **Step 1: Import `Eyebrow` and replace the eyebrow span**

In `frontend/components/NotFoundPage.tsx`, update the `Button` import line to include `Eyebrow`:

```tsx
import { Button, Eyebrow } from './Shared';
```

Then find this block:

```tsx
        <div className="max-w-xl text-center">
          <span className="block mb-4 font-script text-2xl text-accent">Lost in the archive</span>
          <h1 className="font-serif text-6xl md:text-7xl text-ink leading-none mb-6">404</h1>
```

Replace with:

```tsx
        <div className="max-w-xl text-center">
          <Eyebrow rotation="none" className="mb-4">Lost in the archive</Eyebrow>
          <h1 className="font-serif text-6xl md:text-7xl text-ink leading-none mb-6">404</h1>
```

(Eyebrow already provides `block`, `font-script`, `text-2xl`, `text-accent`. The `mb-4` stays via className.)

- [ ] **Step 2: Build and verify**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes, no type errors.

---

### Task 2: Verify Footer needs no migration

**Files:** (verification only)

- [ ] **Step 1: Confirm no hex literals**

```bash
grep -n '#[0-9A-Fa-f]\{3,8\}' /Users/antonspromac/daveenci.ai/frontend/components/Footer.tsx
```

Expected: no output.

- [ ] **Step 2: Confirm tokens are already used**

```bash
grep -E 'bg-ink|text-base|text-white|border-white' /Users/antonspromac/daveenci.ai/frontend/components/Footer.tsx | wc -l
```

Expected: count > 0. These are all tokens (or standard Tailwind whites, which are acceptable).

Document in the PR description that Footer was audited and needed no changes.

---

### Task 3: Migrate Hero text column to use `<Eyebrow>` and `<PageHero>`

**Files:**
- Modify: `frontend/components/Hero.tsx`

- [ ] **Step 1: Update imports**

In `frontend/components/Hero.tsx`, replace the Shared import line:

```tsx
import { Section, ScrollReveal, Button, VitruvianBackground } from './Shared';
```

With:

```tsx
import { Section, ScrollReveal, Button, VitruvianBackground, PageHero } from './Shared';
```

(`PageHero` uses `Eyebrow` internally; no need to import `Eyebrow` directly here.)

- [ ] **Step 2: Replace the text column content inside ScrollReveal**

Find this block (inside `<ScrollReveal delay={200}>`):

```tsx
          <ScrollReveal delay={200}>
            <span className="block mb-4 font-script text-2xl text-accent -rotate-2 origin-bottom-left">
              Folio I — The Thesis
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.1] mb-8">
              Clarity on AI.<br />
              <span className="italic text-ink-muted/80">Automation that Ships.</span>
            </h1>
            <p className="font-sans text-xl md:text-2xl text-ink-muted max-w-2xl leading-relaxed mb-10">
              DaVeenci helps founders, investors, and operators turn AI from slideware into shipped workflows—so teams can scale revenue and margin without scaling headcount.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="primary" onClick={scrollToBooking} className="text-base px-8 py-4">Schedule A Demo</Button>
              <Button variant="secondary" className="text-base px-8 py-4">See How We Work</Button>
            </div>
            <p className="text-xs md:text-sm text-ink-muted/60 font-medium tracking-wide">
              Built for early-stage to growth companies in B2B SaaS, services, and tech-enabled businesses.
            </p>
          </ScrollReveal>
```

Replace with:

```tsx
          <ScrollReveal delay={200}>
            <PageHero
              eyebrow="Folio I — The Thesis"
              title={<>Clarity on AI.<br /><span className="italic text-ink-muted/80">Automation that Ships.</span></>}
              description="DaVeenci helps founders, investors, and operators turn AI from slideware into shipped workflows—so teams can scale revenue and margin without scaling headcount."
              actions={
                <>
                  <Button variant="primary" onClick={scrollToBooking} className="text-base px-8 py-4">Schedule A Demo</Button>
                  <Button variant="secondary" className="text-base px-8 py-4">See How We Work</Button>
                </>
              }
            />
            <p className="mt-8 text-xs md:text-sm text-ink-muted/60 font-medium tracking-wide">
              Built for early-stage to growth companies in B2B SaaS, services, and tech-enabled businesses.
            </p>
          </ScrollReveal>
```

**Note on margin:** `PageHero` applies `mb-10` on its description and no bottom margin on the overall wrapper. Adding `mt-8` on the subtitle matches the previous `mb-8` that was on the buttons row. Net vertical rhythm is equivalent.

- [ ] **Step 3: Build and verify**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes, no TypeScript errors (including no unused-import warnings).

---

### Task 4: Tokenize hex literals in Hero's diagram SVG

**Files:**
- Modify: `frontend/components/Hero.tsx`

The `HeroDiagram` SVG has 14 hex occurrences. Replace each with `rgb(var(--color-*))`:

| Hex | Token |
|---|---|
| `#C4B59D` | `rgb(var(--color-paper-border))` |
| `#3f84c8` | `rgb(var(--color-accent))` |
| `#222` | `rgb(var(--color-ink))` |
| `#5A4A3A` | `rgb(var(--color-ink-muted))` |

- [ ] **Step 1: Replace hex in the HeroDiagram SVG block**

Find the `<HeroDiagram>` function (starts at line ~6) and replace its inner SVG block. The full updated `HeroDiagram` looks like:

```tsx
const HeroDiagram: React.FC = () => (
  <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">System Architecture v2.0</div>
    </div>

    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
        <path d="M 30 125 C 60 125, 100 50, 150 50 C 200 50, 220 30, 240 30" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" fill="none" />
        <path d="M 30 125 C 60 125, 100 200, 150 200 C 200 200, 240 230, 270 230" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" fill="none" />
        <path d="M 30 125 L 270 125" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-pulse" />

        <line x1="150" y1="50" x2="150" y2="200" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" strokeDasharray="4 4" />

        <circle cx="30" cy="125" r="6" fill="rgb(var(--color-ink))" />
        <text x="30" y="155" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" letterSpacing="0.05em">INPUT</text>

        <circle cx="150" cy="125" r="30" fill="rgb(var(--color-accent))" fillOpacity="0.1" stroke="rgb(var(--color-accent))" strokeWidth="1" className="animate-spin-slow origin-[150px_125px]" strokeDasharray="4 2" />
        <circle cx="150" cy="125" r="4" fill="rgb(var(--color-accent))" />
        <text x="150" y="175" textAnchor="middle" fontSize="10" fontWeight="500" fill="rgb(var(--color-accent))" fontFamily="monospace" letterSpacing="0.05em">PROCESSING</text>

        <circle cx="150" cy="50" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
        <circle cx="150" cy="200" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />

        <rect x="260" y="115" width="20" height="20" rx="2" fill="rgb(var(--color-accent))" />
        <text x="270" y="160" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" letterSpacing="0.05em">OUTPUT</text>
        <rect x="265" y="220" width="16" height="16" rx="2" fill="rgb(var(--color-ink))" />
      </svg>

      <div className="absolute top-4 right-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Activity className="w-4 h-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink">Efficiency +40%</span>
      </div>

      <div className="absolute bottom-12 left-8 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
        <Cpu className="w-4 h-4 text-accent" />
        <span className="text-xs font-medium text-ink">Automated</span>
      </div>
    </div>
  </div>
);
```

Fill `"white"` stays literal — it's not a brand token, and the spec explicitly allows literal white.

- [ ] **Step 2: Confirm zero hex in Hero.tsx**

```bash
grep -nE '#[0-9A-Fa-f]{3,8}' /Users/antonspromac/daveenci.ai/frontend/components/Hero.tsx
```

Expected: no output.

- [ ] **Step 3: Build**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes.

---

### Task 5: Full verification

- [ ] **Step 1: Frontend + backend build**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build 2>&1 | tail -3
cd /Users/antonspromac/daveenci.ai/backend && npm run build 2>&1 | tail -3
```

Both should pass.

- [ ] **Step 2: Re-measure hex baseline**

```bash
cd /Users/antonspromac/daveenci.ai && grep -rE '#[0-9A-Fa-f]{3,8}' frontend/components frontend/DaVeenciLandingPage.tsx frontend/App.tsx 2>/dev/null | wc -l
```

Expected: 116 (130 − 14 from Hero.tsx).

- [ ] **Step 3: Browser smoke**

Start dev server, confirm visual parity on the three affected surfaces:

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run dev
```

- http://localhost:3000/ — Hero section: eyebrow, title with italic span, description, two buttons, subtitle. Diagram on the right with identical colors (no visual drift from hex→token swap).
- http://localhost:3000/does-not-exist — NotFoundPage: "Lost in the archive" eyebrow, "404", description, two buttons. Identical to before.
- Scroll through the landing page to confirm Footer still renders correctly.

Kill the dev server after confirming.

---

### Task 6: Commit PR #3

- [ ] **Step 1: Review diff stat**

```bash
cd /Users/antonspromac/daveenci.ai && git diff --stat
```

Expected files:
- `frontend/components/Hero.tsx`
- `frontend/components/NotFoundPage.tsx`

(Footer intentionally unmodified.)

- [ ] **Step 2: Create branch and commit**

```bash
cd /Users/antonspromac/daveenci.ai && git checkout -b design-system/phase-2-pr3-migrate-simple && git add frontend/components/Hero.tsx frontend/components/NotFoundPage.tsx && git commit -m "$(cat <<'EOF'
feat: migrate NotFoundPage and Hero to Eyebrow/PageHero primitives

Adopts two of the Phase 1 primitives on the three simplest pages:

- NotFoundPage: script-font label replaced with <Eyebrow rotation="none">
- Hero: eyebrow + title + description + actions block replaced with
  <PageHero>; the diagram SVG tokenized (14 hex literals → CSS vars)
- Footer: audited, no changes needed — already conformant

No visual changes expected. Hex-in-JSX baseline drops from 130 to 116.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push and open PR**

```bash
git push -u origin design-system/phase-2-pr3-migrate-simple
gh pr create --base main --head design-system/phase-2-pr3-migrate-simple --title "Phase 2 PR #3: migrate NotFoundPage + Hero to primitives" --body "$(cat <<'EOF'
## Summary

First Phase 2 per-page migration. Adopts Phase 1 primitives on three small pages:

- **NotFoundPage**: inline eyebrow `<span>` → `<Eyebrow rotation="none">`
- **Hero**: eyebrow + title + description + actions block → `<PageHero>`; HeroDiagram SVG tokenized (14 hex literals replaced with `rgb(var(--color-*))`)
- **Footer**: audited, no changes needed

## Hex baseline

- Before: 130
- After: 116 (− 14 from Hero.tsx)

## Test plan

- [ ] `npm run build` passes (frontend + backend)
- [ ] Landing page hero renders with identical eyebrow, title (with italic span), description, buttons, and subtitle
- [ ] Hero diagram renders with identical paper-border, accent, ink, and ink-muted colors (no drift from hex→token swap)
- [ ] `/does-not-exist` renders NotFoundPage with identical eyebrow, 404, description, buttons

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Next steps (out of scope for this plan)

- PR #4: `migrate-content-pages` — WhoWeArePage, BriefingsPage
- PR #5-11: remaining per-page migrations per the spec rollout table
- PR #12: ESLint rule + `docs/STYLE_GUIDE.md`
