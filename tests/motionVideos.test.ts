import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { VOICE_VARIANTS, videoPoster, videoSrc } from '../frontend/lib/videoVariant';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');
const pub = (path: string) => `${root}frontend/public${path}`;

// Motion-graphics overviews (Anton, 15 Oct 2026): a third variant in the Order Intake video test, and the Order Review
// page's Fig. ii (no test there).
describe('motion-graphics overviews', () => {
  it('every Order Intake variant has its video and poster in the build', () => {
    for (const v of VOICE_VARIANTS) {
      expect(existsSync(pub(videoSrc(v))), v).toBe(true);
      expect(existsSync(pub(videoPoster(v))), v).toBe(true);
    }
    expect(statSync(pub(videoSrc('motion'))).size).toBeLessThan(5_000_000);
  });

  it('the Intake page words follow the variant: the motion overview is never called real screens', () => {
    const src = read('frontend/components/OrderIntakePage.tsx');
    const motion = src.slice(src.indexOf('  motion: {'), src.indexOf('};', src.indexOf('  motion: {')));
    expect(motion).toContain("button: 'Watch the 20-second overview'");
    expect(motion).not.toMatch(/real screens|real order|real thing|60-second/);
    expect(src).toContain('poster={videoPoster(variant)}');
    expect(src).toContain('{VIDEO_COPY[variant].button}');
  });

  it('Order Review shows its overview in Fig. ii, the same for every visitor', () => {
    const src = read('frontend/components/OrderReviewPage.tsx');
    expect(src).toContain("const OVERVIEW_SRC = '/videos/order-review-motion.mp4';");
    expect(existsSync(pub('/videos/order-review-motion.mp4'))).toBe(true);
    expect(existsSync(pub('/videos/order-review-motion-poster.jpg'))).toBe(true);
    expect(src).not.toMatch(/pickVideoVariant|VOICE_VARIANTS/);
    expect(src.indexOf('src={OVERVIEW_SRC}')).toBeGreaterThan(src.indexOf('Fig. ii · How it works'));
  });
});
