import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { fromZonedTime } from 'date-fns-tz';
import { MobileFolioScene } from './MobileFolioScene';
import AstridSketch from '../../images/Astrid_Sketch.jpg';
import { API_ENDPOINTS } from '../../config';
import type { Page } from '../types';
import {
  MEETING_DURATION_MINUTES,
  BUFFER_MINUTES,
  MIN_LEAD_HOURS,
  getAvailabilityRange,
  checkSlotAvailability,
  type BusySlot,
} from '../calendarAvailability';

interface MobileBookingProps {
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

// 7 slots per weekday within each timezone's min/max — same as desktop BookingPreview.
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

export const MobileBooking: React.FC<MobileBookingProps> = ({ onNavigate }) => {
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
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

  const activeDay = days[activeDayIdx];

  return (
    <MobileFolioScene id="book" eyebrow="Folio VI — The Call" className="bg-white/40">
      <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2">
        Thirty minutes.
        <br />
        <span className="italic text-ink-muted/70">No slide deck.</span>
      </h2>

      <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
        Bring the workflow you want a specialist team for. Astrid will tell you honestly whether we're the right workshop to build it.
      </p>

      {/* Astrid mini row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
          <img src={AstridSketch} alt="Astrid Abrahamyan" className="w-full h-full object-cover object-top scale-125 sepia-[0.15] contrast-105" />
        </div>
        <div>
          <div className="font-serif text-base text-ink leading-tight">Astrid Abrahamyan</div>
          <div className="flex items-center gap-2 mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            <Clock className="w-3 h-3" /> 30 min
            <span className="text-ink-muted/40">·</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      {days.length > 0 && (
        <>
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-serif italic text-[11px] tracking-[0.25em] uppercase text-accent">Next Available</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{userTimezone.replace(/_/g, ' ')}</span>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map(({ date }, i) => {
              const isActive = i === activeDayIdx;
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setActiveDayIdx(i)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center py-2 px-4 rounded-sm border transition-all ${
                    isActive
                      ? 'bg-accent/10 border-accent ring-1 ring-accent'
                      : 'bg-white/60 border-ink/10'
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{WEEKDAY_SHORT[date.getDay()]}</span>
                  <span className={`font-serif text-xl leading-none my-0.5 ${isActive ? 'text-ink font-semibold' : 'text-ink'}`}>
                    {date.getDate()}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{MONTH_SHORT[date.getMonth()]}</span>
                </button>
              );
            })}
          </div>

          {/* Time chips for active day */}
          {activeDay && (
            <div key={activeDay.date.toISOString()} className="grid grid-cols-3 gap-2 animate-in fade-in duration-200">
              {activeDay.slots.map((iso) => {
                const busy = isSlotBusy(iso);
                return (
                  <button
                    key={iso}
                    onClick={() => handleSlotClick(iso)}
                    disabled={busy}
                    className={`py-3 font-serif italic text-[13px] tracking-[0.03em] rounded-sm border transition-all ${
                      busy
                        ? 'text-ink-muted/40 border-ink/5 line-through cursor-not-allowed'
                        : 'text-ink border-ink/15 active:border-accent active:bg-accent/10 active:text-accent'
                    }`}
                  >
                    {formatChip(iso)}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </MobileFolioScene>
  );
};
