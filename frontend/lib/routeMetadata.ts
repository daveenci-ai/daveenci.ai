import type { Page } from '../components/types';
import { getBriefingSummary } from '../content/briefings';
import { commercialOffers } from '../content/commercialOffers';

const SITE_URL = 'https://daveenci.ai';
const DEFAULT_IMAGE = `${SITE_URL}/daveenci-og.png`;

const toAbsoluteUrl = (value: string): string => new URL(value, SITE_URL).href;

export interface RouteMetadata {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  author?: string;
  noIndex?: boolean;
}

const ROUTE_METADATA: Record<Exclude<Page, 'briefing-detail' | 'not-found'>, RouteMetadata> = {
  landing: {
    title: 'DaVeenci — Governed AI Production Systems',
    description: 'DaVeenci maps, builds, and improves governed AI production systems for difficult recurring workflows, with explicit human gates and accountable outputs.',
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
    description: 'Book a 30-minute working session with DaVeenci to discuss a recurring workflow and whether it belongs in a fixed-scope Workflow Blueprint.',
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
    title: 'Our Work — Governed AI Production Systems | DaVeenci',
    description: 'Explore DaVeenci production systems, operating practices, demonstrations, and research—each with an explicit operating status.',
    path: '/work',
  },
  purecode: {
    title: 'PureCode — The Specialist AI Code Team | DaVeenci',
    description: 'PureCode turns a feature request into a reviewed pull request through 13 specialist agents and three human gates.',
    path: '/purecode',
  },
  autopilot: {
    title: 'ShootOS — Real-Estate-Media Operations by DaVeenci',
    description: 'ShootOS is DaVeenci’s specialist real-estate-media practice, powered by AutoPilot for intake, scheduling, continuous review, safe remediation, and delivery verification.',
    path: '/shootos',
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
    const article = getBriefingSummary(briefingId);
    if (article && briefingId) {
      return {
        title: article.seoTitle,
        description: article.description,
        path: `/codex/${briefingId}`,
        type: 'article',
        publishedAt: article.publishedAt,
        author: 'DaVeenci',
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

const updateStructuredData = (metadata: RouteMetadata, url: string, image: string): void => {
  const existing = document.getElementById('route-structured-data');
  existing?.remove();

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DaVeenci',
    url: SITE_URL,
    description: ROUTE_METADATA.landing.description,
  };

  const data = metadata.type === 'article'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: metadata.title.replace(/ — DaVeenci$/, ''),
        description: metadata.description,
        datePublished: metadata.publishedAt,
        mainEntityOfPage: url,
        image,
        author: { '@type': 'Organization', name: metadata.author || 'DaVeenci', url: `${SITE_URL}/who-we-are` },
        publisher: {
          '@type': 'Organization',
          name: 'DaVeenci',
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/daveenci-logo.png` },
        },
      }
    : metadata.path === '/'
      ? {
          ...organizationData,
          makesOffer: commercialOffers.map((offer) => ({
            '@type': 'Offer',
            name: offer.title,
            description: offer.description,
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: offer.id === 'blueprint' ? '5000' : offer.id === 'build' ? '14000' : '2500',
              priceCurrency: 'USD',
              unitText: offer.id === 'operate' ? 'MONTH' : offer.timeline,
            },
          })),
        }
      : organizationData;

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
  const image = metadata.image ? toAbsoluteUrl(metadata.image) : DEFAULT_IMAGE;

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
  updateStructuredData(metadata, url, image);

  return metadata;
};
