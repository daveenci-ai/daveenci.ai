import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { getHost, senderFor } from '../backend/src/hosts';
import { isDelegationError, withHostAuth } from '../backend/src/services/calendar';
import { buildDisplaySlots, type SlotConfig } from '../frontend/components/calendarAvailability';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.GOOGLE_CALENDAR_OWNER_EMAIL = 'owner@daveenci.ai';
  process.env.GOOGLE_CALENDAR_ID = 'legacy@group.calendar.google.com';
  process.env.GOOGLE_CALENDAR_ID_ANTON = 'anton@daveenci.ai';
  delete process.env.GOOGLE_CALENDAR_ID_ASTRID;
  delete process.env.GOOGLE_CALENDAR_SUBJECT_ANTON;
  delete process.env.GOOGLE_CALENDAR_SUBJECT_ASTRID;
  delete process.env.BOOKING_SLOT_INTERVAL_ANTON;
  delete process.env.BOOKING_SLOT_INTERVAL_ASTRID;
});
afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe('each host books from their own account (13 Oct 2026)', () => {
  test('a person’s calendar id is who the site acts as', () => {
    expect(getHost('anton')?.senderEmail).toBe('anton@daveenci.ai');
  });

  test('a shared group calendar falls back to the owner account', () => {
    expect(getHost('astrid')?.senderEmail).toBe('');
  });

  test('GOOGLE_CALENDAR_SUBJECT_<HOST> wins when set', () => {
    process.env.GOOGLE_CALENDAR_SUBJECT_ASTRID = 'astrid@daveenci.ai';
    expect(getHost('astrid')?.senderEmail).toBe('astrid@daveenci.ai');
    expect(senderFor('ANTON', '')).toBe('');
  });

  test('acts as the host, and falls back to the owner only when Google refuses the delegation', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const seen: (string | undefined)[] = [];
    const makeAuth = (_s: string[], subject?: string) => ({ subject });
    const refused = Object.assign(new Error('unauthorized_client'), { response: { data: { error: 'unauthorized_client' } } });
    const run = async (_auth: unknown, subject?: string) => {
      seen.push(subject);
      if (subject === 'anton@daveenci.ai') throw refused;
      return 'ok';
    };
    await expect(withHostAuth({ key: 'anton', senderEmail: 'anton@daveenci.ai' }, [], run, makeAuth)).resolves.toBe('ok');
    expect(seen).toEqual(['anton@daveenci.ai', 'owner@daveenci.ai']);
    expect(warn).toHaveBeenCalledOnce();
  });

  test('any other error is not hidden behind the fallback', async () => {
    const boom = Object.assign(new Error('Calendar busy'), { code: 500 });
    const run = vi.fn(async () => { throw boom; });
    await expect(withHostAuth({ key: 'anton', senderEmail: 'anton@daveenci.ai' }, [], run, () => ({}))).rejects.toBe(boom);
    expect(run).toHaveBeenCalledOnce();
  });

  test('no host account set: runs once as the owner, as before', async () => {
    const run = vi.fn(async (_a: unknown, subject?: string) => subject);
    await expect(withHostAuth({ key: 'astrid', senderEmail: '' }, [], run, () => ({}))).resolves.toBe('owner@daveenci.ai');
    expect(run).toHaveBeenCalledOnce();
  });

  test('recognises Google’s delegation refusals', () => {
    expect(isDelegationError({ response: { data: { error: 'invalid_grant' } } })).toBe(true);
    expect(isDelegationError(new Error('unauthorized_client: Client is unauthorized'))).toBe(true);
    expect(isDelegationError({ code: 404, message: 'Not Found' })).toBe(false);
  });
});

describe('slot interval can differ from the call length (13 Oct 2026)', () => {
  const ASTRID: SlotConfig = {
    durationMin: 30, bufferMin: 10, minLeadHours: 24,
    timezone: 'America/Chicago', businessHours: [8, 9], businessDays: [1, 2, 3, 4],
  };
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-01T12:00:00Z')); });
  afterEach(() => { vi.useRealTimers(); });

  test('defaults to the call length (no change unless set)', () => {
    expect(getHost('astrid')?.slotIntervalMin).toBe(30);
    expect(getHost('anton')?.slotIntervalMin).toBe(15);
    expect(buildDisplaySlots(new Date(2026, 8, 14), 'America/Chicago', ASTRID)).toHaveLength(4);
  });

  test('BOOKING_SLOT_INTERVAL_<HOST> offers more start times without changing the length', () => {
    process.env.BOOKING_SLOT_INTERVAL_ASTRID = '15';
    expect(getHost('astrid')?.slotIntervalMin).toBe(15);
    expect(getHost('astrid')?.durationMin).toBe(30);
    expect(buildDisplaySlots(new Date(2026, 8, 14), 'America/Chicago', { ...ASTRID, slotIntervalMin: 15 })).toHaveLength(8);
  });

  test('nonsense values fall back to the call length', () => {
    process.env.BOOKING_SLOT_INTERVAL_ANTON = '2';
    expect(getHost('anton')?.slotIntervalMin).toBe(15);
    process.env.BOOKING_SLOT_INTERVAL_ANTON = 'abc';
    expect(getHost('anton')?.slotIntervalMin).toBe(15);
  });
});

describe('the sitemap lists only real pages', () => {
  test('/calendar (a redirect) is gone', async () => {
    const { readFileSync } = await import('node:fs');
    const sm = readFileSync(new URL('../frontend/public/sitemap.xml', import.meta.url), 'utf8');
    expect(sm).not.toContain('<loc>https://daveenci.ai/calendar</loc>');
  });
});

describe('free/busy replies (site audit, 15 Oct 2026)', () => {
  test('returns the busy list for a calendar Google could read', async () => {
    const { busyFromFreeBusy } = await import('../backend/src/services/calendar');
    const busy = [{ start: '2026-10-20T14:00:00Z', end: '2026-10-20T15:00:00Z' }];
    expect(busyFromFreeBusy({ calendars: { 'a@x': { busy } } }, 'a@x')).toEqual(busy);
    expect(busyFromFreeBusy({ calendars: { 'a@x': {} } }, 'a@x')).toEqual([]);
  });

  test('an unreadable or missing calendar is an error, never an empty (all-free) day', async () => {
    const { busyFromFreeBusy } = await import('../backend/src/services/calendar');
    expect(() => busyFromFreeBusy({ calendars: { 'a@x': { errors: [{ domain: 'global', reason: 'notFound' }], busy: [] } } }, 'a@x'))
      .toThrow(/notFound/);
    expect(() => busyFromFreeBusy({ calendars: {} }, 'a@x')).toThrow(/missing/);
    try {
      busyFromFreeBusy({ calendars: { 'a@x': { errors: [{ reason: 'internalError' }] } } }, 'a@x');
    } catch (e) {
      expect((e as { code?: string }).code).toBe('calendar_unreadable');
    }
  });
});
