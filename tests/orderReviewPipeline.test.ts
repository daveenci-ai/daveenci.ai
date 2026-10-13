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

describe('Order Review counts nine checks, including same-day (13 Oct 2026)', () => {
  it('lists nine checks, the ninth being the same-day order', () => {
    const block = page.slice(page.indexOf('const CHECKS'), page.indexOf('// Fig. iv'));
    expect((block.match(/n: '0\d'/g) || []).length).toBe(9);
    expect(block).toContain("title: 'Same-day order'");
  });

  it('no Shoot Ops page or metadata still says eight', () => {
    for (const rel of [
      'frontend/components/OrderReviewPage.tsx',
      'frontend/components/orderReview/ReviewVisuals.tsx',
      'frontend/components/ShootOpsModuleSchematics.tsx',
      'frontend/components/ModulesPage.tsx',
      'frontend/components/AutoPilotPage.tsx',
      'frontend/components/mobile/MobileAutoPilotPage.tsx',
      'frontend/content/shootOpsModules.ts',
      'frontend/content/shootOpsEvidence.ts',
      'frontend/lib/routeMetadata.ts',
      'frontend/public/llms.txt',
    ]) {
      const src = readFileSync(`${root}${rel}`, 'utf8');
      expect(src, rel).not.toMatch(/\beight\b|\b8 checks\b/i);
    }
  });
});
