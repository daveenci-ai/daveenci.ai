import { query } from '../db';
import { google } from 'googleapis';
import { createAuthClient } from './calendar';

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// The owner notification is sent as text/html, so client-supplied fields
// must be escaped before interpolation.
const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sendNewsletterOwnerEmail = async (email: string, source?: string) => {
    const auth = createAuthClient(GMAIL_SCOPES);
    const gmail = google.gmail({ version: 'v1', auth });

    const subject = `New Newsletter Subscription: ${email}`;
    const body = `
A new user has subscribed to the newsletter:

Email: ${escapeHtml(email)}${source ? `\nSource: ${escapeHtml(source)}` : ''}
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

export const subscribeToNewsletter = async (email: string, source?: string) => {
    // Check if email already exists
    const checkText = 'SELECT id FROM newsletter_request WHERE email = $1';
    const checkResult = await query(checkText, [email]);

    if (checkResult.rows.length > 0) {
        const error: any = new Error('Email already exists');
        error.code = '23505'; // Simulate unique constraint violation
        throw error;
    }

    let rows;
    if (source) {
        try {
            ({ rows } = await query(
                'INSERT INTO newsletter_request (email, source) VALUES ($1, $2) RETURNING *',
                [email, source]
            ));
        } catch (error: any) {
            // 42703 = undefined column: the source column migration hasn't run
            // yet. Never fail a subscription over attribution metadata.
            if (error?.code !== '42703') throw error;
            console.warn('newsletter_request.source column missing — run migrations/2026-07-10-newsletter-source.sql');
            ({ rows } = await query(
                'INSERT INTO newsletter_request (email) VALUES ($1) RETURNING *',
                [email]
            ));
        }
    } else {
        ({ rows } = await query(
            'INSERT INTO newsletter_request (email) VALUES ($1) RETURNING *',
            [email]
        ));
    }

    // Send notification email to owner in background
    sendNewsletterOwnerEmail(email, source).catch(err => console.error('Background newsletter email error:', err));

    return rows[0];
};
