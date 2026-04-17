# Phase 1 — Tokens & Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the foundation for the design system — CSS custom-property tokens wired through Tailwind, plus five reusable primitives in `Shared.tsx`. No page migrations happen here; those get their own plans in Phase 2.

**Architecture:** Tokens defined as CSS variables in `frontend/src/index.css`. `tailwind.config.js` references them via `rgb(var(--color-*) / <alpha-value>)` so Tailwind's `/N` opacity modifiers keep working. Primitives added to `frontend/components/Shared.tsx` alongside existing ones.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind 3.4, Vite 6. No test framework in the frontend — acceptance per task is `npm run build` passing plus a manual browser smoke on affected pages.

**Spec reference:** `docs/superpowers/specs/2026-04-17-design-system-tokens-primitives.md`

**Scope note:** The spec listed six primitives including `FeatureCard`. During plan drafting I couldn't find a concrete icon+title+description grid pattern in the current codebase (Problems uses image-`Card`, Solutions uses SVG diagrams, PulseLandingPage uses image-label grids). Dropping `FeatureCard` from this plan. If Phase 2 migration surfaces the pattern, we add it then.

**File map (Phase 1):**
- Modify: `frontend/src/index.css` (add `:root` block, tokenize `body` and `::selection`)
- Modify: `frontend/tailwind.config.js` (rewire color entries to consume CSS vars)
- Modify: `frontend/components/Shared.tsx` (append five new primitives)

---

## PR #1 — tokens-plumbing

### Task 1: Define color tokens in `src/index.css`

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add `:root` color block at top of file (after the three `@tailwind` imports)**

Open `frontend/src/index.css`. The current file is:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles if needed */
html {
  scroll-behavior: smooth;
}

body {
  background-color: #F5F0E6;
  color: #222222;
}

::selection {
  background-color: #3f84c8;
  color: #ffffff;
}
```

Replace with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors — stored as space-separated RGB triples so Tailwind's /<alpha-value>
     opacity modifiers continue to work (rgb(var(--color-x) / 0.5)). */
  --color-base: 245 240 230;          /* #F5F0E6 — light parchment */
  --color-alt: 228 214 189;           /* #E4D6BD — deeper tan */
  --color-ink: 34 34 34;              /* #222222 — deep charcoal */
  --color-ink-muted: 90 74 58;        /* #5A4A3A — soft warm brown */
  --color-accent: 63 132 200;         /* #3f84c8 — brand blue */
  --color-accent-light: 100 161 224;  /* #64a1e0 */
  --color-accent-hover: 47 108 168;   /* #2f6ca8 */
  --color-paper-border: 196 181 157;  /* #C4B59D — tan line work in diagrams */
}

/* Custom styles if needed */
html {
  scroll-behavior: smooth;
}

body {
  background-color: #F5F0E6;
  color: #222222;
}

::selection {
  background-color: #3f84c8;
  color: #ffffff;
}
```

