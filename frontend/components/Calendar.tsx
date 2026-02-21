
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, User, Briefcase, HelpCircle, ArrowLeft, Mail, Phone, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Logo, Button, VitruvianBackground, ScrollReveal } from './Shared';
import type { CalendarProps } from './types';
import AstridSketch from '../images/Astrid_Sketch.jpg';
import { API_ENDPOINTS } from '../config';
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

// --- Custom Select Component ---
interface CustomSelectProps {
   label: string;
   value: string;
   onChange: (value: string) => void;
   options: string[];
   placeholder?: string;
   required?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options, placeholder, required }) => {
   const [isOpen, setIsOpen] = useState(false);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   return (
      <div className="relative" ref={containerRef}>
         <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
            <HelpCircle className="w-3 h-3" /> {label} {required && <span className="text-red-500">*</span>}
         </label>

         <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-base/30 border ${isOpen ? 'border-accent' : 'border-ink/20'} p-3 text-ink cursor-pointer rounded-sm flex justify-between items-center transition-colors hover:border-accent/50`}
         >
            <span className={!value ? "text-ink-muted" : ""}>{value || placeholder || "Select an option"}</span>
            <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </div>

         {isOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-ink/10 shadow-xl z-50 mt-1 rounded-sm max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
               {options.map((option) => (
                  <div
                     key={option}
                     onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                     }}
                     className={`p-3 text-sm cursor-pointer transition-colors ${value === option
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-ink hover:bg-accent hover:text-white'
                        }`}
                  >
                     {option}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

const Calendar: React.FC<CalendarProps> = ({ onNavigate }) => {
   const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime');
   const [currentDate, setCurrentDate] = useState(new Date());
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
   const [selectedTime, setSelectedTime] = useState<string | null>(null); // Stores ISO string

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: '',
      phone: '',
      reason: "Multiple areas (we will prioritize together)",
      notes: ''
   });

   // But display times in user's local timezone
   const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

   const [displaySlots, setDisplaySlots] = useState<{ display: string, value: string, localTime: string }[]>([]);

   useEffect(() => {
      document.title = "Talk To Astrid";

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
         metaDesc.setAttribute("content", "Schedule a casual introductory call with Astrid to explore how we can support your vision.");
      }

      // Update Open Graph meta tags for link previews
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
         ogTitle = document.createElement('meta');
         ogTitle.setAttribute('property', 'og:title');
         document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', 'Talk To Astrid');

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
         ogDescription = document.createElement('meta');
         ogDescription.setAttribute('property', 'og:description');
         document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', 'Schedule a casual introductory call with Astrid to explore how we can support your vision.');

      // Twitter Card meta tags
      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (!twitterTitle) {
         twitterTitle = document.createElement('meta');
         twitterTitle.setAttribute('name', 'twitter:title');
         document.head.appendChild(twitterTitle);
      }
      twitterTitle.setAttribute('content', 'Talk To Astrid');

      return () => {
         document.title = "DaVeenci | AI & Automation Consultancy";
      };
   }, []);

   useEffect(() => {
      if (!selectedDate) {
         setDisplaySlots([]);
         return;
      }
      setDisplaySlots(buildDisplaySlots(selectedDate, USER_TIMEZONE, BUSINESS_HOURS, BUSINESS_TIMEZONE));
   }, [selectedDate]);

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
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
      // Reset time when date changes
      setSelectedTime(null);
      // Refresh availability when selecting a date
      fetchAvailability();
   };

   const [busySlots, setBusySlots] = useState<{ start: string, end: string }[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   // Fetch availability function (reusable)
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

   // Fetch on mount and when month changes
   useEffect(() => {
      fetchAvailability();
   }, [currentDate]);

   // Auto-refresh availability every 30 seconds
   useEffect(() => {
      const interval = setInterval(fetchAvailability, 30000);
      return () => clearInterval(interval);
   }, [currentDate]);

   const checkSlotAvailability = (slotIsoTime: string) => {
      return checkSharedSlotAvailability(slotIsoTime, busySlots, MEETING_DURATION_MINUTES, BUFFER_MINUTES);
   };

   const isDateDisabled = (day: number) => {
      return isDayDisabled(
         day,
         currentDate,
         busySlots,
         BUSINESS_HOURS,
         BUSINESS_TIMEZONE,
         MEETING_DURATION_MINUTES,
         BUFFER_MINUTES
      );
   };

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
               bookingType: 'meet-astrid'
            }),
         });

         const data = await response.json();

         if (response.ok) {
            setStep('success');
         } else if (response.status === 409 && data.isDuplicate) {
            // Already booked - show friendly message and refresh availability
            alert(data.error || 'You already have a meeting scheduled at this time.');
            // Refresh availability to update the calendar
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const start = new Date(year, month, 1).toISOString();
            const end = new Date(year, month + 1, 0).toISOString();
            const availResponse = await fetch(`http://localhost:3001/api/calendar/availability?start=${start}&end=${end}`);
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
      <div className="min-h-screen bg-base font-sans text-ink selection:bg-accent/20 flex flex-col">
         <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden min-h-screen">
            <VitruvianBackground className="opacity-[0.08] fixed" />

            <div className="relative z-10 w-full max-w-6xl">
               <ScrollReveal>
                  <div className="bg-white/60 backdrop-blur-xl shadow-2xl shadow-ink/10 border border-ink/10 rounded-sm overflow-hidden flex flex-col lg:flex-row min-h-[780px]">

                     {/* Left Panel: Context & Agenda - Increased Width */}
                     <div className="w-full lg:w-5/12 bg-white/40 border-b lg:border-b-0 lg:border-r border-ink/10 p-8 lg:p-12 flex flex-col relative">
                        <div className="mb-8">
                           <Logo className="w-12 h-12 text-ink mb-6" />
                           <span className="font-mono text-xs font-bold text-ink-muted/60 uppercase tracking-widest mb-2 block">Private Calendar</span>
                           <h1 className="font-serif text-3xl lg:text-4xl text-ink mb-4">Meet Astrid</h1>

                           <div className="flex items-center gap-6 text-sm font-medium text-ink-muted mb-8">
                              <div className="flex items-center gap-2">
                                 <Clock className="w-4 h-4" /> 45 Min
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Available
                              </div>
                           </div>

                           <p className="text-ink-muted leading-relaxed mb-8">
                              A casual introductory call to get to know each other and explore how we can support your vision.
                           </p>

                           <div className="flex items-center gap-4 py-6 border-y border-ink/5 mb-6">
                              <div className="w-20 h-20 rounded-sm overflow-hidden border border-ink/10 flex-shrink-0">
                                 <img src={AstridSketch} alt="Astrid Abrahamyan" className="w-full h-full object-cover object-top scale-125" />
                              </div>
                              <div>
                                 <div className="font-serif text-ink text-lg leading-none mb-1">Astrid Abrahamyan</div>
                                 <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">Partner & Solution Architect</div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-auto">
                           <h3 className="font-serif text-lg text-ink mb-4 border-b border-ink/10 pb-2">Proposed Agenda</h3>
                           <ul className="space-y-4">
                              <li className="flex gap-3 text-sm text-ink-muted">
                                 <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                                 <span>Get to know each other and your business goals</span>
                              </li>
                              <li className="flex gap-3 text-sm text-ink-muted">
                                 <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                                 <span>Identify potential areas where we can provide value</span>
                              </li>
                              <li className="flex gap-3 text-sm text-ink-muted">
                                 <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                                 <span>Discuss next steps for working together</span>
                              </li>
                           </ul>

                           <div className="mt-8 pt-6 border-t border-ink/5">
                              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} className="text-xs font-mono font-bold text-accent uppercase tracking-widest hover:text-ink transition-colors block">
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
                              <h2 className="font-serif text-3xl text-ink mb-2">Request Confirmed</h2>
                              <p className="text-ink-muted text-lg mb-8 max-w-md">
                                 A calendar invitation has been sent to your inbox. I look forward to our conversation.
                              </p>
                              <div className="bg-base/50 p-6 rounded-sm border border-ink/5 w-full max-w-sm mb-8">
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

                              {/* Progress Bar */}
                              <div className="w-full max-w-md flex items-center gap-4 mb-8 text-xs font-bold uppercase tracking-widest">
                                 <span className={`pb-1 border-b-2 transition-colors ${step === 'datetime' ? 'text-accent border-accent' : 'text-green-600 border-green-600'}`}>01 Time</span>
                                 <span className={`pb-1 border-b-2 transition-colors ${step === 'details' ? 'text-accent border-accent' : 'text-ink-muted/20 border-transparent'}`}>02 Details</span>
                              </div>

                              {step === 'datetime' && (
                                 <div className="flex flex-col h-full w-full max-w-md animate-in slide-in-from-right-4 duration-300">
                                    {/* Calendar */}
                                    <div className="mb-8">
                                       <div className="flex items-center justify-between mb-6">
                                          <h3 className="font-serif text-xl text-ink">
                                             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                          </h3>
                                          <div className="flex gap-2">
                                             <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronLeft className="w-5 h-5" /></button>
                                             <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-base rounded-full text-ink-muted"><ChevronRight className="w-5 h-5" /></button>
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
                                                   className={`w-10 h-10 rounded-sm text-sm font-medium transition-all ${isSelected
                                                      ? 'bg-ink text-white shadow-lg scale-110'
                                                      : disabled
                                                         ? 'text-ink-muted/30 cursor-not-allowed'
                                                         : 'text-ink hover:bg-accent/10 hover:text-accent'
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
                                       <h3 className="font-serif text-lg text-ink mb-4 text-center">
                                          {selectedDate ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select Date Above'}
                                       </h3>

                                       {selectedDate ? (
                                          isLoading ? (
                                             <div className="flex flex-col items-center justify-center py-12 text-ink-muted/50">
                                                <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3"></div>
                                                <span className="text-sm font-medium">Checking availability...</span>
                                             </div>
                                          ) : (
                                             <>
                                                <div className="grid grid-cols-3 gap-3 mb-6">
                                                   {displaySlots.map(slot => {
                                                      const disabled = isTimeDisabled(slot.value);
                                                      return (
                                                         <button
                                                            key={slot.value}
                                                            disabled={disabled}
                                                            onClick={() => !disabled && setSelectedTime(slot.value)}
                                                            className={`py-3 px-2 text-sm border rounded-sm transition-all text-center ${selectedTime === slot.value
                                                               ? 'bg-accent text-white border-accent shadow-md scale-105'
                                                               : disabled
                                                                  ? 'bg-base/50 text-ink-muted/30 border-ink/5 cursor-not-allowed'
                                                                  : 'bg-white border-ink/10 text-ink hover:border-accent hover:text-accent hover:shadow-sm'
                                                               }`}
                                                         >
                                                            {slot.display}
                                                         </button>
                                                      );
                                                   })}
                                                </div>
                                                <Button
                                                   variant="primary"
                                                   className={`w-full ${!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                   onClick={() => selectedTime && setStep('details')}
                                                >
                                                   Next
                                                </Button>
                                             </>
                                          )) : (
                                          <div className="text-center text-ink-muted/50 text-sm italic py-4">
                                             Available times will appear here
                                          </div>
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
                                          <input
                                             type="text"
                                             required
                                             value={formData.name}
                                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                             className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                                             placeholder="Leonardo da Vinci"
                                          />
                                       </div>

                                       <div>
                                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                                             <Mail className="w-3 h-3" /> Email <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                             type="email"
                                             required
                                             value={formData.email}
                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                             className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                                             placeholder="leo@florence.it"
                                          />
                                       </div>

                                       <div className="grid grid-cols-2 gap-4">
                                          <div>
                                             <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Briefcase className="w-3 h-3" /> Company <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                                             </label>
                                             <input
                                                type="text"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                                                placeholder="Florence Inc."
                                             />
                                          </div>
                                          <div>
                                             <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Phone <span className="text-ink-muted/60 lowercase font-normal">(optional)</span>
                                             </label>
                                             <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                                                placeholder="+1 555..."
                                             />
                                          </div>
                                       </div>

                                       <div>
                                          <CustomSelect
                                             label="What's on your mind?"
                                             required
                                             value={formData.reason}
                                             onChange={(val) => setFormData({ ...formData, reason: val })}
                                             options={[
                                                "Just want to say hi & learn more",
                                                "Curious about what's possible with AI",
                                                "Feeling some friction in my workflows",
                                                "I have a specific question or project",
                                                "Not sure – let's just chat"
                                             ]}
                                          />
                                       </div>

                                       <div>
                                          <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                                             <HelpCircle className="w-3 h-3" /> Anything else you want to share?
                                          </label>
                                          <textarea
                                             value={formData.notes}
                                             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                             className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm min-h-[100px] resize-y"
                                             placeholder="Optional - feel free to share any context or specific questions..."
                                          />
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
            </div>
         </main>
      </div>
   );
};

export default Calendar;
