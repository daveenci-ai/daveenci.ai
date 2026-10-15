import { lazy, type ComponentType } from 'react';

/**
 * Stale chunks after a deploy (15 Oct 2026).
 *
 * Every page is its own JS chunk with a hashed name (GuidesPage-20dH2vYP.js). A visitor who opened the site before a
 * deploy still runs the old app; when they click to another page it asks for the old chunk, which the new deployment
 * no longer has. Vercel answers 404, the import fails and the visitor sees "That page didn't load" until they
 * refresh. The fix: when a page chunk fails to load, reload once. The address already points at the page they
 * clicked, so the reload lands them on it with the new build.
 *
 * Guarded so it can never loop: one reload per address per 30 seconds. If storage is blocked we don't reload at all
 * and the error screen (with its own Reload button) shows instead.
 */

const KEY = 'dv:stale-chunk-reload';
const WINDOW_MS = 30_000;

const CHUNK_ERROR =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|Loading (CSS )?chunk [\w-]+ failed/i;

export const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_ERROR.test(message);
};

/** Reload the page once for this address. Returns true when a reload was started. */
export const reloadForNewDeploy = (now: number = Date.now()): boolean => {
  if (typeof window === 'undefined') return false;
  const url = window.location.pathname + window.location.search;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const prev = raw ? (JSON.parse(raw) as { url?: string; at?: number }) : null;
    if (prev && prev.url === url && typeof prev.at === 'number' && now - prev.at < WINDOW_MS) return false;
    window.sessionStorage.setItem(KEY, JSON.stringify({ url, at: now }));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};

/** React.lazy for a page: a chunk that is gone after a deploy triggers one reload instead of an error screen. */
export function lazyPage<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return lazy(() =>
    load().catch((error: unknown) => {
      // Keep the loading spinner up while the browser reloads.
      if (isChunkLoadError(error) && reloadForNewDeploy()) return new Promise<{ default: T }>(() => {});
      throw error;
    }),
  );
}

/** Vite fires this when a dynamic import or its preloads fail; same handling. */
export const installStaleChunkReload = (): void => {
  if (typeof window === 'undefined') return;
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadForNewDeploy()) event.preventDefault();
  });
};
