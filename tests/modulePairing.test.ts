import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { modulePairings, shootOpsModules, starterModuleTerms } from '../frontend/content/shootOpsModules';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Order Intake and Order Review promote each other (13 Oct 2026)', () => {
  it('each starter module pairs with the other, and both have a page, a path and the $2,500 price', () => {
    expect(modulePairings['order-intake'].with).toBe('order-review');
    expect(modulePairings['order-review'].with).toBe('order-intake');
    for (const id of ['order-intake', 'order-review'] as const) {
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

  it('the Order Review side stays Aryeo only, and no copy invents a bundle price or a monthly plan', () => {
    const reviewSide = [modulePairings['order-review'].title, modulePairings['order-review'].body].join(' ');
    expect(reviewSide).not.toMatch(/Spiro/);
    const all = Object.values(modulePairings).map((p) => `${p.title} ${p.body}`).join(' ') + starterModuleTerms;
    expect(all).not.toMatch(/bundle|discount|monthly|\/mo|\$\d/i);
  });

  it('the /shoot-ops hub names both as the small starter modules, desktop and mobile', () => {
    for (const file of ['frontend/components/AutoPilotPage.tsx', 'frontend/components/mobile/MobileAutoPilotPage.tsx']) {
      const src = read(file);
      expect(src).toContain('Concierge Order Intake and Order Review are the two small ones');
      expect(src).not.toContain('is the first, small one');
    }
  });
});
