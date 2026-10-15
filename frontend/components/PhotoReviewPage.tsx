import React, { useEffect, useMemo } from 'react';
import { Check, Eye, Gauge, Send, Upload, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Button, Eyebrow, PageHero, Plate, ScrollReveal, Section, SectionHeader, VitruvianBackground } from './Shared';
import { Stack } from './motion/Stack';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { useScrollProgress } from '../lib/useScrollProgress';
import { termsNoteFor } from '../content/shootOpsModules';
import { ModuleSchematic } from './ShootOpsModuleSchematics';
import { HeroUploads, MeasurePanel, OUTCOMES, TicketMock, TicketPanel, UploadPanel, VisionPanel } from './photoReview/ReviewVisuals';
import ModulePairing from './ModulePairing';
import AntonSketch from '../images/Anton_Sketch.webp';

interface PhotoReviewPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Module 04 (Anton, 15 Oct 2026): $2,500 fixed plus AI usage at cost (the client's own AI account, paid directly), Aryeo
// only, same two-week refund and no-subscription terms, in the same layout as the other three module pages. The checks
// are taken from the module's production code (job-review-advanced): twelve checks on — focus and near-duplicates
// measured first with an AI second look, then one combined AI pass per photo for the rest; exposure and room coverage
// are built but switched off after tuning. One ticket per order, only when something is wrong; a photo it couldn't check
// is never good. REAL TIME IS THE OFFER: today's code reviews each order once from the morning list; the page describes
// photos checked as they are uploaded (Anton, 15 Oct 2026), with no minute figure because none has been measured.
// Client names never appear; listing data is fictional. Books with Anton like every Shoot Ops page.

const PROOF = [
  { value: '12', label: 'checks on every photo' },
  { value: '#', label: 'every finding names the frame' },
  { value: '1', label: 'ticket per order, only if needed' },
  { value: '0', label: 'tickets for a clean order' },
  { value: 'Never', label: 'calls a photo good it couldn’t check' },
];

// Fig. iii — the twelve checks that are on, grouped. From rules.seed.json (config v9) and the vision questions.
const CHECKS: { group: string; items: { title: string; body: string }[] }[] = [
  {
    group: 'Focus and duplicates',
    items: [
      { title: 'Focus', body: 'Frames much softer than the listing’s own photos, confirmed by an AI second look before they count.' },
      { title: 'Near-duplicates', body: 'Two frames that are almost the same — keep one. A photo and its ordered day-to-dusk or staged version are never duplicates.' },
    ],
  },
  {
    group: 'Framing',
    items: [
      { title: 'Verticals', body: 'Walls and lines that lean enough for a buyer to notice — not small leans or wide-angle edges.' },
      { title: 'Crop and composition', body: 'A roofline or main subject cut off, or driveway and street pushing the house out of the frame.' },
      { title: 'Camera angle', body: 'A viewpoint or obstruction that hides the subject and could have been avoided by moving the camera.' },
    ],
  },
  {
    group: 'Light and capture',
    items: [
      { title: 'Sun and glare', body: 'Shot into the sun: flare, a blown-out sky behind the house.' },
      { title: 'Reflections', body: 'The photographer or camera visible in a mirror, window or glass.' },
      { title: 'Noise', body: 'Grain above an acceptable level.' },
      { title: 'Colour cast', body: 'A white-balance cast, or colour that doesn’t match the rest of the set.' },
      { title: 'HDR artifacts', body: 'Halos around fixtures and windows, ghosting, blown-out windows.' },
    ],
  },
  {
    group: 'What a listing must not show',
    items: [
      { title: 'Signs and branding', body: 'Phone numbers, emails, web addresses, agent branding, watermarks, for-sale and yard signs. The required “Virtually Staged” label is not a finding.' },
    ],
  },
  {
    group: 'What was ordered',
    items: [
      { title: 'Ordered photo types', body: 'When the order includes aerial, twilight, virtual twilight or virtual staging, the set has them.' },
    ],
  },
];

// Fig. iv — one photo's path, in the order the production code does it (pick up → measure → look → ticket).
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
    eyebrow: 'Pick up',
    title: 'Photos are checked as they land.',
    body: 'When your editor uploads finished photos to the Aryeo listing, it picks them up and starts checking — it doesn’t wait for a morning list or for someone to ask.',
    bullets: [
      'It reads the photos shown on the listing, in listing order, so “image 17” means the same photo to it and to your editor.',
      'A listing with no photos yet is left alone until it has some.',
    ],
    Icon: Upload,
    Panel: UploadPanel,
  },
  {
    n: '02',
    eyebrow: 'Measure',
    title: 'Focus and duplicates, measured first.',
    body: 'Each photo is measured against the rest of the set. A frame much softer than the listing’s own photos is a focus suspect, and near-identical frames are found by image fingerprint.',
    bullets: [
      'A suspect gets an AI second look before it counts — a soft photo of a soft subject isn’t a finding.',
      'A photo and its ordered day-to-dusk or virtually staged version are twins, never duplicates.',
    ],
    Icon: Gauge,
    Panel: MeasurePanel,
  },
  {
    n: '03',
    eyebrow: 'Look',
    title: 'One AI look per photo, every check at once.',
    body: 'Photos go to the vision model in small batches, and each one is asked every check that is on — verticals, framing, angle, sun, reflections, noise, colour, HDR, signs and branding — with a verdict per photo per check.',
    bullets: [
      'On framing and angle, a finding has to say what it saw; a claim its own evidence contradicts is dropped.',
      'Brightness and colour checks skip virtual twilight and staged images, which are meant to look that way.',
      'A call that fails or times out is tried once more, then marked “couldn’t check” — never “good”.',
    ],
    Icon: Eye,
    Panel: VisionPanel,
  },
  {
    n: '04',
    eyebrow: 'Ticket',
    title: 'One ticket per order, only if something is wrong.',
    body: 'If any photo has an issue, one ticket goes to your order queue: the order and address, then only the problem photos — number, file name and a link to each.',
    bullets: [
      'A clean order sends nothing. Silence is the all-clear.',
      'Photos it couldn’t check are one quiet line at the end, not a ticket of their own.',
      'The same finding is never ticketed twice.',
    ],
    Icon: Send,
    Panel: TicketPanel,
  },
];

