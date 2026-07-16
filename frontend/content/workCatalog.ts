import type { CaseId } from '../lib/analytics';

export interface WorkCatalogItem {
  page: CaseId;
  href: string;
  label: string;
  status: string;
  statusTone: 'operating' | 'development' | 'demo';
  title: string;
  subtitle: string;
  blurb: string;
  previewBlurb: string;
  featured: boolean;
}

export const workCatalog: WorkCatalogItem[] = [
  {
    page: 'purecode',
    href: '/purecode',
    label: 'Code delivery',
    status: 'Operating',
    statusTone: 'operating',
    title: 'PureCode',
    subtitle: 'The code team.',
    blurb: 'A feature request walks in. A reviewed pull request walks out. Thirteen specialist agents, three human gates, orchestrated end to end.',
    previewBlurb: 'A feature request becomes a reviewed pull request through 13 specialist agents and three human gates.',
    featured: true,
  },
  {
    page: 'autopilot',
    href: '/shootos',
    label: 'Real-estate media operations',
    status: 'Operating practice',
    statusTone: 'operating',
    title: 'ShootOS',
    subtitle: 'A specialist practice by DaVeenci.',
    blurb: 'Industry knowledge and reusable AutoPilot infrastructure for order intake, scheduling, continuous QC, safe remediation, and verified delivery.',
    previewBlurb: 'A real-estate-media operating practice powered by AutoPilot: intake, scheduling, continuous QC, safe remediation, and delivery verification.',
    featured: true,
  },
  {
    page: 'compoundiq',
    href: '/compoundiq',
    label: 'Trading research & execution',
    status: 'In development · Paper only',
    statusTone: 'development',
    title: 'CompoundIQ',
    subtitle: 'The governed trading team.',
    blurb: 'Hypothesis in. Versioned research, explicit action gates, paper execution, and structured feedback out—an in-progress system designed to earn autonomy safely.',
    previewBlurb: 'Versioned research, explicit action gates, paper execution, and structured feedback in one constrained loop.',
    featured: true,
  },
  {
    page: 'pulsenote',
    href: '/pulsenote',
    label: 'Content operations',
    status: 'Product demonstration',
    statusTone: 'demo',
    title: 'PulseNote',
    subtitle: 'The content team.',
    blurb: 'Meeting transcripts in. Review-ready newsletters, social posts, and visuals out. One governed workflow across every platform you publish to.',
    previewBlurb: 'Meeting transcripts become review-ready newsletters, social posts, and visual assets.',
    featured: false,
  },
  {
    page: 'brandos',
    href: '/brandos',
    label: 'Brand decisions',
    status: 'Live demonstration',
    statusTone: 'demo',
    title: 'BrandOS',
    subtitle: 'The brand team.',
    blurb: 'A name, positioning, or launch idea goes in. Weighted scoring across ten dimensions, calibrated to business stage, with a live scorecard you can run.',
    previewBlurb: 'Weighted brand-name analysis across ten dimensions, calibrated to business stage.',
    featured: false,
  },
];

export const featuredWork = workCatalog.filter((item) => item.featured);

export const workStatusClass = (tone: WorkCatalogItem['statusTone']): string => {
  if (tone === 'operating') return 'text-green-700';
  if (tone === 'development') return 'text-amber-800';
  return 'text-sky-700';
};
