// Typed GA4 analytics layer. All events flow through track(); pageviews are
// fired manually from the router choke point in App.tsx because the custom
// pushState/replaceState router makes GA4 Enhanced Measurement history
// tracking unreliable (see docs/ANALYTICS_SETUP.md — EM history tracking
// must be disabled on the GA4 property).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type CaseId = 'compoundiq' | 'autopilot' | 'purecode' | 'brandos' | 'pulsenote';
export type DemoId = 'brandos_analyzer' | 'purecode_ticket_sim' | 'compoundiq_gate_sim';

export interface AnalyticsEventMap {
  select_content: { content_type: 'case_study'; content_id: CaseId; surface: 'work_preview' | 'work_page' };
  case_engaged: { case_id: CaseId; trigger: 'active_time' | 'scroll_depth' };
  demo_start: { demo_id: DemoId };
  demo_complete: { demo_id: DemoId };
  next_case_click: { from_case: CaseId; to_case: CaseId };
  calendar_start: { booking_type: string };
  generate_lead: { booking_type: string };
  newsletter_subscribe: { source: string };
}

const MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

/**
 * Injects gtag.js and configures the GA4 property with automatic pageviews
 * disabled. Safe to call without VITE_GA_MEASUREMENT_ID set — the module
 * degrades to dev-console logging.
 */
export const initAnalytics = (): void => {
  if (initialized || !MEASUREMENT_ID) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtagShim() {
    // GA4 requires the real Arguments object on the dataLayer.
    window.dataLayer!.push(arguments);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
};

const send = (eventName: string, params: Record<string, unknown>): void => {
  if (window.gtag && MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  } else if (import.meta.env.DEV) {
    console.debug('[analytics]', eventName, params);
  }
};

/** Manual pageview — call only from the router choke point in App.tsx. */
export const trackPageView = (path: string): void => {
  send('page_view', {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: document.title,
  });
};

/** Fire a typed funnel event. */
export const track = <N extends keyof AnalyticsEventMap>(
  name: N,
  params: AnalyticsEventMap[N],
): void => {
  send(name, params);
};
