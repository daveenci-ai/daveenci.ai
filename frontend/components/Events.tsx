import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ArrowRight, X, Check, Loader2 } from 'lucide-react';
import { format, addDays, getDay, setDay, startOfDay, addWeeks } from 'date-fns';
import { Section, SectionHeader, ScrollReveal } from './Shared';
import type { EventCardProps } from './types';
import NetworkingImage from '../images/01 - Networking Session.jpg';
import AEOvsSEOImage from '../images/02 - Battle Between AEO and SEO.jpg';
import OwnYourStackImage from '../images/03 - Own Your Stack.jpg';
import { API_ENDPOINTS } from '../config';

interface RegistrationModalProps {
   isOpen: boolean;
   onClose: () => void;
   event: {
      title: string;
      date: string;
      description: string;
      isoDate: string; // Added for backend
   };
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, event }) => {
   const [formData, setFormData] = useState({ fullName: '', email: '' });
   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [errorMessage, setErrorMessage] = useState('');

   if (!isOpen) return null;

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      setErrorMessage('');

      try {
         const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               fullName: formData.fullName,
               email: formData.email,
               eventName: event.title,
               eventDescription: event.description,
               eventDate: event.isoDate
            })
         });

         const data = await response.json();

         if (response.ok) {
            setStatus('success');
            setTimeout(() => {
               onClose();
               setStatus('idle');
               setFormData({ fullName: '', email: '' });
            }, 2000);
         } else {
            setStatus('error');
            setErrorMessage(data.error || 'Failed to register');
         }
      } catch (error) {
         setStatus('error');
         setErrorMessage('Network error. Please try again.');
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-ink-muted hover:text-ink">
               <X className="w-5 h-5" />
            </button>

            {status === 'success' ? (
               <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink mb-2">You're on the list.</h3>
                  <p className="text-ink-muted">We'll see you at {event.title}.</p>
               </div>
            ) : (
               <>
                  <div className="mb-6">
                     <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">Event Registration</span>
                     <h3 className="font-serif text-2xl text-ink mt-1">{event.title}</h3>
                     <p className="text-sm text-ink-muted mt-2">{event.date}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Full Name</label>
                        <input
                           type="text"
                           required
                           value={formData.fullName}
                           onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                           className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                           placeholder="Leonardo da Vinci"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email Address</label>
                        <input
                           type="email"
                           required
                           value={formData.email}
                           onChange={e => setFormData({ ...formData, email: e.target.value })}
                           className="w-full bg-base/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                           placeholder="leo@florence.it"
                        />
                     </div>

                     {status === 'error' && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-sm">
                           {errorMessage}
                        </div>
                     )}

                     <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-ink text-white font-bold uppercase tracking-wider py-4 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {status === 'loading' ? 'Registering...' : 'Confirm Registration'}
                     </button>
                  </form>
               </>
            )}
         </div>
      </div>
   );
};

const CodexEventCard: React.FC<EventCardProps & { index: number; onRegister: () => void }> = ({ image, date, title, description, index, onRegister }) => (
   <div className="group relative flex flex-col h-full min-h-[500px] bg-[#FDFBF7] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-0 border border-[#D6CFC0] shadow-[inset_0_0_20px_rgba(214,207,192,0.2)] pointer-events-none"></div>

      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ink/20"></div>
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ink/20"></div>
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ink/20"></div>
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ink/20"></div>

      <div className="relative p-8 flex flex-col h-full z-10">
         <div className="flex justify-between items-end mb-6 border-b border-ink/10 pb-4 border-dashed">
            <div className="flex flex-col">
               <span className="font-serif text-[11px] italic text-ink/40 mb-1">Codex DaVeenci</span>
               <span className="font-script text-xl text-ink/60 -rotate-1 transform origin-left">Folio {100 + index}.v2</span>
            </div>
            <div className="font-mono text-xs font-bold text-white bg-accent px-3 py-1.5 rounded-sm shadow-md tracking-tight">
               {date}
            </div>
         </div>

         <div className="relative aspect-square mb-6 overflow-hidden border border-ink/10 p-1 bg-white shadow-sm rotate-[0.5deg] group-hover:rotate-0 transition-transform duration-500">
            <div className="relative w-full h-full overflow-hidden bg-ink/5">
               <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover opacity-90 filter sepia-[0.2] grayscale-[0.4] contrast-[1.1] group-hover:filter-none group-hover:opacity-100 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 mix-blend-multiply pointer-events-none"></div>
            </div>
         </div>

         <div className="mb-6 flex-grow">
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 group-hover:text-accent transition-colors">{title}</h3>
            {/* Date moved to top badge */}
            <p className="font-serif text-base leading-relaxed text-ink/70 italic border-l-2 border-ink/10 pl-4">
               "{description}"
            </p>
         </div>

         <div className="mt-auto pt-4 flex items-center justify-between border-t border-ink/5">
            <span className="font-mono text-[9px] tracking-widest text-ink/30 uppercase">Ref: DA-2025-0{index + 1}</span>
            <button
               onClick={onRegister}
               className="group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors"
            >
               <span>Register</span>
               <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
   </div>
);

