# Phase 2 PR #7 — migrate-calendar (Calendar + Booking)

**Note:** PR #6 (migrate-admin) was skipped — all 5 hex in `AdminPage.tsx` are Google's brand palette (logo colors, official Sign-in button spec), not ours. No forms or error banners to migrate either.

**Goal:** Consolidate the duplicated form UI across `Calendar.tsx` and `Booking.tsx`. Delete Calendar's local `CustomSelect` (60-line duplicate). Replace all form inputs with `<FormField>` and Calendar's inline retry banner with `<ErrorAlert>`.

**Scope:**
- Extend `FormField` and `CustomSelect` in `Shared.tsx` with optional `icon?: React.ReactNode` prop (preserves the lucide icons currently inline in the labels).
- Delete Calendar's local `CustomSelect` definition (~60 lines).
- In both `Calendar.tsx` and `Booking.tsx`: replace 5 `<input>` + 1 `<textarea>` with `<FormField>`, passing icons.
- In `Calendar.tsx`: replace the inline error banner with `<ErrorAlert message={...} onRetry={fetchAvailability} />`.

**Out of scope:**
- Extracting a shared `ContactForm` component for the whole form section. Left as potential future cleanup; PR #7 only converts the primitives.

**Hex baseline change:** none (both files already 0 hex).

**File map:**
- Modify: `frontend/components/Shared.tsx` (extend `FormField`, `CustomSelect`)
- Modify: `frontend/components/Calendar.tsx` (delete local `CustomSelect`, swap forms/errors)
- Modify: `frontend/components/Booking.tsx` (swap forms)

**Expected line delta:** −100 to −150 lines net across Calendar + Booking (mostly from deleting the local CustomSelect and compressing field blocks).
