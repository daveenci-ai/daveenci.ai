# GA4 Analytics Setup

How to connect daveenci.ai's analytics layer to a GA4 property, verify it, and avoid the double-pageview trap inherent to this site's custom router.

## 1. Architecture (what's in the code)

- **One typed module:** `frontend/lib/analytics.ts`. Everything flows through `track()` (typed against `AnalyticsEventMap`) and `trackPageView()`. gtag.js is injected at runtime by `initAnalytics()` only when the measurement ID env var is present; without it the module logs to the dev console and sends nothing.
- **Manual pageviews only.** The site uses a custom `pushState` router (`frontend/App.tsx`), not react-router. `initAnalytics()` configures GA4 with `send_page_view: false`. Initial loads, in-app navigation, and back/forward all converge on one route-committed effect: it applies centralized route metadata first, then emits `page_view` with the destination title. Same-path links and landing anchors do not change route state and therefore do not inflate pageviews. A URL-key ref guards React StrictMode's development-only effect replay.
- **Attribution-safe pageviews.** `page_view` sends `page_location` as the full `window.location.href` (query string included — UTM/gclid survive) and `page_path` as the canonical trailing-slash-free pathname so one page never splits into two report rows.
- **Engagement hook:** `frontend/lib/useCaseEngaged.ts` fires `case_engaged` once per case-page visit at 30 visible-tab seconds OR 50% scroll depth (visibility-aware interval + IntersectionObserver sentinel). The scroll trigger additionally requires an actual scroll (`scrollY > 8`), so a page whose lazy content hasn't loaded yet can't false-fire on mount.

## 2. GA4 property setup

1. In Google Analytics: **Admin → Create → Property**, name it (e.g. "daveenci.ai"), set time zone/currency.
2. Add a **Web data stream** for `https://daveenci.ai`. Copy the Measurement ID (`G-XXXXXXXXXX`).
3. **Disable Enhanced Measurement history tracking — required.** In the data stream: **Enhanced measurement → gear icon → Page changes based on browser history events → OFF.** The router calls `replaceState` for legacy-URL redirects (`App.tsx` — `/briefings→/codex`, `/book-demo→/pulsenote`, `/brand-analyzer→/brandos`, `/shootos→/autopilot`) and `pushState` on every navigation; with EM history tracking on, GA4 would fire its own `page_view` on top of the manual one → double counting. Leave the other EM toggles (scroll, outbound clicks, etc.) as you like — they don't conflict.
4. Mark events as key events (Admin → Events) once they arrive: `generate_lead` at minimum; `demo_complete` and `calendar_start` recommended.

## 3. Environment variable

The measurement ID is **never hardcoded**. Set:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

- Local: `frontend/.env.local` (gitignored).
- Vercel: Project → Settings → Environment Variables → add for Production (and Preview if you want preview-deploy data — better: leave Preview unset so preview traffic sends nothing).

Unset ⇒ analytics is a no-op (dev builds log `[analytics]` lines to the console instead).

## 4. Event dictionary

| Event | Params | Fires when | Source |
|---|---|---|---|
| `page_view` | `page_location`, `page_path`, `page_title` | Initial load, every `navigate()`, back/forward | `frontend/App.tsx` |
| `select_content` | `content_type: 'case_study'`, `content_id`, `surface: 'work_preview' \| 'work_page'` | Case card clicked on homepage WorkPreview or /work | `WorkPreview.tsx`, `WorkPage.tsx`, `mobile/MobileWorkPreview.tsx`, `mobile/MobileWorkPage.tsx` |
| `work_preview_viewed` | `surface: 'work_preview'` | At least 35% of the homepage Selected Work section enters the viewport | desktop + mobile WorkPreview |
| `cta_click` | `cta_id`, `surface`, `from_page`, `destination` | An instrumented hero, header, case, or sticky CTA is activated | shared Button/MobileButton callers |
| `case_engaged` | `case_id`, `trigger: 'active_time' \| 'scroll_depth'` | 30 visible seconds OR 50% scroll on a case page (once per visit) | `lib/useCaseEngaged.ts`, called from the CompoundIQ/AutoPilot/PureCode/BrandOS page wrappers (covers desktop + mobile) |
| `demo_start` | `demo_id: 'brandos_analyzer' \| 'purecode_ticket_sim' \| 'compoundiq_gate_sim'` | First user-initiated demo run per visit | `BrandOSPage.tsx`, `mobile/MobileBrandOSPage.tsx`, `PureCodePage.tsx`, gate simulator (Phase 4) |
| `demo_complete` | `demo_id` | Demo run first reaches a finished/result state per visit | same files |
| `next_case_click` | `from_case`, `to_case` | Next-case link clicked at the end of a case page | case pages, both trees (Phase 2) |
| `calendar_start` | `booking_type` | First date/time selection in a booking flow (once per mount) | `Calendar.tsx`, `BookingWidget.tsx`, `mobile/MobileCalendarPage.tsx` |
| `booking_step_viewed` | `booking_type`, `step: 'details'` | Prospect first reaches the details step (once per mounted funnel, even after Back/Next) | same files via `lib/useBookingStepAnalytics.ts` |
| `generate_lead` | `booking_type` | `POST /calendar/book` returns success | same files |
| `newsletter_subscribe` | `source` | `POST /newsletter/subscribe` returns success | `Footer.tsx` + case-page subscribe blocks (Phase 3) |

