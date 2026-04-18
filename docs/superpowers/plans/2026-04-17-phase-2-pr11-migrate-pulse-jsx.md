# Phase 2 PR #11 — migrate-pulse (part 2: JSX primitives)

**Goal:** Adopt `<PageHero>` on PulseLandingPage's hero, extending PageHero to support non-script-eyebrow elements (Pulse uses a pill-style label, not parchment/script).

**Scope:**
- Extend `PageHero` in `Shared.tsx`: if `eyebrow` is a string, wrap in `<Eyebrow>` (current behavior). If it's a ReactNode, render as-is (new behavior — backward-compatible).
- Swap `PulseLandingPage.tsx` `PulseHero` from inline `<span>/<h1>/<p>/buttons` layout to `<PageHero>` with a custom pill eyebrow element.

**Out of scope:**
- Other Pulse pill labels (lines 453, 480, 523, 633, 777, 947) are decorative labels inside feature cards, not eyebrows. Not tag-worthy per YAGNI (one-off contexts).
- FAQ, CTA sections — no JSX standardization opportunities remaining.

**Expected diff:** small — primarily the PulseHero refactor.
