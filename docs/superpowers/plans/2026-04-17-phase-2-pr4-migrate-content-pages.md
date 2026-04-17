# Phase 2 PR #4 — migrate-content-pages (WhoWeArePage, BriefingsPage)

**Goal:** Adopt `<PageHero>` on the two centered-hero content pages. Add a `centered` prop to `PageHero` to support this layout variant.

**Hex baseline change:** none (both files have 0 hex; this PR is JSX standardization only).

**File map:**
- Modify: `frontend/components/Shared.tsx` (extend `PageHero` with `centered?: boolean`)
- Modify: `frontend/components/WhoWeArePage.tsx` (swap inline hero block for `<PageHero centered>`)
- Modify: `frontend/components/BriefingsPage.tsx` (swap inline hero block for `<PageHero centered eyebrowRotation="none">`)

---

### Task 1: Extend `PageHero` with `centered` prop

**Files:**
- Modify: `frontend/components/Shared.tsx`

- [ ] **Step 1: Update `PageHero` signature and render**

Replace the existing `PageHero` export with:

```tsx
export const PageHero: React.FC<{
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'md' | 'lg';
  eyebrowRotation?: 'left' | 'right' | 'slight' | 'none';
  centered?: boolean;
  className?: string;
}> = ({ eyebrow, title, description, actions, size = 'lg', eyebrowRotation = 'left', centered = false, className = '' }) => {
  const titleSize = size === 'lg'
    ? 'text-5xl md:text-6xl lg:text-7xl'
    : 'text-4xl md:text-5xl lg:text-6xl';
  const descriptionSize = size === 'lg'
    ? 'text-xl md:text-2xl'
    : 'text-lg md:text-xl';
  const alignmentClasses = centered ? 'text-center' : '';
  const descriptionCentering = centered ? 'mx-auto' : '';
  const actionsCentering = centered ? 'justify-center' : '';
  return (
    <div className={`${alignmentClasses} ${className}`}>
      <Eyebrow rotation={eyebrowRotation}>{eyebrow}</Eyebrow>
      <h1 className={`font-serif ${titleSize} text-ink leading-[1.1] mb-8 mt-4`}>
        {title}
      </h1>
      <p className={`font-sans ${descriptionSize} text-ink-muted max-w-2xl leading-relaxed mb-10 ${descriptionCentering}`}>
        {description}
      </p>
      {actions && <div className={`flex flex-col sm:flex-row gap-4 ${actionsCentering}`}>{actions}</div>}
    </div>
  );
};
```

The three new conditional class segments (`alignmentClasses`, `descriptionCentering`, `actionsCentering`) only apply when `centered` is true. Default behavior is unchanged — Hero.tsx from PR #3 continues to render left-aligned.

- [ ] **Step 2: Build**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build 2>&1 | tail -3
```

Expected: passes.

---

### Task 2: Migrate WhoWeArePage hero

**Files:**
- Modify: `frontend/components/WhoWeArePage.tsx`

- [ ] **Step 1: Add `PageHero` to imports**

Replace:

```tsx
import { Section, SectionHeader, ScrollReveal, VitruvianBackground, Button } from './Shared';
```

With:

```tsx
import { Section, SectionHeader, ScrollReveal, VitruvianBackground, Button, PageHero } from './Shared';
```

- [ ] **Step 2: Replace hero block inside `ScrollReveal`**

Find this block (lines ~33-42):

```tsx
               <ScrollReveal className="text-center max-w-4xl mx-auto mb-20">
                  <span className="font-script text-2xl text-accent mb-4 block rotate-[-2deg]">Folio 0 — The Origin</span>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink mb-8 leading-tight">
                     Engineers of <br /><span className="italic text-ink-muted">Elegant Efficiency.</span>
                  </h1>
                  <p className="font-sans text-xl md:text-2xl text-ink-muted leading-relaxed mb-8 max-w-2xl mx-auto">
                     DaVeenci is an AI & Automation consultancy built for the builders. Founded by ex-unicorn operators to bridge the gap between "cool AI demos" and "shipped revenue systems."
                  </p>
                  <div className="w-32 h-1 bg-accent/20 mx-auto"></div>
               </ScrollReveal>