`select_content` and `generate_lead` are GA4 recommended events; the rest are custom. Register `case_id`, `demo_id`, `source`, `surface`, `from_case`, `to_case`, `booking_type`, `step`, `content_id`, `cta_id`, `from_page`, and `destination` as custom dimensions (event-scoped) if you want them in standard reports: Admin → Custom definitions.

## 5. DebugView QA checklist

Enable debug: run locally with `VITE_GA_MEASUREMENT_ID` set, and append `?gtm_debug=x` to the URL or install the GA Debugger extension (or temporarily add `debug_mode: true` to the `config` call in `lib/analytics.ts`). Open GA4 **Admin → DebugView**, then:

- [ ] Load `/` → exactly one `page_view` (`page_path: /`). This holds in dev too — the initial pageview is guarded against StrictMode's double effect run.
- [ ] Load `/?utm_source=test` → the `page_view`'s `page_location` still contains `utm_source=test`.
- [ ] While on `/`, click a header link that scrolls to a landing section → NO new `page_view`. Click a footer link to the page you're already on → NO new `page_view`.
- [ ] Click a case card in "Selected work" → one `select_content` (check `content_id`, `surface: work_preview`) followed by one `page_view` for the case page.
- [ ] Scroll until 35% of Selected Work is visible → one `work_preview_viewed`. Click a case card and calculate card CTR as `select_content / work_preview_viewed`, not clicks divided by all sessions.
- [ ] Click the homepage hero, header, CompoundIQ gate, and mobile sticky CTAs → one `cta_click` each with the expected `cta_id`, `surface`, `from_page`, and `destination`.
- [ ] Stay on the case page 30s with the tab focused → one `case_engaged` (`trigger: active_time`). Reload, immediately scroll past halfway instead → one `case_engaged` (`trigger: scroll_depth`). Confirm it never fires twice on one visit.
- [ ] On /brandos run the analyzer → `demo_start` on submit, `demo_complete` when results render. Run it again → no duplicate events (once per visit).
- [ ] On /purecode run the ticket simulator → `demo_start` / `demo_complete` once each.
- [ ] Click the next-case link at the end of a case page → `next_case_click` with correct `from_case`/`to_case`, then a `page_view`.
- [ ] On /calendar pick a date → one `calendar_start`; continue to details → one `booking_step_viewed`; go Back and continue again → no duplicate details event; complete a booking (use a test slot) → `generate_lead`.
- [ ] Subscribe in the footer → `newsletter_subscribe` with `source: footer`; subscribe from a case-page block → `source` matches that case.
- [ ] Repeat the pageview and one demo check at mobile viewport width (<768px or DevTools device mode) — events must fire from the mobile tree too.

## 6. Duplicate-pageview verification

The known duplicate risk is GA4 Enhanced Measurement history tracking (step 2.3). Verify it's off:

1. In DebugView, navigate Home → /work → a case page → browser Back.
2. Count `page_view` events: must be exactly 4 (one per transition, including Back).
3. Visit a legacy URL directly (`/brand-analyzer`): must produce exactly one `page_view`, with `page_path: /brandos` (the redirect resolves before the pageview fires).
4. Confirm every pageview carries the destination title, including direct loads of `/compoundiq`, in-app navigation from `/work`, and browser Back.
5. If you see pairs of near-simultaneous `page_view`s on navigation, EM history tracking is still ON — turn it off; do not "fix" this in code. (The route effect is already StrictMode-guarded, so a pair on *navigation* can only come from EM.)