const INCLUDED = [
  'The twelve checks, tuned to your shop’s standards',
  'Your ordered photo types: aerial, twilight, virtual twilight, virtual staging',
  'One Aryeo account, every listing your team uploads photos to',
  'One ticket per order with issues, sent to your order queue',
  'Every photo’s result logged, good ones included',
  'Two weeks of tuning from the examples your team sends back',
];

const NOT_INCLUDED = [
  'Platforms other than Aryeo',
  'Editing or replacing photos — it names the frame; your editor fixes it',
  'Checking that everything ordered was delivered — that is the Daily Report',
  'Room sequencing and lockbox detection — quoted separately',
];

const TWO_WEEKS = [
  { when: 'Day 1', what: 'You share access and a handful of photos your editors would send back, and why. We set the checks to your standards, connect the AI account in your name, and agree where tickets go.' },
  { when: 'Days 2–5', what: 'It checks every photo as it is uploaded and sends its tickets to us only. We compare them with your editors’ own calls and tune each check from the examples you dispute.' },
  { when: 'By day 7', what: 'Live. Tickets go to your order queue, one per order, only when something is wrong.' },
  { when: 'Day 14', what: 'Keep it, or get a full refund if it isn’t catching what it should. By then you’ve seen the AI cost on your own orders.' },
];

const ACCESS = [
  'A team-member login on your Aryeo account — not the owner login. You can revoke it any time. It only reads; it changes nothing in Aryeo.',
  'An AI account in your name for the vision checks. You pay its usage directly, at the provider’s rates.',
  'An address for the tickets: the order queue or inbox your team already works from.',
  'It runs in your own Google and GitHub accounts, and you keep the code. Photos go only to the AI model for the check, through your own account.',
];

