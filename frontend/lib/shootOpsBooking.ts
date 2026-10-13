import type { Page } from '../components/types';
import { readAttribution, rememberAttribution } from './attribution';

/**
 * Every Shoot Ops call is booked with Anton (Anton, 13 Oct 2026). These are the pages a re-media visitor reads:
 * the /shoot-ops hub, the module pages, /modules and the guides (all of them are written for re-media shops).
 * From any of them, a generic "Talk to us" or "book a call" goes to Anton's calendar, never to the chooser or Astrid.
 */
export const SHOOT_OPS_PAGES: readonly Page[] = ['autopilot', 'order-intake', 'order-review', 'modules', 'guides', 'guide'];

export const isShootOpsPage = (page: string): boolean => (SHOOT_OPS_PAGES as readonly string[]).includes(page);

/** Same pages, by address — for components that only know the URL (the mobile sticky bar). */
export const isShootOpsPath = (path: string): boolean =>
  path === '/shoot-ops' || path.startsWith('/shoot-ops/') || path === '/modules' || path === '/guides' || path.startsWith('/guides/');

/** Generic booking targets ('calendar' = Astrid, 'book' = the chooser) become Anton when asked from a Shoot Ops page. */
export const bookingTargetFor = (target: Page, from: Page): Page =>
  (target === 'calendar' || target === 'book') && isShootOpsPage(from) ? 'book-anton' : target;

/** Anton's booking page, tagged as a module lead and carrying the outreach token when the visitor has one. */
export const shootOpsBookingHref = (t: string = readAttribution().t): string =>
  `/book/anton?src=module${t ? `&t=${encodeURIComponent(t)}` : ''}`;

/** Open Anton's calendar from a Shoot Ops button: tag the visit as a module lead, then route. */
export const openShootOpsBooking = (onNavigate: (page: Page) => void): void => {
  rememberAttribution('?src=module');
  window.history.pushState({ page: 'book-anton' }, '', shootOpsBookingHref());
  onNavigate('book-anton');
};
