import React, { useEffect, useMemo } from 'react';
import { Check, FileSearch, ListChecks, ListTodo, Send, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Button, Eyebrow, PageHero, Plate, ScrollReveal, Section, SectionHeader, VitruvianBackground } from './Shared';
import { Stack } from './motion/Stack';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { useScrollProgress } from '../lib/useScrollProgress';
import { termsNoteFor } from '../content/shootOpsModules';
import { ModuleSchematic } from './ShootOpsModuleSchematics';
import { HeroReport, ListPanel, ListingPanel, MatrixPanel, OUTCOMES, ReportMock, SendPanel } from './dailyReport/ReportVisuals';
import ModulePairing from './ModulePairing';
import AntonSketch from '../images/Anton_Sketch.webp';

interface DailyReportPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Module 03 (Anton, 15 Oct 2026): $2,500 fixed, Aryeo only, same two-week refund and no-subscription terms as the
// other two modules, in the same layout as the Order Review page. Everything below is taken from the module's
// production code (the delivery audit): the day's list from a saved view, resumable sweeps from six, the product
// matrix (images, video, 3D, floor plans, files, custom property website), special handling, image sub-types read
// from the delivered files' names (no vision call since 19 Sep 2026), and one report a day with missing items first.
// It does not move deliveries in Aryeo: the reschedule is built but switched off, so a person holds the delivery.
// Client names never appear; listing data is fictional.

const PROOF = [
  { value: '6:00', label: 'first sweep of the morning' },
  { value: '6', label: 'kinds of deliverable checked' },
  { value: '4', label: 'special image types, by file name' },
  { value: '1', label: 'report a day — never two' },
  { value: 'Never', label: 'calls a listing complete it couldn’t read' },
];

const DELIVERABLES: { title: string; body: string }[] = [
  { title: 'Photos', body: 'At least one finished image on the listing for every product that includes photography.' },
  { title: 'Video', body: 'A video on the listing when a product with video was ordered.' },
  { title: '3D tour', body: 'A Matterport or Zillow 3D tour linked when one was ordered.' },
  { title: 'Floor plans', body: 'A floor plan uploaded when a floor plan was ordered.' },
  { title: 'Files', body: 'The download files your products promise, such as branded and unbranded links.' },
  { title: 'Property website', body: 'A custom website address registered — the platform’s default address doesn’t count.' },
];

const SUBTYPES: { name: string; marker: string }[] = [
  { name: 'Aerial', marker: 'AERIAL' },
  { name: 'Twilight', marker: 'TWILIGHT' },
  { name: 'Virtual twilight', marker: 'day to dusk' },
  { name: 'Virtual staging', marker: 'virtually staged' },
];

// Fig. iv — one morning's run, in the order the production code does it (sweep → extract → checks → report).
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
    eyebrow: 'List',
    title: 'Every listing due for delivery, taken once.',
    body: 'At six it opens the saved view your team already uses for tomorrow’s deliveries and takes that list as the day’s work. A listing added to the view later in the morning isn’t picked up halfway through.',
    bullets: [
      'It checks the view really loaded — the right count, settled — before it trusts the list.',
      'If it can’t confirm the list is complete, it still checks what it can, but sends no report, so a partial list never looks like a full one.',
    ],
    Icon: ListTodo,
    Panel: ListPanel,
  },
  {
    n: '02',
    eyebrow: 'Read',
    title: 'What was ordered, and what is on the listing.',
    body: 'For each listing it reads the ordered products from the data behind the page, counts what is in each panel — images, video, 3D, floor plans, files — checks the property website address, and reads the name of every delivered image.',
    bullets: [
      'File names only. Your photos aren’t downloaded or sent anywhere.',
      'Short sweeps every ten minutes, each with a time limit, so one slow listing never costs the rest. A sweep that stops early resumes where it left off.',
    ],
    Icon: FileSearch,
    Panel: ListingPanel,
  },
  {
    n: '03',
    eyebrow: 'Check',
    title: 'Ordered against delivered, product by product.',
    body: 'Your product matrix says what each product must deliver. The listing’s products are combined into one list of expected deliverables, and each one is present, missing, or couldn’t be read — never assumed.',
    bullets: [
      'Ordered aerial, twilight, virtual twilight and virtual staging images must have a file named for them.',
      'Products that always need a person — a revisit, rush processing, custom edits — are flagged. Fees that deliver nothing are skipped.',
      'A product it doesn’t know yet goes to “could not verify”, not to “complete”.',
    ],
    Icon: ListChecks,
    Panel: MatrixPanel,
  },
  {
    n: '04',
    eyebrow: 'Report',
    title: 'One report, before the delivery window.',
    body: 'When the list is finished — or the cutoff arrives — it sends the whole morning as one email to your order queue. Later sweeps send nothing more.',
    bullets: [
      'Missing items first, then could not verify, then anything it didn’t reach, then every complete listing as one line.',
      'Every missing item says when it looked and how many images were on the listing then, so a late upload is easy to tell from a real gap.',
    ],
    Icon: Send,
    Panel: SendPanel,
  },
];

