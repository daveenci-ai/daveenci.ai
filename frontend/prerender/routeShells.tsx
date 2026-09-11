import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import OrderIntakePage from '../components/OrderIntakePage';
import GuidePage from '../components/GuidePage';
import GuidesPage from '../components/GuidesPage';
import { guides } from '../content/guides';
import { getRouteMetadata, buildStructuredData, SITE, DEFAULT_OG_IMAGE } from '../lib/routeMetadata';
import type { RouteMetadata } from '../lib/routeMetadata';

/**
 * Full-page static renders for the routes that must be readable without JavaScript (11 Sep 2026, AEO plan):
 * the module landing page and every guide. OpenAI's, Perplexity's and most other answer-engine crawlers do not
 * execute JavaScript, and Google renders it late; the SPA shell alone showed them the homepage hero and nothing else.
 *
 * The markup comes from the real components, so the crawler-facing page and the hydrated page cannot drift apart.
 * React's createRoot().render replaces the subtree on mount (same pattern as the hero shell).
 */

const noop = () => {};

export interface PrerenderedRoute {
  /** URL path the file is served at. */
  path: string;
  /** File name under dist/_prerendered/. */
  file: string;
  html: string;
  metadata: RouteMetadata;
  structuredData: Record<string, unknown>;
}

const wrap = (inner: string) =>
  `<main class="antialiased font-sans text-ink min-h-screen selection:bg-accent/20">${inner}</main>`;

export function renderRoutes(): PrerenderedRoute[] {
  const out: PrerenderedRoute[] = [];
  const add = (path: string, file: string, element: React.ReactElement, page: Parameters<typeof getRouteMetadata>[0], id?: string) => {
    const metadata = getRouteMetadata(page, id);
    const url = `${SITE}${metadata.path}`;
    out.push({
      path,
      file,
      html: wrap(renderToStaticMarkup(element)),
      metadata,
      structuredData: buildStructuredData(metadata, url, DEFAULT_OG_IMAGE),
    });
  };

  add('/shootos/concierge-order-intake', 'concierge-order-intake.html', <OrderIntakePage onNavigate={noop} />, 'order-intake');
  add('/guides', 'guides.html', <GuidesPage onNavigate={noop} />, 'guides');
  for (const g of guides) {
    add(`/guides/${g.slug}`, `guide-${g.slug}.html`, <GuidePage onNavigate={noop} slug={g.slug} isStatic />, 'guide', g.slug);
  }
  return out;
}
