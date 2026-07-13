import type { Page } from '../components/types';

const SITE_URL = 'https://daveenci.ai';
const DEFAULT_IMAGE = `${SITE_URL}/daveenci-og.png`;

export interface RouteMetadata {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  noIndex?: boolean;
}

const BRIEFING_METADATA: Record<string, Omit<RouteMetadata, 'path' | 'type'>> = {
  'agentic-workflow': {
    title: 'The Agentic Workflow: Architecting Swarms — DaVeenci',
    description: 'A technical guide to autonomous agent swarms, four-stage reasoning pipelines, and self-correcting AI workers.',
    publishedAt: '2025-10-14',
  },
  'synthetic-data': {
    title: 'Synthetic Data Pipelines: The Infinite Dataset — DaVeenci',
    description: 'A playbook for generating high-fidelity synthetic datasets to fine-tune models without exposing private human data.',
    publishedAt: '2025-10-21',
  },
  'zero-touch-crm': {
    title: 'The Zero-Touch CRM: Self-Healing Databases — DaVeenci',
    description: 'A technical deep dive into customer databases that enrich and maintain themselves without sales-rep intervention.',
    publishedAt: '2025-10-28',
  },
  'rag-vs-long-context': {
    title: 'RAG vs. Long Context: The Architecture of Memory — DaVeenci',
    description: 'A practical comparison of the cost, latency, and reasoning trade-offs between retrieval and long-context models.',
    publishedAt: '2025-11-04',
  },
  'local-llm-stack': {
    title: 'Local LLM Stack 2025: Running Llama 4 for Legal Ops — DaVeenci',
    description: 'Hardware and inference-engine guidance for running local language models in privacy-focused legal operations.',
    publishedAt: '2025-12-07',
  },
  'prompt-patterns': {
    title: 'Prompt Engineering Patterns: Beyond Chain of Thought — DaVeenci',
    description: 'Implementing tree-of-thought and recursive-criticism patterns for complex reasoning tasks.',
    publishedAt: '2025-12-07',
  },
  'ai-compliance': {
    title: 'AI Legal Compliance: Navigating the EU AI Act — DaVeenci',
    description: 'Practical compliance checklists for teams shipping automated decision-making systems under the EU AI Act.',
    publishedAt: '2025-12-07',
  },
  'saas-pricing': {
    title: 'The Death of SaaS Pricing: From Seats to Outcomes — DaVeenci',
    description: 'Why per-seat pricing is weakening and how AI products can transition toward outcome-based billing.',
    publishedAt: '2025-12-07',
  },
  'automated-video': {
    title: 'Automated Video Production: Hyper-Personalization — DaVeenci',
    description: 'Using generative video and programmable production to create personalized sales outreach at scale.',
    publishedAt: '2025-12-07',
  },
};

