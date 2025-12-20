import { query } from '../db';

export const saveConsultationRequest = async (data: any) => {
  const { name, email, phone, company, reason, notes, date, time, dateTime } = data;

  // Combine date and time for scheduled_with (assuming UTC for simplicity or relying on DB to handle timezone if provided)
  // The user schema has 'shchedule_utc', let's construct a timestamp.
  const scheduleUtc = dateTime || new Date(`${date}T${time}:00`).toISOString();

  const text = `
    INSERT INTO consultation_request (
      full_name, email, phone, company, reason, other, scheduled_with, schedule_utc
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    name,
    email,
    phone,
    company,
    reason,
    notes,
    'Astrid Abrahamyan', // Static for now as per plan
    scheduleUtc
  ];

  try {
    const res = await query(text, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error saving consultation request:', err);
    throw err;
  }
};

export const getBookedSlots = async (start: string, end: string) => {
  const text = `
    SELECT schedule_utc
    FROM consultation_request
    WHERE schedule_utc >= $1 AND schedule_utc <= $2
    ORDER BY schedule_utc ASC
  `;

  const values = [start, end];

  try {
    const res = await query(text, values);
    // Convert to same format as Google Calendar busy slots
    // Assume 45 minute meetings
    const slots = res.rows.map(row => ({
      start: new Date(row.schedule_utc).toISOString(),
      end: new Date(new Date(row.schedule_utc).getTime() + 45 * 60000).toISOString()
    }));
    return slots;
  } catch (err) {
    console.error('Error fetching booked slots:', err);
    throw err;
  }
};
