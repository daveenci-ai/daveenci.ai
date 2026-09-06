import { fromZonedTime } from 'date-fns-tz';

export type BusySlot = { start: string; end: string };

export interface SlotConfig {
  /** Meeting length; also the interval between offered slots. */
  durationMin: number;
  bufferMin: number;
  minLeadHours: number;
  /** Timezone the business hours below are expressed in. */
  timezone: string;
  businessHours: number[];
  /** Day numbers (0 = Sunday). */
  businessDays: number[];
}

export const BUSINESS_TIMEZONE = 'America/Chicago';
export const BUSINESS_HOURS = [8, 9, 10, 11, 12, 13, 14, 15];
export const BUSINESS_DAYS = [1, 2, 3, 4]; // Monday=1 through Thursday=4
export const MEETING_DURATION_MINUTES = 30;
export const BUFFER_MINUTES = 10;
export const MIN_LEAD_HOURS = 24;

/**
 * Client-side defaults. The server is the source of truth and hands the real
 * config back with the availability response; these keep the grid renderable
 * before that lands and if it fails.
 */
const DEFAULTS: Omit<SlotConfig, 'durationMin'> = {
  bufferMin: 10,
  minLeadHours: 24,
  timezone: BUSINESS_TIMEZONE,
  businessHours: BUSINESS_HOURS,
  businessDays: BUSINESS_DAYS,
};

/** Anything but 'anton' falls back to Astrid, as the server does. */
export const hostSlotConfig = (host: string): SlotConfig => ({
  ...DEFAULTS,
  durationMin: host === 'anton' ? 15 : 30,
});

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface DisplaySlot {
  /** Time only, in the visitor's zone: "6:30 PM". */
  display: string;
  /** Time with its zone — what the UI must show. Never render `display` bare. */
  label: string;
  /** Absolute start, ISO 8601. */
  value: string;
  timezone: string;
}

/** Slot start times for one day, as ISO strings, spaced by the meeting length. */
export const getSlotsForDate = (date: Date, config: SlotConfig): string[] => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const minutes: number[] = [];
  for (let m = 0; m < 60; m += config.durationMin) minutes.push(m);

  return config.businessHours
    .flatMap((hour) =>
      minutes.map((minute) => {
        const local = `${year}-${month}-${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
        return fromZonedTime(local, config.timezone).toISOString();
      }),
    )
    .sort();
};

export const buildDisplaySlots = (
  selectedDate: Date,
  userTimezone: string,
  config: SlotConfig,
): DisplaySlot[] =>
  getSlotsForDate(selectedDate, config).map((value) => {
    const display = new Date(value).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone,
    });
    return { display, label: `${display} · ${userTimezone}`, value, timezone: userTimezone };
  });

export const getAvailabilityRange = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const start = new Date(year, month, 1 - 7).toISOString();
  const lastDay = new Date(year, month + 1, 0 + 7);
  lastDay.setHours(23, 59, 59, 999);
  const end = lastDay.toISOString();
  return { start, end };
};

export const checkSlotAvailability = (
  slotIsoTime: string,
  busySlots: BusySlot[],
  config: SlotConfig,
): boolean => {
  const slotStart = new Date(slotIsoTime);
  const slotStartWithBuffer = new Date(slotStart.getTime() - config.bufferMin * 60000);
  const slotEnd = new Date(slotStart.getTime() + config.durationMin * 60000);
  const slotEndWithBuffer = new Date(slotEnd.getTime() + config.bufferMin * 60000);

  const minBookingTime = new Date(Date.now() + config.minLeadHours * 60 * 60000);
  if (slotStart < minBookingTime) return false;

  return !busySlots.some((slot) => {
    const busyStart = new Date(slot.start);
    const busyEnd = new Date(slot.end);
    return slotStartWithBuffer < busyEnd && slotEndWithBuffer > busyStart;
  });
};

export const isDayDisabled = (
  day: number,
  currentDate: Date,
  busySlots: BusySlot[],
  config: SlotConfig,
): boolean => {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return true;

  if (!config.businessDays.includes(date.getDay())) return true;

  return !getSlotsForDate(date, config).some((slotIso) =>
    checkSlotAvailability(slotIso, busySlots, config));
};
