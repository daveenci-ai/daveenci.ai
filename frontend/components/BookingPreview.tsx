import React, { useEffect, useMemo, useState } from 'react';
import { Clock, CalendarDays } from 'lucide-react';
import { fromZonedTime } from 'date-fns-tz';
import { Section, ScrollReveal, FolioHeader, Plate } from './Shared';
import AstridSketch from '../images/Astrid_Sketch.webp';
import { API_ENDPOINTS } from '../config';
import type { Page } from './types';
import {
  MEETING_DURATION_MINUTES,
  BUFFER_MINUTES,
  MIN_LEAD_HOURS,
  getAvailabilityRange,
  checkSlotAvailability,
  type BusySlot,
} from './calendarAvailability';

interface BookingPreviewProps {
  onNavigate: (page: Page) => void;
}

interface SlotDef {
  h: number;
  m: number;
}

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ET_ZONES = new Set(['America/New_York', 'America/Detroit', 'America/Toronto', 'America/Montreal', 'America/Indiana/Indianapolis']);
const CT_ZONES = new Set(['America/Chicago', 'America/Mexico_City', 'America/Winnipeg']);
const MT_ZONES = new Set(['America/Denver', 'America/Edmonton', 'America/Boise', 'America/Phoenix']);
const PT_ZONES = new Set(['America/Los_Angeles', 'America/Vancouver', 'America/Tijuana']);

// 7 slots per weekday within each timezone's min/max, at :00 or :30 only.
const ET_SLOTS: SlotDef[] = [
  { h: 9, m: 0 }, { h: 10, m: 0 }, { h: 11, m: 0 }, { h: 12, m: 0 },
  { h: 13, m: 0 }, { h: 14, m: 0 }, { h: 15, m: 0 },
];
const CT_SLOTS: SlotDef[] = [
  { h: 8, m: 0 }, { h: 9, m: 0 }, { h: 10, m: 0 }, { h: 11, m: 0 },
  { h: 12, m: 0 }, { h: 13, m: 0 }, { h: 14, m: 0 },
];
const MT_SLOTS: SlotDef[] = [
  { h: 7, m: 0 }, { h: 8, m: 0 }, { h: 9, m: 0 }, { h: 10, m: 0 },
  { h: 11, m: 0 }, { h: 12, m: 0 }, { h: 13, m: 0 },
];
const PT_SLOTS: SlotDef[] = [
  { h: 9, m: 0 }, { h: 9, m: 30 }, { h: 10, m: 0 }, { h: 10, m: 30 },
  { h: 11, m: 0 }, { h: 11, m: 30 }, { h: 12, m: 0 },
];

const getLocalSlots = (tz: string): SlotDef[] => {
  if (ET_ZONES.has(tz)) return ET_SLOTS;
  if (CT_ZONES.has(tz)) return CT_SLOTS;
  if (MT_ZONES.has(tz)) return MT_SLOTS;
  if (PT_ZONES.has(tz)) return PT_SLOTS;
  return CT_SLOTS;
};

const isWeekend = (day: number) => day === 0 || day === 6;
const pad = (n: number) => String(n).padStart(2, '0');

