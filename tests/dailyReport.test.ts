import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shootOpsModules } from '../frontend/content/shootOpsModules';
import { bookingTargetFor, isShootOpsPage, isShootOpsPath } from '../frontend/lib/shootOpsBooking';
import { getRouteMetadata } from '../frontend/lib/routeMetadata';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Daily Report page (Anton, 15 Oct 2026)', () => {
  const src = read('frontend/components/DailyReportPage.tsx');

  it('is served prerendered at /shoot-ops/daily-report and listed everywhere a module page is', () => {
    const routes = JSON.parse(read('vercel.json')).routes;
    expect(routes.some((r: { src?: string; dest?: string }) => r.src === '/shoot-ops/daily-report' && r.dest === '/_prerendered/daily-report.html')).toBe(true);
    expect(read('frontend/public/sitemap.xml')).toContain('<loc>https://daveenci.ai/shoot-ops/daily-report</loc>');
    expect(read('frontend/prerender/routeShells.tsx')).toContain("add('/shoot-ops/daily-report', 'daily-report.html'");
    expect(read('frontend/App.tsx')).toContain("path === '/shoot-ops/daily-report'");
    expect(read('frontend/public/llms.txt')).toContain('[Daily Report](https://daveenci.ai/shoot-ops/daily-report)');
    expect(read('frontend/components/ModulesPage.tsx')).toContain("path: '/shoot-ops/daily-report'");
    expect(getRouteMetadata('daily-report').path).toBe('/shoot-ops/daily-report');
  });

  it('carries the same terms as the other two: $2,500, Aryeo only, two-week refund, no subscription', () => {
    expect(src).toContain('$2,500');
    expect(src).toContain('One Aryeo account');
    expect(src).toContain('Platforms other than Aryeo');
    expect(src).toContain('Refund in full');
    expect(src).toContain('No subscription:');
    expect(src).not.toMatch(/Spiro|monthly plan/);
    expect(shootOpsModules.find((m) => m.id === 'daily-review')?.price).toBe('$2,500 fixed · live within a week');
  });

  it('describes what the module actually does: file names not vision, no Aryeo changes, no urgent section', () => {
    const visuals = read('frontend/components/dailyReport/ReportVisuals.tsx');
    const schematic = read('frontend/components/ShootOpsModuleSchematics.tsx');
    const daily = schematic.slice(schematic.indexOf('export const DailyReviewSchematic'));
    const catalogue = shootOpsModules.find((m) => m.id === 'daily-review')!;
    for (const text of [src, visuals, daily.slice(0, daily.indexOf('\n};') + 3), catalogue.detail, catalogue.summary]) {
      expect(text).not.toMatch(/vision model|confirmed by vision|urgent/i);
    }
    expect(src).toContain('It reads your team’s own file names');
    expect(src).toContain('it changes nothing in Aryeo');
    expect(src).toContain('Holding or rescheduling deliveries in Aryeo');
    for (const marker of ['AERIAL', 'TWILIGHT', 'day to dusk', 'virtually staged']) expect(src).toContain(`marker: '${marker}'`);
    for (const d of ['Photos', 'Video', '3D tour', 'Floor plans', 'Files', 'Property website']) expect(src).toContain(`title: '${d}'`);
  });

  it('books with Anton like every Shoot Ops page', () => {
    expect(isShootOpsPage('daily-report')).toBe(true);
    expect(bookingTargetFor('calendar', 'daily-report')).toBe('book-anton');
    expect(isShootOpsPath('/shoot-ops/daily-report')).toBe(true);
    expect(src).toContain('Book 15 minutes with Anton');
    expect(src).not.toContain("onNavigate('calendar')");
  });

  it('no client is named on the page or in its drawings', () => {
    const visuals = read('frontend/components/dailyReport/ReportVisuals.tsx');
    for (const text of [src, visuals]) expect(text).not.toMatch(/\bf8\b|f8re|Steve|Elich|Botero|CBLC|Coldwell/i);
  });
});
