export type CrmFormKind = 'event' | 'consultation' | 'newsletter';

export const CRM_INTAKE_BASE_URL = process.env.CRM_INTAKE_URL || 'https://go.daveenci.ai';

const TIMEOUT_MS = 5000;

export interface CrmPostResult {
    ok: boolean;
    status?: number;
    rateLimited?: boolean;
    error?: string;
}

/**
 * Post one form submission to the CRM intake on go.daveenci.ai.
 *
 * Never throws and never rejects: a booking or subscription must succeed even
 * when the intake is down. The caller logs the result and carries on.
 */
export const postToCrm = async (
    kind: CrmFormKind,
    payload: Record<string, unknown>,
    options: { clientIp?: string } = {},
): Promise<CrmPostResult> => {
    // The contract is flat JSON, strings only.
    const body: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;
        body[key] = String(value);
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Origin: 'https://daveenci.ai',
    };
    // Posts are server-to-server, so without this the intake rate limit would
    // key on the Vercel egress IP and throttle every visitor at once.
    if (options.clientIp) headers['X-Forwarded-For'] = options.clientIp;

    try {
        const response = await fetch(`${CRM_INTAKE_BASE_URL}/form/${kind}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });

        if (!response.ok) {
            return { ok: false, status: response.status, rateLimited: response.status === 429 };
        }
        return { ok: true, status: response.status };
    } catch (error: any) {
        return { ok: false, error: error?.message || 'crm intake unreachable' };
    }
};
