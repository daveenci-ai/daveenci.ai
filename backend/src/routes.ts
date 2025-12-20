import { Router, Request, Response } from 'express';
import { createCalendarEvent, getBusySlots } from './services/calendar';
import { saveConsultationRequest, getBookedSlots } from './services/consultation';
import { registerForEvent } from './services/events';
import { subscribeToNewsletter } from './services/newsletter';

const router = Router();

router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const result = await subscribeToNewsletter(email);
        res.status(200).json({ success: true, result });
    } catch (error: any) {
        console.error('Newsletter subscription error:', error);
        if (error?.code === '23505') {
            return res.status(409).json({
                success: false,
                error: 'You are already subscribed to the newsletter.',
                isDuplicate: true
            });
        }
        res.status(500).json({ success: false, error: 'Failed to subscribe to newsletter' });
    }
});

router.post('/events/register', async (req: Request, res: Response) => {
    try {
        const result = await registerForEvent(req.body);
        res.status(200).json({ success: true, result });
    } catch (error: any) {
        console.error('Event registration error:', error);
        if (error?.code === '23505') {
            return res.status(409).json({
                success: false,
                error: 'You are already registered for this event.',
                isDuplicate: true
            });
        }
        res.status(500).json({ success: false, error: 'Failed to register for event' });
    }
});

router.post('/calendar/book', async (req: Request, res: Response) => {
    try {
        // Run both operations in parallel
        const [event, dbRecord] = await Promise.all([
            createCalendarEvent(req.body),
            saveConsultationRequest(req.body)
        ]);

        res.status(200).json({ success: true, event, dbRecord });
    } catch (error: any) {
        console.error('Booking error:', error);

        // Handle duplicate booking error (same email + same time)
        if (error?.code === '23505') {
            return res.status(409).json({
                success: false,
                error: 'You already have a consultation scheduled at this time. Check your email for the calendar invite.',
                isDuplicate: true
            });
        }

        res.status(500).json({ success: false, error: 'Failed to book consultation' });
    }
});

router.get('/calendar/availability', async (req: Request, res: Response) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) {
            return res.status(400).json({ error: 'Missing start or end date' });
        }

        // Fetch both Google Calendar busy slots AND database bookings
        const [googleBusySlots, dbBookedSlots] = await Promise.all([
            getBusySlots(start as string, end as string),
            getBookedSlots(start as string, end as string)
        ]);

        // Merge both sources of busy times
        const allBusySlots = [...googleBusySlots, ...dbBookedSlots];

        res.json({ busySlots: allBusySlots });
    } catch (error) {
        console.error('Availability error:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
});

export default router;
