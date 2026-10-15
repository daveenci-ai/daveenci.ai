import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { modulePairings, shootOpsModules, starterModuleTerms } from '../frontend/content/shootOpsModules';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('The three fixed-price modules promote the other two (13 Oct 2026; Daily Report added 15 Oct 2026)', () => {
  it('each module pairs with the other two, and all three have a page, a path and the $2,500 price', () => {
    expect(modulePairings['order-intake'].with).toEqual(['order-review', 'daily-review']);
    expect(modulePairings['order-review'].with).toEqual(['order-intake', 'daily-review']);
    expect(modulePairings['daily-review'].with).toEqual(['order-intake', 'order-review']);
    for (const id of ['order-intake', 'order-review', 'daily-review'] as const) {
      const m = shootOpsModules.find((x) => x.id === id);
      expect(m?.page).toBeTruthy();
      expect(m?.path).toMatch(/^\/shoot-ops\//);
      expect(m?.price).toBe('$2,500 fixed · live within a week');
    }
  });

  it('each page renders the band for its own module, before the first two weeks', () => {
    for (const [file, id] of [
      ['frontend/components/OrderIntakePage.tsx', 'order-intake'],
      ['frontend/components/OrderReviewPage.tsx', 'order-review'],
      ['frontend/components/DailyReportPage.tsx', 'daily-review'],
    ] as const) {
      const src = read(file);
      const band = src.indexOf(`<ModulePairing current="${id}"`);
      expect(band).toBeGreaterThan(-1);
      expect(band).toBeLessThan(src.indexOf('Fig. vii · Getting started'));
      expect(src).not.toContain('Also part of Shoot Ops');
    }
  });

  it('Concierge Order Intake lists checking placed orders as Order Review, with a link', () => {
    const src = read('frontend/components/OrderIntakePage.tsx');
    expect(src).toContain('Checking orders once they’re placed — that is Order Review');
    expect(src).toContain('href="/shoot-ops/order-review"');
  });

  it('the Order Review and Daily Report sides stay Aryeo only, and no copy invents a bundle price or a monthly plan', () => {
    for (const id of ['order-review', 'daily-review'] as const) {
      expect([modulePairings[id].title, modulePairings[id].body].join(' ')).not.toMatch(/Spiro/);
    }
    const all = Object.values(modulePairings).map((p) => `${p.title} ${p.body}`).join(' ') + starterModuleTerms;
    expect(all).not.toMatch(/bundle|discount|monthly|\/mo|\$\d/i);
  });

  it('the /shoot-ops hub names all three as the small modules at $2,500 each, desktop and mobile', () => {
    for (const file of ['frontend/components/AutoPilotPage.tsx', 'frontend/components/mobile/MobileAutoPilotPage.tsx']) {
      const src = read(file);
      expect(src).toContain('Concierge Order Intake, Order Review and the Daily Report are the three small ones — $2,500 each');
      expect(src).not.toContain('are the two small ones');
      expect(src).not.toContain('is the first, small one');
    }
  });
});
