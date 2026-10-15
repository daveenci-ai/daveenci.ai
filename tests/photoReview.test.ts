import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { shootOpsModules } from '../frontend/content/shootOpsModules';
import { bookingTargetFor, isShootOpsPage, isShootOpsPath } from '../frontend/lib/shootOpsBooking';
import { getRouteMetadata } from '../frontend/lib/routeMetadata';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Real-time Photo Review page (Anton, 15 Oct 2026)', () => {
  const src = read('frontend/components/PhotoReviewPage.tsx');
  const visuals = read('frontend/components/photoReview/ReviewVisuals.tsx');

  it('is served prerendered at /shoot-ops/photo-review and listed everywhere a module page is', () => {
    const routes = JSON.parse(read('vercel.json')).routes;
    expect(routes.some((r: { src?: string; dest?: string }) => r.src === '/shoot-ops/photo-review' && r.dest === '/_prerendered/photo-review.html')).toBe(true);
    expect(read('frontend/public/sitemap.xml')).toContain('<loc>https://daveenci.ai/shoot-ops/photo-review</loc>');
    expect(read('frontend/prerender/routeShells.tsx')).toContain("add('/shoot-ops/photo-review', 'photo-review.html'");
    expect(read('frontend/App.tsx')).toContain("path === '/shoot-ops/photo-review'");
    expect(read('frontend/public/llms.txt')).toContain('[Real-time Photo Review](https://daveenci.ai/shoot-ops/photo-review)');
    expect(read('frontend/components/ModulesPage.tsx')).toContain("path: '/shoot-ops/photo-review'");
    expect(getRouteMetadata('photo-review').path).toBe('/shoot-ops/photo-review');
  });

  it('prices it at $2,500 fixed plus AI usage at cost, never a made-up per-photo figure', () => {
    expect(src).toContain('$2,500');
    expect(src).toContain('+ AI usage at cost, paid directly');
    expect(src).toContain('we add nothing');
    expect(src).toContain('Refund in full');
    expect(src).toContain('No subscription:');
    expect(src).toContain('Platforms other than Aryeo');
    expect(src).not.toMatch(/Spiro|monthly plan|per photo\W+\$|\$0\.\d|cents/i);
  });

  it('lists the twelve checks that are on in the module, and says exposure and coverage are off by default', () => {
    const titles = [...src.matchAll(/\{ title: '([^']+)', body:/g)].map((m) => m[1]);
    expect(titles).toEqual([
      'Focus', 'Near-duplicates', 'Verticals', 'Crop and composition', 'Camera angle', 'Sun and glare', 'Reflections',
      'Noise', 'Colour cast', 'HDR artifacts', 'Signs and branding', 'Ordered photo types',
    ]);
    expect(src).toContain('exposure outliers and room coverage — are built and off by default');
  });

  it('describes real time without a timing promise, and reads only', () => {
    expect(src).toContain('checked as it is uploaded');
    expect(src).not.toMatch(/within \d+ (seconds|minutes)|in seconds|instantly/i);
    expect(src).toContain('It only reads; it changes nothing in Aryeo.');
    expect(src).toContain('It never edits, moves or deletes a photo');
    // The access list must not claim nothing leaves the client's accounts: photos go to the AI model.
    expect(src).not.toContain('Nothing about your listings leaves your accounts');
    expect(src).toContain('Photos go only to the AI model for the check');
  });

  it('the ticket matches the module: subject by order number, frames by number, could-not-verify as one line', () => {
    expect(visuals).toContain('Photo Review - Order 20412 (3 Issues)');
    expect(visuals).toContain('near-duplicates, keep one');
    expect(visuals).toContain('Could not verify: noise on 2 images.');
  });

  it('books with Anton like every Shoot Ops page', () => {
    expect(isShootOpsPage('photo-review')).toBe(true);
    expect(bookingTargetFor('calendar', 'photo-review')).toBe('book-anton');
    expect(isShootOpsPath('/shoot-ops/photo-review')).toBe(true);
    expect(src).toContain('Book 15 minutes with Anton');
  });

  it('the catalogue, hub and schematic no longer claim exposure or coverage checks', () => {
    const m = shootOpsModules.find((x) => x.id === 'photo-review')!;
    for (const text of [m.summary, m.detail]) expect(text).not.toMatch(/exposure|coverage/i);
    const schematic = read('frontend/components/ShootOpsModuleSchematics.tsx');
    expect(schematic).not.toContain('focus, exposure, duplicates');
    for (const file of ['frontend/components/AutoPilotPage.tsx', 'frontend/components/mobile/MobileAutoPilotPage.tsx']) {
      expect(read(file)).not.toMatch(/focus, exposure, duplicates, coverage/);
    }
  });

  it('no client is named on the page or in its drawings', () => {
    for (const text of [src, visuals]) expect(text).not.toMatch(/\bf8\b|f8re|Steve|Elich|Botero|Ryan|Harliss|Divisadero/i);
  });
});
