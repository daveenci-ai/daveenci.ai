import { query } from '../db';

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
    return rows[0];
};
