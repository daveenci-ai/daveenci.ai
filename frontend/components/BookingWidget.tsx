import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, HelpCircle, Clock, Check, Briefcase, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollReveal, Section, Button, Logo, CustomSelect } from './Shared';
import { API_ENDPOINTS } from '../config';
import type { Page } from './types';
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
} from './calendarAvailability';

interface BookingWidgetProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  sectionId?: string;
  sectionClassName?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  leftBody: string;
  bookingType: string;
  hostName: string;
  hostRole: string;
  hostImage: string;
  reasonOptions?: string[];
  defaultReason?: string;
}

const DEFAULT_REASONS = [
  'Just want to say hi & learn more',
  "Curious about what's possible with AI",
  'Feeling some friction in my workflows',
  'I have a specific question or project',
  "Not sure - let's just chat",
];

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  onNavigate,
  sectionId = 'booking',
  sectionClassName = 'bg-alt/20 border-t border-ink/5',
  eyebrow,
  title,
  subtitle,
  leftBody,
  bookingType,
  hostName,
  hostRole,
  hostImage,
  reasonOptions = DEFAULT_REASONS,
  defaultReason = 'Multiple areas (we will prioritize together)',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
  const [busySlots, setBusySlots] = useState<{ start: string; end: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [displaySlots, setDisplaySlots] = useState<{ display: string; value: string }[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    reason: defaultReason,
    notes: '',
  });

  useEffect(() => {
    if (!selectedDate) { setDisplaySlots([]); return; }
    setDisplaySlots(buildDisplaySlots(selectedDate, USER_TIMEZONE, BUSINESS_HOURS, BUSINESS_TIMEZONE));
  }, [selectedDate]);

  const fetchAvailability = async () => {
    setIsLoading(true);
    const { start, end } = getAvailabilityRange(currentDate);
    try {
      const response = await fetch(`${API_ENDPOINTS.availability}?start=${start}&end=${end}`);
      if (response.ok) {
        const data = await response.json();
        setBusySlots(data.busySlots);
      }
    } catch (error) {
      console.error('Failed to fetch availability', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAvailability(); }, []);

  const checkSlotAvailability = (slotIsoTime: string) =>
    checkSharedSlotAvailability(slotIsoTime, busySlots, MEETING_DURATION_MINUTES, BUFFER_MINUTES);

  const isDateDisabled = (day: number) =>
    isDayDisabled(day, currentDate, busySlots, BUSINESS_HOURS, BUSINESS_TIMEZONE, MEETING_DURATION_MINUTES, BUFFER_MINUTES);

  const isTimeDisabled = (slotIso: string) => !checkSlotAvailability(slotIso);

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
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setSelectedTime(null);
    fetchAvailability();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.book, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, dateTime: selectedTime, bookingType }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('success');
      } else if (response.status === 409 && data.isDuplicate) {
        alert(data.error || 'You already have a demo scheduled at this time.');
        fetchAvailability();
        setStep('datetime');
        setSelectedTime(null);
      } else {
        alert(data.error || 'Failed to book demo. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Section id={sectionId} className={sectionClassName} overflow={true}>
      <div className="mb-12 text-center">
        <ScrollReveal>
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">{title}</h2>
          <p className="text-ink-muted max-w-xl mx-auto">{subtitle}</p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={100}>
        <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl shadow-2xl shadow-ink/10 border border-ink/10 rounded-lg overflow-hidden flex flex-col lg:flex-row min-h-[780px]">
          {/* Left Panel */}
          <div className="w-full lg:w-5/12 bg-white/40 border-b lg:border-b-0 lg:border-r border-ink/10 p-8 lg:p-12 flex flex-col relative">
            <div className="mb-8">
              <Logo className="w-12 h-12 text-ink mb-6" />
              <span className="font-mono text-xs font-bold text-ink-muted/60 uppercase tracking-widest mb-2 block">{eyebrow}</span>
              <h1 className="font-serif text-3xl lg:text-4xl text-ink mb-4">{title}</h1>
              <div className="flex items-center gap-6 text-sm font-medium text-ink-muted mb-8">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 30 Min</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available</div>
              </div>
              <p className="text-ink-muted leading-relaxed mb-8">{leftBody}</p>
              <div className="flex items-center gap-4 py-6 border-y border-ink/5 mb-6">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-ink/10 flex-shrink-0">
                  <img src={hostImage} alt={hostName} className="w-full h-full object-cover object-top scale-125" />
                </div>
                <div>
                  <div className="font-serif text-ink text-lg leading-none mb-1">{hostName}</div>
                  <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">{hostRole}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Calendar */}
          <div className="w-full lg:w-7/12 bg-white relative">
            {step === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-serif text-3xl text-ink mb-2">Request Confirmed</h2>
                <p className="text-ink-muted text-lg mb-8 max-w-md">
                  A calendar invitation has been sent to your inbox. I look forward to our conversation.
                </p>
                <div className="bg-base/50 p-6 rounded-lg border border-ink/5 w-full max-w-sm mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ink-muted">Date</span>
                    <span className="font-medium text-ink">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">Time</span>
                    <span className="font-medium text-ink">{selectedTime ? format(new Date(selectedTime), 'hh:mm a') : ''}</span>
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
                <Button variant="secondary" onClick={() => onNavigate('landing')}>Return to Homepage</Button>
              </div>
            ) : (
              <div className="p-8 lg:p-12 h-full flex flex-col justify-center items-center">
                <div className="w-full max-w-md flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest">
                  <span className={`pb-1 border-b-2 transition-colors ${step === 'datetime' ? 'text-accent border-accent' : 'text-green-600 border-green-600'}`}>01 Time</span>
                  <span className={`pb-1 border-b-2 transition-colors ${step === 'details' ? 'text-accent border-accent' : 'text-ink-muted/20 border-transparent'}`}>02 Details</span>
                </div>

                {step === 'datetime' && (
                  <div className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-xl text-ink">{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronLeft className="w-5 h-5" /></button>
                          <button onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDate(null); setSelectedTime(null); }} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-ink-muted/40 mb-2">
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
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${isSelected
                                ? 'bg-ink text-white shadow-lg scale-110'
                                : disabled
                                  ? 'text-ink-muted/30 cursor-not-allowed'
                                  : 'text-ink hover:bg-accent/10 hover:text-accent'
                                }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-ink/10 min-h-[200px]">
                      <h3 className="font-serif text-lg text-ink mb-4 text-center">
                        {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select Date Above'}
                      </h3>
                      {selectedDate ? (
                        isLoading ? (
                          <div className="flex flex-col items-center justify-center py-12 text-ink-muted/50">
                            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3" />
                            <span className="text-sm font-medium">Checking availability...</span>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {displaySlots.filter(slot => !isTimeDisabled(slot.value)).map(slot => (
                                <button
                                  key={slot.value}
                                  onClick={() => setSelectedTime(slot.value)}
                                  className={`py-3 px-2 text-sm border rounded-lg transition-all text-center ${selectedTime === slot.value
                                    ? 'bg-accent text-white border-accent shadow-md scale-105'
                                    : 'bg-white border-ink/10 text-ink hover:border-accent hover:text-accent hover:shadow-sm'
                                    }`}
                                >
                                  {slot.display}
                                </button>
                              ))}
                            </div>
                            <Button
                              variant="primary"
                              className={`w-full ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => selectedTime && setStep('details')}
                            >
                              Next
                            </Button>
                          </>
                        )
                      ) : (
                        <div className="text-center text-ink-muted/50 text-sm italic py-4">Available times will appear here</div>
                      )}
                    </div>
                  </div>
                )}

                {step === 'details' && (
                  <form onSubmit={handleSubmit} className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                    <h3 className="font-serif text-2xl text-ink mb-6">Your Information</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <User className="w-3 h-3" /> Full Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-lg" placeholder="Leonardo da Vinci" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
                        </label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-lg" placeholder="leo@florence.it" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Briefcase className="w-3 h-3" /> Company <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                          </label>
                          <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-lg" placeholder="Acme Inc." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                          </label>
                          <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-lg" placeholder="+1 555..." />
                        </div>
                      </div>
                      <div>
                        <CustomSelect
                          label="What's on your mind?"
                          required
                          value={formData.reason}
                          onChange={val => setFormData({ ...formData, reason: val })}
                          options={reasonOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                          <HelpCircle className="w-3 h-3" /> Anything else you want to share?
                        </label>
                        <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-lg min-h-[100px] resize-y" placeholder="Optional - feel free to share any context or specific questions..." />
                      </div>
                    </div>
                    <div className="mt-auto flex gap-4">
                      <Button variant="secondary" onClick={() => setStep('datetime')} className="px-6">Back</Button>
                      <Button variant="primary" className="flex-1">Schedule Call</Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
};
