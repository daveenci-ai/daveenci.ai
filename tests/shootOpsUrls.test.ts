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
