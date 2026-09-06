
import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, User, Briefcase, HelpCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { Logo, Button, VitruvianBackground, ScrollReveal, CustomSelect, FormField } from './Shared';
import type { CalendarProps } from './types';
import { API_ENDPOINTS } from '../config';
import {
   MONTH_NAMES,
   buildDisplaySlots,
   getAvailabilityRange,
   checkSlotAvailability as checkSharedSlotAvailability,
   isDayDisabled,
   hostSlotConfig,
   type SlotConfig,
   type DisplaySlot,
} from './calendarAvailability';
import { BOOKING_HOSTS } from './bookingHosts';
import { readAttribution } from '../lib/attribution';
import { TimezonePicker, downloadIcs } from './BookingBits';

// Shown as the .ics organizer only; the real invite comes from Google.
const HOST_EMAIL = 'anton@daveenci.ai';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileCalendarPage } from './mobile/MobileCalendarPage';
import { track } from '../lib/analytics';
import { useBookingStepAnalytics } from '../lib/useBookingStepAnalytics';

const Calendar: React.FC<CalendarProps> = (props) => {
   const isMobile = useIsMobile();
   if (isMobile) return <MobileCalendarPage {...props} />;
   return <CalendarDesktop {...props} />;
};

const CalendarDesktop: React.FC<CalendarProps> = ({ onNavigate, host = 'astrid' }) => {
   const copy = BOOKING_HOSTS[host];
   const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [selectedTime, setSelectedTime] = useState<string | null>(null); // Stores ISO string

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
      phone: '',
      reason: copy.defaultReason,
      notes: '',
      // Honeypot: a person never sees this, a bot fills it in.
      website: ''
   });

   const [userTimezone, setUserTimezone] = useState(
      () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
   );
   // The server owns duration, hours and buffers; this renders the grid until
   // the availability response lands and if it fails.
   const [slotConfig, setSlotConfig] = useState<SlotConfig>(() => hostSlotConfig(host));

   const [displaySlots, setDisplaySlots] = useState<DisplaySlot[]>([]);

   const calendarStartFired = useRef(false);
   const trackDetailsViewed = useBookingStepAnalytics(copy.key);
   const trackCalendarStart = () => {
      if (calendarStartFired.current) return;
      calendarStartFired.current = true;
      track('calendar_start', { booking_type: copy.key });
   };

   // Apply pre-selection handed off from the landing page booking preview
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
         /* ignore malformed preselect */
      }
   }, []);

   useEffect(() => {
      if (!selectedDate) {
         setDisplaySlots([]);
         return;
      }
      setDisplaySlots(buildDisplaySlots(selectedDate, userTimezone, slotConfig));
   }, [selectedDate, userTimezone, slotConfig]);

   const monthNames = MONTH_NAMES;

   // Calendar Logic
   const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const days = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      return { days, firstDay };
   };

   const { days, firstDay } = getDaysInMonth(currentDate);
   const daysArray = Array.from({ length: days }, (_, i) => i + 1);
   const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

   const handleDateClick = (day: number) => {
      trackCalendarStart();
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
      // Reset time when date changes
      setSelectedTime(null);
      // Refresh availability when selecting a date
      fetchAvailability();
   };

   const [busySlots, setBusySlots] = useState<{ start: string, end: string }[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [availabilityError, setAvailabilityError] = useState<string | null>(null);

   // Fetch availability function (reusable)
   const fetchAvailability = async () => {
      setIsLoading(true);
      const { start, end } = getAvailabilityRange(currentDate);

      try {
         const response = await fetch(`${API_ENDPOINTS.availability}?host=${host}&start=${start}&end=${end}`);
         if (!response.ok) {
            throw new Error(`Availability request failed (${response.status})`);
         }
         const data = await response.json();
         setBusySlots(data.busySlots);
         if (data.host) {
            setSlotConfig({
               durationMin: data.host.durationMin,
               bufferMin: data.host.bufferMin,
               minLeadHours: data.host.minLeadHours,
               timezone: data.host.timezone,
               businessHours: data.host.businessHours,
               businessDays: data.host.businessDays,
            });
         }
         setAvailabilityError(null);
      } catch (error) {
         if (import.meta.env.DEV) console.debug('[calendar] Live availability unavailable', error);
         setAvailabilityError("We couldn't load live availability. Times shown may not reflect current bookings.");
      } finally {
         setIsLoading(false);
      }
   };

   // Fetch on mount
   useEffect(() => {
      fetchAvailability();
   }, []);

   const checkSlotAvailability = (slotIsoTime: string) =>
      checkSharedSlotAvailability(slotIsoTime, busySlots, slotConfig);

   const isDateDisabled = (day: number) => isDayDisabled(day, currentDate, busySlots, slotConfig);

   const isTimeDisabled = (slotIso: string) => {
      return !checkSlotAvailability(slotIso);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const response = await fetch(API_ENDPOINTS.book, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               ...formData,
               dateTime: selectedTime, // Send ISO string
               host,
               timezone: userTimezone,
               ...readAttribution(),
               page: `/book/${host}`,
            }),
         });

         const data = await response.json();

         if (response.ok) {
            track('generate_lead', { booking_type: copy.key });
            setStep('success');
         } else if (response.status === 429) {
            alert('Too many submissions from your network. Please try again in a while.');
         } else if (response.status === 409 && data.isDuplicate) {
            // Already booked - show friendly message and refresh availability
            alert(data.error || 'You already have a meeting scheduled at this time.');
            // Refresh availability to update the calendar
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const start = new Date(year, month, 1).toISOString();
            const end = new Date(year, month + 1, 0).toISOString();
            const availResponse = await fetch(`${API_ENDPOINTS.availability}?host=${host}&start=${start}&end=${end}`);
            if (availResponse.ok) {
               const availData = await availResponse.json();
               setBusySlots(availData.busySlots);
            }
            // Go back to time selection
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

   return (
      <div className="min-h-screen bg-canvas font-sans text-ink selection:bg-accent/20 flex flex-col">
         <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden min-h-screen">
            <VitruvianBackground className="opacity-[0.08] fixed" />

            <div className="relative z-10 w-full max-w-6xl">
               <ScrollReveal immediate>
                  <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-ink/10 border border-ink/10 rounded-sm overflow-hidden flex flex-col lg:flex-row min-h-[780px]">

                     {/* Left Panel: Context & Agenda - Increased Width */}
                     <div className="w-full lg:w-5/12 bg-white/40 border-b lg:border-b-0 lg:border-r border-ink/10 p-8 lg:p-12 flex flex-col relative">
                        <div className="mb-8">
                           <button
                              type="button"
                              onClick={() => onNavigate('landing')}
                              aria-label="Return to homepage"
                              className="group mb-8 inline-block"
                           >
                              <Logo className="w-12 h-12 text-ink group-hover:text-accent transition-colors duration-300" />
                           </button>
                           <div className="flex items-center gap-3 mb-5">
                              <span className="h-px w-8 bg-ink-muted/30" />
                              <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">{copy.eyebrow}</span>
                           </div>
                           <h1 className="font-serif text-4xl lg:text-5xl text-ink leading-[1.05] mb-6">{copy.lead} <em className="italic text-accent">{copy.leadEmphasis}</em></h1>

                           <div className="flex items-center gap-6 font-serif italic text-sm text-ink-muted mb-8">
                              <span className="flex items-center gap-2">
                                 <Clock className="w-4 h-4" /> {copy.durationLabel}
                              </span>
                              <span className="flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available
                              </span>
                           </div>

                           <p className="text-ink-muted leading-relaxed mb-8 font-serif">{copy.blurb}</p>

                           <div className="flex items-center gap-4 py-6 border-y border-ink/5 mb-6">
                              <div className="w-20 h-20 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
                                 <img src={copy.portrait} alt={copy.name} decoding="async" className="w-full h-full object-cover object-top scale-125" />
                              </div>
                              <div>
                                 <div className="font-serif text-ink text-lg leading-none mb-1">{copy.name}</div>
                                 <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">{copy.role}</div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-auto">
                           <h3 className="font-serif italic text-xs text-ink uppercase tracking-[0.25em] mb-4">{copy.agendaTitle}</h3>
                           <ol className="space-y-4 border-l border-ink/10 pl-5">
                              {copy.agenda.map((item, i) => (
                                 <li key={item} className="flex gap-4 items-baseline text-sm text-ink-muted leading-relaxed">
                                    <span className="font-serif italic text-accent tracking-[0.1em] flex-shrink-0 w-4 text-right">{['i.', 'ii.', 'iii.', 'iv.'][i]}</span>
                                    <span>{item}</span>
                                 </li>
                              ))}
                           </ol>

                           <div className="mt-8 pt-6 border-t border-ink/10">
                              <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} className="font-serif italic text-xs text-accent tracking-[0.2em] uppercase hover:text-ink transition-colors inline-flex items-center gap-2">
                                 <span className="h-px w-6 bg-accent/40" />
                                 www.daveenci.ai
                              </a>
                           </div>
                        </div>
                     </div>

                     {/* Right Panel: Interactive Flow - Adjusted Width */}
                     <div className="w-full lg:w-7/12 bg-white relative">
                        {step === 'success' ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                                 <Check className="w-10 h-10 text-green-600" />
                              </div>
                              <h2 className="font-serif text-3xl text-ink mb-2">You're on the calendar.</h2>
                              <p className="text-ink-muted text-lg mb-8 max-w-md">{copy.confirmation}</p>
                              <div className="bg-canvas/50 p-6 rounded-sm border border-ink/5 w-full max-w-sm mb-8">
                                 <div className="flex justify-between text-sm mb-2">
                                    <span className="text-ink-muted">Date</span>
                                    <span className="font-medium text-ink">{selectedDate?.toLocaleDateString()}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                    <span className="text-ink-muted">Time</span>
                                    <span className="font-medium text-ink">
                                       {selectedTime
                                          ? `${new Date(selectedTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: userTimezone })} · ${userTimezone}`
                                          : ''}
                                    </span>
                                 </div>

                                 {formData.notes && (
                                    <div className="mt-4 pt-4 border-t border-ink/5">
                                       <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                                          <HelpCircle className="w-3 h-3" /> Anything else we should know?
                                       </label>
                                       <p className="text-sm text-ink-muted text-left">{formData.notes}</p>
                                    </div>
                                 )}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3">
                                 <Button
                                    variant="primary"
                                    onClick={() => selectedTime && downloadIcs({
                                       title: copy.eventTitle,
                                       start: selectedTime,
                                       durationMin: slotConfig.durationMin,
                                       hostEmail: HOST_EMAIL,
                                       attendeeEmail: formData.email,
                                       description: copy.blurb,
                                    })}
                                 >
                                    Add to calendar
                                 </Button>
                                 <Button variant="secondary" onClick={() => onNavigate('landing')}>Return to Homepage</Button>
                              </div>
                           </div>
                        ) : (
                           <div className="p-8 lg:p-12 h-full flex flex-col justify-center items-center">

                              {/* Progress Bar */}
                              <div className="w-full max-w-md flex items-center gap-5 mb-8 font-serif italic text-sm tracking-[0.1em]">
                                 <span className={`inline-flex items-baseline gap-1.5 pb-1 border-b transition-colors ${step === 'datetime' ? 'text-accent border-accent' : 'text-green-700 border-green-700'}`}>
                                    <span className="text-[11px] tracking-[0.2em]">i.</span> Time
                                 </span>
                                 <span className="text-ink-muted/30">·</span>
                                 <span className={`inline-flex items-baseline gap-1.5 pb-1 border-b transition-colors ${step === 'details' ? 'text-accent border-accent' : 'text-ink-muted/40 border-transparent'}`}>
                                    <span className="text-[11px] tracking-[0.2em]">ii.</span> Details
                                 </span>
                              </div>

                              {step === 'datetime' && (
                                 <div className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                                    {/* Calendar */}
                                    <div className="mb-8">
                                       <div className="flex items-center justify-between mb-6">
                                          <h3 className="font-serif italic text-2xl text-ink">
                                             {monthNames[currentDate.getMonth()]} <span className="text-ink-muted">{currentDate.getFullYear()}</span>
                                          </h3>
                                          <div className="flex gap-1.5">
                                             <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="w-8 h-8 flex items-center justify-center border border-ink/10 rounded-sm text-ink-muted hover:border-accent hover:text-accent transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                             <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="w-8 h-8 flex items-center justify-center border border-ink/10 rounded-sm text-ink-muted hover:border-accent hover:text-accent transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                          </div>
                                       </div>
                                       <div className="grid grid-cols-7 gap-2 text-center font-serif italic text-[10px] tracking-[0.2em] text-ink-muted/60 uppercase mb-3">
                                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                                       </div>
                                       <div className="grid grid-cols-7 gap-2">
                                          {blanksArray.map((_, i) => <div key={`b-${i}`} className="w-10 h-10" />)}
                                          {daysArray.map(day => {
                                             const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                             const isSelected = selectedDate?.toDateString() === date.toDateString();
                                             const disabled = isDateDisabled(day);
                                             return (
                                                <button
                                                   key={day}
                                                   disabled={disabled}
                                                   onClick={() => !disabled && handleDateClick(day)}
                                                   className={`w-10 h-10 rounded-sm font-serif text-base transition-all ${isSelected
                                                      ? 'bg-accent/10 text-ink font-semibold ring-1 ring-accent shadow-sm'
                                                      : disabled
                                                         ? 'text-ink-muted/25 cursor-not-allowed'
                                                         : 'text-ink hover:bg-accent/5 hover:text-accent'
                                                      }`}
                                                >
                                                   {day}
                                                </button>
                                             )
                                          })}
                                       </div>
                                    </div>

                                    {/* Time Slots - Stacked Below */}
                                    <div className="pt-6 border-t border-ink/10 min-h-[200px]">
                                       <h3 className="font-serif italic text-lg text-ink mb-3 text-center">
                                          {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Choose a date to see open times.'}
                                       </h3>

                                       <div className="flex justify-center mb-5">
                                          <TimezonePicker value={userTimezone} onChange={setUserTimezone} />
                                       </div>

                                       {availabilityError && (
                                          <div role="alert" className="mb-4 text-xs font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-sm px-4 py-2.5 flex items-start gap-3">
                                             <span className="flex-1 leading-relaxed">{availabilityError}</span>
                                             <button onClick={fetchAvailability} type="button" className="not-italic font-sans text-amber-900 underline font-medium hover:text-ink transition-colors shrink-0">Retry</button>
                                          </div>
                                       )}

                                       {selectedDate ? (
                                          isLoading ? (
                                             <div className="flex flex-col items-center justify-center py-12 text-ink-muted/60">
                                                <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3"></div>
                                                <span className="font-serif italic text-sm">Checking availability…</span>
                                             </div>
                                          ) : (
                                             <>
                                                <div className="grid grid-cols-4 gap-2 mb-6">
                                                   {displaySlots.filter(slot => !isTimeDisabled(slot.value)).map(slot => (
                                                         <button
                                                            key={slot.value}
                                                            onClick={() => { trackCalendarStart(); setSelectedTime(slot.value); }}
                                                            aria-label={slot.label}
                                                            title={slot.label}
                                                            className={`py-2.5 px-2 font-serif italic text-sm border rounded-sm transition-all text-center ${selectedTime === slot.value
                                                               ? 'bg-accent/10 text-accent border-accent ring-1 ring-accent shadow-sm'
                                                               : 'bg-white border-ink/10 text-ink hover:border-accent hover:text-accent hover:bg-accent/5 hover:shadow-sm'
                                                               }`}
                                                         >
                                                            <span className="block">{slot.display}</span>
                                                         </button>
                                                   ))}
                                                </div>
                                                <Button
                                                   variant="primary"
                                                   className={`w-full ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                   onClick={() => {
                                                      if (!selectedTime) return;
                                                      trackDetailsViewed();
                                                      setStep('details');
                                                   }}
                                                >
                                                   Next
                                                </Button>
                                             </>
                                          )) : (
                                          <div className="text-center text-ink-muted/60 font-serif italic text-sm py-6">
                                             Available times will appear once you pick a date.
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              )}

                              {step === 'details' && (
                                 <form onSubmit={handleSubmit} className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                                    <h3 className="font-serif text-2xl text-ink mb-6">Your Information</h3>

                                    <div className="space-y-4 mb-6">
                                       <FormField
                                          label="Full Name"
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

                                       <div className="grid grid-cols-2 gap-4">
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
                                       </div>

                                       <CustomSelect
                                          label={copy.reasonLabel}
                                          required
                                          value={formData.reason}
                                          onChange={(val) => setFormData({ ...formData, reason: val })}
                                          icon={<HelpCircle className="w-3 h-3" />}
                                          options={copy.reasonOptions}
                                       />

                                       <FormField
                                          label="Anything else you want to share?"
                                          name="notes"
                                          type="textarea"
                                          value={formData.notes}
                                          onChange={(val) => setFormData({ ...formData, notes: val })}
                                          placeholder="Optional — what recurring input, handoff, or exception is costing your team attention?"
                                          icon={<HelpCircle className="w-3 h-3" />}
                                          rows={4}
                                       />
                                    </div>

                                    {/* Honeypot — hidden from people, tempting to bots. */}
                                    <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden opacity-0 pointer-events-none">
                                       <label htmlFor="website-desktop">Website</label>
                                       <input
                                          id="website-desktop"
                                          name="website"
                                          type="text"
                                          tabIndex={-1}
                                          autoComplete="off"
                                          value={formData.website}
                                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                       />
                                    </div>

                                    <div className="mt-auto flex gap-4">
                                       <Button variant="secondary" onClick={() => setStep('datetime')} className="px-6">Back</Button>
                                       <Button variant="primary" className="flex-1">Book the call</Button>
                                    </div>
                                 </form>
                              )}

                           </div>
                        )}
                     </div>

                  </div>
               </ScrollReveal>
            </div>
         </main>
      </div>
   );
};

export default Calendar;
