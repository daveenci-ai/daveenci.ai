import React, { useEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon, ArrowRight, X, Check, Loader2 } from 'lucide-react';
import { Section, SectionHeader, ScrollReveal, Surface } from './Shared';
import { API_ENDPOINTS } from '../config';
import { formatEventDate, scheduledEvents, workshopTopics, type ScheduledEvent } from './eventCatalog';

interface RegistrationModalProps {
   isOpen: boolean;
   onClose: () => void;
   event: ScheduledEvent | null;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, event }) => {
   const [formData, setFormData] = useState({ fullName: '', email: '' });
   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [errorMessage, setErrorMessage] = useState('');

   const closeButtonRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      if (!isOpen) return;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
      const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
         if (keyboardEvent.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
         document.body.style.overflow = previousOverflow;
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [isOpen, onClose]);

   if (!isOpen || !event) return null;

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
               eventDate: event.startsAt
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
      } catch {
         setStatus('error');
         setErrorMessage('Network error. Please try again.');
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200">
         <div role="dialog" aria-modal="true" aria-labelledby="event-registration-title" className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button ref={closeButtonRef} type="button" aria-label="Close registration" onClick={onClose} className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink">
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
                     <h3 id="event-registration-title" className="font-serif text-2xl text-ink mt-1">{event.title}</h3>
                     <p className="text-sm text-ink-muted mt-2">{formatEventDate(event)}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="event-full-name" className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Full Name</label>
                        <input
                           id="event-full-name"
                           name="fullName"
                           autoComplete="name"
                           type="text"
                           required
                           value={formData.fullName}
                           onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                           className="w-full bg-canvas/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                           placeholder="Leonardo da Vinci"
                        />
                     </div>
                     <div>
                        <label htmlFor="event-email" className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Email Address</label>
                        <input
                           id="event-email"
                           name="email"
                           autoComplete="email"
                           type="email"
                           required
                           value={formData.email}
                           onChange={e => setFormData({ ...formData, email: e.target.value })}
                           className="w-full bg-canvas/30 border border-ink/20 p-3 text-ink focus:outline-none focus:border-accent transition-colors rounded-sm"
                           placeholder="leo@florence.it"
                        />
                     </div>

                     {status === 'error' && (
                        <div role="alert" className="text-red-500 text-sm bg-red-50 p-3 rounded-sm">
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

const CodexEventCard: React.FC<{ event: ScheduledEvent; index: number; onRegister: () => void }> = ({ event, index, onRegister }) => (
   <Surface kind="document" className="group relative flex flex-col h-full min-h-[500px] bg-canvas transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-0 border border-paper-border/70 shadow-[inset_0_0_20px_rgba(214,207,192,0.2)] pointer-events-none"></div>

      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-ink/20"></div>
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-ink/20"></div>
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-ink/20"></div>
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-ink/20"></div>

      <div className="relative p-8 flex flex-col h-full z-10">
         <div className="flex justify-between items-end mb-6 border-b border-ink/10 pb-4 border-dashed">
            <div className="flex flex-col">
               <span className="font-serif text-[11px] italic text-ink/40 mb-1">Codex DaVeenci</span>
               <span className="font-serif italic text-sm tracking-[0.12em] uppercase text-ink/60">Folio {100 + index}.v2</span>
            </div>
            <div className="font-mono text-xs font-bold text-white bg-accent px-3 py-1.5 rounded-sm shadow-md tracking-tight">
               {formatEventDate(event)}
            </div>
         </div>

         <div className="relative aspect-square mb-6 overflow-hidden border border-ink/10 p-1 bg-white shadow-sm rotate-[0.5deg] group-hover:rotate-0 transition-transform duration-500">
            <div className="relative w-full h-full overflow-hidden bg-ink/5">
               <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-90 filter sepia-[0.2] grayscale-[0.4] contrast-[1.1] group-hover:filter-none group-hover:opacity-100 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 mix-blend-multiply pointer-events-none"></div>
            </div>
         </div>

         <div className="mb-6 flex-grow">
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 group-hover:text-accent transition-colors">{event.title}</h3>
            {/* Date moved to top badge */}
            <p className="font-serif text-base leading-relaxed text-ink/70 italic border-l-2 border-ink/10 pl-4">
               "{event.description}"
            </p>
         </div>

         <div className="mt-auto pt-4 flex items-center justify-between border-t border-ink/5">
            <span className="font-mono text-[9px] tracking-widest text-ink/30 uppercase">Ref: {event.id}</span>
            <button
               onClick={onRegister}
               className="group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink hover:text-accent transition-colors"
            >
               <span>Register</span>
               <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
   </Surface>
);

const Events: React.FC = () => {
   const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);

   return (
      <Section id="events" pattern="grid" className="bg-alt/30">
         <div className="relative z-10">
            <SectionHeader
               eyebrow={scheduledEvents.length ? 'Upcoming' : 'Next dates'}
               title={scheduledEvents.length ? 'Come sit in.' : 'The next sessions are being planned.'}
               subtitle={scheduledEvents.length ? 'Confirmed sessions are listed below with one shared source of truth for time and timezone.' : 'No public dates are open right now. Subscribe at the bottom of the page and we’ll send the next invitation when it is confirmed.'}
            />

            {scheduledEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {scheduledEvents.map((event, idx) => (
                     <ScrollReveal key={event.id} delay={idx * 100} className="h-full">
                        <CodexEventCard event={event} index={idx} onRegister={() => setSelectedEvent(event)} />
                     </ScrollReveal>
                  ))}
               </div>
            ) : (
               <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-3 mb-8 text-ink-muted">
                     <CalendarIcon className="w-5 h-5 text-accent" />
                     <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Topics from the workshop</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {workshopTopics.map((topic, idx) => (
                        <ScrollReveal key={topic.title} delay={idx * 100} className="h-full">
                           <Surface kind="document" as="article" className="h-full bg-white/55 border border-ink/10 overflow-hidden">
                              <img src={topic.image} alt="" loading="lazy" decoding="async" className="w-full aspect-[16/10] object-cover grayscale-[0.2]" />
                              <div className="p-7">
                                 <h3 className="font-serif text-2xl text-ink mb-3">{topic.title}</h3>
                                 <p className="font-sans text-sm leading-relaxed text-ink-muted">{topic.description}</p>
                              </div>
                           </Surface>
                        </ScrollReveal>
                     ))}
                  </div>
               </div>
            )}
         </div>

         <RegistrationModal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            event={selectedEvent}
         />
      </Section>
   );
};

export default Events;
