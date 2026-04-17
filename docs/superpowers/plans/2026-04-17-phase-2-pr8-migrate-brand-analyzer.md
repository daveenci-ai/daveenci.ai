# Phase 2 PR #8 — migrate-brand-analyzer (+ Header piggyback)

**Scope:**
1. `BrandAnalyzerPage.tsx`: swap hero block (eyebrow + title + description) for `<PageHero size="md">`, inline error div for `<ErrorAlert>`, and inline primary button for `<Button variant="primary">`.
2. `Header.tsx`: replace 2 inline-style hex literals (`style={{ color: '#3f84c8' }}`) with conditional `text-accent` className.

**Hex baseline:** 62 → 60 (−2).

**File map:**
- Modify: `frontend/components/BrandAnalyzerPage.tsx`
- Modify: `frontend/components/Header.tsx`

**Notes:**
- PageHero left-aligned (default), size="md" matches the current `text-4xl md:text-5xl lg:text-6xl` h1.
- The "Book a Free Call" CTA button currently uses a hand-crafted `<button>` with classes that closely mirror Button's primary variant. Swap to `<Button variant="primary" className="px-8 py-4">` — the slightly larger padding preserves the existing look.
- Header inline style: `style={active ? { color: '#3f84c8' } : {}}` becomes conditional `text-accent` in className. Also preserves bold weight when active.
- `BriefingDetailPage.tsx:499` — the flagged "#123" was `&#123;` HTML entity, not a real hex literal. Not touched here.
