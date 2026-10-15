import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isChunkLoadError, reloadForNewDeploy } from '../frontend/lib/staleChunk';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('a page chunk gone after a deploy reloads once instead of failing (15 Oct 2026)', () => {
  let store: Record<string, string>;
  const reload = vi.fn();
  beforeEach(() => {
    store = {};
    reload.mockReset();
    vi.stubGlobal('window', {
      location: { pathname: '/guides', search: '', reload },
      sessionStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
      },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('recognises the browsers’ chunk-load errors and nothing else', () => {
    for (const m of [
      'Failed to fetch dynamically imported module: https://daveenci.ai/assets/GuidesPage-20dH2vYP.js', // Chrome
      'Importing a module script failed.', // Safari
      'error loading dynamically imported module: https://daveenci.ai/assets/x.js', // Firefox
      'Unable to preload CSS for /assets/index-DTJIKeil.css',
    ]) expect(isChunkLoadError(new TypeError(m))).toBe(true);
    for (const m of ['Cannot read properties of undefined', 'NetworkError when attempting to fetch resource.']) {
      expect(isChunkLoadError(new Error(m))).toBe(false);
    }
  });

  it('reloads once per address, never in a loop', () => {
    expect(reloadForNewDeploy(1_000)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    // Same address again within 30 s (the new build is also broken): no second reload, the error screen shows.
    expect(reloadForNewDeploy(5_000)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    // Later, or on another page, it may reload again.
    expect(reloadForNewDeploy(40_000)).toBe(true);
    (window.location as { pathname: string }).pathname = '/codex';
    expect(reloadForNewDeploy(41_000)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(3);
  });

  it('does not reload at all when storage is blocked', () => {
    (window as unknown as { sessionStorage: unknown }).sessionStorage = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('SecurityError'); },
    };
    expect(reloadForNewDeploy()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('every lazy page goes through lazyPage, and the entry point and error screen use the same recovery', () => {
    const app = read('frontend/App.tsx');
    expect(app).not.toMatch(/= lazy\(/);
    expect(app.match(/= lazyPage\(\(\) => import\(/g)?.length).toBeGreaterThan(20);
    for (const f of ['frontend/components/CreativeProductionPage.tsx', 'frontend/components/mobile/MobileCreativeProductionPage.tsx']) {
      expect(read(f)).toContain('const BookingWidget = lazyPage(');
    }
    expect(read('frontend/index.tsx')).toContain('installStaleChunkReload();');
    expect(read('frontend/components/mobile/MobileErrorBoundary.tsx')).toContain('isChunkLoadError(error) && reloadForNewDeploy()');
  });

  it('a missing /assets file is a 404 nobody caches (it used to be cached for four hours)', () => {
    const routes = JSON.parse(read('vercel.json')).routes as Array<Record<string, unknown>>;
    const fs = routes.findIndex((r) => r.handle === 'filesystem');
    const assets = routes.findIndex((r) => r.src === '/assets/.*');
    expect(assets).toBe(fs + 1);
    expect(routes[assets]).toMatchObject({ status: 404, headers: { 'Cache-Control': 'no-store' } });
  });
});
