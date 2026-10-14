// Typed analytics layer. All events flow through track(); pageviews are fired
// manually from the router choke point in App.tsx because the custom
// pushState/replaceState router makes GA4 Enhanced Measurement history
// tracking unreliable (see docs/ANALYTICS_SETUP.md — EM history tracking
// must be disabled on the GA4 property).
//
// Two transports, chosen by env at build time:
//   VITE_GTM_ID set            → Google Tag Manager. Events go to window.dataLayer as
//                                 { event, event_params }; GTM forwards them to GA4 (and later to
//                                 Meta / LinkedIn / custom conversions) without a code deploy.
//   only VITE_GA_MEASUREMENT_ID → gtag.js straight to GA4 (the original path).
// Never both: with VITE_GTM_ID set, gtag.js is not loaded, so nothing is counted twice.
// The event names and params below are the contract — GTM only routes them.

import type { VoiceVariant } from './videoVariant';
import { isInternalTraffic } from './internalTraffic';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type CaseId = 'compoundiq' | 'autopilot' | 'purecode' | 'brandos' | 'pulsenote' | 'analytics-os';
export type PracticeId = 'operations' | 'creative';
export type DemoId = 'brandos_analyzer' | 'purecode_ticket_sim' | 'compoundiq_gate_sim';

export interface AnalyticsEventMap {
  select_content: { content_type: 'case_study'; content_id: CaseId; surface: 'work_preview' | 'work_page' };
  work_preview_viewed: { surface: 'work_preview' };
  cta_click: { cta_id: string; surface: string; from_page: string; destination: string; video_variant?: VoiceVariant };
  case_engaged: { case_id: CaseId; trigger: 'active_time' | 'scroll_depth' };
  demo_start: { demo_id: DemoId };
  demo_complete: { demo_id: DemoId };
  next_case_click: { from_case: CaseId; to_case: CaseId };
  practice_open: { practice_id: PracticeId; surface: 'homepage_practice' | 'about' | 'work_page' | 'footer' };
  practice_case_click: { practice_id: PracticeId; case_id: CaseId; surface: 'practice_page' };
  calendar_start: { booking_type: string; lead_source?: string };
  booking_step_viewed: { booking_type: string; step: 'details' };
  generate_lead: { booking_type: string; video_variant?: VoiceVariant; lead_source?: string };
  // Voice A/B on the Concierge Order Intake walkthrough (lib/videoVariant.ts).
  video_impression: { video_id: 'order_intake'; video_variant: VoiceVariant; forced: boolean };
  video_sound_on: { video_id: 'order_intake'; video_variant: VoiceVariant; via: 'button' | 'controls' };
  video_progress: { video_id: 'order_intake'; video_variant: VoiceVariant; percent: 25 | 50 | 75 | 100; sound: boolean };
}

const MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GTM_ID: string | undefined = import.meta.env.VITE_GTM_ID;
// The GTM id ships in frontend/.env.production (it is public — it appears in every page's source), so every
// production-mode build has it, Vercel previews included. Only the live hosts load GTM; previews and local
// builds send nothing.
export const LIVE_HOSTS = ['daveenci.ai', 'www.daveenci.ai'];

let initialized = false;
let transport: 'gtm' | 'gtag' | null = null;

/**
 * What one event looks like on the dataLayer. GTM's data model merges every push into one long-lived
 * object, so params from an earlier event would otherwise leak into the next one (a video_variant
 * from the walkthrough showing up on a later cta_click). Clearing event_params first prevents that.
 */
export const dataLayerPushes = (eventName: string, params: Record<string, unknown>): Record<string, unknown>[] => [
  { event_params: null },
  { event: eventName, event_params: params },
];

/**
 * Loads GTM (or gtag.js) once. Safe to call with neither env var set — the module then
 * degrades to dev-console logging and sends nothing.
 */
export const initAnalytics = (): void => {
  if (initialized || (!GTM_ID && !MEASUREMENT_ID)) return;
  if (GTM_ID && !LIVE_HOSTS.includes(window.location.hostname)) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  const internal = isInternalTraffic(window.location.search);

  const script = document.createElement('script');
  script.async = true;

  if (GTM_ID) {
    transport = 'gtm';
    // Read by the GTM Google tag as a config parameter; must be on the dataLayer before gtm.js runs.
    if (internal) window.dataLayer.push({ traffic_type: 'internal' });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
    return;
  }

  transport = 'gtag';
  window.gtag = function gtagShim() {
    // GA4 requires the real Arguments object on the dataLayer.
    window.dataLayer!.push(arguments);
  };
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false, ...(internal ? { traffic_type: 'internal' } : {}) });
};

const send = (eventName: string, params: Record<string, unknown>): void => {
  if (transport === 'gtm' && window.dataLayer) {
    for (const push of dataLayerPushes(eventName, params)) window.dataLayer.push(push);
  } else if (transport === 'gtag' && window.gtag) {
    window.gtag('event', eventName, params);
  } else if (import.meta.env.DEV) {
    console.debug('[analytics]', eventName, params);
  }
};

/**
 * Manual pageview — call only from the router choke points in App.tsx, after
 * the URL has been updated. page_location keeps the full href (query string
 * included) so GA4 campaign/UTM attribution survives; page_path is the
 * canonical trailing-slash-free pathname so one page never splits into two
 * rows.
 */
export const trackPageView = (pageTitle = document.title): void => {
  const { pathname } = window.location;
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  send('page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: pageTitle,
  });
};

/** Fire a typed funnel event. */
export const track = <N extends keyof AnalyticsEventMap>(
  name: N,
  params: AnalyticsEventMap[N],
): void => {
  send(name, params);
};