```

Replace with:

```tsx
               <ScrollReveal className="max-w-4xl mx-auto mb-20">
                  <PageHero
                    eyebrow="Folio 0 — The Origin"
                    title={<>Engineers of <br /><span className="italic text-ink-muted">Elegant Efficiency.</span></>}
                    description={<>DaVeenci is an AI & Automation consultancy built for the builders. Founded by ex-unicorn operators to bridge the gap between "cool AI demos" and "shipped revenue systems."</>}
                    centered
                  />
                  <div className="w-32 h-1 bg-accent/20 mx-auto"></div>
               </ScrollReveal>
```

(The `text-center` class moves from ScrollReveal to PageHero via the `centered` prop. The divider stays as a sibling.)

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | tail -3
```

---

### Task 3: Migrate BriefingsPage hero

**Files:**
- Modify: `frontend/components/BriefingsPage.tsx`

- [ ] **Step 1: Add `PageHero` to imports**

Replace:

```tsx
import { Section, ScrollReveal, BriefingCard, VitruvianBackground } from './Shared';
```

With:

```tsx
import { Section, ScrollReveal, BriefingCard, VitruvianBackground, PageHero } from './Shared';
```

- [ ] **Step 2: Replace hero block inside `ScrollReveal`**

Find this block (lines ~135-141):

```tsx
          <ScrollReveal>
            <span className="font-script text-2xl text-accent mb-2 block">The DaVeenci Codex</span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink mb-6">Intelligence Briefings</h1>
            <p className="text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Weekly architectural blueprints, technical deep dives, and strategic plays for the AI-native enterprise.
            </p>
          </ScrollReveal>
```

Replace with:

```tsx
          <ScrollReveal>
            <PageHero
              eyebrow="The DaVeenci Codex"
              title="Intelligence Briefings"
              description="Weekly architectural blueprints, technical deep dives, and strategic plays for the AI-native enterprise."
              centered
              eyebrowRotation="none"
            />
          </ScrollReveal>
```

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | tail -3
```

---

### Task 4: Full verification

- [ ] **Step 1: Build both sides**

```bash
cd /Users/antonspromac/daveenci.ai/frontend && npm run build 2>&1 | tail -3
cd /Users/antonspromac/daveenci.ai/backend && npm run build 2>&1 | tail -3
```

- [ ] **Step 2: Confirm hex baseline unchanged**

```bash
cd /Users/antonspromac/daveenci.ai && grep -rE '#[0-9A-Fa-f]{3,8}' frontend/components frontend/DaVeenciLandingPage.tsx frontend/App.tsx 2>/dev/null | wc -l
```

Expected: 118 (unchanged from previous PR; no hex in these files).

- [ ] **Step 3: Browser smoke**

```bash
npm run dev
```

Verify on:
- http://localhost:3000/who-we-are — hero centered, eyebrow rotated, title with italic "Elegant Efficiency", description, divider line below
- http://localhost:3000/briefings — hero centered, eyebrow (no rotation), title "Intelligence Briefings", description
- http://localhost:3000/ — regression check: Hero (PR #3) still left-aligned and unchanged

---

### Task 5: Commit PR #4

```bash
git add frontend/components/Shared.tsx frontend/components/WhoWeArePage.tsx frontend/components/BriefingsPage.tsx
git commit -m "feat: migrate WhoWeArePage and BriefingsPage to PageHero

Extends PageHero with a \`centered\` prop to support content-page heroes
that center their eyebrow, title, description, and actions. Both pages
now render their hero through <PageHero centered>, dropping the
duplicated inline span/h1/p pattern.

Hex-in-JSX baseline unchanged (118); this PR is JSX standardization only.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

Push and open PR.