const ROUTE_METADATA: Record<Exclude<Page, 'briefing-detail' | 'not-found'>, RouteMetadata> = {
  landing: {
    title: 'DaVeenci — AI teams, not AI tools',
    description: 'A studio of specialist AI teams that ship finished work — code, media, and research — with human gates and accountable outputs.',
    path: '/',
  },
  briefings: {
    title: 'The Codex — DaVeenci',
    description: 'Field notes, technical briefings, and practical playbooks for building specialist AI teams that ship finished work.',
    path: '/codex',
  },
  'who-we-are': {
    title: 'Who We Are — DaVeenci',
    description: 'Meet the small, senior team behind DaVeenci and the specialist AI systems we build with operators.',
    path: '/who-we-are',
  },
  calendar: {
    title: 'Talk to Us — DaVeenci',
    description: 'Book a 30-minute working session with DaVeenci and bring the workflow you want a specialist AI team to own.',
    path: '/calendar',
  },
  pulsenote: {
    title: 'PulseNote — Turn Meetings into Content | DaVeenci',
    description: 'PulseNote turns meeting insights into review-ready newsletters, social posts, and visuals through one accountable content workflow.',
    path: '/pulsenote',
  },
  brandos: {
    title: 'BrandOS — AI Brand Name Analysis | DaVeenci',
    description: 'Score a brand name across ten weighted dimensions, calibrated to your business stage and market context.',
    path: '/brandos',
  },
  work: {
    title: 'Our Work — Specialist AI Teams | DaVeenci',
    description: 'Explore specialist AI teams built for code delivery, media operations, governed research, content, and brand decisions.',
    path: '/work',
  },
  purecode: {
    title: 'PureCode — The Specialist AI Code Team | DaVeenci',
    description: 'PureCode turns a feature request into a reviewed pull request through 13 specialist agents and three human gates.',
    path: '/purecode',
  },
  autopilot: {
    title: 'AutoPilot — Real Estate Media Operations | DaVeenci',
    description: 'From order email to delivery gate: coordinated services for scheduling, continuous review, safe remediation, and verification.',
    path: '/autopilot',
  },
  compoundiq: {
    title: 'CompoundIQ — Governed, Paper-First Trading Research | DaVeenci',
    description: 'Versioned trading research, explicit action gates, paper execution, and structured feedback in one constrained loop.',
    path: '/compoundiq',
  },
  events: {
    title: 'Workshop Events — DaVeenci',
    description: 'Occasional DaVeenci sessions on specialist AI teams, orchestration, governance, and lessons from active builds.',
    path: '/events',
  },
  thesis: {
    title: 'The Thesis — AI Teams, Not AI Tools | DaVeenci',
    description: 'Why the next useful unit of AI is a governed specialist team accountable for finished work, not another standalone tool.',
    path: '/thesis',
  },
  privacy: {
    title: 'Privacy and Data Use — DaVeenci',
    description: 'How DaVeenci collects, uses, and protects information submitted through this website.',
    path: '/privacy',
  },
};

export const getRouteMetadata = (page: Page, briefingId?: string | null): RouteMetadata => {
  if (page === 'briefing-detail') {
    const article = briefingId ? BRIEFING_METADATA[briefingId] : undefined;
    if (article && briefingId) {
      return {
        ...article,
        path: `/codex/${briefingId}`,
        type: 'article',
      };
    }

    return {
      title: 'Codex Briefing Not Found — DaVeenci',
      description: 'The requested Codex briefing could not be found.',
      path: briefingId ? `/codex/${briefingId}` : '/codex',
      noIndex: true,
    };
  }

  if (page === 'not-found') {
    return {
      title: 'Page Not Found — DaVeenci',
      description: 'The requested page could not be found.',
      path: window.location.pathname,
      noIndex: true,
    };
  }

  return ROUTE_METADATA[page];
};

const upsertMeta = (attribute: 'name' | 'property', key: string, content: string): void => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const upsertCanonical = (href: string): void => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
};

const updateStructuredData = (metadata: RouteMetadata, url: string): void => {
  const existing = document.getElementById('route-structured-data');
  existing?.remove();

  const data = metadata.type === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title.replace(/ — DaVeenci$/, ''),
        description: metadata.description,
        datePublished: metadata.publishedAt,
        mainEntityOfPage: url,
        publisher: { '@type': 'Organization', name: 'DaVeenci', url: SITE_URL },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'DaVeenci',
        url: SITE_URL,
        description: ROUTE_METADATA.landing.description,
      };

  const script = document.createElement('script');
  script.id = 'route-structured-data';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/** Apply canonical, social, search, and structured metadata for a committed route. */
export const applyRouteMetadata = (page: Page, briefingId?: string | null): RouteMetadata => {
  const metadata = getRouteMetadata(page, briefingId);
  const url = `${SITE_URL}${metadata.path === '/' ? '' : metadata.path}`;
  const image = metadata.image || DEFAULT_IMAGE;

  document.title = metadata.title;
  upsertMeta('name', 'description', metadata.description);
  upsertMeta('name', 'robots', metadata.noIndex ? 'noindex, nofollow' : 'index, follow');
  upsertMeta('property', 'og:type', metadata.type || 'website');
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:title', metadata.title);
  upsertMeta('property', 'og:description', metadata.description);
  upsertMeta('property', 'og:image', image);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:url', url);
  upsertMeta('name', 'twitter:title', metadata.title);
  upsertMeta('name', 'twitter:description', metadata.description);
  upsertMeta('name', 'twitter:image', image);
  upsertCanonical(url);
  updateStructuredData(metadata, url);

  return metadata;
};
