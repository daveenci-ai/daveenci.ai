import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isInternalTraffic } from '../frontend/lib/internalTraffic';
import { withLeadSource } from '../frontend/lib/attribution';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

describe('internal-traffic mark', () => {
  it('?internal=1 marks the browser and the mark survives later visits', () => {
    const s = memoryStorage();
    expect(isInternalTraffic('?internal=1', s)).toBe(true);
    expect(isInternalTraffic('', s)).toBe(true);
  });

  it('?internal=0 removes the mark', () => {
    const s = memoryStorage();
    isInternalTraffic('?internal=1', s);
    expect(isInternalTraffic('?internal=0', s)).toBe(false);
    expect(isInternalTraffic('', s)).toBe(false);
  });

  it('an unmarked visitor is not internal', () => {
    expect(isInternalTraffic('?utm_source=x', memoryStorage())).toBe(false);
  });

  it('blocked storage falls back to the URL alone', () => {
    const broken = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); }, removeItem: () => { throw new Error('x'); } };
    expect(isInternalTraffic('?internal=1', broken)).toBe(true);
    expect(isInternalTraffic('', broken)).toBe(false);
  });
});

describe('lead source on booking events', () => {
  it('adds where the visitor came from, never the outreach token', () => {
    const s = memoryStorage();
    s.setItem('daveenci-attribution', JSON.stringify({ t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', src: 'outreach' }));
    const out = withLeadSource({ booking_type: 'anton' }, s);
    expect(out).toEqual({ booking_type: 'anton', lead_source: 'outreach' });
    expect(JSON.stringify(out)).not.toContain('aaaa');
  });

  it('defaults to site traffic', () => {
    expect(withLeadSource({ booking_type: 'x' }, memoryStorage()).lead_source).toBe('site');
  });
});

// --- transport: GTM vs gtag.js, never both ---------------------------------------------------------

type FakeWindow = { location: { search: string; href: string; pathname: string; hostname: string }; dataLayer?: unknown[]; gtag?: unknown };
const appended: { src?: string }[] = [];

const installDom = (search = '', hostname = 'daveenci.ai') => {
  appended.length = 0;
  const win: FakeWindow = { location: { search, href: `https://${hostname}/${search}`, pathname: '/', hostname } };
  vi.stubGlobal('window', win);
  vi.stubGlobal('document', {
    title: 'DaVeenci',
    createElement: () => ({}),
    head: { appendChild: (el: { src?: string }) => appended.push(el) },
  });
  vi.stubGlobal('localStorage', memoryStorage());
  return win;
};

const loadAnalytics = async (env: Record<string, string>) => {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  return import('../frontend/lib/analytics');
};

describe('analytics transport', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('VITE_GTM_ID', '');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('with a GTM id: loads gtm.js only, and events land on the dataLayer', async () => {
    const win = installDom();
    const a = await loadAnalytics({ VITE_GTM_ID: 'GTM-TEST123', VITE_GA_MEASUREMENT_ID: 'G-TEST' });
    a.initAnalytics();
    expect(appended.map((s) => s.src)).toEqual(['https://www.googletagmanager.com/gtm.js?id=GTM-TEST123']);
    expect(win.gtag).toBeUndefined();
    a.track('generate_lead', { booking_type: 'anton', lead_source: 'outreach' });
    expect(win.dataLayer!.slice(-2)).toEqual([
      { event_params: null },
      { event: 'generate_lead', event_params: { booking_type: 'anton', lead_source: 'outreach' } },
    ]);
  });

  it('clears the previous event params before every event', async () => {
    const win = installDom();
    const a = await loadAnalytics({ VITE_GTM_ID: 'GTM-TEST123' });
    a.initAnalytics();
    a.track('video_sound_on', { video_id: 'order_intake', video_variant: 'mark', via: 'button' });
    a.track('cta_click', { cta_id: 'x', surface: 'hero', from_page: '/', destination: '/book' });
    const pushes = win.dataLayer!.slice(-2);
    expect(pushes[0]).toEqual({ event_params: null });
    expect(pushes[1]).toEqual({ event: 'cta_click', event_params: { cta_id: 'x', surface: 'hero', from_page: '/', destination: '/book' } });
  });

  it('marks internal visitors on the dataLayer before gtm.js starts', async () => {
    const win = installDom('?internal=1');
    const a = await loadAnalytics({ VITE_GTM_ID: 'GTM-TEST123' });
    a.initAnalytics();
    const iInternal = win.dataLayer!.findIndex((x) => (x as Record<string, unknown>).traffic_type === 'internal');
    const iStart = win.dataLayer!.findIndex((x) => (x as Record<string, unknown>).event === 'gtm.js');
    expect(iInternal).toBeGreaterThanOrEqual(0);
    expect(iInternal).toBeLessThan(iStart);
  });

  it('a normal visitor carries no traffic_type', async () => {
    const win = installDom();
    const a = await loadAnalytics({ VITE_GTM_ID: 'GTM-TEST123' });
    a.initAnalytics();
    expect(win.dataLayer!.some((x) => 'traffic_type' in (x as object))).toBe(false);
  });

  it('without a GTM id: falls back to gtag.js with the GA4 id', async () => {
    const win = installDom();
    const a = await loadAnalytics({ VITE_GA_MEASUREMENT_ID: 'G-TEST' });
    a.initAnalytics();
    expect(appended.map((s) => s.src)).toEqual(['https://www.googletagmanager.com/gtag/js?id=G-TEST']);
    expect(typeof win.gtag).toBe('function');
  });

  it('a Vercel preview or local build never loads GTM, even with the id baked in', async () => {
    for (const host of ['daveenci-ai-git-branch.vercel.app', 'localhost']) {
      const win = installDom('', host);
      const a = await loadAnalytics({ VITE_GTM_ID: 'GTM-TEST123' });
      a.initAnalytics();
      a.track('generate_lead', { booking_type: 'anton' });
      expect(appended).toEqual([]);
      expect(win.dataLayer).toBeUndefined();
    }
  });

  it('with neither id: loads nothing', async () => {
    installDom();
    const a = await loadAnalytics({});
    a.initAnalytics();
    expect(appended).toEqual([]);
  });
});
