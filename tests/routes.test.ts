import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const createCalendarEvent = vi.fn(async () => ({ id: 'evt_1', htmlLink: 'https://cal' }));
const getBusySlots = vi.fn(async () => [{ start: '2026-09-14T13:00:00Z', end: '2026-09-14T13:30:00Z' }]);
const saveConsultationRequest = vi.fn(async () => ({ id: 1 }));
const subscribeToNewsletter = vi.fn(async () => ({ id: 1 }));
const registerForEvent = vi.fn(async () => ({ id: 1 }));

vi.mock('../backend/src/services/calendar', () => ({ createCalendarEvent, getBusySlots }));
vi.mock('../backend/src/services/consultation', () => ({ saveConsultationRequest }));
vi.mock('../backend/src/services/newsletter', () => ({ subscribeToNewsletter }));
vi.mock('../backend/src/services/events', () => ({ registerForEvent }));
vi.mock('../backend/src/services/auth', () => ({ getAuthUrl: () => '', verifyGoogleToken: async () => ({}) }));
vi.mock('../backend/src/services/brandAnalyzer', () => ({ analyzeBrands: async () => ({}) }));

process.env.GOOGLE_CALENDAR_ID = 'astrid@daveenci.ai';
process.env.GOOGLE_CALENDAR_ID_ANTON = 'anton@daveenci.ai';
process.env.NODE_ENV = 'production';

const routes = (await import('../backend/src/routes')).default;
const app = express().use(express.json()).use('/api', routes);

const ORIGIN = 'https://daveenci.ai';
const booking = {
  host: 'anton', name: 'Katie', email: 'katie@example.com',
  dateTime: '2026-09-14T13:30:00.000Z', timezone: 'America/Edmonton',
  reason: 'Order Intake module', src: 'module', t: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaa', website: '',
};

let crmCalls: Array<{ url: string; body: any }>;
const stubCrm = (response: any) => {
  vi.stubGlobal('fetch', vi.fn(async (url: any, init: any) => {
    crmCalls.push({ url: String(url), body: JSON.parse(init.body) });
    if (response instanceof Error) throw response;
    return response;
  }));
};

beforeEach(() => {
  crmCalls = [];
  vi.clearAllMocks();
  stubCrm({ ok: true, status: 200, json: async () => ({ ok: true }) });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe('POST /api/calendar/book', () => {
  test('books the call and posts it to the CRM intake', async () => {
    const res = await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(booking);
    expect(res.status).toBe(200);
    expect(createCalendarEvent).toHaveBeenCalledTimes(1);
    expect(crmCalls[0].url).toContain('/form/event');
    expect(crmCalls[0].body).toMatchObject({ host: 'anton', src: 'module', duration_min: '15' });
  });

  test('books against the host named in the request', async () => {
    await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(booking);
    expect(createCalendarEvent.mock.calls[0][1]).toMatchObject({
      key: 'anton', calendarId: 'anton@daveenci.ai', durationMin: 15,
    });
  });

  test('a request with no host still books Astrid, as it did before hosts', async () => {
    const { host, ...legacy } = booking;
    await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(legacy);
    expect(createCalendarEvent.mock.calls[0][1]).toMatchObject({
      key: 'astrid', calendarId: 'astrid@daveenci.ai', durationMin: 30,
    });
  });

  test('the CRM post is fire-and-forget: intake down, booking still confirmed', async () => {
    stubCrm(new Error('ECONNREFUSED'));
    const res = await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(booking);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(createCalendarEvent).toHaveBeenCalledTimes(1);
  });

  test('a 429 from the intake does not cost the visitor their booking', async () => {
    stubCrm({ ok: false, status: 429, json: async () => ({}) });
    const res = await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(booking);
    expect(res.status).toBe(200);
  });

  test('the legacy Postgres write failing does not cost the booking', async () => {
    saveConsultationRequest.mockRejectedValueOnce(new Error('no such table'));
    const res = await request(app).post('/api/calendar/book').set('Origin', ORIGIN).send(booking);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('rejects a post from another origin', async () => {
    const res = await request(app).post('/api/calendar/book').set('Origin', 'https://evil.example').send(booking);
    expect(res.status).toBe(403);
    expect(createCalendarEvent).not.toHaveBeenCalled();
  });

  test('a filled honeypot books nothing and tells the bot nothing', async () => {
    const res = await request(app).post('/api/calendar/book').set('Origin', ORIGIN)
      .send({ ...booking, website: 'http://spam.example' });
    expect(res.status).toBe(200);
    expect(createCalendarEvent).not.toHaveBeenCalled();
    expect(crmCalls).toHaveLength(0);
  });
});

describe('GET /api/calendar/availability', () => {
  test('answers with the host config the grid needs', async () => {
    const res = await request(app).get('/api/calendar/availability')
      .query({ host: 'anton', start: '2026-09-01T00:00:00Z', end: '2026-09-30T00:00:00Z' });
    expect(res.status).toBe(200);
    expect(res.body.host).toMatchObject({ key: 'anton', durationMin: 15, name: 'Anton Osipov' });
    expect(res.body.busySlots).toHaveLength(1);
  });

  test('never leaks the calendar address', async () => {
    const res = await request(app).get('/api/calendar/availability')
      .query({ host: 'anton', start: '2026-09-01T00:00:00Z', end: '2026-09-30T00:00:00Z' });
    expect(JSON.stringify(res.body)).not.toContain('anton@daveenci.ai');
  });

  test('reads each host own calendar', async () => {
    await request(app).get('/api/calendar/availability')
      .query({ host: 'astrid', start: '2026-09-01T00:00:00Z', end: '2026-09-30T00:00:00Z' });
    expect(getBusySlots.mock.calls[0][2]).toMatchObject({ calendarId: 'astrid@daveenci.ai' });
  });

  test('an unknown host falls back to Astrid rather than erroring', async () => {
    const res = await request(app).get('/api/calendar/availability')
      .query({ host: 'mallory', start: '2026-09-01T00:00:00Z', end: '2026-09-30T00:00:00Z' });
    expect(res.body.host.key).toBe('astrid');
  });
});

describe('POST /api/newsletter/subscribe', () => {
  test('forwards the subscription to the CRM intake', async () => {
    const res = await request(app).post('/api/newsletter/subscribe').set('Origin', ORIGIN)
      .send({ email: 'a@b.com', source: 'footer', website: '' });
    expect(res.status).toBe(200);
    expect(crmCalls[0].url).toContain('/form/newsletter');
    expect(crmCalls[0].body.email).toBe('a@b.com');
  });

  test('subscribes even when the legacy store is gone', async () => {
    subscribeToNewsletter.mockRejectedValueOnce(new Error('no such table'));
    const res = await request(app).post('/api/newsletter/subscribe').set('Origin', ORIGIN)
      .send({ email: 'a@b.com', website: '' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('still reports a duplicate subscription', async () => {
    subscribeToNewsletter.mockRejectedValueOnce(Object.assign(new Error('dup'), { code: '23505' }));
    const res = await request(app).post('/api/newsletter/subscribe').set('Origin', ORIGIN)
      .send({ email: 'a@b.com', website: '' });
    expect(res.status).toBe(409);
  });

  test('a rate-limited intake asks the visitor to try again later', async () => {
    stubCrm({ ok: false, status: 429, json: async () => ({}) });
    const res = await request(app).post('/api/newsletter/subscribe').set('Origin', ORIGIN)
      .send({ email: 'a@b.com', website: '' });
    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/try again/i);
  });
});
