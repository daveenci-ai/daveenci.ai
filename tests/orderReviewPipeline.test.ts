import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url).pathname;
const page = readFileSync(`${root}frontend/components/OrderReviewPage.tsx`, 'utf8');
const visuals = readFileSync(`${root}frontend/components/orderReview/ReviewVisuals.tsx`, 'utf8');

describe('Order Review: the stacking step cards (13 Oct 2026)', () => {
  it('Fig. iv is the four-step stack — Find, Read, Check, Fix — in the Intake page’s layout', () => {
    expect(page).toContain('Fig. iv · From new order to done');
    expect(page).toMatch(/<Stack>\s*\{PIPELINE\.map/);
    for (const step of ['Find', 'Read', 'Check', 'Fix']) expect(page).toContain(`eyebrow: '${step}'`);
    for (const panel of ['SweepPanel', 'ReadPanel', 'ResultsPanel', 'FixPanel']) expect(visuals).toContain(`export const ${panel}`);
  });

  it('keeps client names, places and the second platform off the page', () => {
    for (const src of [page, visuals]) {
      expect(src).not.toMatch(/\bf8\b|Steve|Zendesk|Daly City|RentCast|Spiro/i);
    }
  });
});