const INCLUDED = [
  'Your product matrix: each product mapped to what it must deliver',
  'Your file-naming convention for aerial, twilight, virtual twilight and virtual staging',
  'One Aryeo account and one saved view of tomorrow’s deliveries',
  'One report every morning, sent to your order queue',
  'Every listing’s result logged',
  'Two weeks of tuning',
];

const NOT_INCLUDED = [
  'Platforms other than Aryeo',
  'Holding or rescheduling deliveries in Aryeo — the report says what to hold; your team holds it',
  'Judging photo quality — that is Real-time Photo Review',
  'Checking orders when they land — that is Order Review',
];

const TWO_WEEKS = [
  { when: 'Day 1', what: 'You share access and your product list. We map every product to what it must deliver, agree the file names for aerial, twilight, virtual twilight and virtual staging, and where the report goes.' },
  { when: 'Days 2–5', what: 'It runs every morning and sends its report to us only. We compare it with your own pre-delivery check and tune the matrix.' },
  { when: 'By day 7', what: 'Live. The report goes to your order queue before your delivery window, every morning.' },
  { when: 'Day 14', what: 'Keep it, or get a full refund if it isn’t catching what it should.' },
];

const ACCESS = [
  'A team-member login on your Aryeo account — not the owner login. You can revoke it any time. It only reads; it changes nothing in Aryeo.',
  'A saved view of the listings due for delivery, or we set one up with you.',
  'An address for the report: the order queue or inbox your team already works from.',
  'It runs in your own Google and GitHub accounts. You keep the code. Nothing about your listings leaves your accounts.',
];

const FAQS = [
  {
    q: 'Does it change anything in Aryeo?',
    a: 'No. It reads listings and sends one report. Holding a delivery is your team’s call — the report puts the listings to hold at the top, with what is missing on each.',
  },
  {
    q: 'How does it know an image is aerial or twilight?',
    a: 'From the file name. Most shops already name finished files by type — AERIAL, TWILIGHT, “day to dusk”, “virtually staged”. We agree your names during setup, and it reads them on every delivered image. If it can’t read any file names on a listing, that listing goes to “could not verify”.',
  },
  {
    q: 'What if a file is uploaded after it looked?',
    a: 'Every missing item in the report says what time it looked and how many images were on the listing then. If the file appeared later, that line tells you it was a late upload, not a mistake in the check.',
  },
  {
    q: 'Will it send more than one report?',
    a: 'No. One report a day, written when the list is finished or the cutoff arrives — a clean morning included, so you know it ran. If it can’t confirm it was looking at the whole list, it sends nothing rather than a report that looks complete but isn’t.',
  },
  {
    q: 'Does it need the other modules?',
    a: 'No. It reads whatever is on your listings, however the orders were placed and checked. The three work well together: one places orders, one checks them when they land, and this one checks the delivery.',
  },
  {
    q: 'What happens when Aryeo changes something?',
    a: 'Aryeo changes its screens without notice. The module reads products from the data behind the page rather than its layout, and a panel it can’t read becomes “could not verify”, never “complete”. If you want a change supported, we quote the repair first — there is no subscription and no obligation either way.',
  },
  {
    q: 'What happens after two weeks?',
    a: 'It keeps running. Nothing else is due. If something breaks later, a repair is quoted before any work, and you decide.',
  },
  {
    q: 'Who owns the accounts it uses?',
    a: `You do. ${termsNoteFor('Aryeo')}`,
  },
];

const PAGE_PATH = '/shoot-ops/daily-report';

