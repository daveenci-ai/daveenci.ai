import briefingData from './briefings.json';

export interface BriefingSummary {
  id: string;
  title: string;
  seoTitle: string;
  description: string;
  issueNo: string;
  category: 'Architecture' | 'Engineering' | 'Operations' | 'Strategy';
  featured: boolean;
  readTime: string;
  publishedAt: string;
}

export const briefings: BriefingSummary[] = briefingData.map((briefing) => ({
  ...briefing,
  category: briefing.category as BriefingSummary['category'],
}));

export const getBriefingSummary = (id?: string | null): BriefingSummary | undefined =>
  id ? briefings.find((briefing) => briefing.id === id) : undefined;
