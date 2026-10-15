import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('..', import.meta.url).pathname;

describe('Shoot Ops URLs (renamed from /shootos, 10 Oct 2026)', () => {
  it('the old name appears nowhere in the repo except the two legacy redirects', () => {
    const hits = execSync("git grep -n -i 'shootos' -- . ':!tests/shootOpsUrls.test.ts' || true", { cwd: root, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .filter((l) => !l.startsWith('vercel.json:') && !l.startsWith('frontend/App.tsx:'));
    expect(hits).toEqual([]);
  });

  it('vercel 301s /shootos and every page under it to /shoot-ops, before any other route', () => {
    const routes = JSON.parse(readFileSync(`${root}vercel.json`, 'utf8')).routes;
    expect(routes[0]).toEqual({ src: '/shootos/?', status: 301, headers: { Location: '/shoot-ops' } });
    expect(routes[1]).toEqual({ src: '/shootos/(.*)', status: 301, headers: { Location: '/shoot-ops/$1' } });
    expect(routes.some((r: { src?: string; dest?: string }) => r.src === '/shoot-ops/concierge-order-intake' && r.dest === '/_prerendered/concierge-order-intake.html')).toBe(true);
  });

  it('the sitemap lists the new addresses', () => {
    const sm = readFileSync(`${root}frontend/public/sitemap.xml`, 'utf8');
    expect(sm).toContain('<loc>https://daveenci.ai/shoot-ops</loc>');
    expect(sm).toContain('<loc>https://daveenci.ai/shoot-ops/concierge-order-intake</loc>');
  });
});

describe('Fig. i links module rows to their pages (11 Oct 2026)', () => {
  it('all four modules link to their pages (Real-time Photo Review since 15 Oct 2026)', async () => {
    const { modulePageFor } = await import('../frontend/content/shootOpsModules');
    expect(modulePageFor('Concierge Order Intake')).toEqual({ page: 'order-intake', path: '/shoot-ops/concierge-order-intake' });
    expect(modulePageFor('Order Review')).toEqual({ page: 'order-review', path: '/shoot-ops/order-review' });
    expect(modulePageFor('Daily Report')).toEqual({ page: 'daily-report', path: '/shoot-ops/daily-report' });
    expect(modulePageFor('Real-time Photo Review')).toEqual({ page: 'photo-review', path: '/shoot-ops/photo-review' });
    expect(modulePageFor('Nope')).toBeNull();
  });
});

describe('Order Review page (11 Oct 2026)', () => {
  it('is routed to its prerendered page and listed in the sitemap', () => {
    const routes = JSON.parse(readFileSync(`${root}vercel.json`, 'utf8')).routes;
    expect(routes.some((r: { src?: string; dest?: string }) => r.src === '/shoot-ops/order-review' && r.dest === '/_prerendered/order-review.html')).toBe(true);
    expect(readFileSync(`${root}frontend/public/sitemap.xml`, 'utf8')).toContain('<loc>https://daveenci.ai/shoot-ops/order-review</loc>');
  });

  it('shows the terms Anton set: $2,500, Aryeo only, two-week refund, no subscription', () => {
    const src = readFileSync(`${root}frontend/components/OrderReviewPage.tsx`, 'utf8');
    expect(src).toContain('$2,500');
    expect(src).toContain('One Aryeo account');
    expect(src).toContain('Platforms other than Aryeo');
    expect(src).toContain('Refund in full');
    expect(src).toContain('No subscription:');
    expect(src).not.toMatch(/Spiro|monthly plan/);
  });
});
