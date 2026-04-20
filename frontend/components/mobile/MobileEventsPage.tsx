import React, { useEffect, useMemo, useState } from 'react';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';
import { format, addDays, getDay, setDay, startOfDay, addWeeks } from 'date-fns';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import NetworkingImage from '../../images/01 - Networking Session.jpg';
import AEOvsSEOImage from '../../images/02 - Battle Between AEO and SEO.jpg';
import OwnYourStackImage from '../../images/03 - Own Your Stack.jpg';
import { API_ENDPOINTS } from '../../config';
import type { Page } from '../types';

interface EventItem {
  image: string;
  date: string;
  isoDate: string;
  title: string;
  description: string;
}

interface MobileEventsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const RegistrationSheet: React.FC<{
  event: EventItem | null;
  onClose: () => void;
}> = ({ event, onClose }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!event) return;
    const prev = document.body.style.overflow;
    const prevScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      window.scrollTo(0, prevScroll);
    };
  }, [event]);

  if (!event) return null;

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
          eventDate: event.isoDate,
        }),
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="events-sheet-title"
      data-mobile
      className="fixed inset-0 z-50 bg-base flex flex-col animate-in fade-in duration-200"
    >
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-11 h-11 flex items-center justify-center text-ink"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent mb-2">
          Register
        </div>
        <h2 id="events-sheet-title" className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-2 tracking-tight">
          {event.title}
        </h2>
        <p className="font-mono text-[11px] text-ink-muted mb-5">{event.date}</p>
        <p className="font-serif italic text-[15px] text-ink-muted leading-relaxed mb-6 border-l-2 border-ink/10 pl-4">
          "{event.description}"
        </p>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-sm p-5 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="font-serif text-lg text-ink mb-1">You're registered.</h3>
            <p className="text-sm text-ink-muted">A confirmation is on its way to your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Leonardo da Vinci"
                disabled={status === 'loading'}
                className="w-full bg-white border border-ink/20 rounded-sm p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="leo@florence.it"
                disabled={status === 'loading'}
                className="w-full bg-white border border-ink/20 rounded-sm p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </div>

            {status === 'error' && errorMessage && (
              <div role="alert" className="text-xs font-serif italic text-amber-900 bg-amber-50/70 border border-amber-200/80 rounded-sm px-4 py-2.5">
                {errorMessage}
              </div>
            )}

            <MobileButton type="submit" disabled={status === 'loading'}>
              <span className="inline-flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering…
                  </>
                ) : (
                  'Reserve my seat'
                )}
              </span>
            </MobileButton>
          </form>
        )}
      </div>
    </div>
  );
};

export const MobileEventsPage: React.FC<MobileEventsPageProps> = ({ onNavigate }) => {
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    document.title = 'Events — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  const events: EventItem[] = useMemo(() => {
    const today = startOfDay(new Date());
    const dayOfWeek = getDay(today);
    let event1Date = setDay(today, 4, { weekStartsOn: 0 });
    if (dayOfWeek >= 3) event1Date = addWeeks(event1Date, 1);
    event1Date.setHours(10, 0, 0, 0);

    const event2Date = addDays(event1Date, 10);
    event2Date.setHours(10, 30, 0, 0);

    const event3Date = addDays(event2Date, 6);
    event3Date.setHours(10, 0, 0, 0);

    return [
      {
        image: NetworkingImage,
        date: `${format(event1Date, 'EEE, MMM d')} · ${format(event1Date, 'h:mm a')} CST`,
        isoDate: event1Date.toISOString(),
        title: 'AI × Ops: The Networking Session',
        description: 'Curious about how AI and automation are transforming work? Meet founders, builders, and operators at this interactive networking event.',
      },
      {
        image: AEOvsSEOImage,
        date: `${format(event2Date, 'EEE, MMM d')} · ${format(event2Date, 'h:mm a')} CST`,
        isoDate: event2Date.toISOString(),
        title: 'The Battle Between AEO and SEO',
        description: 'In this session, we explore the shifting terrain between classic SEO — the old mapmakers of the web — and AEO, the new intelligence engines.',
      },
      {
        image: OwnYourStackImage,
        date: `${format(event3Date, 'EEE, MMM d')} · ${format(event3Date, 'h:mm a')} CST`,
        isoDate: event3Date.toISOString(),
        title: 'AI Foundations: Own Your Stack',
        description: "Learn how to run AI apps on infrastructure you actually control. We'll cover the essentials of hosting, servers, and GPU access.",
      },
    ];
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            Workshop Events
          </span>
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          From the <br />
          <span className="italic text-ink-muted/70">workshop.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6]">
          Occasional in-person and online sessions — on specialist AI teams, orchestration, and what we're learning as we build. Three upcoming on the calendar.
        </p>
      </section>

      <section className="px-6 pb-10 space-y-5">
        {events.map((event, i) => (
          <article
            key={event.isoDate}
            className="bg-white border border-ink/10 rounded-sm overflow-hidden shadow-sm shadow-ink/5"
          >
            <div className="aspect-[16/9] bg-ink/5 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover filter sepia-[0.15] contrast-105"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] font-bold tracking-widest text-white bg-accent px-2 py-1 rounded-sm">
                  {event.date}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-ink-muted/50 uppercase">
                  Folio {100 + i}
                </span>
              </div>
              <h2 className="font-serif text-xl text-ink leading-snug mb-3">{event.title}</h2>
              <p className="font-serif italic text-[14px] text-ink-muted leading-relaxed border-l-2 border-ink/10 pl-4 mb-5">
                "{event.description}"
              </p>
              <button
                onClick={() => setSelected(event)}
                className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-accent"
              >
                Register
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <RegistrationSheet event={selected} onClose={() => setSelected(null)} />
    </MobileShell>
  );
};
