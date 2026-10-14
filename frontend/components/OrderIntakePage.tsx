import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarClock, Check, FileText, MapPin, ShieldCheck, UserCheck, Volume2, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Button, Eyebrow, PageHero, Plate, ScrollReveal, Section, SectionHeader, VitruvianBackground } from './Shared';
import { Stack } from './motion/Stack';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { track } from '../lib/analytics';
import { useScrollProgress } from '../lib/useScrollProgress';
import { newProgressMarks, pickVideoVariant, videoSrc } from '../lib/videoVariant';
import { platformTermsNote, shootOpsPlatforms } from '../content/shootOpsModules';
import {
  AddressPanel,
  FormPanel,
  HeroPipeline,
  InboxMock,
  LABELS,
  ParsedEmail,
  ServicesPanel,
  SlotsPanel,
  VerifyPanel,
} from './orderIntake/IntakeVisuals';
import ModulePairing from './ModulePairing';
import AntonSketch from '../images/Anton_Sketch.webp';

interface OrderIntakePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Redesigned 11 Oct 2026 (Anton: the page should carry the site's look — background, depth — and show
// everything the module really does). Every behaviour described here is taken from the production code of
// the module (the email parser, address/unit reconciliation, form fill, agent search by email, state-mapped
// add-ons, twilight second appointment, ±3 h slot search, claim-before-submit, order-number read-back,
// Gmail labels, three tries before ERROR). Client names never appear; all listing data shown is fictional.

// The walkthrough (v1.9, ~60 s, captions burned in; real Aryeo screens redacted into one fictional shop), narrated by
// one of two AI voices. Each visitor gets one voice, 50/50, and keeps it (lib/videoVariant.ts). Browsers only autoplay
// muted video, so it starts muted and offers "Play with sound", which restarts it from the top with the voice on.
// v2 (9 Oct 2026): the title card says Shoot Ops; a new file name so CDNs and browsers don't serve the old card.
const VIDEO_POSTER = '/videos/concierge-order-intake-poster-v2.jpg';

const PROOF = [
  { value: '10 min', label: 'between inbox sweeps' },
  { value: '±3 h', label: 'slot search around the request' },
  { value: '1', label: 'order per email — never two' },
  { value: '#', label: 'order number read back' },
  { value: '3', label: 'tries before a person is asked' },
];

const PIPELINE: {
  n: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  Icon: React.ComponentType<{ className?: string }>;
  Panel: React.FC;
}[] = [
  {
    n: '01',
    eyebrow: 'Address',
    title: 'The address goes in the way the form wants it.',
    body: 'It types the listing address into the order form’s own address search and waits for the map to appear — the form’s sign that it accepted the address.',
    bullets: [
      'The unit number is checked twice: what the email says, and what the address search filled in. When they disagree, the email wins.',
      'If the form won’t take the address after three tries, the order isn’t guessed at. The email gets an ADDRESS ISSUE label.',
    ],
    Icon: MapPin,
    Panel: AddressPanel,
  },
  {
    n: '02',
    eyebrow: 'Order form',
    title: 'Every field your team used to retype.',
    body: 'Square footage, access instructions (lockbox or agent access), the lockbox code, and the region — taken from the agent’s office area, not typed from memory.',
    bullets: [
      'The appointment notes are written for the photographer in one block: lockbox yes or no, the code, where it is, and the agent’s own notes word for word.',
      'Your standing defaults are set the same way on every order.',
      'An office area you haven’t mapped to a region yet stops the order with a NEW REGION label.',
    ],
    Icon: FileText,
    Panel: FormPanel,
  },
  {
    n: '03',
    eyebrow: 'Agent & services',
    title: 'The right agent, the right package, the right add-ons.',
    body: 'The agent is found by email address, never by name — names have duplicates, emails don’t. Then the package and each add-on the agent chose go on the order.',
    bullets: [
      'Add-ons are mapped per state, where what you sell differs by market.',
      'A selection it has no mapping for is never dropped quietly: the order is flagged so a person adds it.',
      'An agent who isn’t in your system yet gets a NEW CLIENT label instead of a guess.',
    ],
    Icon: UserCheck,
    Panel: ServicesPanel,
  },
  {
    n: '04',
    eyebrow: 'Scheduling',
    title: 'The nearest open slot to the time they asked for.',
    body: 'The calendar is set to the time zone written in the email, it walks to the requested month and day, and it books the open slot closest to the requested time, within three hours either side.',
    bullets: [
      'A twilight shoot gets its second appointment booked too, with the same photographer on both when one is free for both.',
      'Nothing open in the window: a NO AVAILABILITY label, and the order waits for a person.',
    ],
    Icon: CalendarClock,
    Panel: SlotsPanel,
  },
  {
    n: '05',
    eyebrow: 'Submit & verify',
    title: 'An order only counts once it exists.',
    body: 'Before it clicks submit, it records that it’s about to — so even a crash at that exact moment can’t lead to the same order being placed twice. After submitting, it reads the order number back.',
    bullets: [
      'No payment step: you invoice as usual.',
      'If the order number can’t be read back, the order is not called placed. It’s flagged for a person to check.',
      'The email gets a star when the order is placed and verified.',
    ],
    Icon: ShieldCheck,
    Panel: VerifyPanel,
  },
];

const INCLUDED = [
  'One email source',
  'One destination platform (Aryeo or Spiro)',
  'Up to 12 service types mapped',
  'Every order logged: placed, verified or held',
  'Held orders labelled in your inbox with the reason',
  'Two weeks of tuning',
];

const NOT_INCLUDED = [
  'Order sources other than email (forms, phone)',
  'A second platform',
  'Custom pricing rules',
  'Checking orders once they’re placed — that is Order Review',
  'Photo QA — that is the Real-time Photo Review module',
];

const TWO_WEEKS = [
  { when: 'Day 1', what: 'You share access and forward a few past concierge emails. We map your offices, regions and service types.' },
  { when: 'Days 2–5', what: 'The first real orders go through while you watch. Anything it holds, we look at together and tune.' },
  { when: 'By day 7', what: 'Live. Orders are placed and verified without anyone retyping them.' },
  { when: 'Day 14', what: 'Keep it, or get a full refund if orders are not landing correctly.' },
];

const ACCESS = [
  'A team-member login on your Aryeo or Spiro account — not the owner login. You can revoke it any time.',
  'Read access to the mailbox that receives the concierge emails, and permission to label them.',
  'It runs in your own Google and GitHub accounts. You keep the code. Nothing about your orders leaves your accounts.',
];

const FAQS = [
  {
    q: 'Does it place orders without me?',
    a: 'Yes — that is the job. It places the order, reads the order number back to confirm the order exists, and stops only when it is not sure. Those it holds and labels. Nothing is placed blindly.',
  },
  {
    q: 'What if my emails look different every time?',
    a: 'That is what it is for. If it cannot read one, it holds the order and asks you rather than guessing.',
  },
  {
    q: 'What if the email has no square footage?',
    a: 'It still places the order, with a placeholder figure your team can see, so nothing stalls. If you also run Order Review, it flags the placeholder and brings the public-record square footage onto the order.',
  },
  {
    q: 'What happens when Aryeo or Spiro changes something?',
    a: 'Their order forms change without notice — Aryeo changed its form layout on 1 September 2026. When a form no longer looks the way the module expects, it stops and tells you instead of placing wrong orders. If you want it repaired, we quote the repair first — there is no subscription and no obligation either way.',
  },
  {
    q: 'What happens after two weeks?',
    a: 'It keeps running. Nothing else is due. If something breaks later, a repair is quoted before any work, and you decide.',
  },
  {
    q: 'Who owns the accounts it uses?',
    a: `You do. ${platformTermsNote}`,
  },
];

const OrderIntakePage: React.FC<OrderIntakePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Hero planes: copy settles, the figure lags as the hero scrolls out (same rules as /shoot-ops).
  const heroRef = useScrollProgress<HTMLElement>({ mode: 'exit' });

  // Carry the outreach token through to the booking page, so a call books against the email that produced it.
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
        className="px-8 py-4"
        analytics={{
          cta_id: 'book_anton',
          surface,
          from_page: '/shoot-ops/concierge-order-intake',
          destination: '/book/anton',
          video_variant: variant,
        }}
      >
        Book 15 minutes with Anton
      </Button>
    </a>
  );

  const toVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('video')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toPage = (page: Page) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <div className="flex flex-col w-full overflow-x-clip min-h-screen">
      <Header onNavigate={onNavigate} currentPage="order-intake" />

      {/* Hero */}
      <Section className="pt-32 pb-16 md:pt-40 md:pb-24 lg:min-h-[88vh] flex items-center" overflow innerRef={heroRef}>
        <div className="hero-scaffold absolute inset-0 pointer-events-none" aria-hidden="true">
          <VitruvianBackground className="opacity-[0.08] -right-1/4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative z-10 hero-copy">
            <ScrollReveal immediate>
              <PageHero
                eyebrow={
                  <a href="/shoot-ops" onClick={toPage('autopilot')} className="hover:text-ink transition-colors">
                    <Eyebrow>Shoot Ops · Module 01</Eyebrow>
                  </a>
                }
                title={<>Concierge Order Intake<br /><span className="italic text-ink-muted/80">from email to booked order.</span></>}
                description="Concierge order emails, placed in Aryeo or Spiro — without anyone retyping them. The right order form, the right agent, the nearest open slot, and the order number read back before it counts."
                size="md"
                actions={
                  <>
                    <BookButton surface="hero" />
                    <Button variant="secondary" onClick={toVideo} className="px-8 py-4">Watch the 60-second walkthrough</Button>
                  </>
                }
              />
              <div className="mt-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Built for</span>
                  <span aria-hidden="true" className="h-px w-6 bg-ink-muted/30" />
                </div>
                <ul className="flex flex-wrap items-center gap-x-9 gap-y-5">
                  {shootOpsPlatforms.map((platform) => (
                    <li key={platform.name} className="flex items-center">
                      <img src={platform.logo} alt={platform.name} width={platform.width} height={platform.height} className="h-7 md:h-8 w-auto" loading="lazy" decoding="async" />
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6 hero-plate">
            <ScrollReveal delay={300} direction="left">
              <Plate fig="i" title="Email → order" compact>
                <HeroPipeline />
              </Plate>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Proof strip */}
      <section className="border-y border-ink/10 bg-white/35">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {PROOF.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <div className="font-serif text-3xl text-ink">{item.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Video */}
      <Section id="video" className="py-20 md:py-28 scroll-mt-20" pattern="grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow="Fig. ii · The walkthrough" title="One real order, start to finish." className="mb-6!" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              Sixty seconds on real screens, with the shop and the people changed: the email arrives, the order is placed, the
              number comes back.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="aspect-video w-full border border-ink/10 rounded-xs overflow-hidden bg-ink/5 shadow-widget-raised">
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
                    className="hidden md:inline-flex absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink/85 hover:bg-ink text-white font-sans text-base px-5 py-3 shadow-lg transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                    Play with sound
                  </button>
                )}
              </div>
            </div>
            {!soundOn && (
              <button
                type="button"
                onClick={playWithSound}
                className="md:hidden mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xs bg-ink text-white font-sans text-base px-5 py-3 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Volume2 className="w-5 h-5" aria-hidden="true" />
                Play with sound
              </button>
            )}
            <div className="mt-8">
              <BookButton surface="under_video" />
            </div>
          </div>
        </div>
      </Section>

      {/* Reading the email */}
      <Section className="py-20 md:py-28 bg-white/35" pattern="circles">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow="Fig. iii · Reading the email"
              title="Every field, taken from the email — not from memory."
              subtitle="Every ten minutes it checks the inbox for new concierge emails, oldest first, and reads each one line by line. An email it has already handled is never handled twice."
            />
            <ul className="space-y-3">
              {[
                'Address, square footage, beds and baths',
                'The package and every photography selection',
                'The requested date, time and time zone',
                'Lockbox yes or no, the code and where it is',
                'The agent’s name, email, phone and office area',
                'The agent’s own notes, word for word',
              ].map((t) => (
                <li key={t} className="flex gap-3 items-baseline font-sans text-ink-muted leading-relaxed">
                  <Check className="w-4 h-4 text-accent shrink-0 translate-y-0.5" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal direction="left">
              <Plate fig="iii" title="The email" compact>
                <ParsedEmail />
              </Plate>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* The pipeline */}
      <Section id="how" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="Fig. iv · From email to order"
          title="Five steps a careful admin takes — taken every time."
          subtitle="The same steps your best person follows, by rule, on every order. Where a person would stop and ask, it stops and labels the email."
        />
        <Stack>
          {PIPELINE.map((step) => (
            <article key={step.n} className="stack-card grid grid-cols-1 lg:grid-cols-12 gap-8 bg-paper border border-ink/10 p-6 md:p-10 shadow-lg shadow-ink/5 rounded-xs">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mb-3">Step {step.n} · {step.eyebrow}</div>
                <div className="border border-ink/10 bg-white/60 rounded-xs p-4">
                  <step.Panel />
                </div>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <step.Icon className="w-5 h-5 text-accent" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{step.eyebrow}</span>
                </div>
                <h3 className="font-serif text-2xl md:text-4xl md:leading-10 text-ink leading-tight mb-4">{step.title}</h3>
                <p className="font-sans text-[17px] leading-relaxed text-ink-muted mb-5">{step.body}</p>
                <ul className="space-y-2.5">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-ink-muted">
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Stack>
      </Section>

      {/* Inbox labels */}
      <section className="relative bg-ink text-canvas px-6 py-20 md:py-28 overflow-clip">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="font-serif italic text-base tracking-[0.15em] uppercase text-canvas/60 mb-4">Fig. v · Your inbox</div>
            <h2 className="font-serif text-4xl md:text-5xl md:leading-none font-bold leading-[1.05] tracking-tight mb-6">
              Every order email ends with a star or a label.
            </h2>
            <p className="font-serif text-lg md:text-xl md:leading-7 text-canvas/75 leading-relaxed mb-8">
              A star means placed and verified. A label means it stopped, and says why — so your team works the short list,
              not the whole inbox.
            </p>
            <ul className="space-y-4">
              {LABELS.map((l) => (
                <li key={l.name} className="grid grid-cols-[8.5rem_1fr] gap-4 items-baseline">
                  <span className="justify-self-start rounded-xs px-2 py-0.5 font-sans text-[11px] font-semibold" style={{ background: l.bg, color: l.text }}>
                    {l.name}
                  </span>
                  <span className="font-sans text-sm text-canvas/80 leading-relaxed">{l.when}</span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-sm text-canvas/60 leading-relaxed mt-8">
              A hiccup — a slow page, a timeout — is retried on the next sweeps before anything is labelled, up to three tries.
              Alerts go out only when an order might exist that the records don’t account for, so you hear about the rare thing
              that needs a person.
            </p>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal direction="left">
              <div className="rotate-[-1.5deg] hover:rotate-0 transition-transform duration-700">
                <InboxMock />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Price */}
      <Section className="py-20 md:py-28" pattern="circles">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Fig. vi · The offer" title="One price. Live within a week." className="mb-8!" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              If keying in an order takes five minutes and you get ten a day, that’s about twenty hours a month back — and no
              orders on the wrong order form, wrong region or wrong agent, which is where the expensive mistakes come from.
              Your numbers will differ; the walkthrough shows the real thing.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-ink/15 bg-white/80 rounded-xs p-8 md:p-10 shadow-widget-raised">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Price</div>
              <div className="font-serif text-5xl md:text-6xl md:leading-none text-ink leading-none mb-5">
                $2,500<span className="text-ink-muted text-2xl md:text-3xl ml-3">fixed</span>
              </div>
              <ul className="space-y-2 font-sans text-ink-muted leading-relaxed">
                <li>Live within a week.</li>
                <li>Refund in full if orders aren't landing correctly after two weeks.</li>
                <li>That is the whole price for the module. It keeps running after the two weeks, in your own accounts, and you keep the code.</li>
              </ul>
              <div className="font-sans text-sm text-ink-muted leading-relaxed mt-6 pt-6 border-t border-ink/10 space-y-3">
                <p>
                  <span className="text-ink">No subscription:</span> if an Aryeo or Spiro change breaks something after the
                  two weeks, the repair is quoted before any work. You decide; nothing is owed until you do.
                </p>
                <p>
                  <span className="text-ink">Change orders:</span> a second email source, a second platform or more
                  than 12 service types is quoted before the work, never after.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-ink/10">
                <div>
                  <div className="font-serif text-xl text-ink mb-4">Included</div>
                  <ul className="space-y-2.5">
                    {INCLUDED.map((item) => (
                      <li key={item} className="flex gap-3 items-baseline font-sans text-sm text-ink-muted leading-relaxed">
                        <Check className="w-4 h-4 text-accent shrink-0 translate-y-0.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-serif text-xl text-ink mb-4">Not included</div>
                  <ul className="space-y-2.5">
                    {NOT_INCLUDED.map((item) => (
                      <li key={item} className="flex gap-3 items-baseline font-sans text-sm text-ink-muted leading-relaxed">
                        <X className="w-4 h-4 text-ink-muted/50 shrink-0 translate-y-0.5" aria-hidden="true" />
                        <span>
                          {item.startsWith('Checking orders') ? (
                            <>
                              Checking orders once they’re placed — that is{' '}
                              <a href="/shoot-ops/order-review" onClick={toPage('order-review')} className="underline underline-offset-2 hover:text-ink">
                                Order Review
                              </a>
                            </>
                          ) : (
                            item
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* The other starter module */}
      <ModulePairing current="order-intake" onNavigate={onNavigate} />

      {/* The first two weeks + access */}
      <Section className="py-20 md:py-28 bg-white/35" pattern="grid">
        <SectionHeader eyebrow="Fig. vii · Getting started" title="How the first two weeks go." />
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {TWO_WEEKS.map(({ when, what }, i) => (
            <li key={when} className="relative bg-white/80 border border-ink/10 rounded-xs p-6 shadow-xs">
              <div className="font-serif italic text-3xl text-ink-muted/30 mb-2">0{i + 1}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">{when}</div>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{what}</p>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h3 className="font-serif text-3xl text-ink leading-tight">What access it needs</h3>
          </div>
          <ul className="lg:col-span-8 space-y-3">
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
      <Section className="py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <SectionHeader eyebrow="Questions" title="What owners ask first." className="mb-6!" />
          </div>
          <div className="lg:col-span-8 space-y-8">
            {FAQS.map(({ q, a }) => (
              <section key={q} className="border-b border-ink/10 pb-8 last:border-0">
                <h3 className="font-serif text-2xl text-ink mb-3">{q}</h3>
                <p className="font-sans text-ink-muted leading-relaxed">{a}</p>
              </section>
            ))}
          </div>
        </div>
      </Section>

      {/* Close */}
      <Section className="py-20 md:py-28 bg-white/35" pattern="circles">
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