(We'll tokenize the `body` and `::selection` rules in Task 4 after Tailwind is wired.)

- [ ] **Step 2: Verify the site still renders**

Run:

```bash
cd frontend && npm run dev
```

Open http://localhost:3000 in a browser. Confirm the landing page renders with the parchment background and no console errors. Kill the dev server with `Ctrl+C`.

---

### Task 2: Define spacing, radius, shadow, z-index, and transition tokens

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Extend the `:root` block**

In `frontend/src/index.css`, replace the existing `:root` block with the fully populated version:

```css
:root {
  /* Colors — space-separated RGB triples for Tailwind alpha compatibility. */
  --color-base: 245 240 230;
  --color-alt: 228 214 189;
  --color-ink: 34 34 34;
  --color-ink-muted: 90 74 58;
  --color-accent: 63 132 200;
  --color-accent-light: 100 161 224;
  --color-accent-hover: 47 108 168;
  --color-paper-border: 196 181 157;

  /* Spacing */
  --space-section-y: 5rem;       /* py-20 */
  --space-section-y-lg: 7rem;    /* md:py-28 */
  --space-card-p: 1.5rem;        /* p-6 */
  --container-max: 80rem;        /* max-w-7xl */

  /* Radius */
  --radius-sharp: 0;
  --radius-card: 0.125rem;       /* rounded-sm */
  --radius-pill: 9999px;

  /* Shadow */
  --shadow-card: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-brand-glow: 0 40px 80px -20px rgb(63 132 200 / 0.15);

  /* Z-index scale */
  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 20;
  --z-overlay: 30;
  --z-modal: 50;

  /* Transitions */
  --ease-base: 300ms;
  --ease-out-slow: 700ms;
}
```

- [ ] **Step 2: Verify the file parses**

Run:

```bash
cd frontend && npm run build
```

Expected: build completes with no CSS parse errors. Output includes `✓ built in ...`.

---

### Task 3: Rewire Tailwind colors to consume CSS vars

**Files:**
- Modify: `frontend/tailwind.config.js`

- [ ] **Step 1: Replace hardcoded color hex with CSS var references**

Open `frontend/tailwind.config.js`. Replace the `colors` block inside `theme.extend` with:

```js
colors: {
    base: 'rgb(var(--color-base) / <alpha-value>)',
    alt: 'rgb(var(--color-alt) / <alpha-value>)',
    ink: {
        DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
    },
    accent: {
        DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
    },
    'paper-border': 'rgb(var(--color-paper-border) / <alpha-value>)',
},
```

Full file after this edit:

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./DaVeenciLandingPage.tsx",
        "./App.tsx"
    ],
    theme: {
        extend: {
            colors: {
                base: 'rgb(var(--color-base) / <alpha-value>)',
                alt: 'rgb(var(--color-alt) / <alpha-value>)',
                ink: {
                    DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
                    muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                    light: 'rgb(var(--color-accent-light) / <alpha-value>)',
                    hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
                },
                'paper-border': 'rgb(var(--color-paper-border) / <alpha-value>)',
            },
            fontFamily: {
                serif: ['"IM Fell English"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                script: ['"La Belle Aurore"', 'cursive'],
            },
            backgroundImage: {
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'float-slow': 'float 10s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
                'spin-slower': 'spin 60s linear infinite',
                'spin-reverse-slower': 'spin-reverse 50s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'spin-reverse': {
                    'from': { transform: 'rotate(360deg)' },
                    'to': { transform: 'rotate(0deg)' },
                }
            }
        },
    },
    plugins: [],
}
```

- [ ] **Step 2: Build and verify output**

Run:

```bash
cd frontend && npm run build
```

Expected: build completes. Inspect the generated CSS inside the `dist/assets/index-*.css` file — confirm `bg-accent` classes now expand to `rgb(var(--color-accent) / 1)` or similar, not hex values:

```bash
grep -o 'rgb(var(--color-accent)' dist/assets/index-*.css | head -3
```

Expected: at least one match.

- [ ] **Step 3: Browser smoke test — every top-level route**

```bash
cd frontend && npm run dev
```

Visit each route in a browser and confirm no visual regressions (colors identical to before):

- http://localhost:3000/
- http://localhost:3000/briefings
- http://localhost:3000/who-we-are
- http://localhost:3000/calendar
- http://localhost:3000/book-demo
- http://localhost:3000/brand-analyzer
- http://localhost:3000/admin

Kill the dev server when done.

If any route shows a color regression, the rgb/alpha math is likely off. Inspect the element, confirm its computed color, and compare to the hex in `src/index.css`. They should match exactly.

---

### Task 4: Tokenize body and selection styles

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Replace hex with `rgb(var(...))` in the global styles**

In `frontend/src/index.css`, replace the `body` and `::selection` blocks:

```css
body {
  background-color: rgb(var(--color-base));
  color: rgb(var(--color-ink));
}

::selection {
  background-color: rgb(var(--color-accent));
  color: #ffffff;
}
```

(White stays as a literal — it's not a brand token.)

- [ ] **Step 2: Build and verify**

```bash
cd frontend && npm run build
```

Expected: build passes. Start dev server, confirm body background is still parchment and text selection still blue:

```bash
cd frontend && npm run dev
```

Select some text on any page. Confirm the highlight is the accent blue. Kill the dev server.

---

### Task 5: Capture the hex-in-JSX baseline

**Files:** (none modified; this is a measurement)

- [ ] **Step 1: Count hex literals in JSX source files**

Run from repo root:

```bash
cd /Users/antonspromac/daveenci.ai
grep -rE '#[0-9A-Fa-f]{3,8}' frontend/components frontend/DaVeenciLandingPage.tsx frontend/App.tsx | wc -l
```

Record the number. Expected: around 130 (we saw 132 in the audit).

- [ ] **Step 2: Save the baseline to the commit message (use in Task 7)**

The number goes into the PR #1 commit message body as:

```
Hex-in-JSX baseline: N occurrences (measured via grep across frontend/components/**/*.tsx)
```

This number will be re-measured before PR 6, PR 9, and PR 12 in Phase 2/3 to confirm it trends toward zero.

---

### Task 6: Full verification — frontend + backend build

**Files:** (none modified; verification only)

- [ ] **Step 1: Run frontend build**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: `✓ built in ...`, no TypeScript or Tailwind errors.

- [ ] **Step 2: Run backend build**

```bash
cd /Users/antonspromac/daveenci.ai/backend && npm run build
```

Expected: `tsc` exits cleanly (no output means success).

- [ ] **Step 3: Browser smoke — open all seven routes one more time**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run dev
```