const FAQS = [
  {
    q: 'Does it change anything in Aryeo or my photos?',
    a: 'No. It reads the listing and sends one ticket when something is wrong. It never edits, moves or deletes a photo; your editor does the fix.',
  },
  {
    q: 'Who decides whether a finding gets fixed?',
    a: 'Your team. It reports every check that is on — including sun and camera angle, which only a reshoot can fix — and whether to re-edit, reshoot or just note it for the photographer is your call.',
  },
  {
    q: 'What if it’s wrong about a photo?',
    a: 'Send the example back. Each check is tuned from the photos your team disputes, and a check that keeps misfiring can be switched off on its own, without touching the others.',
  },
  {
    q: 'Will it flag virtual staging or day-to-dusk edits?',
    a: 'No. A photo and its staged or day-to-dusk version are twins, not duplicates; brightness and colour checks skip images that are meant to look edited; and the required “Virtually Staged” label is never treated as branding.',
  },
  {
    q: 'What does the AI cost?',
    a: 'You pay the AI provider directly, on your own account, at its own rates — we add nothing on top. It depends on how many photos you shoot, so we don’t quote a figure: you see the real cost on your own orders during the first two weeks, before you decide to keep it.',
  },
  {
    q: 'Does it need the other modules?',
    a: 'No. It checks whatever photos land on your listings. The four work well together: one places orders, one checks them when they land, this one checks each photo as it is uploaded, and the Daily Report checks the whole delivery.',
  },
  {
    q: 'What happens when Aryeo changes something?',
    a: 'Aryeo changes its screens without notice. A photo or panel it can’t read becomes “couldn’t check”, never “good”. If you want a change supported, we quote the repair first — there is no subscription and no obligation either way.',
  },
  {
    q: 'Who owns the accounts it uses?',
    a: `You do. ${termsNoteFor('Aryeo')}`,
  },
];

const PAGE_PATH = '/shoot-ops/photo-review';

