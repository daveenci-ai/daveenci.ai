import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, X, Volume2 } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, Button } from './Shared';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { track } from '../lib/analytics';
import { newProgressMarks, pickVideoVariant, videoSrc } from '../lib/videoVariant';
import AntonSketch from '../images/Anton_Sketch.webp';

interface OrderIntakePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// The walkthrough (v1.9, ~60 s, captions burned in; real Aryeo screens redacted into one fictional shop), narrated by
// one of two AI voices. Each visitor gets one voice, 50/50, and keeps it (lib/videoVariant.ts). Browsers only autoplay
// muted video, so it starts muted and offers "Play with sound", which restarts it from the top with the voice on.
const VIDEO_POSTER = '/videos/concierge-order-intake-poster.jpg';

const INCLUDED = [
  'One email source',
  'One destination platform (Aryeo or Spiro)',
  'Up to 12 service types mapped',
  'Every order logged: placed, verified or held',
  'Held orders flagged in your inbox with the reason',
  'Two weeks of tuning',
];

const NOT_INCLUDED = [
  'Order sources other than email (forms, phone)',
  'A second platform',
  'Custom pricing rules',
  'Photo QA — that is the Real-time Photo Review module',
];

const TWO_WEEKS = [
  {
    when: 'Day 1',
    what: 'You share access and forward a few past concierge emails. We map your offices, regions and service types.',
  },
  {
    when: 'Days 2–5',
    what: 'The first real orders go through while you watch. Anything it holds, we look at together and tune.',
  },
  {
    when: 'By day 7',
    what: 'Live. Orders are placed and verified without anyone retyping them.',
  },
  {
    when: 'Day 14',
    what: 'Keep it, or get a full refund if orders are not landing correctly.',
  },
];

const ACCESS = [
  'A team-member login on your Aryeo or Spiro account — not the owner login. You can revoke it any time.',
  'Read access to the mailbox that receives the concierge emails, and permission to label them.',
  'It runs in your own Google and GitHub accounts. You keep the code. Nothing about your orders leaves your accounts.',
];

const FAQS = [
  {
    q: 'Does it place orders without me?',
    a: 'Yes — that is the job. It places the order, reads the order number back to confirm the order exists, and stops only when it is not sure. Those it holds and tells you about. Nothing is placed blindly.',
  },
  {
    q: 'What if my emails look different every time?',
    a: 'That is what it is for. If it cannot read one, it holds the order and asks you rather than guessing.',
  },
  {
    q: 'What happens when Aryeo or Spiro changes something?',
    a: 'Their order forms change without notice — Aryeo changed its form layout on 1 September 2026. When a form no longer looks the way the module expects, it stops and tells you instead of placing wrong orders. Repairing it is what the monthly plan covers; without one, we quote the repair before doing it.',
  },
  {
    q: 'What happens after two weeks?',
    a: 'It keeps running. Nothing else is due unless you take the monthly plan.',
  },
];

