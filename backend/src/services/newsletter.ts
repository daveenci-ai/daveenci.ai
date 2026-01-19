import { query } from '../db';
import { google } from 'googleapis';
import { createAuthClient } from './calendar';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const sendNewsletterOwnerEmail = async (email: string) => {
    const auth = createAuthClient(GMAIL_SCOPES);
    const gmail = google.gmail({ version: 'v1', auth });

    const subject = `New Newsletter Subscription: ${email}`;
    const body = `
A new user has subscribed to the newsletter:

Email: ${email}
Subscription Date: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
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
        console.error('Error sending newsletter subscription email to owner:', error);
    }
};

export const subscribeToNewsletter = async (email: string) => {
    // Check if email already exists
    const checkText = 'SELECT id FROM newsletter_request WHERE email = $1';
    const checkResult = await query(checkText, [email]);

    if (checkResult.rows.length > 0) {
        const error: any = new Error('Email already exists');
        error.code = '23505'; // Simulate unique constraint violation
        throw error;
    }

    const text = `
        INSERT INTO newsletter_request (email)
        VALUES ($1)
        RETURNING *
    `;
    const { rows } = await query(text, [email]);

    // Send notification email to owner in background
    sendNewsletterOwnerEmail(email).catch(err => console.error('Background newsletter email error:', err));

    return rows[0];
};
