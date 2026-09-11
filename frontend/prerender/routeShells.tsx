import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Page } from '../components/types';
import OrderIntakePage from '../components/OrderIntakePage';
import GuidePage from '../components/GuidePage';
import GuidesPage from '../components/GuidesPage';
import ModulesPage from '../components/ModulesPage';
import BriefingsPage from '../components/BriefingsPage';
import BriefingDetailPage from '../components/BriefingDetailPage';
import WhoWeArePage from '../components/WhoWeArePage';
import PulseNotePage from '../components/PulseNotePage';
import BrandOSPage from '../components/BrandOSPage';
import WorkPage from '../components/WorkPage';
import PureCodePage from '../components/PureCodePage';
import AutoPilotPage from '../components/AutoPilotPage';
import CompoundIQPage from '../components/CompoundIQPage';
import AnalyticsOSPage from '../components/AnalyticsOSPage';
import CreativeProductionPage from '../components/CreativeProductionPage';
import EventsPage from '../components/EventsPage';
import ThesisPage from '../components/ThesisPage';
import PrivacyPage from '../components/PrivacyPage';
import { guides } from '../content/guides';
import { briefings } from '../content/briefings';
import { getRouteMetadata, buildStructuredData, SITE, DEFAULT_OG_IMAGE } from '../lib/routeMetadata';
import type { RouteMetadata } from '../lib/routeMetadata';

/**
 * Full-page static renders for every content route (11 Sep 2026, AEO plan — extended to the whole site the same day).
 * OpenAI's, Perplexity's and most other answer-engine crawlers do not execute JavaScript, and Google renders it late;
 * the SPA shell alone showed them the homepage hero and nothing else on every route.
 *
 * The markup comes from the real components, so the crawler-facing page and the hydrated page cannot drift apart.
 * React's createRoot().render replaces the subtree on mount (same pattern as the hero shell). Pages that branch on
 * useIsMobile render their desktop tree here (the hook's SSR default); a phone gets the mobile tree a moment later.
 *
 * Not prerendered on purpose: the homepage (its hero is already injected into index.html, and index.html is also the
 * SPA fallback for every unknown path), the booking pages (live availability, no-index value) and 404.
 */

const noop = () => {};

export interface PrerenderedRoute {
  path: string;
  file: string;
  html: string;
  metadata: RouteMetadata;
  structuredData: Record<string, unknown>;
}

const wrap = (inner: string) =>
  `<main class="antialiased font-sans text-ink min-h-screen selection:bg-accent/20">${inner}</main>`;

export function renderRoutes(): PrerenderedRoute[] {
  const out: PrerenderedRoute[] = [];
  const add = (path: string, file: string, element: React.ReactElement, page: Page, id?: string) => {
    const metadata = getRouteMetadata(page, id);
    const url = `${SITE}${metadata.path}`;
    out.push({ path, file, html: wrap(renderToStaticMarkup(element)), metadata, structuredData: buildStructuredData(metadata, url, DEFAULT_OG_IMAGE) });
  };

  add('/shootos/concierge-order-intake', 'concierge-order-intake.html', <OrderIntakePage onNavigate={noop} />, 'order-intake');
  add('/guides', 'guides.html', <GuidesPage onNavigate={noop} />, 'guides');
  for (const g of guides) {
    add(`/guides/${g.slug}`, `guide-${g.slug}.html`, <GuidePage onNavigate={noop} slug={g.slug} isStatic />, 'guide', g.slug);
  }
  add('/modules', 'modules.html', <ModulesPage onNavigate={noop} />, 'modules');
  add('/shootos', 'shootos.html', <AutoPilotPage onNavigate={noop} />, 'autopilot');
  add('/thesis', 'thesis.html', <ThesisPage onNavigate={noop} />, 'thesis');
  add('/work', 'work.html', <WorkPage onNavigate={noop} />, 'work');
  add('/who-we-are', 'who-we-are.html', <WhoWeArePage onNavigate={noop} />, 'who-we-are');
  add('/purecode', 'purecode.html', <PureCodePage onNavigate={noop} />, 'purecode');
  add('/compoundiq', 'compoundiq.html', <CompoundIQPage onNavigate={noop} />, 'compoundiq');
  add('/analytics-os', 'analytics-os.html', <AnalyticsOSPage onNavigate={noop} />, 'analytics-os');
  add('/creative-production', 'creative-production.html', <CreativeProductionPage onNavigate={noop} />, 'creative-production');
  add('/events', 'events.html', <EventsPage onNavigate={noop} />, 'events');
  add('/pulsenote', 'pulsenote.html', <PulseNotePage onNavigate={noop} />, 'pulsenote');
  add('/brandos', 'brandos.html', <BrandOSPage onNavigate={noop} />, 'brandos');
  add('/privacy', 'privacy.html', <PrivacyPage onNavigate={noop} />, 'privacy');
  add('/codex', 'codex.html', <BriefingsPage onNavigate={noop} />, 'briefings');
  for (const b of briefings) {
    add(`/codex/${b.id}`, `codex-${b.id}.html`, <BriefingDetailPage onNavigate={noop} id={b.id} />, 'briefing-detail', b.id);
  }
  return out;
}
