import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Create auth client with Domain-Wide Delegation (impersonating the calendar owner)
const createAuthClient = () => {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: SCOPES,
        clientOptions: {
            subject: process.env.GOOGLE_CALENDAR_OWNER_EMAIL, // Impersonate this user
        },
    });
};

export const createCalendarEvent = async (eventDetails: any) => {
    const { name, email, company, phone, reason, notes, date, time, dateTime } = eventDetails;

    const auth = createAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    // Use provided ISO dateTime or fallback to constructing it (legacy support)
    let startDateTime: Date;
    if (dateTime) {
        startDateTime = new Date(dateTime);
    } else {
        startDateTime = new Date(`${date}T${time}:00`);
    }

    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000); // 45 min duration

    const event = {
        summary: `${name} | Astrid - AI Consultation`,
        description: `Agenda:
• Identify inefficiencies in your current process.
• Validate the right solutions for your goals.
• Draft a roadmap for costs, savings, and timeline.

Client Details:
Company: ${company || 'N/A'}
Reason: ${reason || 'N/A'}
Notes: ${notes || 'N/A'}`,
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
    };

    try {
        const response = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: event,
            sendUpdates: 'all', // Send email invitations to attendees
        });
        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

export const getBusySlots = async (start: string, end: string) => {
    const auth = createAuthClient();
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
