import { describe, expect, it } from 'vitest';
import { CAMPAIGN_TTL_MS, parseCampaign, readCampaign, rememberCampaign } from '../frontend/lib/campaign';
import { buildBookingIntake } from '../backend/src/lib/bookingIntake';
import { getHost } from '../backend/src/hosts';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

const AD = '?utm_source=linkedin&utm_medium=paid_social&utm_campaign=Shoot%20Ops%20%7C%20Intake%20%7C%202026-10&utm_content=video-a&li_fat_id=abc-123';

describe('campaign capture', () => {
  it('reads utm_* and click ids off an ad landing URL', () => {
    expect(parseCampaign(AD)).toEqual({
      utm_source: 'linkedin', utm_medium: 'paid_social', utm_campaign: 'Shoot Ops | Intake | 2026-10', utm_content: 'video-a', li_fat_id: 'abc-123',
    });
  });

  it('ignores unknown params and strips markup', () => {
    expect(parseCampaign('?utm_source=<script>x</script>&foo=bar&fbclid=bad%20id')).toEqual({ utm_source: 'scriptx/script' });
  });

  it('survives a later visit without parameters (the booking can come days later)', () => {
    const s = memoryStorage();
    rememberCampaign(AD, s, 1_000);
    expect(rememberCampaign('', s, 2_000).utm_source).toBe('linkedin');
  });

  it('is last-touch: a newer tagged visit replaces the older one entirely', () => {
    const s = memoryStorage();
    rememberCampaign(AD, s, 1_000);
    rememberCampaign('?utm_source=facebook&utm_medium=paid_social&fbclid=xyz', s, 2_000);
    expect(readCampaign(s, 3_000)).toEqual({ utm_source: 'facebook', utm_medium: 'paid_social', fbclid: 'xyz' });
  });

  it('expires after 90 days', () => {
    const s = memoryStorage();
    rememberCampaign(AD, s, 0);
    expect(readCampaign(s, CAMPAIGN_TTL_MS - 1).utm_source).toBe('linkedin');
    expect(readCampaign(s, CAMPAIGN_TTL_MS + 1)).toEqual({});
  });
});

describe('campaign fields reach the CRM booking payload', () => {
  process.env.GOOGLE_CALENDAR_ID_ANTON = 'anton@daveenci.ai';
  const anton = getHost('anton')!;
  const body = { name: 'A', email: 'a@example.com', dateTime: '2026-09-09T13:30:00.000Z', src: 'site' };

  it('adds the cleaned campaign fields when present', () => {
    const p = buildBookingIntake(anton, { ...body, ...parseCampaign(AD) });
    expect(p.utm_source).toBe('linkedin');
    expect(p.utm_campaign).toBe('Shoot Ops | Intake | 2026-10');
    expect(p.li_fat_id).toBe('abc-123');
  });

  it('adds nothing for a plain booking (the documented payload is unchanged)', () => {
    const p = buildBookingIntake(anton, body);
    expect(Object.keys(p).some((k) => k.startsWith('utm_') || ['gclid', 'fbclid', 'li_fat_id'].includes(k))).toBe(false);
  });

  it('drops a forged click id', () => {
    expect(buildBookingIntake(anton, { ...body, gclid: 'x"><img src=x>' }).gclid).toBeUndefined();
  });
});
