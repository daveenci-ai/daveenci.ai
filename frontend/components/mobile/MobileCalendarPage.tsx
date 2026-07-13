import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Clock, Mail, Phone, User, Briefcase, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { CustomSelect, FormField } from '../Shared';
import { MobileButton } from './MobileButton';
import { MobileErrorBoundary } from './MobileErrorBoundary';
import AstridSketch from '../../images/Astrid_Sketch.webp';
import { API_ENDPOINTS } from '../../config';
import { track } from '../../lib/analytics';
import type { CalendarProps } from '../types';
import {
  BUSINESS_TIMEZONE,
  BUSINESS_HOURS,
  MEETING_DURATION_MINUTES,
  BUFFER_MINUTES,
  MONTH_NAMES,
  buildDisplaySlots,
  getAvailabilityRange,
  checkSlotAvailability as checkSharedSlotAvailability,
  isDayDisabled,
} from '../calendarAvailability';

type Step = 'datetime' | 'details' | 'success';

export const MobileCalendarPage: React.FC<CalendarProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<Step>('datetime');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    reason: 'Multiple areas (we will prioritize together)',
    notes: '',
  });

  const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [displaySlots, setDisplaySlots] = useState<{ display: string; value: string; localTime: string }[]>([]);
  const [busySlots, setBusySlots] = useState<{ start: string; end: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const calendarStartTracked = useRef(false);

  const trackCalendarStart = () => {
    if (calendarStartTracked.current) return;
    calendarStartTracked.current = true;
    track('calendar_start', { booking_type: 'meet-astrid' });
  };

  // Apply sessionStorage preselect from landing
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('booking-preselect');
      if (!raw) return;
      sessionStorage.removeItem('booking-preselect');
      const { time, ts } = JSON.parse(raw);
      if (typeof time !== 'string' || Date.now() - ts > 5 * 60 * 1000) return;
      const d = new Date(time);
      if (isNaN(d.getTime())) return;
      setCurrentDate(d);
      setSelectedDate(d);
      setSelectedTime(time);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setDisplaySlots([]);
      return;
    }
    setDisplaySlots(buildDisplaySlots(selectedDate, USER_TIMEZONE, BUSINESS_HOURS, BUSINESS_TIMEZONE));
  }, [selectedDate]);

  const fetchAvailability = async () => {
    setIsLoading(true);
    const { start, end } = getAvailabilityRange(currentDate);
    try {
      const response = await fetch(`${API_ENDPOINTS.availability}?start=${start}&end=${end}`);
      if (!response.ok) throw new Error(`Availability request failed (${response.status})`);
      const data = await response.json();
      setBusySlots(data.busySlots);
      setAvailabilityError(null);
    } catch (error) {
      if (import.meta.env.DEV) console.debug('[calendar] Live availability unavailable', error);
      setAvailabilityError("We couldn't load live availability. Times shown may not reflect current bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const { days, firstDay } = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      days: new Date(year, month + 1, 0).getDate(),
      firstDay: new Date(year, month, 1).getDay(),
    };
  })();

  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  const handleDateClick = (day: number) => {
    trackCalendarStart();
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null);
    fetchAvailability();
  };

  const isDateDisabled = (day: number) =>
    isDayDisabled(day, currentDate, busySlots, BUSINESS_HOURS, BUSINESS_TIMEZONE, MEETING_DURATION_MINUTES, BUFFER_MINUTES);

  const isTimeDisabled = (slotIso: string) =>
    !checkSharedSlotAvailability(slotIso, busySlots, MEETING_DURATION_MINUTES, BUFFER_MINUTES);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.book, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, dateTime: selectedTime, bookingType: 'meet-astrid' }),
      });
      const data = await response.json();
      if (response.ok) {
        track('generate_lead', { booking_type: 'meet-astrid' });
        setStep('success');
      } else if (response.status === 409 && data.isDuplicate) {
        alert(data.error || 'You already have a meeting scheduled at this time.');
        fetchAvailability();
        setStep('datetime');
        setSelectedTime(null);
      } else {
        console.error('Booking failed:', data.error);
        alert(data.error || 'Failed to book the call. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('datetime');
    else onNavigate('landing');
  };

  const canProceedFromDatetime = Boolean(selectedDate && selectedTime);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-base text-ink" data-mobile>
      {/* Top bar: back + step indicator */}
      <header className="sticky top-0 z-40 bg-base/90 backdrop-blur-md border-b border-ink/10 px-4 py-3 flex items-center gap-4">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="w-10 h-10 flex items-center justify-center -ml-2"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <div className="flex-1 flex items-center gap-2 font-serif italic text-[12px] tracking-[0.12em]">
          <span className={step === 'datetime' ? 'text-accent' : step === 'success' ? 'text-green-700' : 'text-green-700'}>
            <span className="text-[10px] tracking-[0.2em]">i.</span> Time
          </span>
          <span className="text-ink-muted/30">·</span>
          <span className={step === 'details' ? 'text-accent' : step === 'success' ? 'text-green-700' : 'text-ink-muted/40'}>
            <span className="text-[10px] tracking-[0.2em]">ii.</span> Details
          </span>
          <span className="text-ink-muted/30">·</span>
          <span className={step === 'success' ? 'text-accent' : 'text-ink-muted/40'}>
            <span className="text-[10px] tracking-[0.2em]">iii.</span> Confirm
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto pb-28">
      <MobileErrorBoundary>
        {step === 'datetime' && (
          <div className="px-5 pt-6">
            {/* Intro strip */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
                <img src={AstridSketch} alt="Astrid Abrahamyan" decoding="async" className="w-full h-full object-cover object-top scale-125 sepia-[0.15] contrast-105" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Discovery Call</div>
                <h1 className="font-serif text-xl text-ink leading-tight">Talk to us.</h1>
                <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted font-serif italic">
                  <Clock className="w-3 h-3" /> 30 min
                  <span className="text-ink-muted/40">·</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Available
                  </span>
                </div>
              </div>
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif italic text-xl text-ink">
                {MONTH_NAMES[currentDate.getMonth()]} <span className="text-ink-muted">{currentDate.getFullYear()}</span>
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }}
                  className="w-9 h-9 flex items-center justify-center border border-ink/10 rounded-sm text-ink-muted active:border-accent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }}
                  className="w-9 h-9 flex items-center justify-center border border-ink/10 rounded-sm text-ink-muted active:border-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day-of-week header */}
            <div className="grid grid-cols-7 gap-1 text-center font-serif italic text-[10px] tracking-[0.2em] text-ink-muted/60 uppercase mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {blanksArray.map((_, i) => (
                <div key={`b-${i}`} className="aspect-square" />
              ))}
              {daysArray.map((day) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const disabled = isDateDisabled(day);
                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => !disabled && handleDateClick(day)}
                    className={`aspect-square rounded-sm font-serif text-sm transition-all ${
                      isSelected
                        ? 'bg-accent/10 text-ink font-semibold ring-1 ring-accent'
                        : disabled
                        ? 'text-ink-muted/25'
                        : 'text-ink active:bg-accent/10'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Error alert */}
            {availabilityError && (
              <div role="alert" className="mb-4 text-xs font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-sm px-3 py-2 flex items-start gap-3">
                <span className="flex-1 leading-relaxed">{availabilityError}</span>
                <button onClick={fetchAvailability} type="button" className="not-italic font-sans text-amber-900 underline font-medium shrink-0">
                  Retry
                </button>
              </div>
            )}

            {/* Times */}
            <div className="border-t border-ink/10 pt-6">
              <h4 className="font-serif italic text-base text-ink mb-4 text-center">
                {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Choose a date.'}
              </h4>

              {selectedDate && (
                isLoading ? (
                  <div className="flex flex-col items-center py-8 text-ink-muted/60">
                    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3" />
                    <span className="font-serif italic text-sm">Checking availability…</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {displaySlots.filter((slot) => !isTimeDisabled(slot.value)).map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => {
                          trackCalendarStart();
                          setSelectedTime(slot.value);
                        }}
                        className={`py-2.5 font-serif italic text-sm border rounded-sm transition-all ${
                          selectedTime === slot.value
                            ? 'bg-accent/10 text-accent border-accent ring-1 ring-accent'
                            : 'bg-white/60 border-ink/10 text-ink active:border-accent active:text-accent'
                        }`}
                      >
                        {slot.display}
                      </button>
                    ))}
                  </div>
                )
              )}

              {!selectedDate && (
                <p className="text-center text-ink-muted/60 font-serif italic text-sm py-6">
                  Available times will appear once you pick a date.
                </p>
              )}
            </div>
          </div>
        )}

        {step === 'details' && (
          <form id="booking-form" onSubmit={handleSubmit} className="px-5 pt-6 space-y-4">
            <h2 className="font-serif text-2xl text-ink mb-2">Your details.</h2>
            <p className="text-ink-muted text-sm mb-6">
              {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              {selectedTime && ` · ${format(new Date(selectedTime), 'hh:mm a')}`}
            </p>

            <FormField
              label="Full name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              placeholder="Leonardo da Vinci"
              icon={<User className="w-3 h-3" />}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              placeholder="leo@florence.it"
              icon={<Mail className="w-3 h-3" />}
            />
            <FormField
              label="Company"
              name="company"
              type="text"
              value={formData.company}
              onChange={(val) => setFormData({ ...formData, company: val })}
              placeholder="Florence Inc."
              icon={<Briefcase className="w-3 h-3" />}
              optionalLabel="(optional)"
            />
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(val) => setFormData({ ...formData, phone: val })}
              placeholder="+1 555..."
              icon={<Phone className="w-3 h-3" />}
              optionalLabel="(optional)"
            />
            <CustomSelect
              label="What brings you here?"
              required
              value={formData.reason}
              onChange={(val) => setFormData({ ...formData, reason: val })}
              icon={<HelpCircle className="w-3 h-3" />}
              options={[
                'I have a specific workflow I want a team for',
                "I'm exploring — want to see if specialist AI teams fit my work",
                'I read the thesis and want to discuss it',
                "Something else — I'll explain on the call",
              ]}
            />
            <FormField
              label="Anything else?"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={(val) => setFormData({ ...formData, notes: val })}
              placeholder="Optional — feel free to share context or questions..."
              icon={<HelpCircle className="w-3 h-3" />}
              rows={4}
            />
          </form>
        )}

        {step === 'success' && (
          <div className="px-5 pt-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-serif text-3xl text-ink mb-3">You're on the calendar.</h2>
            <p className="text-ink-muted text-base mb-8 max-w-sm">
              A calendar invitation is on its way to your inbox. Looking forward to the conversation.
            </p>
            <div className="w-full bg-white/60 border border-ink/10 p-5 rounded-sm mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ink-muted">Date</span>
                <span className="font-medium text-ink">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Time</span>
                <span className="font-medium text-ink">{selectedTime ? format(new Date(selectedTime), 'hh:mm a') : ''}</span>
              </div>
            </div>
          </div>
        )}
      </MobileErrorBoundary>
      </main>

      {/* Sticky bottom CTA */}
      {step !== 'success' && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-base/95 backdrop-blur-md border-t border-ink/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          {step === 'datetime' && (
            <MobileButton
              onClick={() => canProceedFromDatetime && setStep('details')}
              disabled={!canProceedFromDatetime}
            >
              Continue
            </MobileButton>
          )}
          {step === 'details' && (
            <MobileButton type="submit" form="booking-form">
              Book the call
            </MobileButton>
          )}
        </div>
      )}

      {step === 'success' && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-base/95 backdrop-blur-md border-t border-ink/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <MobileButton variant="dark" onClick={() => onNavigate('landing')}>
            Return home
          </MobileButton>
        </div>
      )}
    </div>
  );
};