const Events: React.FC = () => {
   const [selectedEvent, setSelectedEvent] = useState<any>(null);

   const events = useMemo(() => {
      const today = startOfDay(new Date());
      const dayOfWeek = getDay(today); // 0 (Sun) to 6 (Sat)

      // Logic: If Sun(0), Mon(1), Tue(2) -> This week's Thursday.
      // If Wed(3) or later -> Next week's Thursday.
      let event1Date = setDay(today, 4, { weekStartsOn: 0 }); // Set to Thursday of this week
      if (dayOfWeek >= 3) {
         event1Date = addWeeks(event1Date, 1);
      }

      // Set time to 10:00 AM for consistency
      event1Date.setHours(10, 0, 0, 0);

      const event2Date = addDays(event1Date, 10);
      // Event 2 is usually at 10:30 AM based on previous data
      event2Date.setHours(10, 30, 0, 0);

      const event3Date = addDays(event2Date, 6);
      // Event 3 at 10:00 AM
      event3Date.setHours(10, 0, 0, 0);

      return [
         {
            image: NetworkingImage,
            date: `${format(event1Date, "EEE, MMM d, yyyy")} @ ${format(event1Date, "h:mm a")} CST`,
            isoDate: event1Date.toISOString(),
            title: "AI × Ops: The Networking Session",
            description: "Curious about how AI and automation are transforming work? Meet founders, builders, and operators at this interactive networking event."
         },
         {
            image: AEOvsSEOImage,
            date: `${format(event2Date, "EEE, MMM d, yyyy")} @ ${format(event2Date, "h:mm a")} CST`,
            isoDate: event2Date.toISOString(),
            title: "The Battle Between AEO and SEO",
            description: "In this session, we explore the shifting terrain between classic SEO—the old mapmakers of the web—and AEO, the new intelligence engines."
         },
         {
            image: OwnYourStackImage,
            date: `${format(event3Date, "EEE, MMM d, yyyy")} @ ${format(event3Date, "h:mm a")} CST`,
            isoDate: event3Date.toISOString(),
            title: "AI Foundations: Own Your Stack",
            description: "Learn how to run AI apps on infrastructure you actually control. We’ll cover the essentials of hosting, servers, and GPU access."
         }
      ];
   }, []);

   return (
      <Section id="events" pattern="grid" className="bg-alt/30">
         <div className="relative z-10">
            <SectionHeader
               eyebrow="Folio IV — Engagement"
               title="Upcoming Intelligence"
               subtitle="Join the conversation with industry leaders, founders, and builders."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
               {events.map((event, idx) => (
                  <ScrollReveal key={idx} delay={idx * 150} className="h-full">
                     <CodexEventCard
                        index={idx}
                        {...event}
                        onRegister={() => setSelectedEvent(event)}
                     />
                  </ScrollReveal>
               ))}
            </div>
         </div>

         <RegistrationModal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            event={selectedEvent || { title: '', date: '', description: '', isoDate: '' }}
         />
      </Section>
   );
};

export default Events;
