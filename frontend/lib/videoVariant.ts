/**
 * A/B test of the narrator voice on the Concierge Order Intake walkthrough.
 *
 * Each visitor is assigned one voice, 50/50, and keeps it on later visits
 * (localStorage), so the same person never hears both. `?vv=mark` or
 * `?vv=rachel` forces a voice for that page view only — for previews and QA —
 * and is never stored, so it cannot skew the split.
 */
export type VoiceVariant = 'mark' | 'rachel';

export const VOICE_VARIANTS: readonly VoiceVariant[] = ['mark', 'rachel'];

const KEY = 'daveenci-video-voice';

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;

const defaultStorage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const parseVariant = (raw: string | null | undefined): VoiceVariant | null => {
  const v = (raw ?? '').trim().toLowerCase();
  return (VOICE_VARIANTS as readonly string[]).includes(v) ? (v as VoiceVariant) : null;
};

/** The voice this visitor was assigned, or null if they have never been assigned one. */
export const readVideoVariant = (storage: Storage | null = defaultStorage()): VoiceVariant | null => {
  try {
    return parseVariant(storage?.getItem(KEY));
  } catch {
    return null;
  }
};

/**
 * The voice to play on this page view: a `?vv=` override, else the stored
 * assignment, else a fresh 50/50 assignment that is stored for next time.
 */
export const pickVideoVariant = (
  search: string,
  storage: Storage | null = defaultStorage(),
  random: () => number = Math.random,
): { variant: VoiceVariant; forced: boolean } => {
  const forced = parseVariant(new URLSearchParams(search).get('vv'));
  if (forced) return { variant: forced, forced: true };

  const stored = readVideoVariant(storage);
  if (stored) return { variant: stored, forced: false };

  const variant: VoiceVariant = random() < 0.5 ? 'mark' : 'rachel';
  try {
    storage?.setItem(KEY, variant);
  } catch {
    /* private mode, or storage disabled: the visitor just gets a per-view assignment */
  }
  return { variant, forced: false };
};

export const videoSrc = (variant: VoiceVariant): string => `/videos/concierge-order-intake-${variant}.mp4`;

/** Quarter marks a viewer has newly passed, given the marks already reported. */
export const newProgressMarks = (
  currentTime: number,
  duration: number,
  reported: ReadonlySet<number>,
): Array<25 | 50 | 75 | 100> => {
  if (!(duration > 0) || !(currentTime >= 0)) return [];
  const pct = (currentTime / duration) * 100;
  return ([25, 50, 75, 100] as const).filter((m) => !reported.has(m) && pct >= (m === 100 ? 98 : m));
};

/** Tag a booking event with the voice this visitor was assigned, if any, so bookings can be split by voice. */
export const withVideoVariant = <P extends object>(
  params: P,
  storage: Storage | null = defaultStorage(),
): P & { video_variant?: VoiceVariant } => {
  const v = readVideoVariant(storage);
  return v ? { ...params, video_variant: v } : params;
};
