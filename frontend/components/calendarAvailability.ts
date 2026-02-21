import { fromZonedTime } from 'date-fns-tz';

export type BusySlot = { start: string; end: string };

export const BUSINESS_TIMEZONE = 'America/Chicago';
export const BUSINESS_HOURS = [6, 7, 8, 9, 10, 11];
export const MEETING_DURATION_MINUTES = 45;
export const BUFFER_MINUTES = 10;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const buildDisplaySlots = (
  selectedDate: Date,
  userTimezone: string,
  businessHours: number[] = BUSINESS_HOURS,
  businessTimezone: string = BUSINESS_TIMEZONE,
) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const slots = businessHours.map((hour) => {
    const isoDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00`;
    const utcDate = fromZonedTime(isoDateStr, businessTimezone);
    return {
      display: utcDate.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTimezone,
      }),
      value: utcDate.toISOString(),
      localTime: userTimezone,
    };
  });

  slots.sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());
  return slots;
};

export const getAvailabilityRange = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const start = new Date(year, month, 1 - 7).toISOString();
  const lastDay = new Date(year, month + 1, 0 + 7);
  lastDay.setHours(23, 59, 59, 999);
  const end = lastDay.toISOString();
  return { start, end };
};

export const getSlotsForDate = (
  date: Date,
  businessHours: number[] = BUSINESS_HOURS,
  businessTimezone: string = BUSINESS_TIMEZONE,
) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return businessHours.map((hour) => {
    const isoDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00`;
    return fromZonedTime(isoDateStr, businessTimezone).toISOString();
  });
};

export const checkSlotAvailability = (
  slotIsoTime: string,
  busySlots: BusySlot[],
  meetingDurationMinutes: number = MEETING_DURATION_MINUTES,
  bufferMinutes: number = BUFFER_MINUTES,
) => {
  const slotStart = new Date(slotIsoTime);
  const slotStartWithBuffer = new Date(slotStart.getTime() - bufferMinutes * 60000);
  const slotEnd = new Date(slotStart.getTime() + meetingDurationMinutes * 60000);
  const slotEndWithBuffer = new Date(slotEnd.getTime() + bufferMinutes * 60000);

  if (slotStart < new Date()) return false;

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
  businessHours: number[] = BUSINESS_HOURS,
  businessTimezone: string = BUSINESS_TIMEZONE,
  meetingDurationMinutes: number = MEETING_DURATION_MINUTES,
  bufferMinutes: number = BUFFER_MINUTES,
) => {
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return true;

  const slots = getSlotsForDate(date, businessHours, businessTimezone);
  return !slots.some((slotIso) =>
    checkSlotAvailability(slotIso, busySlots, meetingDurationMinutes, bufferMinutes));
};
