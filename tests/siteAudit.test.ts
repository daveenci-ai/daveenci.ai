import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { tocEntries } from '../frontend/lib/codexToc';
import { briefings } from '../frontend/components/BriefingDetailPage';
import { getRouteMetadata } from '../frontend/lib/routeMetadata';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

// Full-site audit, 15 Oct 2026: each test pins one defect the crawl found.
describe('Site audit fixes (15 Oct 2026)', () => {
  it('every Codex "Contents" link points at a section that exists', () => {
    for (const [slug, data] of Object.entries(briefings)) {
      const ids = new Set([...data.sections.map((s) => s.id), 'faq', 'quick-answer']);
      const entries = tocEntries(data);
      expect(entries).toHaveLength(data.toc.length);
      for (const e of entries) expect(ids.has(e.id), `${slug}: ${e.label} → #${e.id}`).toBe(true);
      // Each section is reached by at most one link (labels stay in section order).
      const sectionLinks = entries.map((e) => e.id).filter((id) => id !== 'faq' && id !== 'quick-answer');
      expect(new Set(sectionLinks).size).toBe(sectionLinks.length);
    }
    expect(read('frontend/components/BriefingDetailPage.tsx')).toContain('id="quick-answer"');
  });

  it('a booking page survives an availability reply without a busySlots list', () => {
    for (const file of ['frontend/components/Calendar.tsx', 'frontend/components/mobile/MobileCalendarPage.tsx', 'frontend/components/BookingWidget.tsx']) {
      const src = read(file);
      expect(src).toMatch(/Array\.isArray\(data\?\.busySlots\)/);
      // Every place that stores a reply's busySlots checks it is a list on that line or the line before.
      const lines = src.split('\n');
      lines.forEach((line, i) => {
        if (/setBusySlots\(\w+\.busySlots\)/.test(line)) expect(`${lines[i - 1]}\n${line}`, `${file}:${i + 1}`).toContain('Array.isArray');
      });
    }
  });

  it('the header Services link is a real address, not a bare #services', () => {
    expect(read('frontend/components/Header.tsx')).toContain("href={link.href.startsWith('#') ? `/${link.href}` : link.href}");
  });

  it('pages with an inline booking widget have one element with id="booking"', () => {
    for (const file of ['frontend/components/PureCodePage.tsx', 'frontend/components/BrandOSPage.tsx', 'frontend/components/mobile/MobileBrandOSPage.tsx', 'frontend/components/mobile/MobilePulseNotePage.tsx', 'frontend/components/mobile/MobilePureCodePage.tsx']) {
      const src = read(file);
      expect(src).toContain('<div id="booking"');
      expect(src).toContain('sectionId="booking-calendar"');
    }
    // The phone PulseNote page wraps Creator Mode in its own #try-it section.
    expect(read('frontend/components/mobile/MobilePulseNotePage.tsx')).toContain('<CreatorMode sectionId="creator-mode" />');
  });

  it('inline code wraps on a phone', () => {
    expect(read('frontend/src/index.css')).toMatch(/:not\(pre\) > code \{\s*overflow-wrap: anywhere;/);
  });

  it('route descriptions fit a search result', () => {
    for (const page of ['guides', 'daily-report', 'photo-review', 'order-review', 'modules', 'library'] as const) {
      expect(getRouteMetadata(page).description.length, page).toBeLessThanOrEqual(165);
    }
  });
});

describe('Site audit fixes (15 Oct 2026) — accessible names', () => {
  it('the booking calendars name their month buttons', () => {
    for (const file of ['frontend/components/Calendar.tsx', 'frontend/components/mobile/MobileCalendarPage.tsx']) {
      const src = readFileSync(`${new URL('..', import.meta.url).pathname}${file}`, 'utf8');
      expect(src).toContain('aria-label="Previous month"');
      expect(src).toContain('aria-label="Next month"');
    }
  });
});

describe('Site audit fixes (15 Oct 2026) — sideways scrollers', () => {
  it('every sideways-scrolling rail can be reached with the keyboard', () => {
    const root = new URL('..', import.meta.url).pathname;
    for (const file of ['frontend/components/mobile/MobileWhoWeArePage.tsx', 'frontend/components/mobile/MobileAdvantage.tsx', 'frontend/components/AnalyticsOSPage.tsx']) {
      expect(readFileSync(`${root}${file}`, 'utf8')).toMatch(/tabIndex=\{0\}\s+role="region"\s+aria-label="/);
    }
  });
});

describe('Site audit fixes (15 Oct 2026) — security headers', () => {
  it('every response carries the basic security headers, before any redirect or rewrite', () => {
    const root = new URL('..', import.meta.url).pathname;
    const routes = JSON.parse(readFileSync(`${root}vercel.json`, 'utf8')).routes;
    expect(routes[0]).toMatchObject({ src: '/(.*)', continue: true });
    expect(routes[0].headers).toMatchObject({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
    });
    expect(routes[0].headers['Permissions-Policy']).toContain('camera=()');
  });
});

describe('Site audit fixes (15 Oct 2026) — the static 404 page', () => {
  it('uses the site fonts and links to the Library, not the old briefings', () => {
    const page = readFileSync(`${new URL('..', import.meta.url).pathname}frontend/public/404.html`, 'utf8');
    expect(page).not.toMatch(/fonts\.googleapis|IM Fell/);
    expect(page).toContain("url('/fonts/playfair-display-latin-var.woff2')");
    expect(page).toContain('href="/library"');
    expect(page).not.toContain('/briefings');
  });
});
