import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STARTER_MODULES, modulePairings, shootOpsModules, starterModuleTerms } from '../frontend/content/shootOpsModules';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

const PAGES = [
  ['frontend/components/OrderIntakePage.tsx', 'order-intake'],
  ['frontend/components/OrderReviewPage.tsx', 'order-review'],
  ['frontend/components/DailyReportPage.tsx', 'daily-review'],
  ['frontend/components/PhotoReviewPage.tsx', 'photo-review'],
] as const;

describe('The four fixed-price modules each promote two others (13 Oct 2026; Daily Report and Photo Review added 15 Oct 2026)', () => {
  it('the pairs rotate (Anton, 15 Oct 2026), and every module has a page, a path and the $2,500 price', () => {
    expect(STARTER_MODULES).toEqual(['order-intake', 'order-review', 'daily-review', 'photo-review']);
    expect(modulePairings['order-intake'].with).toEqual(['order-review', 'daily-review']);
    expect(modulePairings['order-review'].with).toEqual(['daily-review', 'photo-review']);
    expect(modulePairings['daily-review'].with).toEqual(['photo-review', 'order-intake']);
    expect(modulePairings['photo-review'].with).toEqual(['order-intake', 'order-review']);
    for (const id of STARTER_MODULES) {
      expect(modulePairings[id].with).toHaveLength(2);
      expect(modulePairings[id].with).not.toContain(id);
      const m = shootOpsModules.find((x) => x.id === id);
      expect(m?.page).toBeTruthy();
      expect(m?.path).toMatch(/^\/shoot-ops\//);
      expect(m?.price).toMatch(/^\$2,500 fixed/);
    }
    expect(shootOpsModules.find((x) => x.id === 'photo-review')?.price).toBe('$2,500 fixed + AI usage at cost');
    // Every module is promoted by exactly two others.
    for (const id of STARTER_MODULES) {
      expect(STARTER_MODULES.filter((o) => modulePairings[o].with.includes(id))).toHaveLength(2);
    }
  });

  it('each page renders the band for its own module, before the first two weeks', () => {
    for (const [file, id] of PAGES) {
      const src = read(file);
      const band = src.indexOf(`<ModulePairing current="${id}"`);
      expect(band).toBeGreaterThan(-1);
      expect(band).toBeLessThan(src.indexOf('Fig. vii · Getting started'));
      expect(src).not.toContain('Also part of Shoot Ops');
    }
  });

  it('every module page books with Anton (Anton, 15 Oct 2026)', () => {
    for (const [file] of PAGES) {
      const src = read(file);
      expect(src).toContain('Book 15 minutes with Anton');
      expect(src).toContain('/book/anton?src=module');
      expect(src).not.toMatch(/book\/astrid|onNavigate\('calendar'\)/);
    }
  });

  it('Concierge Order Intake lists checking placed orders as Order Review, with a link', () => {
    const src = read('frontend/components/OrderIntakePage.tsx');
    expect(src).toContain('Checking orders once they’re placed — that is Order Review');
    expect(src).toContain('href="/shoot-ops/order-review"');
  });

  it('only Intake names Spiro, and no copy invents a bundle price or a monthly plan', () => {
    for (const id of ['order-review', 'daily-review', 'photo-review'] as const) {
      expect([modulePairings[id].title, modulePairings[id].body].join(' ')).not.toMatch(/Spiro/);
    }
    const all = Object.values(modulePairings).map((p) => `${p.title} ${p.body}`).join(' ') + starterModuleTerms;
    expect(all).not.toMatch(/bundle|discount|monthly|\/mo|\$\d/i);
  });

  it('the /shoot-ops hub prices all four at $2,500 each, desktop and mobile, with Photo Review adding AI usage', () => {
    for (const file of ['frontend/components/AutoPilotPage.tsx', 'frontend/components/mobile/MobileAutoPilotPage.tsx']) {
      const src = read(file);
      expect(src).toContain('Each one is $2,500, fixed, live within a week');
      expect(src).toContain('Real-time Photo Review adds its AI usage at cost');
      expect(src).not.toMatch(/three small ones|two small ones|follows once one is live/);
    }
  });
});
