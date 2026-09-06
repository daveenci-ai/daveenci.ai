import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { getHost, HOST_KEYS } from '../backend/src/hosts';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.GOOGLE_CALENDAR_ID = 'legacy@group.calendar.google.com';
  process.env.GOOGLE_CALENDAR_ID_ANTON = 'anton@daveenci.ai';
  delete process.env.GOOGLE_CALENDAR_ID_ASTRID;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('host registry', () => {
  test('anton is a 15-minute module call on his own calendar', () => {
    const host = getHost('anton');
    expect(host?.durationMin).toBe(15);
    expect(host?.calendarId).toBe('anton@daveenci.ai');
    expect(host?.name).toBe('Anton Osipov');
  });

  test('astrid is a 30-minute discovery call', () => {
    expect(getHost('astrid')?.durationMin).toBe(30);
    expect(getHost('astrid')?.name).toBe('Astrid Abrahamyan');
  });

  test('astrid falls back to the legacy single-calendar env var', () => {
    expect(getHost('astrid')?.calendarId).toBe('legacy@group.calendar.google.com');
  });

  test('the two hosts book against different calendars', () => {
    expect(getHost('anton')?.calendarId).not.toBe(getHost('astrid')?.calendarId);
  });

  test('an unknown host is not resolved', () => {
    expect(getHost('mallory')).toBeUndefined();
    expect(getHost(undefined)).toBeUndefined();
  });

  test('HOST_KEYS lists exactly the bookable hosts', () => {
    expect([...HOST_KEYS].sort()).toEqual(['anton', 'astrid']);
  });
});
