import React, { useEffect, useState } from 'react';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { API_ENDPOINTS } from '../../config';
import type { Page } from '../types';
import { formatEventDate, scheduledEvents, workshopTopics, type ScheduledEvent } from '../eventCatalog';
import { MobileSubscribe } from './MobileSubscribe';

interface MobileEventsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const RegistrationSheet: React.FC<{
  event: ScheduledEvent | null;
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
          eventDate: event.startsAt,
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
        <p className="font-mono text-[11px] text-ink-muted mb-5">{formatEventDate(event, true)}</p>
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
              <label htmlFor="mobile-event-full-name" className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mobile-event-full-name"
                name="fullName"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Leonardo da Vinci"
                disabled={status === 'loading'}
                className="w-full bg-white border border-ink/20 rounded-sm p-3 text-[15px] text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label htmlFor="mobile-event-email" className="block font-mono text-[10px] font-bold text-ink uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="mobile-event-email"
                name="email"
                autoComplete="email"
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
  const [selected, setSelected] = useState<ScheduledEvent | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
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
          Occasional in-person and online sessions — on specialist AI teams, orchestration, and what we're learning as we build.
        </p>
      </section>

      <section className="px-6 pb-10 space-y-5">
        {scheduledEvents.length === 0 && (
          <div className="bg-white/55 border border-ink/10 rounded-sm p-5 mb-7">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent mb-2">Next dates</div>
            <h2 className="font-serif text-2xl text-ink mb-3">The next sessions are being planned.</h2>
            <p className="font-sans text-[14px] leading-relaxed text-ink-muted">No public dates are open right now. Subscribe at the bottom of the page and we’ll send the next confirmed invitation.</p>
          </div>
        )}

        {scheduledEvents.map((event, i) => (
          <article
            key={event.id}
            className="bg-white border border-ink/10 rounded-sm overflow-hidden shadow-sm shadow-ink/5"
          >
            <div className="aspect-[16/9] bg-ink/5 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover filter sepia-[0.15] contrast-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-[10px] font-bold tracking-widest text-white bg-accent px-2 py-1 rounded-sm">
                  {formatEventDate(event, true)}
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

        {scheduledEvents.length === 0 && (
          <div className="pt-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted mb-4">Topics from the workshop</div>
            <div className="space-y-5">
              {workshopTopics.map((topic) => (
                <article key={topic.title} className="bg-white border border-ink/10 rounded-sm overflow-hidden shadow-sm shadow-ink/5">
                  <img src={topic.image} alt="" loading="lazy" decoding="async" className="w-full aspect-[16/9] object-cover" />
                  <div className="p-5">
                    <h2 className="font-serif text-xl text-ink leading-snug mb-3">{topic.title}</h2>
                    <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{topic.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <MobileSubscribe
        heading="Get the next workshop invitation"
        body="Confirmed dates, practical field notes, and new builds from the workshop. One Codex letter every Tuesday."
        source="events"
      />

      <RegistrationSheet event={selected} onClose={() => setSelected(null)} />
    </MobileShell>
  );
};
