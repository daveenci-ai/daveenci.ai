
import React from 'react';

export type Page = 'landing' | 'briefings' | 'briefing-detail' | 'who-we-are' | 'calendar';

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
  image: string;
  issueNo: string;
  category: string;
  className?: string;
  onClick?: () => void;
}

export interface CalendarProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}
