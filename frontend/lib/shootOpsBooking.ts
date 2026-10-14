import type { Page } from '../components/types';
import { readAttribution, rememberAttribution } from './attribution';
import { allGuidesRealEstate, isRealEstateGuide } from '../content/guideTags';

/**
 * Every Shoot Ops call is booked with Anton (Anton, 13 Oct 2026). These are the pages a re-media visitor reads:
 * the /shoot-ops hub, the module pages and /modules — plus, since the Library restructure (14 Oct 2026), the guides
 * tagged Real-estate media (content/guideTags.ts). A general guide books like any DaVeenci page. The /guides index
 * stays a Shoot Ops page while every published guide is real-estate media.
 * From any Shoot Ops page, a generic "Talk to us" or "book a call" goes to Anton's calendar, never to the chooser or Astrid.
 */
export const SHOOT_OPS_PAGES: readonly Page[] = ['autopilot', 'order-intake', 'order-review', 'modules'];

/** The guide slug in the current address, when there is one (the header and App only know the page name). */
const currentGuideSlug = (): string | null => {
  if (typeof window === 'undefined') return null;
  const m = window.location.pathname.match(/^\/guides\/([^/?#]+)/);
  return m ? m[1] : null;
};

export const isShootOpsPage = (page: string, guideSlug: string | null = currentGuideSlug()): boolean => {
  if (page === 'guide') return isRealEstateGuide(guideSlug);
  if (page === 'guides') return allGuidesRealEstate();
  return (SHOOT_OPS_PAGES as readonly string[]).includes(page);
};

/** Same rule, by address — for components that only know the URL (the mobile sticky bar). */
export const isShootOpsPath = (path: string): boolean => {
  if (path === '/shoot-ops' || path.startsWith('/shoot-ops/') || path === '/modules') return true;
  if (path === '/guides') return allGuidesRealEstate();
  const m = path.match(/^\/guides\/([^/?#]+)/);
  return m ? isRealEstateGuide(m[1]) : false;
};

/** Generic booking targets ('calendar' = Astrid, 'book' = the chooser) become Anton when asked from a Shoot Ops page. */
export const bookingTargetFor = (target: Page, from: Page, guideSlug?: string | null): Page =>
  (target === 'calendar' || target === 'book') && isShootOpsPage(from, guideSlug === undefined ? currentGuideSlug() : guideSlug)
    ? 'book-anton'
    : target;

/** Anton's booking page, tagged as a module lead and carrying the outreach token when the visitor has one. */
export const shootOpsBookingHref = (t: string = readAttribution().t): string =>
  `/book/anton?src=module${t ? `&t=${encodeURIComponent(t)}` : ''}`;

/** Open Anton's calendar from a Shoot Ops button: tag the visit as a module lead, then route. */
export const openShootOpsBooking = (onNavigate: (page: Page) => void): void => {
  rememberAttribution('?src=module');
  window.history.pushState({ page: 'book-anton' }, '', shootOpsBookingHref());
  onNavigate('book-anton');
};