Walk through all seven routes listed in Task 3 Step 3. Open dev tools, confirm no console errors. Kill the dev server.

---

### Task 7: Commit PR #1

**Files:** (no changes; just stage and commit existing modifications)

- [ ] **Step 1: Review the diff**

```bash
cd /Users/antonspromac/daveenci.ai && git diff --stat
```

Expected files modified:
- `frontend/src/index.css`
- `frontend/tailwind.config.js`

No other files should appear. If they do, investigate before committing.

- [ ] **Step 2: Stage and commit**

Replace `<BASELINE>` with the number from Task 5 Step 1:

```bash
cd /Users/antonspromac/daveenci.ai && git add frontend/src/index.css frontend/tailwind.config.js && git commit -m "$(cat <<'EOF'
feat: wire design tokens through CSS custom properties

Define :root custom properties in src/index.css for colors, spacing,
radius, shadows, z-index, and transitions. Tailwind config consumes
them via rgb(var(--color-*) / <alpha-value>) so opacity modifiers
(bg-accent/30, text-ink-muted/80) continue to work. Body background
and ::selection also reference the tokens.

No visual changes — all token values match the previous hex literals
exactly.

Hex-in-JSX baseline: <BASELINE> occurrences (via grep across frontend/
components/**/*.tsx, App.tsx, DaVeenciLandingPage.tsx).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Confirm clean status**

```bash
git status
```

Expected: `working tree clean`, branch `main` ahead of `origin/main` by one commit.

---

## PR #2 — primitives-land

PR #2 adds five primitives to `Shared.tsx`. The primitives are additive — no existing component imports them yet. Verification is that `npm run build` passes and the new exports are importable.

### Task 8: Add `<Eyebrow>` primitive

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Append the Eyebrow component**

In `frontend/components/Shared.tsx`, append the following at the end of the file (after the `Section` export, which is the last existing export):

```tsx
// --- Primitives ---

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  rotation?: 'left' | 'right' | 'slight' | 'none';
  tone?: 'accent' | 'muted';
  className?: string;
}> = ({ children, rotation = 'left', tone = 'accent', className = '' }) => {
  const rotationClass = {
    left: '-rotate-2 origin-bottom-left',
    right: 'rotate-2 origin-bottom-right',
    slight: '-rotate-1 origin-bottom-left',
    none: '',
  }[rotation];
  const toneClass = tone === 'accent' ? 'text-accent' : 'text-ink-muted/80';
  return (
    <span className={`block font-script text-2xl ${toneClass} ${rotationClass} ${className}`}>
      {children}
    </span>
  );
};
```

- [ ] **Step 2: Build to verify types**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: `✓ built in ...`, no TypeScript errors.

---

### Task 9: Add `<PageHero>` primitive

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Append PageHero after Eyebrow**

In `frontend/components/Shared.tsx`, directly after the `Eyebrow` export, append:

```tsx
export const PageHero: React.FC<{
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'md' | 'lg';
  eyebrowRotation?: 'left' | 'right' | 'slight' | 'none';
  className?: string;
}> = ({ eyebrow, title, description, actions, size = 'lg', eyebrowRotation = 'left', className = '' }) => {
  const titleSize = size === 'lg'
    ? 'text-5xl md:text-6xl lg:text-7xl'
    : 'text-4xl md:text-5xl lg:text-6xl';
  const descriptionSize = size === 'lg'
    ? 'text-xl md:text-2xl'
    : 'text-lg md:text-xl';
  return (
    <div className={className}>
      <Eyebrow rotation={eyebrowRotation}>{eyebrow}</Eyebrow>
      <h1 className={`font-serif ${titleSize} text-ink leading-[1.1] mb-8 mt-4`}>
        {title}
      </h1>
      <p className={`font-sans ${descriptionSize} text-ink-muted max-w-2xl leading-relaxed mb-10`}>
        {description}
      </p>
      {actions && <div className="flex flex-col sm:flex-row gap-4">{actions}</div>}
    </div>
  );
};
```

- [ ] **Step 2: Build to verify types**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes.

---

### Task 10: Add `<FormField>` primitive

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Append FormField after PageHero**

In `frontend/components/Shared.tsx`, directly after the `PageHero` export, append:

```tsx
type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
  error?: string;
  rows?: number;
  className?: string;
};

