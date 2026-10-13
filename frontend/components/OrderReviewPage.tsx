import React, { useEffect, useMemo } from 'react';
import {
  Check,
  ClipboardList,
  Clock,
  FileSearch,
  FileWarning,
  Home,
  Inbox,
  KeyRound,
  ListChecks,
  MessageSquareWarning,
  Ruler,
  ScissorsLineDashed,
  Wrench,
  X,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Button, Eyebrow, PageHero, Plate, ScrollReveal, Section, SectionHeader, VitruvianBackground } from './Shared';
import { Stack } from './motion/Stack';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { useScrollProgress } from '../lib/useScrollProgress';
import { termsNoteFor } from '../content/shootOpsModules';
import { ModuleSchematic } from './ShootOpsModuleSchematics';
import { FixPanel, HeroReview, OUTCOMES, ReadPanel, ResultsPanel, SweepPanel, TicketMock } from './orderReview/ReviewVisuals';
import ModulePairing from './ModulePairing';
import AntonSketch from '../images/Anton_Sketch.webp';

interface OrderReviewPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Module 02 (Anton, 11 Oct 2026): $2,500 fixed, Aryeo only, same two-week refund and no-subscription terms as
// Concierge Order Intake. Redesigned the same day in the Intake page's look. Every check, fix and outcome below is
// taken from the module's production code and its checks reference (eight flag checks, six automatic fixes, the
// three-state result model, one ticket per flagged order). Client names never appear; order data is fictional.
// The walkthrough video comes later; until then Fig. ii is the module drawing.

const PROOF = [
  { value: '10 min', label: 'between sweeps' },
  { value: '8', label: 'checks on every new order' },
  { value: '6', label: 'fixes it makes on its own' },
  { value: '1', label: 'ticket per order — never two' },
  { value: 'Never', label: 'passes a field it couldn’t read' },
];

const CHECKS: { n: string; title: string; body: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  {
    n: '01',
    title: 'Profile not finished',
    body: 'The agent’s customer profile is missing your “profile complete” note — so whoever picks it up knows to finish it.',
    Icon: ClipboardList,
  },
  {
    n: '02',
    title: 'Placeholder item ordered',
    body: 'The agent skipped the main product and went straight to add-ons. The order may need combining with another one for the same listing.',
    Icon: ScissorsLineDashed,
  },
  {
    n: '03',
    title: 'Exteriors only',
    body: 'The notes or the access field say exterior photos only, so someone confirms with the client before an interior shoot is planned.',
    Icon: Home,
  },
  {
    n: '04',
    title: 'Square footage that doesn’t fit',
    body: 'Under 10 (vacant land), right on a pricing-tier edge, or over 10,000 (likely commercial). The public-record figure, beds and baths go on the ticket.',
    Icon: Ruler,
  },
  {
    n: '05',
    title: 'Lockbox with no code',
    body: 'Access is set to lockbox, but the code field is empty — caught before the photographer is standing at the door.',
    Icon: KeyRound,
  },
  {
    n: '06',
    title: 'Notes that need a person',
    body: 'A phone number or email in the appointment notes, a “call me before you go”, a request to shoot the community pool, or a note so long it’s burying something.',
    Icon: MessageSquareWarning,
  },
  {
    n: '07',
    title: 'Arrive whenever',
    body: '“Vacant, go anytime”, “feel free to come early” — notes that invite the photographer off the booked time, which the rest of the day is scheduled around.',
    Icon: Clock,
  },
  {
    n: '08',
    title: 'Wrong floor-plan size',
    body: 'A stand-alone floor plan ordered in a size band that doesn’t match the square footage. The ticket shows the band, the order’s figure and the public record.',
    Icon: FileWarning,
  },
];

