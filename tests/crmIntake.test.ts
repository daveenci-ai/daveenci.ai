import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { postToCrm, CRM_INTAKE_BASE_URL } from '../backend/src/services/crmIntake';

let calls: Array<{ url: string; init: any }>;

const stubFetch = (impl: (url: string, init: any) => any) => {
  vi.stubGlobal('fetch', vi.fn(async (url: any, init: any) => {
    calls.push({ url: String(url), init });
    return impl(String(url), init);
  }));
};

const okResponse = () => ({ ok: true, status: 200, json: async () => ({ ok: true }) });

beforeEach(() => { calls = []; });
afterEach(() => { vi.unstubAllGlobals(); });

describe('CRM intake post', () => {
  test('posts bookings to the booking endpoint', async () => {
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie' });
    expect(calls[0].url).toBe(`${CRM_INTAKE_BASE_URL}/form/booking`);
  });

  test('posts event registrations and the newsletter to their own endpoints', async () => {
    stubFetch(okResponse);
    await postToCrm('event', { email: 'a@b.com' });
    await postToCrm('newsletter', { email: 'a@b.com' });
    expect(calls.map((c) => c.url)).toEqual([
      `${CRM_INTAKE_BASE_URL}/form/event`,
      `${CRM_INTAKE_BASE_URL}/form/newsletter`,
    ]);
  });

  test('sends JSON with the daveenci.ai Origin the endpoint expects', async () => {
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie' });
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.headers['Content-Type']).toBe('application/json');
    expect(calls[0].init.headers['Origin']).toBe('https://daveenci.ai');
  });

  test('sends every value as a string', async () => {
    stubFetch(okResponse);
    await postToCrm('booking', { duration_min: 15, name: 'Katie' });
    const body = JSON.parse(calls[0].init.body);
    expect(body.duration_min).toBe('15');
    expect(body.name).toBe('Katie');
  });

  test('drops absent fields but keeps the empty honeypot', async () => {
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie', phone: undefined, notes: null, website: '' });
    const body = JSON.parse(calls[0].init.body);
    expect(body).not.toHaveProperty('phone');
    expect(body).not.toHaveProperty('notes');
    expect(body.website).toBe('');
  });

  test('reports failure instead of throwing when the endpoint is unreachable', async () => {
    stubFetch(() => { throw new Error('ECONNREFUSED'); });
    await expect(postToCrm('booking', { name: 'Katie' })).resolves.toMatchObject({ ok: false });
  });

  test('reports failure instead of throwing on a server error', async () => {
    stubFetch(() => ({ ok: false, status: 500, json: async () => ({}) }));
    const result = await postToCrm('booking', { name: 'Katie' });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(500);
  });

  test('flags a 429 so the caller can say "try again in a while"', async () => {
    stubFetch(() => ({ ok: false, status: 429, json: async () => ({}) }));
    const result = await postToCrm('newsletter', { email: 'a@b.com' });
    expect(result.rateLimited).toBe(true);
  });

  test('authenticates with the shared secret so the worker trusts the forwarded IP', async () => {
    process.env.GO_FORM_SECRET = 's3cret';
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie' }, { clientIp: '203.0.113.7' });
    expect(calls[0].init.headers['Authorization']).toBe('Bearer s3cret');
    delete process.env.GO_FORM_SECRET;
  });

  test('sends no Authorization header at all when the secret is unset', async () => {
    delete process.env.GO_FORM_SECRET;
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie' });
    // "Bearer undefined" would read as a bad credential rather than none.
    expect(calls[0].init.headers).not.toHaveProperty('Authorization');
  });

  test('forwards the visitor IP so the rate limit keys on them, not on Vercel', async () => {
    stubFetch(okResponse);
    await postToCrm('booking', { name: 'Katie' }, { clientIp: '203.0.113.7' });
    expect(calls[0].init.headers['X-Forwarded-For']).toBe('203.0.113.7');
  });
});
