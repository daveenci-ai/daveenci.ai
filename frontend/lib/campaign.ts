// Ad / campaign attribution that survives until the visitor books.
//
// The landing URL of a paid ad (or a tagged outreach email) carries utm_* parameters and, for ads, a click id
// (gclid / fbclid / li_fat_id). GA4 reads those itself for the session, but a booking can happen days later in a
// new session, and the CRM never sees GA4. So the last tagged touch is kept in localStorage for 90 days (the
// LinkedIn / Meta click attribution window) and sent with the booking, where it lands on the CRM interaction.

export const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export const CLICK_ID_KEYS = ['gclid', 'fbclid', 'li_fat_id'] as const;
export type CampaignKey = (typeof CAMPAIGN_KEYS)[number] | (typeof CLICK_ID_KEYS)[number];
export type Campaign = Partial<Record<CampaignKey, string>>;

const KEY = 'daveenci-campaign';
export const CAMPAIGN_TTL_MS = 90 * 24 * 60 * 60 * 1000;

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

/** Campaign names come from ad platforms (spaces, pipes, dashes are normal); drop control chars and cap length. */
export const cleanUtm = (raw: unknown): string => {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[\u0000-\u001f\u007f<>"'`]/g, '').trim().slice(0, 100);
};

/** Click ids are opaque tokens. */
export const cleanClickId = (raw: unknown): string => {
  if (typeof raw !== 'string') return '';
  const v = raw.trim();
  return v.length <= 255 && /^[A-Za-z0-9._-]+$/.test(v) ? v : '';
};

/** What this URL alone says about the campaign. Empty object when it carries none. */
export const parseCampaign = (search: string): Campaign => {
  const params = new URLSearchParams(search);
  const out: Campaign = {};
  for (const k of CAMPAIGN_KEYS) {
    const v = cleanUtm(params.get(k));
    if (v) out[k] = v;
  }
  for (const k of CLICK_ID_KEYS) {
    const v = cleanClickId(params.get(k));
    if (v) out[k] = v;
  }
  return out;
};

/**
 * Last-touch: a URL that carries any campaign parameter replaces what was stored; a plain URL leaves it alone.
 * Returns the campaign now in effect.
 */
export const rememberCampaign = (search: string, storage: Storage | null = defaultStorage(), now = Date.now()): Campaign => {
  const incoming = parseCampaign(search);
  if (Object.keys(incoming).length) {
    try {
      storage?.setItem(KEY, JSON.stringify({ at: now, campaign: incoming }));
    } catch {
      /* storage blocked — the booking just won't carry it */
    }
    return incoming;
  }
  return readCampaign(storage, now);
};

/** The stored campaign, or {} when none or older than 90 days. Only known, cleaned keys come back. */
export const readCampaign = (storage: Storage | null = defaultStorage(), now = Date.now()): Campaign => {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed?.at !== 'number' || now - parsed.at > CAMPAIGN_TTL_MS) {
      storage?.removeItem(KEY);
      return {};
    }
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(parsed.campaign ?? {})) if (typeof v === 'string') qs.set(k, v);
    return parseCampaign(`?${qs.toString()}`);
  } catch {
    return {};
  }
};
