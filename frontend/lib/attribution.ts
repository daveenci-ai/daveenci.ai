export interface Attribution {
  /** Outreach tracked-link token, or '' when the visitor carries none. */
  t: string;
  /** How they arrived: outreach, module, or plain site traffic. */
  src: string;
}

const KEY = 'daveenci-attribution';
const KNOWN_SOURCES = ['outreach', 'module', 'site'];
const EMPTY: Attribution = { t: '', src: 'site' };

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
};

const sanitizeToken = (raw: string | null): string => {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 64) return '';
  return /^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : '';
};

const sanitizeSource = (raw: string | null): string =>
  raw && KNOWN_SOURCES.includes(raw) ? raw : 'site';

/** What this URL alone says about where the visitor came from. */
export const parseAttribution = (search: string): Attribution => {
  const params = new URLSearchParams(search);
  return { t: sanitizeToken(params.get('t')), src: sanitizeSource(params.get('src')) };
};

/**
 * Record the attribution this URL carries, without discarding what an earlier
 * page already established — the token arrives on the module page and has to
 * survive the click through to the booking page.
 */
export const rememberAttribution = (
  search: string,
  storage: Storage | null = defaultStorage(),
): Attribution => {
  const incoming = parseAttribution(search);
  const stored = readAttribution(storage);
  const merged: Attribution = {
    t: incoming.t || stored.t,
    src: new URLSearchParams(search).get('src') ? incoming.src : stored.src,
  };

  try {
    storage?.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* private mode, or storage disabled — attribution is not worth an error */
  }
  return merged;
};

export const readAttribution = (storage: Storage | null = defaultStorage()): Attribution => {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    return { t: sanitizeToken(parsed?.t ?? null), src: sanitizeSource(parsed?.src ?? null) };
  } catch {
    return { ...EMPTY };
  }
};

/**
 * Who /book should open on. Anyone who came through outreach or the module
 * page already knows the price and wants Anton; everyone else gets the choice.
 */
export const defaultBookingHost = (attribution: Attribution): 'anton' | null =>
  attribution.src === 'outreach' || attribution.src === 'module' || attribution.t ? 'anton' : null;
