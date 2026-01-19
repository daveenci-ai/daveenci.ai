import { query } from '../db';
import { google } from 'googleapis';
import { createAuthClient } from './calendar';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const sendEventOwnerEmail = async (details: any) => {
  const { fullName, email, eventName, eventDate } = details;
  const auth = createAuthClient(GMAIL_SCOPES);
  const gmail = google.gmail({ version: 'v1', auth });

  const subject = `New Event Registration: ${fullName} | ${eventName}`;
  const formattedDate = new Date(eventDate).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const body = `
New Event Registration Details:
Name: ${fullName}
Email: ${email}
Event: ${eventName}
Date/Time: ${formattedDate}
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
    console.error('Error sending event registration email to owner:', error);
  }
};

export const registerForEvent = async (data: any) => {
  const { fullName, email, eventName, eventDescription, eventDate } = data;

  // eventDate is expected to be an ISO string (UTC)
  const text = `
    INSERT INTO event_request (
      full_name, email, event_name, event_description, event_dt_utc
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    fullName,
    email,
    eventName,
    eventDescription,
    eventDate
  ];

  try {
    const res = await query(text, values);

    // Send confirmation email to owner in background
    sendEventOwnerEmail(data).catch(err => console.error('Background event email error:', err));

    return res.rows[0];
  } catch (err) {
    console.error('Error registering for event:', err);
    throw err;
  }
};
