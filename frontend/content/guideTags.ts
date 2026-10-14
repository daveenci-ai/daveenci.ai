/**
 * Guide tags (Library restructure, Anton 14 Oct 2026). Guides are generic answer pages; an industry tag says who a
 * guide is written for, topic tags say what it is about. Kept apart from guides.ts so the booking rule
 * (lib/shootOpsBooking.ts) and the header can read the tags without pulling every guide's text into the main bundle.
 *
 * A guide with no industry is general. Real-estate-media guides count as Shoot Ops pages: their booking buttons go to
 * Anton's calendar. Add a new guide here and in guides.ts together — tests/library.test.ts checks they match.
 */

export type GuideIndustry = 'real-estate-media';
export type GuideTopic = 'order-intake' | 'order-review' | 'integrations' | 'access-security' | 'automation-reliability';
export type GuideTag = GuideIndustry | GuideTopic;

export const INDUSTRY_LABELS: Record<GuideIndustry, string> = {
  'real-estate-media': 'Real-estate media',
};

export const TOPIC_LABELS: Record<GuideTopic, string> = {
  'order-intake': 'Order intake',
  'order-review': 'Order review',
  integrations: 'Integrations & APIs',
  'access-security': 'Access & security',
  'automation-reliability': 'Automation reliability',
};

export const TAG_LABELS: Record<GuideTag, string> = { ...INDUSTRY_LABELS, ...TOPIC_LABELS };

export const isGuideTag = (value: string | null | undefined): value is GuideTag =>
  !!value && Object.prototype.hasOwnProperty.call(TAG_LABELS, value);

export interface GuideTagSet {
  industry?: GuideIndustry;
  topics: GuideTopic[];
}

export const GUIDE_TAGS: Record<string, GuideTagSet> = {
  'coldwell-banker-listing-concierge-orders-into-aryeo': { industry: 'real-estate-media', topics: ['order-intake'] },
  'aryeo-changed-the-order-form-what-to-check': { industry: 'real-estate-media', topics: ['integrations'] },
  'why-concierge-orders-land-on-the-wrong-order-form': { industry: 'real-estate-media', topics: ['order-intake'] },
  'stop-copy-pasting-order-emails-into-aryeo-or-spiro': { industry: 'real-estate-media', topics: ['order-intake'] },
  'automated-order-entry-wrong-order-vs-unplaced-order': { industry: 'real-estate-media', topics: ['automation-reliability'] },
  'concierge-order-email-missing-square-footage-or-access-details': { industry: 'real-estate-media', topics: ['order-intake'] },
  'why-photographers-revisit-missed-bedrooms-and-bathrooms': { industry: 'real-estate-media', topics: ['order-review'] },
  'what-access-should-order-automation-get-in-aryeo': { industry: 'real-estate-media', topics: ['access-security'] },
  'does-aryeo-have-an-api-to-create-orders': { industry: 'real-estate-media', topics: ['integrations'] },
};

export const tagsFor = (slug: string): GuideTagSet => GUIDE_TAGS[slug] ?? { topics: [] };

/** The tags a guide carries, industry first — for chips on cards and pages. */
export const tagListFor = (slug: string): GuideTag[] => {
  const t = tagsFor(slug);
  return [...(t.industry ? [t.industry] : []), ...t.topics];
};

export const isRealEstateGuide = (slug: string | null | undefined): boolean =>
  !!slug && tagsFor(slug).industry === 'real-estate-media';

/** True while every published guide is written for real-estate media (the /guides index then stays a Shoot Ops page). */
export const allGuidesRealEstate = (): boolean => Object.keys(GUIDE_TAGS).every((slug) => isRealEstateGuide(slug));
