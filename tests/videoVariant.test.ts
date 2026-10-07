import { describe, expect, it } from 'vitest';
import {
  newProgressMarks,
  parseVariant,
  pickVideoVariant,
  readVideoVariant,
  videoSrc,
} from '../frontend/lib/videoVariant';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
};

const brokenStorage = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
};

describe('voice A/B assignment', () => {
  it('splits new visitors by the random draw: below 0.5 is Mark, the rest Rachel', () => {
    expect(pickVideoVariant('', memoryStorage(), () => 0.49).variant).toBe('mark');
    expect(pickVideoVariant('', memoryStorage(), () => 0.5).variant).toBe('rachel');
  });

  it('keeps a returning visitor on the voice they were first given', () => {
    const s = memoryStorage();
    expect(pickVideoVariant('', s, () => 0.9).variant).toBe('rachel');
    expect(pickVideoVariant('', s, () => 0.1)).toEqual({ variant: 'rachel', forced: false });
    expect(readVideoVariant(s)).toBe('rachel');
  });

  it('lands close to 50/50 over many visitors', () => {
    let seed = 7;
    const lcg = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    let mark = 0;
    for (let i = 0; i < 10000; i++) if (pickVideoVariant('', memoryStorage(), lcg).variant === 'mark') mark++;
    expect(mark).toBeGreaterThan(4800);
    expect(mark).toBeLessThan(5200);
  });

  it('?vv= forces a voice for that view only and never overwrites the assignment', () => {
    const s = memoryStorage();
    pickVideoVariant('', s, () => 0.1); // assigned mark
    expect(pickVideoVariant('?vv=rachel', s, () => 0.1)).toEqual({ variant: 'rachel', forced: true });
    expect(readVideoVariant(s)).toBe('mark');
    const fresh = memoryStorage();
    pickVideoVariant('?vv=MARK', fresh);
    expect(fresh.data.size).toBe(0);
  });

  it('ignores unknown or tampered values', () => {
    expect(parseVariant('paul')).toBeNull();
    expect(parseVariant('<script>')).toBeNull();
    const s = memoryStorage();
    s.setItem('daveenci-video-voice', 'paul');
    expect(pickVideoVariant('?vv=paul', s, () => 0.1)).toEqual({ variant: 'mark', forced: false });
  });

  it('still plays a voice when storage is blocked', () => {
    expect(pickVideoVariant('', brokenStorage, () => 0.7).variant).toBe('rachel');
    expect(pickVideoVariant('', null, () => 0.2).variant).toBe('mark');
    expect(readVideoVariant(brokenStorage)).toBeNull();
  });

  it('maps each voice to its own file', () => {
    expect(videoSrc('mark')).toBe('/videos/concierge-order-intake-mark.mp4');
    expect(videoSrc('rachel')).toBe('/videos/concierge-order-intake-rachel.mp4');
  });
});

describe('watch-progress marks', () => {
  it('reports each quarter once, and 100 from 98% so a last-frame miss still counts', () => {
    expect(newProgressMarks(10, 60, new Set())).toEqual([]);
    expect(newProgressMarks(31, 60, new Set())).toEqual([25, 50]);
    expect(newProgressMarks(31, 60, new Set([25]))).toEqual([50]);
    expect(newProgressMarks(59, 60, new Set([25, 50]))).toEqual([75, 100]);
  });

  it('reports nothing before the duration is known', () => {
    expect(newProgressMarks(5, NaN, new Set())).toEqual([]);
    expect(newProgressMarks(5, 0, new Set())).toEqual([]);
  });
});

describe('booking events carry the voice', () => {
  it('adds video_variant only for visitors who were assigned one', async () => {
    const { withVideoVariant } = await import('../frontend/lib/videoVariant');
    const s = memoryStorage();
    expect(withVideoVariant({ booking_type: 'anton' }, s)).toEqual({ booking_type: 'anton' });
    pickVideoVariant('', s, () => 0.1);
    expect(withVideoVariant({ booking_type: 'anton' }, s)).toEqual({ booking_type: 'anton', video_variant: 'mark' });
    expect(withVideoVariant({ booking_type: 'anton' }, brokenStorage)).toEqual({ booking_type: 'anton' });
  });
});
