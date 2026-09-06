import React, { useMemo } from 'react';
import { Globe } from 'lucide-react';
import { buildIcs } from '../lib/ics';

const FALLBACK_ZONES = [
  'America/Los_Angeles', 'America/Denver', 'America/Edmonton', 'America/Chicago',
  'America/New_York', 'America/Toronto', 'America/Vancouver', 'Europe/London',
  'Europe/Berlin', 'Europe/Madrid', 'Asia/Yerevan', 'Asia/Dubai', 'UTC',
];

/**
 * Times are meaningless without a zone, and a visitor whose device zone is
 * wrong needs a way to correct it before they pick a slot.
 */
export const TimezonePicker: React.FC<{
  value: string;
  onChange: (timezone: string) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  const zones = useMemo(() => {
    let all: string[] = FALLBACK_ZONES;
    try {
      const supported = (Intl as any).supportedValuesOf?.('timeZone');
      if (Array.isArray(supported) && supported.length) all = supported;
    } catch {
      /* older browsers keep the short list */
    }
    return all.includes(value) ? all : [value, ...all];
  }, [value]);

  return (
    <label className={`inline-flex items-center gap-2 text-ink-muted ${className}`}>
      <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">Time zone</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-serif italic text-sm text-ink-muted border-b border-ink/15 hover:border-accent focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-0.5 max-w-[16rem]"
      >
        {zones.map((zone) => (
          <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
        ))}
      </select>
    </label>
  );
};

export interface ConfirmedBooking {
  title: string;
  start: string;
  durationMin: number;
  hostEmail: string;
  attendeeEmail: string;
  description: string;
}

/** Hand the visitor an .ics so the meeting lands in whatever calendar they use. */
export const downloadIcs = (booking: ConfirmedBooking) => {
  const ics = buildIcs({
    title: booking.title,
    description: booking.description,
    start: booking.start,
    durationMin: booking.durationMin,
    organizerEmail: booking.hostEmail,
    attendeeEmail: booking.attendeeEmail,
    url: 'https://daveenci.ai',
  });

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'daveenci-call.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
