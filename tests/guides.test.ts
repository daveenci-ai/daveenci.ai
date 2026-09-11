import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { guides, guideStructuredData } from '../frontend/content/guides';

const sitemap = readFileSync('frontend/public/sitemap.xml', 'utf8');
const vercel = readFileSync('vercel.json', 'utf8');
const words = (s: string) => s.trim().split(/\s+/).length;

describe('guides (AEO answer pages)', () => {
  test('every guide is shaped for an answer engine and never names a client', () => {
    for (const g of guides) {
      expect(g.slug).toMatch(/^[a-z0-9-]+$/);
      expect(g.question.endsWith('?')).toBe(true);
      expect(words(g.answer)).toBeLessThanOrEqual(90);           // the direct answer stays liftable
      expect(g.description.length).toBeLessThanOrEqual(160)          // meta description, no truncation;
      expect(g.faq.length).toBeGreaterThanOrEqual(3);
      expect(g.sections.length).toBeGreaterThanOrEqual(3);
      const all = JSON.stringify(g);
      expect(all).not.toMatch(/\bf8\b|Steve|AutoPilot|Archi-?Pix/i);   // proof stays anonymous (6 Sep 2026 rule)
      expect(g.updatedAt >= g.publishedAt).toBe(true);
    }
  });

  test('every guide is prerendered: listed in the sitemap and routed by vercel.json', () => {
    expect(sitemap).toContain('<loc>https://daveenci.ai/guides</loc>');
    expect(sitemap).toContain('<loc>https://daveenci.ai/shootos/concierge-order-intake</loc>');
    for (const g of guides) {
      expect(sitemap).toContain(`<loc>https://daveenci.ai/guides/${g.slug}</loc>`);
      expect(vercel).toContain(`"/_prerendered/guide-${g.slug}.html"`);
    }
  });

  test('structured data carries an Article and a FAQPage with every question', () => {
    const g = guides[0];
    const ld = guideStructuredData(g, `https://daveenci.ai/guides/${g.slug}`, 'https://daveenci.ai/daveenci-og.png', 'https://daveenci.ai') as any;
    const types = ld['@graph'].map((n: any) => n['@type']);
    expect(types).toEqual(['Article', 'FAQPage']);
    expect(ld['@graph'][1].mainEntity).toHaveLength(g.faq.length);
    expect(ld['@graph'][0].author.name).toBe('Anton Osipov');
  });
});
