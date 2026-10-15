import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { commercialOffers } from '../frontend/content/commercialOffers';
import { buildStructuredData, getRouteMetadata } from '../frontend/lib/routeMetadata';

const root = new URL('..', import.meta.url).pathname;
const read = (rel: string) => readFileSync(`${root}${rel}`, 'utf8');

describe('Workflow Blueprint is $2,500 with Intake and Order Review as example phases (Anton, 15 Oct 2026)', () => {
  const blueprint = commercialOffers.find((o) => o.id === 'blueprint')!;

  it('the card shows $2,500 and links both module pages', () => {
    expect(blueprint.price).toBe('$2,500');
    expect(blueprint.minPrice).toBe(2500);
    expect(blueprint.timeline).toBe('One week');
    expect(blueprint.examples).toEqual([
      { label: 'Concierge Order Intake', path: '/shoot-ops/concierge-order-intake', page: 'order-intake' },
      { label: 'Order Review', path: '/shoot-ops/order-review', page: 'order-review' },
    ]);
    expect(read('frontend/components/CommercialOffers.tsx')).toContain('Example phases');
  });

  it('the hero lines and llms.txt carry the new price, and $5,000 is gone from the site', () => {
    expect(read('frontend/components/Hero.tsx')).toContain('Blueprint $2,500 · Production builds from $14,000');
    expect(read('frontend/components/mobile/MobileHero.tsx')).toContain('Blueprint $2,500 · Builds from $14,000');
    expect(read('frontend/public/llms.txt')).toContain('Workflow Blueprint $2,500');
    for (const f of ['frontend/components/Hero.tsx', 'frontend/components/mobile/MobileHero.tsx', 'frontend/public/llms.txt', 'frontend/content/commercialOffers.ts']) {
      expect(read(f)).not.toContain('$5,000');
    }
  });

  it('homepage structured data prices every offer from its own minPrice', () => {
    const meta = getRouteMetadata('landing');
    const ld = buildStructuredData(meta, 'https://daveenci.ai/', 'https://daveenci.ai/daveenci-og.png') as any;
    const offers = ld.makesOffer.map((o: any) => [o.name, o.priceSpecification.minPrice]);
    expect(offers).toEqual([
      ['Workflow Blueprint', '2500'],
      ['Specialist Team Build', '14000'],
      ['Operate and Improve', '4000'],
      ['Marketing Analytics OS', '6500'],
    ]);
  });
});
