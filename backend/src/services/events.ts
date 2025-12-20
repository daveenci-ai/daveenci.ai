import { query } from '../db';

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
        return res.rows[0];
    } catch (err) {
        console.error('Error registering for event:', err);
        throw err;
    }
};
