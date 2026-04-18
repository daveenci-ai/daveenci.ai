# Reliability pass — audit cleanup

**Goal:** Fix concrete silent-failure bugs surfaced during the audit + design system work. Each is small; shipping together keeps the PR focused on reliability.

## Fixes

### 1. `frontend/components/Calendar.tsx:191` — hardcoded `localhost:3001`

The 409 duplicate-booking handler refetches availability via a hardcoded `http://localhost:3001/api/calendar/availability?...`. In production this silently 404s and busy slots don't refresh. Fix: use `API_ENDPOINTS.availability` (already imported).

### 2. `frontend/components/BrandAnalyzerPage.tsx:464` — `catch (err: any)`

Change to `catch (err: unknown)` with proper type guard (`err instanceof Error ? err.message : ...`). Safer and matches the spec's JSX convention rule #3 (no `any`).

### 3. `backend/src/services/auth.ts` — hardcoded fallback URI

`GOOGLE_REDIRECT_URI || 'http://localhost:3000/...'` in two places. If env var is missing in production, OAuth auth URL silently points to localhost and breaks. Fix: require the env var, throw clear error on missing. DRY the duplicated literal.

### 4. `package.json` root — build script doesn't build backend

Current: `cd frontend && npm install && npm run build`. This works for Vercel's deploy (backend is transpiled via Vercel's direct TS handling of `api/index.ts`), but a developer running `npm run build` from root gets no backend verification. Fix: add `cd backend && npm install && npm run build` step so root build validates both sides.

### 5. `frontend/components/Booking.tsx:27-28` — duplicated `BUSINESS_TIMEZONE` / `BUSINESS_HOURS`

`calendarAvailability.ts` already exports these; `Calendar.tsx` imports from there. `Booking.tsx` re-declares them locally. Fix: delete local declarations, import from `calendarAvailability`. Prevents drift if business hours change.

## Out of scope

- **404 HTTP 200** — requires Vercel edge-function or redirect-with-status-code setup. More involved than this pass. Tracked for a follow-up.
- **Image optimization / bundle splitting** — performance work, separate pass (option A from the menu).
- **Test framework** — separate pass (option C).

## Verification

- `npm run build` passes both frontend + backend
- `npm run lint` in frontend: 21 warnings unchanged (no new hex)
- Book a consultation on /calendar and /book-demo to confirm no regressions (no automated test coverage)
