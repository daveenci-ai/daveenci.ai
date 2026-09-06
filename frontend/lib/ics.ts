export interface IcsEvent {
  title: string;
  description: string;
  start: string;
  durationMin: number;
  organizerEmail: string;
  attendeeEmail: string;
  url?: string;
  location?: string;
}

/** RFC 5545 escaping for TEXT values. Backslash first, or it double-escapes. */
const escapeText = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Content lines are limited to 75 octets; continuations start with a space. */
const encoder = new TextEncoder();

const fold = (line: string) => {
  const out: string[] = [];
  let current = '';
  let bytes = 0;

  for (const char of line) {
    const size = encoder.encode(char).length;
    // A continuation line spends one octet on its leading space.
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      out.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  out.push(current);

  return out.map((part, index) => (index === 0 ? part : ` ${part}`));
};

export const buildIcs = (event: IcsEvent): string => {
  const start = new Date(event.start);
  const end = new Date(start.getTime() + event.durationMin * 60000);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}@daveenci.ai`;

  const rows = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DaVeenci//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `ORGANIZER;CN=DaVeenci:mailto:${event.organizerEmail}`,
    `ATTENDEE;CN=Guest;RSVP=FALSE:mailto:${event.attendeeEmail}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  // Every content line ends with CRLF, the last one included.
  return `${rows.flatMap(fold).join('\r\n')}\r\n`;
};
