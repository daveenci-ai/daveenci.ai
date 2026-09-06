import type { Host } from '../hosts';

const KNOWN_SOURCES = ['outreach', 'module', 'site'];

/** Tokens are short and alphanumeric; anything else is not ours to forward. */
export const sanitizeToken = (raw: unknown): string => {
    if (typeof raw !== 'string') return '';
    const trimmed = raw.trim();
    if (!trimmed || trimmed.length > 64) return '';
    return /^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : '';
};

export const sanitizeSource = (raw: unknown): string =>
    typeof raw === 'string' && KNOWN_SOURCES.includes(raw) ? raw : 'site';

const text = (value: unknown): string => (value === undefined || value === null ? '' : String(value));

/**
 * Shape one booking into the flat, strings-only payload the CRM intake on
 * go.daveenci.ai accepts. See §4 of the booking brief.
 */
export const buildBookingIntake = (host: Host, body: Record<string, any>): Record<string, string> => {
    const start = new Date(body.dateTime);
    const end = new Date(start.getTime() + host.durationMin * 60000);

    return {
        host: host.key,
        kind: host.kind,
        duration_min: String(host.durationMin),
        name: text(body.name),
        email: text(body.email),
        company: text(body.company),
        phone: text(body.phone),
        start: start.toISOString(),
        end: end.toISOString(),
        timezone: text(body.timezone),
        reason: text(body.reason),
        notes: text(body.notes),
        src: sanitizeSource(body.src),
        t: sanitizeToken(body.t),
        page: `/book/${host.key}`,
        // Always present, always empty: a filled honeypot never reaches here.
        website: '',
    };
};
