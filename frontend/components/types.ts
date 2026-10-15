
import React from 'react';

export type Page = 'landing' | 'briefings' | 'briefing-detail' | 'who-we-are' | 'calendar' | 'book' | 'book-anton' | 'book-astrid' | 'modules' | 'order-intake' | 'order-review' | 'daily-report' | 'pulsenote' | 'brandos' | 'work' | 'purecode' | 'autopilot' | 'compoundiq' | 'analytics-os' | 'creative-production' | 'events' | 'thesis' | 'privacy' | 'guides' | 'guide' | 'library' | 'not-found';

export type BookingHost = 'anton' | 'astrid';

export interface NavLink {
  label: string;
  href: string;
}

export interface CardProps {
  title: string;
  children: React.ReactNode;
  label?: string;
  className?: string;
  image?: string;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  pattern?: 'none' | 'grid' | 'circles' | 'nodes';
  overflow?: boolean;
  /** Ref to the <section> element (scroll-progress subscribers attach here). */
  innerRef?: React.Ref<HTMLElement>;
  /** Vertical padding, replacing the default. Use this rather than a second py-* in className: with two py-* on one
   *  element, which one applies depends on Tailwind's utility order, not on which was written last. */
  padding?: string;
}

export interface EventCardProps {
  image: string;
  date: string;
  title: string;
  description: string;
}

export interface BriefingCardProps {
  title: string;
  description: string;
  coverId: string;
  issueNo: string;
  category: string;
  readTime: string;
  href: string;
  className?: string;
  onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface CalendarProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  /** Which host this booking page books. Defaults to Astrid's discovery call. */
  host?: BookingHost;
}
