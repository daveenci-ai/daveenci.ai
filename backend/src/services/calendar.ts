import { google } from 'googleapis';
import type { Host } from '../hosts';

const CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Create auth client with Domain-Wide Delegation, impersonating `subject` (default: the calendar owner).
export const createAuthClient = (scopes: string[], subject: string | undefined = process.env.GOOGLE_CALENDAR_OWNER_EMAIL) => {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
                ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
                : undefined,
        },
        scopes: scopes,
        clientOptions: {
            subject, // Impersonate this user
        },
    });
};


/** True when Google refused to let the service account act as that user (not a calendar error). */
export const isDelegationError = (error: any): boolean => {
    const code = error?.response?.data?.error || error?.code;
    const text = `${error?.message || ''} ${JSON.stringify(error?.response?.data || '')}`;
    return code === 'unauthorized_client' || code === 'invalid_grant' || code === 'access_denied'
        || /unauthorized_client|invalid_grant|Client is unauthorized/i.test(text);
};

/**
 * Run a Google call as the host (so invites and emails come from them). If Google won't let the
 * service account act as the host, run it once more as the owner account — the pre-13-Oct behaviour —
 * and log it, so a booking never fails because of per-host sending.
 */
export const withHostAuth = async <T>(
    host: Pick<Host, 'key' | 'senderEmail'>,
    scopes: string[],
    run: (auth: any, subject: string | undefined) => Promise<T>,
    makeAuth: (scopes: string[], subject?: string) => any = createAuthClient,
): Promise<T> => {
    const owner = process.env.GOOGLE_CALENDAR_OWNER_EMAIL;
    const subject = host.senderEmail || owner;
    try {
        return await run(makeAuth(scopes, subject), subject);
    } catch (error) {
        if (subject === owner || !isDelegationError(error)) throw error;
        console.warn(`[calendar] cannot act as ${host.key}'s account; falling back to the owner account`);
        return run(makeAuth(scopes, owner), owner);
    }
};

const sendOwnerEmail = async (eventDetails: any, host: Host) => {
    const { name, email, company, reason, notes, date, time, dateTime } = eventDetails;

    const subject = `New Booking: ${host.key === 'anton' ? 'Module call' : 'Meet Astrid'} | ${name}`;

    // Format time from ISO dateTime or fallback to date/time fields
    let formattedTime = 'N/A';
    if (dateTime) {
        formattedTime = new Date(dateTime).toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
        });
    } else if (date && time) {
        formattedTime = `${date} at ${time}`;
    }

    const body = `
Client Details:
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Reason: ${reason || 'N/A'}
Notes: ${notes || 'N/A'}

Host: ${host.name}
Length: ${host.durationMin} min
Time: ${formattedTime}
`;

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const owner = process.env.GOOGLE_CALENDAR_OWNER_EMAIL;
    const to = host.senderEmail || owner;
    const messageParts = [
        `To: ${to}`,
        ...(owner && to !== owner ? [`Cc: ${owner}`] : []),
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        body.replace(/\n/g, '<br>'),
    ];
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        await withHostAuth(host, [...CALENDAR_SCOPES, ...GMAIL_SCOPES], (auth) =>
            google.gmail({ version: 'v1', auth }).users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage,
                },
            }),
        );
    } catch (error: any) {
        console.error('Error sending owner confirmation email:', error?.response?.data || error?.message || error);
    }
};

export const createCalendarEvent = async (eventDetails: any, host: Host) => {
    const { name, email, date, time, dateTime } = eventDetails;

    // Use provided ISO dateTime or fallback to constructing it (legacy support)
    let startDateTime: Date;
    if (dateTime) {
        startDateTime = new Date(dateTime);
    } else {
        startDateTime = new Date(`${date}T${time}:00`);
    }

    const endDateTime = new Date(startDateTime.getTime() + host.durationMin * 60000);

    const summary = host.key === 'anton'
        ? `Module call | ${name}`
        : `Meet Astrid | ${name}`;

    const description = host.key === 'anton'
        ? `Agenda:
• How your orders actually arrive — which inbox, which platform, how many service types.
• Whether the Order Intake module fits as it stands.
• A start date.`
        : `Proposed Agenda:
• Get to know each other and your business goals.
• Identify potential areas where we can provide value.
• Discuss next steps for working together.`;

    const event = {
        summary,
        description,
        start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'UTC', // We are providing absolute ISO time
        },
        end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'UTC',
        },
        attendees: [
            { email: email }, // Client gets invited
            { email: host.calendarId }, // Notify the host whose calendar this is
        ],
        conferenceData: {
            createRequest: {
                requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
        },
    };

    try {
        const response = await withHostAuth(host, CALENDAR_SCOPES, (auth) =>
            google.calendar({ version: 'v3', auth }).events.insert({
                calendarId: host.calendarId,
                conferenceDataVersion: 1, // Required to create Google Meet links
                requestBody: event,
                sendUpdates: 'all', // Send email invitations to attendees
            }),
        );

        // Send detailed email to owner in background
        sendOwnerEmail(eventDetails, host).catch(err => console.error('Background email error:', err?.response?.data || err?.message || err));

        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

/**
 * The busy list for one calendar from a free/busy reply (site audit, 15 Oct 2026). Google answers a calendar it
 * can't read with 200 and an `errors` list instead of `busy`; reading that as "no busy times" would offer every slot
 * and double-book the host. So an unreadable calendar is an error, never an empty day.
 */
export const busyFromFreeBusy = (data: any, calendarId: string): { start: string; end: string }[] => {
    const cal = data?.calendars?.[calendarId];
    const errors: { reason?: string }[] = cal?.errors || [];
    if (!cal || errors.length) {
        const reasons = errors.map((e) => e?.reason).filter(Boolean).join(', ') || 'calendar missing from the reply';
        const err: any = new Error(`Calendar not readable for free/busy (${reasons})`);
        err.code = 'calendar_unreadable';
        throw err;
    }
    return cal.busy || [];
};

export const getBusySlots = async (start: string, end: string, host: Host) => {
    const calendarId = host.calendarId || 'primary';
    const query = (auth: any) =>
        google.calendar({ version: 'v3', auth }).freebusy
            .query({ requestBody: { timeMin: start, timeMax: end, items: [{ id: calendarId }] } })
            .then((response) => busyFromFreeBusy(response.data, calendarId));

    try {
        return await withHostAuth(host, CALENDAR_SCOPES, query);
    } catch (error: any) {
        // The host's own account can't see the calendar: ask once more as the owner account, which has it shared.
        const owner = process.env.GOOGLE_CALENDAR_OWNER_EMAIL;
        if (error?.code === 'calendar_unreadable' && owner && host.senderEmail && host.senderEmail !== owner) {
            console.warn(`[calendar] ${host.key}'s account can't read its calendar for free/busy; asking as the owner account`);
            try {
                return await withHostAuth({ key: host.key, senderEmail: owner }, CALENDAR_SCOPES, query);
            } catch (ownerError) {
                console.error('Error fetching busy slots:', ownerError);
                throw ownerError;
            }
        }
        console.error('Error fetching busy slots:', error);
        throw error;
    }
};