// Fig. iv — the module's run on one order, in the order the production code does it (sweep.js → extract →
// checks.js → execute.js). The 3-D stacking cards match the Concierge Order Intake page; the ticket and the three
// endings follow in Fig. v.
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
    eyebrow: 'Find',
    title: 'Every order nobody has looked at yet.',
    body: 'Every ten minutes it opens your orders list, newest first, and picks up every order without a tag — scheduled or not. An order your team has already tagged is left alone.',
    bullets: [
      'A few orders per run, each with its own time limit, so one slow page never holds up the rest.',
      'If the platform is slow or the login fails, it stops cleanly and the next sweep starts again. Nothing is marked reviewed after a hiccup.',
    ],
    Icon: Inbox,
    Panel: SweepPanel,
  },
  {
    n: '02',
    eyebrow: 'Read',
    title: 'Everything a careful admin reads, every time.',
    body: 'The line items, square footage, access instructions and lockbox code, the appointment notes, the internal notes and the customer’s profile notes — then the address in public property records for beds, baths and square footage.',
    bullets: [
      'Line items come from the data behind the page, not from how the page looks, so a redesign doesn’t blind it.',
      'An order with no line items means the read failed. It isn’t reviewed; it’s read again on the next sweep.',
    ],
    Icon: FileSearch,
    Panel: ReadPanel,
  },
  {
    n: '03',
    eyebrow: 'Check',
    title: 'Eight checks. Three possible answers.',
    body: 'Each check ends as pass, flag, or couldn’t read — and couldn’t read is never counted as a pass. The appointment notes are read twice: by fixed patterns and by an AI read of the wording.',
    bullets: [
      'A note over 1,000 characters always goes to a person, whatever the patterns say: a long note usually buries something.',
      'Its own lines are stripped before the notes are read, so it never flags something it wrote itself.',
      'Public records only inform. Your square footage is never changed on their word.',
    ],
    Icon: ListChecks,
    Panel: ResultsPanel,
  },
  {
    n: '04',
    eyebrow: 'Fix',
    title: 'The small fixes, made and checked.',
    body: 'Only the fixes you agreed to during setup. After each one it reloads the order and confirms the change is there before it counts.',
    bullets: [
      'Cancels a skipped-product placeholder, then confirms every other item is still on the order.',
      'Adds beds and baths from public records to the appointment notes, with “HOA property, check for amenities” when the home has an HOA fee.',
      'Copies a property website from the notes to the top of your internal notes, dated; emails the agent your on-camera prep when a video with the agent is ordered.',
      'Sets the photographer’s floor-plan payout to the right size tier — and waits for a photographer to be assigned rather than guessing. A fix that fails three times goes to a person.',
    ],
    Icon: Wrench,
    Panel: FixPanel,
  },
];

const INCLUDED = [
  'The eight checks, mapped to your products, add-ons and markets',
  'One Aryeo account',
  'The automatic fixes you choose, each read back after it is made',
  'One ticket per order with issues, sent to your order queue',
  'Clean orders tagged as reviewed',
  'Every review logged',
  'Two weeks of tuning',
];

const NOT_INCLUDED = [
  'Platforms other than Aryeo',
  'New kinds of checks beyond the eight',
  'Placing orders — that is Concierge Order Intake',
  'Photo QA — that is Real-time Photo Review',
];

const TWO_WEEKS = [
  { when: 'Day 1', what: 'You share access. We map your products, add-ons and markets, agree which fixes it may make on its own, and where its tickets go.' },
  { when: 'Days 2–5', what: 'It checks your new orders and reports what it finds without changing anything. We go through its findings together and tune.' },
  { when: 'By day 7', what: 'Live. Fixes switched on one at a time; everything else arrives as one ticket per order.' },
  { when: 'Day 14', what: 'Keep it, or get a full refund if it isn’t catching what it should.' },
];

const ACCESS = [
  'A team-member login on your Aryeo account — not the owner login. You can revoke it any time.',
  'An address for its tickets: the order queue or inbox your team already works from.',
  'It runs in your own Google and GitHub accounts. You keep the code. Nothing about your orders leaves your accounts.',
];

