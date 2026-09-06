export type HostKey = 'anton' | 'astrid';

export interface Host {
    key: HostKey;
    name: string;
    role: string;
    /** Meeting length; also the slot interval shown on the booking grid. */
    durationMin: number;
    /** Value recorded as `kind` on the CRM intake post. */
    kind: string;
    calendarId: string;
    /** Timezone the working hours below are expressed in. */
    timezone: string;
    /** Start-of-hour slots offered, in the host's timezone. */
    businessHours: number[];
    /** Day numbers (0 = Sunday) the host takes calls on. */
    businessDays: number[];
    bufferMin: number;
    minLeadHours: number;
}

export const HOST_KEYS: readonly HostKey[] = ['anton', 'astrid'] as const;

const DEFAULT_TIMEZONE = 'America/Chicago';
const DEFAULT_HOURS = [8, 9, 10, 11, 12, 13, 14, 15];
const DEFAULT_DAYS = [1, 2, 3, 4];

const numberList = (raw: string | undefined, fallback: number[]) => {
    if (!raw) return fallback;
    const parsed = raw.split(',').map((part) => Number(part.trim())).filter((n) => Number.isFinite(n));
    return parsed.length ? parsed : fallback;
};

const numberValue = (raw: string | undefined, fallback: number) => {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const getHost = (key: string | undefined): Host | undefined => {
    if (key !== 'anton' && key !== 'astrid') return undefined;

    const upper = key.toUpperCase();
    const calendarId =
        process.env[`GOOGLE_CALENDAR_ID_${upper}`]
        // Astrid is the calendar the site booked against before hosts existed.
        || (key === 'astrid' ? process.env.GOOGLE_CALENDAR_ID : undefined)
        || '';

    const shared = {
        calendarId,
        timezone: process.env[`BOOKING_TIMEZONE_${upper}`] || DEFAULT_TIMEZONE,
        businessHours: numberList(process.env[`BOOKING_HOURS_${upper}`], DEFAULT_HOURS),
        businessDays: numberList(process.env[`BOOKING_DAYS_${upper}`], DEFAULT_DAYS),
        bufferMin: numberValue(process.env[`BOOKING_BUFFER_${upper}`], 10),
        minLeadHours: numberValue(process.env[`BOOKING_MIN_LEAD_HOURS_${upper}`], 24),
    };

    if (key === 'anton') {
        return {
            key,
            name: 'Anton Osipov',
            role: 'Founder',
            durationMin: numberValue(process.env.BOOKING_DURATION_ANTON, 15),
            kind: 'module-call',
            ...shared,
        };
    }

    return {
        key,
        name: 'Astrid Abrahamyan',
        role: 'Co-Founder',
        durationMin: numberValue(process.env.BOOKING_DURATION_ASTRID, 30),
        kind: 'discovery-call',
        ...shared,
    };
};