const DailyReportPage: React.FC<DailyReportPageProps> = ({ onNavigate }) => {
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

  const toReport = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
  };

  const linked = (item: string) => {
    const links: [string, string, Page][] = [
      ['Real-time Photo Review', '/shoot-ops', 'autopilot'],
      ['Order Review', '/shoot-ops/order-review', 'order-review'],
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
      <Header onNavigate={onNavigate} currentPage="daily-report" />

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
                    <Eyebrow>Shoot Ops · Module 03</Eyebrow>
                  </a>
                }
                title={<>Daily Report<br /><span className="italic text-ink-muted/80">before it reaches the agent.</span></>}
                description="Every morning it checks each listing due for delivery against what was ordered — photos, video, 3D, floor plans, files, the property website, and the aerial and twilight shots — and sends one report before your delivery window: what is missing, what it couldn’t verify, what is complete."
                size="md"
                actions={
                  <>
                    <BookButton surface="hero" />
                    <Button variant="secondary" onClick={toReport} className="px-8 py-4">See the report</Button>
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
              <Plate fig="i" title="This morning’s report" compact>
                <HeroReport />
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
            <SectionHeader eyebrow="Fig. ii · How it works" title="One question, asked every morning." className="mb-6!" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-4">
              Was everything that was ordered actually delivered? From six o’clock it works through every listing due
              that day, compares what was ordered with what is on the listing, and notes anything absent.
            </p>
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              Before your delivery window, your team gets one report with the listings to hold at the top — instead of
              finding out from the agent.
            </p>
          </div>
          <div className="lg:col-span-7">
            <figure className="border border-ink/10 rounded-xs bg-white/70 p-5 md:p-8 shadow-widget-raised">
              <ModuleSchematic id="daily-review" className="aspect-5/3 w-full" />
              <figcaption className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mt-4">
                Every listing due today, one report
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
          title="Six kinds of deliverable, and four kinds of photo."
          subtitle="Your product matrix decides which apply to each listing. A deliverable is checked only when one of the listing’s products calls for it."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {DELIVERABLES.map((d, i) => (
            <ScrollReveal key={d.title}>
              <article className="h-full bg-white/85 border border-ink/10 rounded-xs p-6 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-ink leading-tight">{d.title}</h3>
                  <span className="font-serif italic text-2xl text-ink-muted/30">0{i + 1}</span>
                </div>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{d.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
        <div className="border border-ink/15 bg-white/80 rounded-xs p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">Ordered photo types</div>
              <p className="font-sans text-ink-muted leading-relaxed">
                When a product includes aerial, twilight, virtual twilight or virtual staging, at least one delivered image
                must be named for it. It reads your team’s own file names — nothing is guessed from the pictures.
              </p>
            </div>
            <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBTYPES.map((s) => (
                <li key={s.name} className="flex items-baseline justify-between gap-3 border border-ink/10 bg-white rounded-xs px-4 py-3">
                  <span className="font-serif text-lg text-ink">{s.name}</span>
                  <span className="font-mono text-[11px] text-ink-muted">“{s.marker}”</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* One morning, four steps */}
      <Section id="pipeline" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="Fig. iv · From six o’clock to the report"
          title="The pre-delivery check your best person does — on every listing."
          subtitle="The same order of work, by rule, every morning. Where a person would stop and look again, it puts the listing in the report."
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

      {/* The report (dark) */}
      <section id="report" className="relative bg-ink text-canvas px-6 py-20 md:py-28 overflow-clip scroll-mt-20">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="font-serif italic text-base tracking-[0.15em] uppercase text-canvas/60 mb-4">Fig. v · The report</div>
            <h2 className="font-serif text-4xl md:text-5xl md:leading-none font-bold leading-[1.05] tracking-tight mb-6">
              One report a morning. What to hold comes first.
            </h2>
            <p className="font-serif text-lg md:text-xl md:leading-7 text-canvas/75 leading-relaxed mb-8">
              Each listing lands in one of four places, with a direct link to it in Aryeo. The counts sit at the bottom —
              the listings that need a person are the report.
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
                <ReportMock />
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
              A missing floor plan or an aerial that never made it costs most when the agent finds it: a re-delivery, an
              apology, sometimes a lost client. The Daily Report moves that catch to the morning, before anything goes out.
              We won’t put a number on it for you — count last month’s re-deliveries and you’ll have yours.
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
                <li>Refund in full if it isn’t catching what it should after two weeks.</li>
                <li>That is the whole price for the module. It keeps running after the two weeks, in your own accounts, and you keep the code.</li>
              </ul>
              <div className="font-sans text-sm text-ink-muted leading-relaxed mt-6 pt-6 border-t border-ink/10 space-y-3">
                <p>
                  <span className="text-ink">No subscription:</span> if an Aryeo change breaks something after the two
                  weeks, the repair is quoted before any work. You decide; nothing is owed until you do.
                </p>
                <p>
                  <span className="text-ink">Change orders:</span> a new kind of deliverable or a second account is quoted
                  before the work, never after. New products are just a matrix update.
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

      {/* The other two fixed-price modules */}
      <ModulePairing current="daily-review" onNavigate={onNavigate} />

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
            Running every morning at a real-estate media company in Texas.
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
                Fifteen minutes to check that it fits how your deliveries actually work, and to pick a start date.
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

export default DailyReportPage;
