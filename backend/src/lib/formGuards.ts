const ALLOWED_ORIGINS = ['https://daveenci.ai', 'https://www.daveenci.ai'];

export type GuardResult = { ok: true } | { ok: false; reason: 'honeypot' | 'origin' };

export const checkFormGuards = (
    origin: string | undefined,
    body: Record<string, any>,
    options: { allowLocalhost?: boolean } = {},
): GuardResult => {
    // A bot that fills every field in the form trips this; a person never
    // sees it. Absent is fine — older clients don't send the field.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
        return { ok: false, reason: 'honeypot' };
    }

    if (origin) {
        const allowed = ALLOWED_ORIGINS.includes(origin)
            || (options.allowLocalhost === true && /^http:\/\/localhost(:\d+)?$/.test(origin));
        if (!allowed) return { ok: false, reason: 'origin' };
    }

    return { ok: true };
};
