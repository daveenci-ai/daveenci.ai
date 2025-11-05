/**
 * Google Calendar API Integration
 * Handles calendar availability checking and event creation
 */

import { google } from 'googleapis';

/**
 * Initialize Google Calendar API client with domain-wide delegation
 */
function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
    // Subject: The user to impersonate (domain-wide delegation)
    subject: process.env.GOOGLE_CALENDAR_ID || 'anton.osipov@daveenci.com',
  });

  return google.calendar({ version: 'v3', auth });
}

/**
 * Get available time slots for a given date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} timezone - Timezone (e.g., 'America/Chicago')
 * @returns {Promise<Array>} Array of available time slots
 */
export async function getAvailableSlots(startDate, endDate, timezone = 'America/Chicago') {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Define business hours (9 AM - 5 PM)
    const businessStartHour = 9;
    const businessEndHour = 17;
    
    // Query for existing events
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      timeZone: timezone,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const busySlots = response.data.items || [];
    
    // Generate all possible time slots
    const availableSlots = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current < end) {
      // Skip weekends
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        // Generate slots for each day (1-hour intervals)
        for (let hour = businessStartHour; hour < businessEndHour; hour++) {
          const slotStart = new Date(current);
          slotStart.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 60);

          // Check if slot conflicts with existing events
          const isAvailable = !busySlots.some(event => {
            const eventStart = new Date(event.start.dateTime || event.start.date);
            const eventEnd = new Date(event.end.dateTime || event.end.date);
            return (slotStart >= eventStart && slotStart < eventEnd) ||
                   (slotEnd > eventStart && slotEnd <= eventEnd) ||
                   (slotStart <= eventStart && slotEnd >= eventEnd);
          });

          if (isAvailable && slotStart > new Date()) {
            availableSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              display: slotStart.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: timezone,
              }),
            });
          }
        }
      }
      
      current.setDate(current.getDate() + 1);
    }

    return availableSlots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw new Error('Failed to fetch calendar availability');
  }
}

/**
 * Create a calendar event
 * @param {Object} eventData - Event details
 * @returns {Promise<Object>} Created event details
 */
export async function createCalendarEvent(eventData) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const {
      summary,
      description,
      name,
      email,
      phone,
      company,
      meetingType,
      startTime,
      endTime,
      timezone = 'America/Chicago',
      notes,
    } = eventData;

    // Handle webinar events (no attendee info)
    if (meetingType === 'webinar') {
      const event = {
        summary: summary || 'DaVeenci Webinar',
        description: description || 'DaVeenci webinar event',
        start: {
          dateTime: startTime,
          timeZone: timezone,
        },
        end: {
          dateTime: endTime,
          timeZone: timezone,
        },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 60 },  // 1 hour before
            { method: 'popup', minutes: 15 },  // 15 min before
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        conferenceDataVersion: 1,
        resource: event,
      });

      console.log('📅 Webinar event created in Google Calendar');
      console.log('   Event ID:', response.data.id);
      console.log('   Meet Link:', response.data.hangoutLink);

      return {
        id: response.data.id,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink,
      };
    }

    // Handle regular booking events
    const title = meetingType === '30min-fit-check' 
      ? '30-Minute AI Strategy Call - DaVeenci'
      : '90-Minute AI Consultation Call - DaVeenci';
    
    const duration = meetingType === '30min-fit-check' ? '30 minutes' : '90 minutes';
    const meetingTypeLabel = meetingType === '30min-fit-check' ? 'Fit Check (FREE)' : 'Deep Dive Consultation ($150)';

    // Create event
    const event = {
      summary: title,
      description: `
Meeting Type: ${meetingTypeLabel}
Duration: ${duration}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}

${notes ? `Notes: ${notes}` : ''}

${meetingType === '90min-consultation' ? 'Payment: $150 due before session\n' : ''}
Booked via DaVeenci.ai website
      `.trim(),
      start: {
        dateTime: startTime,
        timeZone: timezone,
      },
      end: {
        dateTime: endTime,
        timeZone: timezone,
      },
      attendees: [
        { email, displayName: name },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 },      // 1 hour before
          { method: 'popup', minutes: 30 },      // 30 min before
        ],
      },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email invites
      resource: event,
    });

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink,
      htmlLink: response.data.htmlLink,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
}

/**
 * Cancel a calendar event
 * @param {string} eventId - Google Calendar event ID
 * @returns {Promise<boolean>} Success status
 */
export async function cancelCalendarEvent(eventId) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all', // Notify attendees
    });

    return true;
  } catch (error) {
    console.error('Error cancelling calendar event:', error);
    throw new Error('Failed to cancel calendar event');
  }
}

/**
 * Reschedule a calendar event
 * @param {string} eventId - Google Calendar event ID
 * @param {Object} newTime - New start/end times
 * @returns {Promise<Object>} Updated event details
 */
export async function rescheduleCalendarEvent(eventId, newTime) {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    // Get existing event
    const existingEvent = await calendar.events.get({
      calendarId,
      eventId,
    });

    // Update with new times
    const updatedEvent = {
      ...existingEvent.data,
      start: {
        dateTime: newTime.startTime,
        timeZone: newTime.timezone,
      },
      end: {
        dateTime: newTime.endTime,
        timeZone: newTime.timezone,
      },
    };

    const response = await calendar.events.update({
      calendarId,
      eventId,
      sendUpdates: 'all',
      resource: updatedEvent,
    });

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink,
      htmlLink: response.data.htmlLink,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error rescheduling calendar event:', error);
    throw new Error('Failed to reschedule calendar event');
  }
}

export default {
  getAvailableSlots,
  createCalendarEvent,
  cancelCalendarEvent,
  rescheduleCalendarEvent,
};

