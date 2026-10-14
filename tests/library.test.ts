import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { guides, guidesWithTag } from '../frontend/content/guides';
import {
  GUIDE_TAGS,
  INDUSTRY_LABELS,
  TAG_LABELS,
  TOPIC_LABELS,
  isGuideTag,
  isRealEstateGuide,
  tagListFor,
} from '../frontend/content/guideTags';
import { bookingTargetFor, isShootOpsPage, isShootOpsPath } from '../frontend/lib/shootOpsBooking';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Library: Guides and Codex under one menu item (Anton, 14 Oct 2026)', () => {
  it('every guide has tags, every tag entry has a guide, and each guide has at least one topic', () => {
    expect(Object.keys(GUIDE_TAGS).sort()).toEqual(guides.map((g) => g.slug).sort());
    for (const g of guides) expect(GUIDE_TAGS[g.slug].topics.length).toBeGreaterThan(0);
  });

  it('uses the agreed tag names', () => {
    expect(Object.values(INDUSTRY_LABELS)).toEqual(['Real-estate media']);
    expect(Object.values(TOPIC_LABELS)).toEqual([
      'Order intake',
      'Order review',
      'Integrations & APIs',
      'Access & security',
      'Automation reliability',
    ]);
  });

  it('tags the nine current guides as agreed', () => {
    const topicOf = (slug: string) => GUIDE_TAGS[slug].topics;
    expect(guides.every((g) => isRealEstateGuide(g.slug))).toBe(true);
    expect(guidesWithTag('order-intake').map((g) => g.slug).sort()).toEqual([
      'coldwell-banker-listing-concierge-orders-into-aryeo',
      'concierge-order-email-missing-square-footage-or-access-details',
      'stop-copy-pasting-order-emails-into-aryeo-or-spiro',
      'why-concierge-orders-land-on-the-wrong-order-form',
    ]);
    expect(topicOf('why-photographers-revisit-missed-bedrooms-and-bathrooms')).toEqual(['order-review']);
    expect(guidesWithTag('integrations').map((g) => g.slug).sort()).toEqual([
      'aryeo-changed-the-order-form-what-to-check',
      'does-aryeo-have-an-api-to-create-orders',
    ]);
    expect(topicOf('what-access-should-order-automation-get-in-aryeo')).toEqual(['access-security']);
    expect(topicOf('automated-order-entry-wrong-order-vs-unplaced-order')).toEqual(['automation-reliability']);
    expect(tagListFor('does-aryeo-have-an-api-to-create-orders')).toEqual(['real-estate-media', 'integrations']);
  });

  it('filters by any tag and ignores unknown ones', () => {
    expect(guidesWithTag('real-estate-media')).toHaveLength(guides.length);
    expect(guidesWithTag(null)).toHaveLength(guides.length);
    expect(isGuideTag('order-review')).toBe(true);
    expect(isGuideTag('<script>')).toBe(false);
    expect(isGuideTag('toString')).toBe(false);
    for (const t of Object.keys(TAG_LABELS)) expect(isGuideTag(t)).toBe(true);
  });

  it('a general guide (no industry tag) books like any DaVeenci page; a real-estate one books with Anton', () => {
    expect(isShootOpsPage('guide', 'some-general-guide')).toBe(false);
    expect(bookingTargetFor('calendar', 'guide', 'some-general-guide')).toBe('calendar');
    expect(bookingTargetFor('calendar', 'guide', 'stop-copy-pasting-order-emails-into-aryeo-or-spiro')).toBe('book-anton');
    expect(isShootOpsPath('/guides/some-general-guide')).toBe(false);
    expect(isShootOpsPath('/guides/stop-copy-pasting-order-emails-into-aryeo-or-spiro')).toBe(true);
    // /library is a DaVeenci page.
    expect(isShootOpsPage('library')).toBe(false);
    expect(bookingTargetFor('calendar', 'library')).toBe('calendar');
  });

  it('the menu shows Library (with Guides and Codex under it) instead of Codex and Guides, desktop and mobile', () => {
    const header = read('frontend/components/Header.tsx');
    expect(header).toContain('{ label: "Library", href: "/library" }');
    expect(header).not.toContain('{ label: "Codex", href: "/codex" }');
    expect(header).not.toContain('{ label: "Guides", href: "/guides" }');
    expect(header).toMatch(/label: "Guides", href: "\/guides"/);
    expect(header).toMatch(/label: "Codex", href: "\/codex"/);
    const menu = read('frontend/components/mobile/MobileMenu.tsx');
    expect(menu).toContain("{ label: 'Library', page: 'library' }");
    expect(menu).toContain("{ label: 'Guides', page: 'guides', sub: true }");
    expect(menu).toContain("{ label: 'Codex', page: 'briefings', sub: true }");
  });

  it('old addresses keep working and /library is served, prerendered and in the sitemap', () => {
    const vercel = read('vercel.json');
    expect(vercel).toMatch(/privacy\|modules\|codex\|guides\|library\)",\s*"dest": "\/_prerendered\/\$1\.html"/);
    expect(vercel).toContain('"/codex/(governed-agent-operations');
    expect(vercel).toContain('"/guides/(coldwell-banker-listing-concierge-orders-into-aryeo');
    const sitemap = read('frontend/public/sitemap.xml');
    for (const p of ['/library', '/guides', '/codex']) expect(sitemap).toContain(`<loc>https://daveenci.ai${p}</loc>`);
    expect(read('frontend/prerender/routeShells.tsx')).toContain("add('/library', 'library.html'");
    expect(read('frontend/App.tsx')).toContain("path === '/library'");
  });

  it('every Library page carries the Library trail', () => {
    for (const f of [
      'frontend/components/GuidesPage.tsx',
      'frontend/components/GuidePage.tsx',
      'frontend/components/BriefingsPage.tsx',
      'frontend/components/BriefingDetailPage.tsx',
      'frontend/components/mobile/MobileBriefingsPage.tsx',
      'frontend/components/mobile/MobileBriefingDetailPage.tsx',
    ]) {
      expect(read(f)).toContain('<LibraryTrail');
    }
  });

  it('the Shoot Ops guides strip lists only real-estate guides and links to that filter', () => {
    const src = read('frontend/components/ShootOpsGuides.tsx');
    expect(src).toContain("guidesWithTag('real-estate-media')");
    expect(src).toContain('href="/guides?tag=real-estate-media"');
  });

  it('nothing outside the guides index still says the guides are only for real-estate media', () => {
    const hits = execSync('git grep -n "Straight answers for real-estate media shops" -- frontend || true', { cwd: root, encoding: 'utf8' }).trim();
    expect(hits).toBe('');
  });
});