const BookingPreview: React.FC<BookingPreviewProps> = ({ onNavigate }) => {
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const localSlots = useMemo(() => getLocalSlots(userTimezone), [userTimezone]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { start, end } = getAvailabilityRange(new Date());
      try {
        const res = await fetch(`${API_ENDPOINTS.availability}?start=${start}&end=${end}`);
        if (res.ok) {
          const data = await res.json();
          setBusySlots(data.busySlots || []);
        }
      } catch {
        /* silent */
      }
    };
    fetchAvailability();
  }, []);

  const days = useMemo(() => {
    const result: { date: Date; slots: string[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minBookingTime = new Date(Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000);

    for (let offset = 0; result.length < 4 && offset < 30; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const slotsForDay = isWeekend(d.getDay()) ? localSlots.slice(0, 2) : localSlots;

      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const slots = slotsForDay.map(({ h, m: min }) => {
        const iso = `${y}-${pad(m)}-${pad(day)}T${pad(h)}:${pad(min)}:00`;
        return fromZonedTime(iso, userTimezone).toISOString();
      });

      if (!slots.some((iso) => new Date(iso) >= minBookingTime)) continue;

      result.push({ date: d, slots });
    }
    return result;
  }, [userTimezone, localSlots]);

  const handleSlotClick = (isoTime: string) => {
    try {
      sessionStorage.setItem('booking-preselect', JSON.stringify({ time: isoTime, ts: Date.now() }));
    } catch {
      /* ignore */
    }
    onNavigate('calendar');
  };

  const formatChip = (iso: string) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone,
    });

  const isSlotBusy = (iso: string) =>
    !checkSlotAvailability(iso, busySlots, MEETING_DURATION_MINUTES, BUFFER_MINUTES);

  return (
    <Section id="book" pattern="nodes" overflow={true} className="bg-white/50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 xl:gap-32 items-center">
        <div className="lg:col-span-5 lg:order-1 order-2 relative h-[560px] flex items-center justify-center">
          <ScrollReveal delay={300} direction="right" className="w-full flex justify-center">
            <Plate fig="vi" title="The Calendar">
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-serif italic text-[11px] tracking-[0.25em] uppercase text-accent">Next Available</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{userTimezone.replace(/_/g, ' ')}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {days.map(({ date, slots }) => (
                  <div key={date.toISOString()} className="border border-ink/10 rounded-sm bg-white/80 p-2 flex flex-col">
                    <div className="text-center mb-2 pb-1.5 border-b border-ink/5">
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">{WEEKDAY_SHORT[date.getDay()]}</div>
                      <div className="font-serif text-lg text-ink leading-none mt-0.5">{date.getDate()}</div>
                      <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted mt-0.5">{MONTH_SHORT[date.getMonth()]}</div>
                    </div>
                    <div className="space-y-1 mt-auto">
                      {slots.map((iso) => {
                        const busy = isSlotBusy(iso);
                        return (
                          <button
                            key={iso}
                            onClick={() => handleSlotClick(iso)}
                            disabled={busy}
                            className={`w-full text-center font-serif italic text-[11px] tracking-[0.03em] py-2 rounded-sm border transition-all ${
                              busy
                                ? 'text-ink-muted/40 border-ink/5 line-through cursor-not-allowed'
                                : 'text-ink border-ink/15 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-sm'
                            }`}
                          >
                            {formatChip(iso)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Plate>
          </ScrollReveal>

          <div className="absolute top-32 -left-4 md:-left-6 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float z-30">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-ink">30 min</span>
          </div>

          <div className="absolute bottom-2 -right-4 md:-right-6 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed z-30">
            <CalendarDays className="w-4 h-4 text-[#16a34a]" />
            <span className="text-xs font-medium text-ink">Live availability</span>
          </div>
        </div>

        <div className="lg:col-span-7 lg:order-2 order-1 relative z-20">
          <ScrollReveal delay={100}>
            <FolioHeader
              eyebrow="Folio VI — The Call"
              title={<>Thirty minutes.<br />No slide deck.</>}
              subtitle="Bring the workflow you want a specialist team for. Astrid will tell you honestly whether we're the right workshop to build it."
            />

            <div className="max-w-xl border-l border-ink/10 pl-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
                  <img src={AstridSketch} alt="Astrid Abrahamyan" loading="lazy" decoding="async" className="w-full h-full object-cover object-top scale-125 sepia-[0.15] contrast-105" />
                </div>
                <div>
                  <div className="font-serif text-lg text-ink leading-tight">Astrid Abrahamyan</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-1">Partner</div>
                </div>
              </div>

              <h4 className="font-serif text-xs text-ink uppercase tracking-[0.25em] mb-3">What we cover</h4>
              <ul className="space-y-2.5 text-ink-muted leading-relaxed">
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  The workflow or domain you want a team for
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Where specialist agents + human gates would fit
                </li>
                <li className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  Whether we're the right workshop to build it
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default BookingPreview;