const FAQS = [
  {
    q: 'Does it change orders without asking?',
    a: 'Only the fixes you agree to during setup, and each one is read back to confirm it took. A fix that keeps failing is handed to a person. Everything else becomes a ticket for a person to decide.',
  },
  {
    q: 'Will my team get a flood of alerts?',
    a: 'No. An order with issues gets one ticket that lists everything found — and what was already fixed, so nobody redoes it. A clean order gets nothing but a reviewed tag.',
  },
  {
    q: 'What if it can’t read a field?',
    a: 'Then the order isn’t marked reviewed. If there are real issues too, the ticket goes out and lists what it couldn’t verify; otherwise the next sweep looks again.',
  },
  {
    q: 'Where does the public-record data come from?',
    a: 'A property-records service looked up by the order’s address. Records can be stale or missing, so they only inform — the module never changes your square footage on their word.',
  },
  {
    q: 'Does it need Concierge Order Intake?',
    a: 'No. It checks every new order, however it was placed. The two work well together: one places the orders, the other checks them.',
  },
  {
    q: 'What happens when Aryeo changes something?',
    a: 'Aryeo changes its screens without notice — it rebuilt the order page in August 2026. The module checks which version of the page it is looking at before it reads or writes anything, and when it isn’t sure, it changes nothing at all. If you want a change supported, we quote the repair first — there is no subscription and no obligation either way.',
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

const PAGE_PATH = '/shoot-ops/order-review';

const OrderReviewPage: React.FC<OrderReviewPageProps> = ({ onNavigate }) => {
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

  const BookButton = ({ className = '', surface }: { className?: string; surface: string }) => (
    <a href={bookHref} onClick={bookNow} className={`inline-block ${className}`}>
      <Button variant="primary" className="text-[16px] px-8 py-4" analytics={{ cta_id: 'book_anton', surface, from_page: PAGE_PATH, destination: '/book/anton' }}>
        Book 15 minutes with Anton
      </Button>
    </a>
  );

  const toPage = (page: Page) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  const toChecks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('checks')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full overflow-x-clip min-h-screen">
      <Header onNavigate={onNavigate} currentPage="order-review" />

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
                    <Eyebrow>Shoot Ops · Module 02</Eyebrow>
                  </a>
                }
                title={<>Order Review<br /><span className="italic text-ink-muted/80">caught while it’s still a note.</span></>}
                description="Every new Aryeo order checked within ten minutes against eight rules. It fixes what is safe to fix, and sends one ticket for the rest — before the photographer is on the way, not after the revisit."
                size="md"
                actions={
                  <>
                    <BookButton surface="hero" />
                    <Button variant="secondary" onClick={toChecks} className="text-[16px] px-8 py-4">See the eight checks</Button>
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
              <Plate fig="i" title="One new order" compact>
                <HeroReview />
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

      {/* How it works (the drawing stands in for the walkthrough video until it is made) */}
      <Section id="how" className="py-20 md:py-28" pattern="grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow="Fig. ii · How it works" title="Every ten minutes, every new order." className="!mb-6" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-4">
              It opens each order nobody has looked at yet — scheduled or not — and reads everything a careful admin would:
              the line items, the square footage, the access fields, the appointment notes, the internal notes.
            </p>
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              Then it runs eight checks, makes the fixes you’ve allowed, and ends every order one of three ways.
            </p>
          </div>
          <div className="lg:col-span-7">
            <figure className="border border-ink/10 rounded-sm bg-white/70 p-5 md:p-8 shadow-widget-raised">
              <ModuleSchematic id="order-review" className="aspect-[5/3] w-full" />
              <figcaption className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mt-4">
                One order, eight checks, one ticket
              </figcaption>
            </figure>
            <div className="mt-8">
              <BookButton surface="under_figure" />
            </div>
          </div>
        </div>
      </Section>

      {/* The eight checks */}
      <Section id="checks" className="py-20 md:py-28 bg-white/35 scroll-mt-20" pattern="circles">
        <SectionHeader
          eyebrow="Fig. iii · The eight checks"
          title="The mistakes that turn into revisits."
          subtitle="Each one comes from orders that went wrong on site. The notes are read twice — by fixed patterns and by an AI read of the wording — and either one can raise the flag."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHECKS.map((c) => (
            <ScrollReveal key={c.n}>
              <article className="h-full bg-white/85 border border-ink/10 rounded-sm p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <c.Icon className="w-5 h-5 text-accent" />
                  </span>
                  <span className="font-serif italic text-2xl text-ink-muted/30">{c.n}</span>
                </div>
                <h3 className="font-serif text-xl text-ink leading-tight mb-2">{c.title}</h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{c.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* From new order to done: the 3-D stacking cards, as on the Concierge Order Intake page */}
      <Section id="pipeline" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="Fig. iv · From new order to done"
          title="Four steps a careful admin takes — taken on every order."
          subtitle="The same order of work your best person follows, by rule, every ten minutes. Where a person would stop and ask, it stops and puts it on the ticket."
        />
        <Stack>
          {PIPELINE.map((step) => (
            <article key={step.n} className="stack-card grid grid-cols-1 lg:grid-cols-12 gap-8 bg-paper border border-ink/10 p-6 md:p-10 shadow-lg shadow-ink/5 rounded-sm">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mb-3">Step {step.n} · {step.eyebrow}</div>
                <div className="border border-ink/10 bg-white/60 rounded-sm p-4">
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
                <h3 className="font-serif text-2xl md:text-4xl text-ink leading-tight mb-4">{step.title}</h3>
                <p className="font-sans text-[17px] leading-relaxed text-ink-muted mb-5">{step.body}</p>
                <ul className="space-y-2.5">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-ink-muted">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </Stack>
      </Section>

      {/* The ticket + outcomes (dark) */}
      <section className="relative bg-ink text-canvas px-6 py-20 md:py-28 overflow-clip">
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="font-serif italic text-base tracking-[0.15em] uppercase text-canvas/60 mb-4">Fig. v · The ticket</div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-6">
              One ticket per order. Nothing when it’s fine.
            </h2>
            <p className="font-serif text-lg md:text-xl text-canvas/75 leading-relaxed mb-8">
              The ticket says what needs a person, what it couldn’t verify, and what it already fixed — so your team finds
              problems in one place and never redoes a fix.
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
            <SectionHeader eyebrow="Fig. vi · The offer" title="One price. Live within a week." className="!mb-8" />
            <p className="font-sans text-lg text-ink-muted leading-relaxed">
              The expensive mistakes in this business are found on site: no lockbox code at the door, a bedroom that wasn’t on
              anyone’s list, a note nobody read. Order Review moves those catches to the ten minutes after the order lands, when
              fixing one is a note instead of a second trip. We won’t put a number on it for you — count last month’s revisits
              and you’ll have yours.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-ink/15 bg-white/80 rounded-sm p-8 md:p-10 shadow-widget-raised">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Price</div>
              <div className="font-serif text-5xl md:text-6xl text-ink leading-none mb-5">
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
                  <span className="text-ink">Change orders:</span> a new kind of check or a second account is quoted
                  before the work, never after.
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
                          {item.startsWith('Placing orders') ? (
                            <>
                              Placing orders — that is{' '}
                              <a href="/shoot-ops/concierge-order-intake" onClick={toPage('order-intake')} className="underline underline-offset-2 hover:text-ink">
                                Concierge Order Intake
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
      <ModulePairing current="order-review" onNavigate={onNavigate} />

      {/* The first two weeks + access */}
      <Section className="py-20 md:py-28 bg-white/35" pattern="grid">
        <SectionHeader eyebrow="Fig. vii · Getting started" title="How the first two weeks go." />
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {TWO_WEEKS.map(({ when, what }, i) => (
            <li key={when} className="relative bg-white/80 border border-ink/10 rounded-sm p-6 shadow-sm">
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
            <SectionHeader eyebrow="Questions" title="What owners ask first." className="!mb-6" />
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
                Fifteen minutes to check that it fits how your orders actually look, and to pick a start date.
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

export default OrderReviewPage;
