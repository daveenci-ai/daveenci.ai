import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildDisplaySlots,
  checkSlotAvailability,
  isDayDisabled,
  hostSlotConfig,
  type SlotConfig,
} from '../frontend/components/calendarAvailability';

// Chicago is UTC-5 in September, so 08:00 Chicago == 13:00 UTC.
const ANTON: SlotConfig = {
  durationMin: 15, bufferMin: 10, minLeadHours: 24,
  timezone: 'America/Chicago', businessHours: [8, 9], businessDays: [1, 2, 3, 4],
};
const ASTRID: SlotConfig = { ...ANTON, durationMin: 30 };

// Monday 8 Sep 2026; "now" sits far enough back that lead time never bites.
const MONDAY = new Date(2026, 8, 14);
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-01T12:00:00Z'));
});
afterEach(() => { vi.useRealTimers(); });

describe('slot grid follows the host duration', () => {
  test('a 15-minute host offers four slots an hour', () => {
    expect(buildDisplaySlots(MONDAY, 'America/Chicago', ANTON)).toHaveLength(8);
  });

  test('a 30-minute host offers two slots an hour', () => {
    expect(buildDisplaySlots(MONDAY, 'America/Chicago', ASTRID)).toHaveLength(4);
  });

  test('slots run in chronological order', () => {
    const values = buildDisplaySlots(MONDAY, 'America/Chicago', ANTON).map((s) => s.value);
    expect(values).toEqual([...values].sort());
  });

  test('the first slot is the start of the first working hour', () => {
    const first = buildDisplaySlots(MONDAY, 'America/Chicago', ASTRID)[0];
    expect(first.value).toBe('2026-09-14T13:00:00.000Z');
  });
});

describe('timezone rendering', () => {
  test('never shows a bare time — the zone is on every slot', () => {
    for (const slot of buildDisplaySlots(MONDAY, 'America/Edmonton', ANTON)) {
      expect(slot.label).toContain(' · America/Edmonton');
    }
  });

  test('the same instant reads differently in two zones', () => {
    const [edmonton] = buildDisplaySlots(MONDAY, 'America/Edmonton', ASTRID);
    const [chicago] = buildDisplaySlots(MONDAY, 'America/Chicago', ASTRID);
    expect(edmonton.value).toBe(chicago.value);
    expect(edmonton.display).toBe('7:00 AM');
    expect(chicago.display).toBe('8:00 AM');
    expect(edmonton.label).toBe('7:00 AM · America/Edmonton');
  });
});

describe('busy slots per host', () => {
  const busy = [{ start: '2026-09-14T13:00:00.000Z', end: '2026-09-14T13:30:00.000Z' }];

  test('a slot overlapping a busy block is unavailable', () => {
    expect(checkSlotAvailability('2026-09-14T13:00:00.000Z', busy, ASTRID)).toBe(false);
  });

  test('the buffer keeps a slot butting up against a busy block unavailable', () => {
    // 13:30 starts the moment the busy block ends; 10 minutes of buffer bite.
    expect(checkSlotAvailability('2026-09-14T13:30:00.000Z', busy, ASTRID)).toBe(false);
  });

  test('a slot clear of the busy block and its buffer is available', () => {
    expect(checkSlotAvailability('2026-09-14T13:45:00.000Z', busy, ANTON)).toBe(true);
  });

  test('two hosts see their own calendars, not each others', () => {
    const antonBusy = [{ start: '2026-09-14T13:00:00.000Z', end: '2026-09-14T14:00:00.000Z' }];
    expect(checkSlotAvailability('2026-09-14T13:00:00.000Z', antonBusy, ANTON)).toBe(false);
    expect(checkSlotAvailability('2026-09-14T13:00:00.000Z', [], ASTRID)).toBe(true);
  });

  test('a slot inside the minimum notice window is unavailable', () => {
    vi.setSystemTime(new Date('2026-09-14T00:00:00Z')); // 13 hours before the slot
    expect(checkSlotAvailability('2026-09-14T13:00:00.000Z', [], ANTON)).toBe(false);
  });
});

describe('working days', () => {
  test('a day outside the host working days is disabled', () => {
    // 19 Sep 2026 is a Saturday.
    expect(isDayDisabled(19, new Date(2026, 8, 1), [], ANTON)).toBe(true);
  });

  test('a working day with free slots is open', () => {
    expect(isDayDisabled(14, new Date(2026, 8, 1), [], ANTON)).toBe(false);
  });

  test('a working day whose every slot is busy is disabled', () => {
    const allDay = [{ start: '2026-09-14T00:00:00.000Z', end: '2026-09-15T00:00:00.000Z' }];
    expect(isDayDisabled(14, new Date(2026, 8, 1), allDay, ANTON)).toBe(true);
  });
});

describe('host slot config', () => {
  test('anton defaults to 15 minutes and astrid to 30', () => {
    expect(hostSlotConfig('anton').durationMin).toBe(15);
    expect(hostSlotConfig('astrid').durationMin).toBe(30);
  });
});

describe('host slot config fallback', () => {
  test('an unrecognised host falls back to the 30-minute discovery call', () => {
    expect(hostSlotConfig('mallory').durationMin).toBe(30);
  });
});
