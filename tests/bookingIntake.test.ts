import { describe, test, expect } from 'vitest';
import { buildBookingIntake } from '../backend/src/lib/bookingIntake';
import { getHost } from '../backend/src/hosts';

process.env.GOOGLE_CALENDAR_ID_ANTON = 'anton@daveenci.ai';
const anton = getHost('anton')!;
const astrid = getHost('astrid')!;

const body = {
  name: 'Katie Reed', email: 'katie@example.com', company: 'Reed Media', phone: '+1 555 0100',
  dateTime: '2026-09-09T13:30:00.000Z', timezone: 'America/Edmonton',
  reason: 'Order Intake module', notes: 'Aryeo, 20 orders a week',
  src: 'outreach', t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', website: '',
};

describe('booking intake payload', () => {
  test('matches the documented contract for a module call', () => {
    expect(buildBookingIntake(anton, body)).toEqual({
      host: 'anton', kind: 'module-call', duration_min: '15',
      name: 'Katie Reed', email: 'katie@example.com', company: 'Reed Media', phone: '+1 555 0100',
      start: '2026-09-09T13:30:00.000Z', end: '2026-09-09T13:45:00.000Z',
      timezone: 'America/Edmonton',
      reason: 'Order Intake module', notes: 'Aryeo, 20 orders a week',
      src: 'outreach', t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      page: '/book/anton', website: '',
    });
  });

  test('the end time follows the host duration', () => {
    expect(buildBookingIntake(astrid, body).end).toBe('2026-09-09T14:00:00.000Z');
    expect(buildBookingIntake(astrid, body).duration_min).toBe('30');
  });

  test('every value is a string', () => {
    for (const value of Object.values(buildBookingIntake(anton, body))) {
      expect(typeof value).toBe('string');
    }
  });

  test('the honeypot is always present and empty', () => {
    expect(buildBookingIntake(anton, { ...body, website: undefined }).website).toBe('');
    expect(buildBookingIntake(anton, { ...body, website: 'spam' }).website).toBe('');
  });
});

describe('outreach attribution', () => {
  test('keeps a well-formed token', () => {
    expect(buildBookingIntake(anton, body).t).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  test('drops a token carrying anything but token characters', () => {
    expect(buildBookingIntake(anton, { ...body, t: 'abc<script>' }).t).toBe('');
  });

  test('drops an absurdly long token rather than forwarding it', () => {
    expect(buildBookingIntake(anton, { ...body, t: 'a'.repeat(200) }).t).toBe('');
  });

  test('accepts only the three known sources and defaults to site', () => {
    expect(buildBookingIntake(anton, { ...body, src: 'module' }).src).toBe('module');
    expect(buildBookingIntake(anton, { ...body, src: 'site' }).src).toBe('site');
    expect(buildBookingIntake(anton, { ...body, src: 'javascript:alert(1)' }).src).toBe('site');
    expect(buildBookingIntake(anton, { ...body, src: undefined }).src).toBe('site');
  });

  test('page names the booking route the visitor used', () => {
    expect(buildBookingIntake(astrid, body).page).toBe('/book/astrid');
  });
});

describe('missing optional fields', () => {
  test('absent company, phone and notes become empty strings, not "undefined"', () => {
    const sparse = buildBookingIntake(anton, {
      name: 'Katie', email: 'k@example.com', dateTime: '2026-09-09T13:30:00.000Z',
      timezone: 'UTC', reason: 'Just curious',
    });
    expect(sparse.company).toBe('');
    expect(sparse.phone).toBe('');
    expect(sparse.notes).toBe('');
  });
});