export const FormField: React.FC<FormFieldProps> = ({
  label, name, value, onChange, type = 'text', required, placeholder, error, rows = 4, className = '',
}) => {
  const inputClasses = `w-full bg-base/30 border ${error ? 'border-red-500' : 'border-ink/20'} p-3 text-ink rounded-sm transition-colors focus:outline-none focus:border-accent placeholder:text-ink-muted/50`;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
```

- [ ] **Step 2: Build to verify types**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes.

---

### Task 11: Add `<ErrorAlert>` primitive

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Append ErrorAlert after FormField**

In `frontend/components/Shared.tsx`, directly after the `FormField` export, append:

```tsx
export const ErrorAlert: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => (
  <div
    role="alert"
    className={`text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2 flex items-start gap-2 ${className}`}
  >
    <span className="flex-1">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        type="button"
        className="text-red-700 underline font-medium hover:text-red-900 transition-colors shrink-0"
      >
        Retry
      </button>
    )}
  </div>
);
```

- [ ] **Step 2: Build to verify types**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes.

---

### Task 12: Add `<Tag>` primitive

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Append Tag after ErrorAlert**

In `frontend/components/Shared.tsx`, directly after the `ErrorAlert` export, append:

```tsx
export const Tag: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantClass = variant === 'accent'
    ? 'bg-accent/10 text-accent border-accent/20'
    : 'bg-white/90 text-ink border-ink/10';
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
};
```

- [ ] **Step 2: Build to verify types**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes.

---

### Task 13: Final verification — imports and runtime smoke

**Files:**
- Modify: `frontend/App.tsx` (temporarily)

- [ ] **Step 1: Temporary smoke import — verify all exports are reachable**

We need to confirm the five new exports are importable before committing. Open `frontend/App.tsx`. At the top of the imports block, replace:

```tsx
import BrandAnalyzerPage from './components/BrandAnalyzerPage';
import NotFoundPage from './components/NotFoundPage';
import type { Page } from './components/types';
```

with:

```tsx
import BrandAnalyzerPage from './components/BrandAnalyzerPage';
import NotFoundPage from './components/NotFoundPage';
import { Eyebrow, PageHero, FormField, ErrorAlert, Tag } from './components/Shared';
import type { Page } from './components/types';

// Phase 1 smoke — remove in PR #2 commit.
void Eyebrow; void PageHero; void FormField; void ErrorAlert; void Tag;
```

- [ ] **Step 2: Build to confirm all five resolve**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes. If any primitive is missing or misspelled, tsc errors here.

- [ ] **Step 3: Revert the smoke import**

Open `frontend/App.tsx` again. Restore the original imports:

```tsx
import BrandAnalyzerPage from './components/BrandAnalyzerPage';
import NotFoundPage from './components/NotFoundPage';
import type { Page } from './components/types';
```

(Delete the `void ...` line entirely.)

- [ ] **Step 4: Build one more time to confirm clean revert**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build
```

Expected: build passes, no TypeScript unused-import warnings.

---

### Task 14: Commit PR #2

**Files:** (no changes; just stage and commit)

- [ ] **Step 1: Review the diff**

```bash
cd /Users/antonspromac/daveenci.ai && git diff --stat
```

Expected files modified:
- `frontend/components/Shared.tsx`

No other files. If `App.tsx` appears, the Task 13 Step 3 revert didn't happen — fix before committing.

- [ ] **Step 2: Stage and commit**

```bash
cd /Users/antonspromac/daveenci.ai && git add frontend/components/Shared.tsx && git commit -m "$(cat <<'EOF'
feat: add Eyebrow, PageHero, FormField, ErrorAlert, Tag primitives

Five new primitives exported from Shared.tsx for use during Phase 2
per-page migrations. All five capture existing patterns duplicated
across pages:

- Eyebrow: script-font label above headings (Hero, BrandAnalyzer, etc.)
- PageHero: eyebrow + title + description + actions hero block
- FormField: labeled input/textarea with optional error
- ErrorAlert: inline error banner with optional retry action
- Tag: small pill for categories and status labels

No existing pages migrated yet — those land in Phase 2 per-page PRs.

FeatureCard (from the original spec) was dropped during planning
because the codebase has no concrete icon+title+description grid
pattern. Will revisit if Phase 2 migration surfaces the need.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Confirm clean status**

```bash
git status
```

Expected: `working tree clean`, branch `main` ahead of `origin/main` by two commits (PR #1 + PR #2).

---

## Post-Phase-1 state

After both PRs land:

- `frontend/src/index.css` owns the single source of truth for palette, spacing, radius, shadows, z-index, and transitions.
- `tailwind.config.js` consumes those variables, so `bg-accent`, `text-ink-muted`, `bg-accent/30`, etc. all resolve through the token layer.
- `Shared.tsx` has five new primitives ready to be adopted by pages.
- No user-visible changes. No existing pages modified.
- Hex-in-JSX baseline is recorded in PR #1's commit message for Phase 2 tracking.

## Next steps (out of scope for this plan)

- **Phase 2**: per-page migrations. Each gets its own lightweight plan at PR time. Order and scope per the spec's rollout table. First migration (PR #3 — NotFoundPage, Footer, Hero) is the real validation test for the new primitives.
- **Phase 3**: ESLint rule and `docs/STYLE_GUIDE.md`. Added once Phase 2 is ~complete.