const OrderIntakePage: React.FC<OrderIntakePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Carry the outreach token through to the booking page, so a call books
  // against the email that produced it.
  const bookHref = useMemo(() => {
    const { t } = readAttribution();
    return `/book/anton?src=module${t ? `&t=${encodeURIComponent(t)}` : ''}`;
  }, []);

  const bookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({ page: 'book-anton' }, '', bookHref);
    onNavigate('book-anton');
  };

  // Voice A/B: which narrator this visitor hears, and what they do with the video.
  // The static prerender has no visitor to assign, so it shows Mark; the live page re-renders with the real pick.
  const { variant, forced } = useMemo(
    () => (typeof window === 'undefined' ? { variant: 'mark' as const, forced: false } : pickVideoVariant(window.location.search)),
    [],
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const soundOnSent = useRef(false);
  const progressSent = useRef(new Set<number>());

  useEffect(() => {
    track('video_impression', { video_id: 'order_intake', video_variant: variant, forced });
  }, [variant, forced]);

  const reportSoundOn = (via: 'button' | 'controls') => {
    setSoundOn(true);
    if (soundOnSent.current) return;
    soundOnSent.current = true;
    // Progress from here on counts as listened-to: start the quarter marks over.
    progressSent.current = new Set();
    track('video_sound_on', { video_id: 'order_intake', video_variant: variant, via });
  };

  const playWithSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    reportSoundOn('button');
    void v.play().catch(() => {
      /* the browser refused; the controls are still there */
    });
  };

  const onVolumeChange = () => {
    const v = videoRef.current;
    if (v && !v.muted && v.volume > 0) reportSoundOn('controls');
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    for (const percent of newProgressMarks(v.currentTime, v.duration, progressSent.current)) {
      progressSent.current.add(percent);
      track('video_progress', { video_id: 'order_intake', video_variant: variant, percent, sound: !v.muted });
    }
  };

  const BookButton = ({ className = '', surface }: { className?: string; surface: string }) => (
    <a href={bookHref} onClick={bookNow} className={`inline-block ${className}`}>
      <Button
        variant="primary"
        analytics={{
          cta_id: 'book_anton',
          surface,
          from_page: '/shootos/concierge-order-intake',
          destination: '/book/anton',
          video_variant: variant,
        }}
      >
        Book 15 minutes with Anton
      </Button>
    </a>
  );

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="order-intake" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <a
            href="/shootos"
            onClick={(e) => { e.preventDefault(); onNavigate('autopilot'); }}
            className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5 hover:text-ink transition-colors"
          >
            ShootOS · Module 01
          </a>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-5">Concierge Order Intake</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            Concierge order emails, placed in Aryeo or Spiro — without anyone retyping them.
          </p>
        </div>
      </Section>

      {/* Video */}
      <Section id="video" className="py-10 md:py-14 bg-white/35">
        <div className="max-w-3xl">
          <div className="aspect-video w-full border border-ink/10 rounded-sm overflow-hidden bg-ink/5">
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                poster={VIDEO_POSTER}
                className="w-full h-full object-cover"
                src={videoSrc(variant)}
                onVolumeChange={onVolumeChange}
                onTimeUpdate={onTimeUpdate}
                aria-label="Concierge Order Intake walkthrough: a concierge order email becomes an Aryeo order"
              />
              {!soundOn && (
                <button
                  type="button"
                  onClick={playWithSound}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink/85 hover:bg-ink text-white font-sans text-sm md:text-base px-5 py-3 shadow-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                  Play with sound
                </button>
              )}
            </div>
          </div>
          <div className="mt-8">
            <BookButton surface="under_video" />
          </div>
        </div>
      </Section>

      {/* What it does */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl space-y-5">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What it does</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            A concierge order arrives by email. The module reads it, opens the right order form for that office and
            region, fills the address, square footage, access notes and lockbox code, finds the agent by email, adds
            the package and selections, books the nearest open slot to the requested time and submits — no payment
            step, you invoice as usual. Then it reads the order number back from Aryeo or Spiro. An order only counts
            as placed once it exists there.
          </p>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            When it isn't sure — agent not in the system, no slot in the window, a new client — it doesn't guess. The
            email gets a label, the order is held, and your team gets a note saying why.
          </p>
        </div>
      </Section>

      {/* What it's worth */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What it's worth</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            If keying in an order takes five minutes and you get ten a day, that's about twenty hours a month back —
            roughly $400 a month at admin rates — and no orders on the wrong order page, wrong region or wrong agent,
            which is where the expensive mistakes come from. Your numbers will differ; the video shows the real thing.
          </p>
        </div>
      </Section>

      {/* Price */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="border border-ink/15 bg-white/70 rounded-sm p-8 md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Price</div>
            <div className="font-serif text-5xl md:text-6xl text-ink leading-none mb-5">
              $2,500<span className="text-ink-muted text-2xl md:text-3xl ml-3">fixed</span>
            </div>
            <ul className="space-y-2 font-sans text-ink-muted leading-relaxed">
              <li>Live within a week.</li>
              <li>Refund in full if orders aren't landing correctly after two weeks.</li>
              <li>That is the whole price for the module. It keeps running after the two weeks, in your own accounts, and you keep the code.</li>
            </ul>
            <div className="font-sans text-sm text-ink-muted leading-relaxed mt-6 pt-6 border-t border-ink/10 space-y-3">
              <p>
                <span className="text-ink">Optional monthly plan:</span> we watch Aryeo and Spiro for changes and fix
                what they break. Priced on the call, never required.
              </p>
              <p>
                <span className="text-ink">Change orders:</span> a second email source, a second platform or more
                than 12 service types is quoted before the work, never after.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Included / not included */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-2xl text-ink mb-5">Included</h2>
            <ul className="space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 items-baseline font-sans text-ink-muted leading-relaxed">
                  <Check className="w-4 h-4 text-accent shrink-0 translate-y-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink mb-5">Not included</h2>
            <ul className="space-y-3">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 items-baseline font-sans text-ink-muted leading-relaxed">
                  <X className="w-4 h-4 text-ink-muted/50 shrink-0 translate-y-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* The first two weeks */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-8">How the first two weeks go</h2>
          <ol className="space-y-6">
            {TWO_WEEKS.map(({ when, what }) => (
              <li key={when} className="grid grid-cols-[6.5rem_1fr] gap-4 items-baseline">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{when}</span>
                <span className="font-sans text-ink-muted leading-relaxed">{what}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Access */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What access it needs</h2>
          <ul className="space-y-3">
            {ACCESS.map((item) => (
              <li key={item} className="flex gap-3 items-baseline font-sans text-ink-muted leading-relaxed">
                <Check className="w-4 h-4 text-accent shrink-0 translate-y-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* FAQs */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl space-y-8">
          {FAQS.map(({ q, a }) => (
            <section key={q}>
              <h3 className="font-serif text-2xl text-ink mb-3">{q}</h3>
              <p className="font-sans text-ink-muted leading-relaxed">{a}</p>
            </section>
          ))}
        </div>
      </Section>

      {/* Close */}
      <Section className="py-14 md:py-20 bg-white/35">
        <div className="max-w-3xl">
          <p className="font-serif italic text-lg text-ink-muted mb-10">
            Running today at a real-estate media company in Texas.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
            <img
              src={AntonSketch}
              alt="Anton Osipov"
              width={1024}
              height={1040}
              loading="lazy"
              decoding="async"
              className="w-28 h-28 rounded-full object-cover border border-ink/10 shrink-0 filter sepia-[0.15] contrast-105"
            />
            <div>
              <p className="font-serif text-2xl text-ink">Anton Osipov</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-1 mb-2">
                Founder, DaVeenci · builds and runs the module
              </p>
              <p className="font-sans text-ink-muted leading-relaxed mb-6">
                Fifteen minutes to check that it fits how your orders actually come in, and to pick a start date.
              </p>
              <BookButton surface="founder_block" />
            </div>
          </div>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default OrderIntakePage;