const PhotoReviewPage: React.FC<PhotoReviewPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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

  const BookButton = ({ className = '', surface }: { className?: string; surface: string }) => (
    <a href={bookHref} onClick={bookNow} className={`inline-block ${className}`}>
      <Button variant="primary" className="px-8 py-4" analytics={{ cta_id: 'book_anton', surface, from_page: PAGE_PATH, destination: '/book/anton' }}>
        Book 15 minutes with Anton
      </Button>
    </a>
  );

  const toPage = (page: Page) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  const toTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('ticket')?.scrollIntoView({ behavior: 'smooth' });
  };

  const linked = (item: string) => {
    const links: [string, string, Page][] = [
      ['Daily Report', '/shoot-ops/daily-report', 'daily-report'],
    ];
    for (const [label, href, page] of links) {
      if (item.endsWith(`that is ${label}`)) {
        return (
          <>
            {item.slice(0, item.length - label.length)}
            <a href={href} onClick={toPage(page)} className="underline underline-offset-2 hover:text-ink">{label}</a>
          </>
        );
      }
    }
    return item;
  };

  return (
    <div className="flex flex-col w-full overflow-x-clip min-h-screen">
      <Header onNavigate={onNavigate} currentPage="photo-review" />

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
                    <Eyebrow>Shoot Ops · Module 04</Eyebrow>
                  </a>
                }
                title={<>Real-time Photo Review<br /><span className="italic text-ink-muted/80">while the editor still has the job.</span></>}
                description="Every photo is checked as it is uploaded to the listing — focus, duplicates, verticals, framing, glare, reflections, signs and branding, the photo types that were ordered — and if something is wrong, one ticket names the frame before the order goes out."
                size="md"
                actions={
                  <>
                    <BookButton surface="hero" />
                    <Button variant="secondary" onClick={toTicket} className="px-8 py-4">See a ticket</Button>
                  </>
                }
              />
              <div className="mt-10 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Built for</span>
                <span aria-hidden="true" className="h-px w-6 bg-ink-muted/30" />
                <img src="/platforms/aryeo.png" alt="Aryeo" className="h-7 md:h-8 w-auto" loading="lazy" decoding="async" />
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6 hero-plate">
            <ScrollReveal delay={300} direction="left">
              <Plate fig="i" title="Photos, checked as they land" compact>
                <HeroUploads />
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

      {/* How it works */}
      <Section id="how" className="py-20 md:py-28" pattern="grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Fig. ii · How it works" title="One question, asked of every photo." className="mb-6!" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-4">
              Would your best editor send this one back? As photos are uploaded to the listing, each one is checked the
              way that editor would look at it — focus, duplicates, lines, framing, light, anything in the picture that
              shouldn’t be there.
            </p>
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              If one isn’t right, your team gets one ticket for the order that names the frame — while the job is still
              open, instead of after the agent has seen it.
            </p>
          </div>
          <div className="lg:col-span-7">
            <figure className="border border-ink/10 rounded-xs bg-white/70 p-5 md:p-8 shadow-widget-raised">
              <ModuleSchematic id="photo-review" className="aspect-5/3 w-full" />
              <figcaption className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mt-4">
                Every frame looked at, the wrong one named
              </figcaption>
            </figure>
            <div className="mt-8">
              <BookButton surface="under_figure" />
            </div>
          </div>
        </div>
      </Section>

      {/* What it checks */}
      <Section id="checks" className="py-20 md:py-28 bg-white/35 scroll-mt-20" pattern="circles">
        <SectionHeader
          eyebrow="Fig. iii · What it checks"
          title="Twelve checks on every photo."
          subtitle="Each one is a separate switch, tuned to your standards. Two more — exposure outliers and room coverage — are built and off by default; either can be switched on."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {CHECKS.map((g) => (
            <ScrollReveal key={g.group}>
              <article className="h-full bg-white/85 border border-ink/10 rounded-xs p-6 shadow-xs">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">{g.group}</div>
                <ul className="space-y-3">
                  {g.items.map((c) => (
                    <li key={c.title} className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-4 items-baseline">
                      <span className="font-serif text-lg text-ink leading-tight">{c.title}</span>
                      <span className="font-sans text-sm text-ink-muted leading-relaxed">{c.body}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* One photo, four steps */}
      <Section id="pipeline" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="Fig. iv · From upload to ticket"
          title="The look your best editor gives a set — on every photo."
          subtitle="The same order of work, by rule, on every upload. Where a person would stop and look again, it names the frame."
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

      {/* The ticket (dark) */}
      <section id="ticket" className="relative bg-ink text-canvas px-6 py-20 md:py-28 overflow-clip scroll-mt-20">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="font-serif italic text-base tracking-[0.15em] uppercase text-canvas/60 mb-4">Fig. v · The ticket</div>
            <h2 className="font-serif text-4xl md:text-5xl md:leading-none font-bold leading-[1.05] tracking-tight mb-6">
              One ticket per order. Each frame named.
            </h2>
            <p className="font-serif text-lg md:text-xl md:leading-7 text-canvas/75 leading-relaxed mb-8">
              Every photo ends one of four ways. Only issues make a ticket — the order and address first, then each
              problem photo with its number, file name and link.
            </p>
            <ul className="space-y-5">
              {OUTCOMES.map((o) => (
                <li key={o.name} className="grid grid-cols-[2rem_1fr] gap-3">
                  <o.Icon className={`w-5 h-5 mt-0.5 ${o.tone === 'text-ink-muted' ? 'text-canvas/50' : o.tone.replace('700', '400')}`} />
                  <div>
                    <div className="font-serif text-xl">{o.name}</div>
                    <p className="font-sans text-sm text-canvas/75 leading-relaxed">{o.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal direction="left">
              <div className="rotate-[-1.5deg] hover:rotate-0 transition-transform duration-700">
                <TicketMock />
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
              A soft photo or a readable yard sign costs most when the agent finds it: a re-edit, a re-delivery,
              sometimes a reshoot. Real-time Photo Review moves that catch to the moment the photo is uploaded, while the
              editor still has the job open. We won’t put a number on it for you — count last month’s photo redos and
              you’ll have yours.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-ink/15 bg-white/80 rounded-xs p-8 md:p-10 shadow-widget-raised">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Price</div>
              <div className="font-serif text-5xl md:text-6xl md:leading-none text-ink leading-none mb-5">
                $2,500<span className="text-ink-muted text-2xl md:text-3xl ml-3">fixed</span>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink mb-5">+ AI usage at cost, paid directly</div>
              <ul className="space-y-2 font-sans text-ink-muted leading-relaxed">
                <li>Live within a week.</li>
                <li>Refund in full if it isn’t catching what it should after two weeks.</li>
                <li>That is the whole price for the module. It keeps running after the two weeks, in your own accounts, and you keep the code.</li>
              </ul>
              <div className="font-sans text-sm text-ink-muted leading-relaxed mt-6 pt-6 border-t border-ink/10 space-y-3">
                <p>
                  <span className="text-ink">No subscription:</span> if an Aryeo change breaks something after the two
                  weeks, the repair is quoted before any work. You decide; nothing is owed until you do.
                </p>
                <p>
                  <span className="text-ink">AI usage:</span> every photo gets an AI look. That runs on an account in
                  your name, and you pay the provider directly at its rates — we add nothing. You see the real cost on your
                  own orders in the first two weeks.
                </p>
                <p>
                  <span className="text-ink">Change orders:</span> a new check or a second account is quoted before the
                  work, never after. Tuning a check to your standards is part of the module.
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
                        <span>{linked(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Two of the other fixed-price modules */}
      <ModulePairing current="photo-review" onNavigate={onNavigate} />

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
            Its checks were tuned on graded production mornings at a real-estate media company in Texas.
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
                Fifteen minutes to check it fits your editors’ standards, and to pick a start date.
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

export default PhotoReviewPage;
