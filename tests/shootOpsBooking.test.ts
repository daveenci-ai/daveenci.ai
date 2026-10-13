import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
  bookingTargetFor,
  isShootOpsPage,
  isShootOpsPath,
  shootOpsBookingHref,
} from '../frontend/lib/shootOpsBooking';

const root = new URL('..', import.meta.url).pathname;

describe('Shoot Ops calls are booked with Anton only (13 Oct 2026)', () => {
  it('a generic booking from any Shoot Ops page goes to Anton', () => {
    for (const from of ['autopilot', 'order-intake', 'order-review', 'modules', 'guides', 'guide'] as const) {
      expect(isShootOpsPage(from)).toBe(true);
      expect(bookingTargetFor('calendar', from)).toBe('book-anton');
      expect(bookingTargetFor('book', from)).toBe('book-anton');
    }
  });

  it('the rest of the site keeps its own booking route', () => {
    for (const from of ['landing', 'compoundiq', 'analytics-os', 'purecode', 'who-we-are'] as const) {
      expect(bookingTargetFor('calendar', from)).toBe('calendar');
      expect(bookingTargetFor('book', from)).toBe('book');
    }
    // Only generic targets are rerouted; an explicit page is never rewritten.
    expect(bookingTargetFor('book-astrid', 'autopilot')).toBe('book-astrid');
    expect(bookingTargetFor('order-review', 'order-intake')).toBe('order-review');
  });

  it('recognises Shoot Ops addresses for the mobile sticky bar', () => {
    for (const p of ['/shoot-ops', '/shoot-ops/order-review', '/shoot-ops/concierge-order-intake', '/modules', '/guides', '/guides/does-aryeo-have-an-api-to-create-orders']) {
      expect(isShootOpsPath(p)).toBe(true);
    }
    for (const p of ['/', '/compoundiq', '/book', '/shoot-opsx']) expect(isShootOpsPath(p)).toBe(false);
  });

  it('the booking link is tagged as a module lead and carries the outreach token', () => {
    expect(shootOpsBookingHref('')).toBe('/book/anton?src=module');
    expect(shootOpsBookingHref('abc_123')).toBe('/book/anton?src=module&t=abc_123');
  });

  it('no Shoot Ops page sends anyone to the generic calendar directly', () => {
    const hits = execSync(
      "git grep -n \"onNavigate('calendar')\" -- frontend/components/AutoPilotPage.tsx frontend/components/mobile/MobileAutoPilotPage.tsx frontend/components/OrderIntakePage.tsx frontend/components/OrderReviewPage.tsx frontend/components/ModulesPage.tsx frontend/components/GuidePage.tsx frontend/components/GuidesPage.tsx || true",
      { cwd: root, encoding: 'utf8' },
    ).trim();
    expect(hits).toBe('');
  });
});
