# Phase 2 PR #5 — migrate-sections (Solutions, Events, + Shared cleanup)

**Goal:** Biggest token-win PR of Phase 2. Tokenize all remaining SVG hex in `Solutions.tsx` (3 diagrams, 48 hex lines), clean up leftover hex in `Shared.tsx` visual primitives (6 hex), and normalize 2 off-palette hex in `Events.tsx` card.

**Hex baseline change:** 118 → ~62 (removing ~56 hex occurrences).

**Scope notes:**
- `Problems.tsx` and `Newsletter.tsx` have zero hex and no hero pattern — verified, no changes needed, but included in this PR's scope per the spec rollout table.
- `Solutions.tsx` line 105/110: `#555` is inconsistent with the rest of the file's label text (which uses `#5A4A3A` / ink-muted). Normalizing to ink-muted.
- `Events.tsx` line 136/137: `#FDFBF7` cream and `#D6CFC0` tan-grey are unique off-palette values. Normalizing to `bg-base` and `border-paper-border` — small visual shift expected; smoke test will validate.

**File map:**
- Modify: `frontend/components/Shared.tsx` (tokenize `SchematicDecor`, `GridPattern`, `NodeNetworkBackground` SVG colors)
- Modify: `frontend/components/Solutions.tsx` (tokenize all 48 SVG hex across 3 diagrams; normalize `#555`)
- Modify: `frontend/components/Events.tsx` (tokenize `bg-[#FDFBF7]` and `border-[#D6CFC0]`)
- Unchanged: `frontend/components/Problems.tsx`, `frontend/components/Newsletter.tsx` (audited, no changes needed)

**Color mapping:**

| Hex | Token |
|---|---|
| `#C4B59D` | `rgb(var(--color-paper-border))` |
| `#3f84c8` | `rgb(var(--color-accent))` |
| `#222`, `#222222` | `rgb(var(--color-ink))` |
| `#5A4A3A`, `#555` (normalized) | `rgb(var(--color-ink-muted))` |
| `#FDFBF7` (Events card bg) | `bg-base` |
| `#D6CFC0` (Events card border) | `border-paper-border` |

`white` stays literal per spec (not a brand token). `rgba(...)` values inside Tailwind arbitrary shadows stay literal.

---

### Task 1: Tokenize Shared.tsx SVG primitives

- [ ] **Step 1:** Replace all hex literals in `NodeNetworkBackground`, `GridPattern`, and `SchematicDecor` with `rgb(var(--color-*))`.
- [ ] **Step 2:** `npm run build` passes.

### Task 2: Tokenize Solutions.tsx

- [ ] **Step 1:** Replace all hex literals in the three diagrams (CRMFlow, MarketingEngine, Ops) using the mapping above. Normalize `#555` → ink-muted.
- [ ] **Step 2:** `npm run build` passes.

### Task 3: Tokenize Events.tsx card

- [ ] **Step 1:** Replace `bg-[#FDFBF7]` with `bg-base`, and `border-[#D6CFC0]` with `border-paper-border`.
- [ ] **Step 2:** `npm run build` passes.

### Task 4: Verify

- [ ] Frontend + backend build pass.
- [ ] Hex baseline measured; expected ~62.
- [ ] Browser smoke on the landing page (`/`) — focus on Problems, Solutions diagrams (all 3), Events cards, Newsletter. Visual parity expected; Events cards may shift slightly.

### Task 5: Commit and PR

- [ ] Commit `feat: migrate Solutions, Events, and Shared primitives to tokens`.
- [ ] Push and open PR.
