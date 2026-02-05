import { google } from 'googleapis';

const CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar'];
const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Create auth client with Domain-Wide Delegation (impersonating the calendar owner)
export const createAuthClient = (scopes: string[]) => {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY
                ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
                : undefined,
        },
        scopes: scopes,
        clientOptions: {
            subject: process.env.GOOGLE_CALENDAR_OWNER_EMAIL, // Impersonate this user
        },
    });
};

const sendOwnerEmail = async (eventDetails: any) => {
    const { name, email, company, reason, notes, date, time } = eventDetails;
    const auth = createAuthClient([...CALENDAR_SCOPES, ...GMAIL_SCOPES]);
    const gmail = google.gmail({ version: 'v1', auth });

    const isMeetAstrid = eventDetails.bookingType === 'meet-astrid';
    const subject = isMeetAstrid ? `New Booking: ${name} | Meet Astrid` : `New Booking: ${name} | Schedule A Demo`;

    const body = `
Client Details:
Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Reason: ${reason || 'N/A'}
Notes: ${notes || 'N/A'}

Agent: Astrid Abrahamyan
Time: ${date} at ${time}
`;

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        `To: ${process.env.GOOGLE_CALENDAR_OWNER_EMAIL}`,
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
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
    } catch (error) {
        console.error('Error sending owner confirmation email:', error);
    }
};

export const createCalendarEvent = async (eventDetails: any) => {
    const { name, email, company, phone, reason, notes, date, time, dateTime } = eventDetails;

    const auth = createAuthClient(CALENDAR_SCOPES);
    const calendar = google.calendar({ version: 'v3', auth });

    // Use provided ISO dateTime or fallback to constructing it (legacy support)
    let startDateTime: Date;
    if (dateTime) {
        startDateTime = new Date(dateTime);
    } else {
        startDateTime = new Date(`${date}T${time}:00`);
    }

    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000); // 45 min duration

    const isMeetAstrid = eventDetails.bookingType === 'meet-astrid';

    const event = {
        summary: isMeetAstrid ? `${name} | Meet Astrid` : `${name} | Schedule A Demo`,
        description: isMeetAstrid
            ? `Proposed Agenda:
• Get to know each other and your business goals.
• Identify potential areas where we can provide value.
• Discuss next steps for working together.`
            : `Agenda:
• Explore custom AI agents and automation workflows.
• Demo of live pipelines for CRM and Marketing.
• Discuss implementation roadmap and ROI projections.`,
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
            { email: process.env.GOOGLE_CALENDAR_ID }, // Send notification to the calendar ID
        ],
        conferenceData: {
            createRequest: {
                requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            conferenceDataVersion: 1, // Required to create Google Meet links
            requestBody: event,
            sendUpdates: 'all', // Send email invitations to attendees
        });

        // Send detailed email to owner in background
        sendOwnerEmail(eventDetails).catch(err => console.error('Background email error:', err));

        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

export const getBusySlots = async (start: string, end: string) => {
    const auth = createAuthClient(CALENDAR_SCOPES);
    const calendar = google.calendar({ version: 'v3', auth });

    try {
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: start,
                timeMax: end,
                items: [{ id: process.env.GOOGLE_CALENDAR_ID || 'primary' }],
            },
        });

        const busySlots = response.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || 'primary']?.busy || [];
        return busySlots;
    } catch (error) {
        console.error('Error fetching busy slots:', error);
        throw error;
    }
};
