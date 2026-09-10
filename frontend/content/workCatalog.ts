import type { CaseId } from '../lib/analytics';

export type Practice = 'operations' | 'creative';

export const PRACTICES: Record<Practice, { name: string; lead: string; summary: string }> = {
  operations: {
    name: 'Operations Systems',
    lead: 'Anton Osipov',
    summary:
      'Recurring work that crosses tools, teams, and judgment — intake, review, exception handling, and delivery, with the gates that make autonomy safe.',
  },
  creative: {
    name: 'Creative Production',
    lead: 'Astrid Abrahamyan',
    summary:
      'Strategy, paid campaigns across Facebook, LinkedIn, Google, TikTok and ChatGPT, and the content that feeds them — ads, video, and brand decisions — run as a governed workflow with a human approving before anything publishes.',
  },
};

export interface WorkCatalogItem {
  page: CaseId;
  practice: Practice;
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
    practice: 'operations',
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
    practice: 'operations',
    href: '/shootos',
    label: 'Real-estate media operations',
    status: 'Operating practice',
    statusTone: 'operating',
    title: 'ShootOS',
    subtitle: 'A specialist practice by DaVeenci.',
    blurb: 'Industry knowledge and reusable modules for concierge order intake, scheduling, continuous QC, safe remediation, and verified delivery.',
    previewBlurb: 'A real-estate-media operating practice: modules for intake, scheduling, continuous QC, safe remediation, and delivery verification.',
    featured: true,
  },
  {
    page: 'compoundiq',
    practice: 'operations',
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
    page: 'analytics-os',
    practice: 'operations',
    href: '/analytics-os',
    label: 'Marketing measurement',
    // Flip to "In delivery" once the client has signed and consented to be
    // named; until then the case describes the system, not the client.
    status: 'New engagement · Scoped Sep 2026',
    statusTone: 'development',
    title: 'Marketing Analytics OS',
    subtitle: 'The measurement team.',
    blurb: 'Ad spend, site events, and CRM outcomes land in one client-owned warehouse. Every campaign and landing-page test carries a verdict — keep, kill, or spend this much more to know — computed with proper statistics, not read by eye.',
    previewBlurb: 'Site events, ad spend, and CRM outcomes reconciled in one client-owned warehouse, with a keep / kill verdict on every campaign and test.',
    featured: true,
  },
  {
    page: 'pulsenote',
    practice: 'creative',
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
    practice: 'creative',
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
