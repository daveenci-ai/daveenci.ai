import { describe, test, expect } from 'vitest';
import { buildIcs } from '../frontend/lib/ics';

const event = {
  title: '15 minutes with Anton',
  description: 'Module call with DaVeenci.',
  start: '2026-09-09T13:30:00.000Z',
  durationMin: 15,
  organizerEmail: 'anton@daveenci.ai',
  attendeeEmail: 'katie@example.com',
  url: 'https://daveenci.ai/book/anton',
};

const lines = (ics: string) => ics.split('\r\n');

describe('ics calendar file', () => {
  test('is a single well-formed VEVENT', () => {
    const out = lines(buildIcs(event));
    expect(out[0]).toBe('BEGIN:VCALENDAR');
    expect(out.filter((l) => l !== '').at(-1)).toBe('END:VCALENDAR');
    expect(out.filter((l) => l === 'BEGIN:VEVENT')).toHaveLength(1);
    expect(out).toContain('VERSION:2.0');
  });

  test('uses CRLF line endings as the spec requires', () => {
    const ics = buildIcs(event);
    expect(ics).toContain('\r\n');
    expect(ics.split('\n').every((l) => l === '' || l.endsWith('\r'))).toBe(true);
  });

  test('stamps start and end in UTC basic format from the duration', () => {
    const out = lines(buildIcs(event));
    expect(out).toContain('DTSTART:20260909T133000Z');
    expect(out).toContain('DTEND:20260909T134500Z');
  });

  test('a 30-minute meeting ends 30 minutes later', () => {
    expect(lines(buildIcs({ ...event, durationMin: 30 }))).toContain('DTEND:20260909T140000Z');
  });

  test('carries the summary, organizer and attendee', () => {
    const ics = buildIcs(event);
    expect(ics).toContain('SUMMARY:15 minutes with Anton');
    expect(ics).toContain('ORGANIZER;CN=DaVeenci:mailto:anton@daveenci.ai');
    expect(ics).toContain('mailto:katie@example.com');
  });

  test('escapes commas, semicolons, backslashes and newlines in text', () => {
    const ics = buildIcs({ ...event, description: 'One, two; three\\four\nfive' });
    expect(ics).toContain('DESCRIPTION:One\\, two\; three\\\\four\\nfive');
  });

  test('gives every file a unique UID on the daveenci.ai domain', () => {
    const a = buildIcs(event).match(/UID:(.+)/)![1];
    const b = buildIcs(event).match(/UID:(.+)/)![1];
    expect(a).toMatch(/@daveenci\.ai$/);
    expect(a).not.toBe(b);
  });

  test('folds long lines so strict clients accept the file', () => {
    const ics = buildIcs({ ...event, description: 'x'.repeat(400) });
    for (const line of lines(ics)) {
      expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
    }
  });
});
