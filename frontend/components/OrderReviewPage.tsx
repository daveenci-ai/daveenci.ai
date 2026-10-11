import React, { useEffect, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, Button } from './Shared';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';
import { termsNoteFor } from '../content/shootOpsModules';
import { ModuleSchematic } from './ShootOpsModuleSchematics';
import AntonSketch from '../images/Anton_Sketch.webp';

interface OrderReviewPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Module 02 (Anton, 11 Oct 2026): $2,500 fixed, Aryeo only, same two-week refund and no-subscription terms as
// Concierge Order Intake. The walkthrough video comes later; until then the module drawing stands in for it.
// What it checks and fixes is the module catalogue (content/shootOpsModules.ts) in the buyer's words (buyer-voice).

const CHECKS = [
  'Standing notes from the agent’s profile that never made it onto the order.',
  'Add-ons that don’t belong on this order or in this market.',
  'Exteriors-only orders, so nobody plans an interior shoot.',
  'Square footage that doesn’t match public records.',
  'A lockbox with no code.',
  'Appointment notes that don’t add up.',
  'A floor plan that doesn’t match the square footage.',
  'A read of the order notes for what a careful admin would catch: a changed time, a vacant house, a room not to shoot.',
];

const FIXES = [
  'a dated note on the order',
  'removing an add-on that doesn’t belong',
  'a public-record note with beds and baths, so the photographer knows what to shoot',
  'the right floor-plan tier for the square footage',
];

const INCLUDED = [
  'The eight checks, mapped to your products, add-ons and markets',
  'One Aryeo account',
  'Safe fixes, each read back after it is made',
  'One ticket per order with issues, sent where your team already looks',
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
  {
    when: 'Day 1',
    what: 'You share access. We map your products, add-ons and markets, agree which fixes it may make on its own, and where its tickets go.',
  },
  {
    when: 'Days 2–5',
    what: 'It checks your new orders and reports what it finds without changing anything. We go through its findings together and tune.',
  },
  {
    when: 'By day 7',
    what: 'Live. Safe fixes switched on; everything else arrives as one ticket per order.',
  },
  {
    when: 'Day 14',
    what: 'Keep it, or get a full refund if it isn’t catching what it should.',
  },
];

const ACCESS = [
  'A team-member login on your Aryeo account — not the owner login. You can revoke it any time.',
  'Somewhere for its tickets to go: an inbox or a ticket queue your team already watches.',
  'It runs in your own Google and GitHub accounts. You keep the code. Nothing about your orders leaves your accounts.',
];

const FAQS = [
  {
    q: 'Does it change orders without asking?',
    a: 'Only the fixes you agree to during setup, and each one is read back to confirm it took. Everything else becomes a ticket for a person to decide.',
  },
  {
    q: 'Will my team get a flood of alerts?',
    a: 'No. An order with issues gets one ticket that lists everything found. A clean order gets nothing but a reviewed tag.',
  },
  {
    q: 'What if it can’t read a field?',
    a: 'Then the check is marked inconclusive and goes on the ticket. A field it can’t read is never counted as a pass.',
  },
  {
    q: 'Does it need Concierge Order Intake?',
    a: 'No. It checks every new order, however it was placed. The two work well together: one places the orders, the other checks them.',
  },
  {
    q: 'What happens when Aryeo changes something?',
    a: 'Aryeo changes its screens without notice — it changed the order form layout on 1 September 2026. When a page no longer looks the way the module expects, it stops and tells you instead of guessing. If you want it repaired, we quote the repair first — there is no subscription and no obligation either way.',
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
      <Button variant="primary" analytics={{ cta_id: 'book_anton', surface, from_page: PAGE_PATH, destination: '/book/anton' }}>
        Book 15 minutes with Anton
      </Button>
    </a>
  );

  const toIntake = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('order-intake');
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="order-review" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <a
            href="/shoot-ops"
            onClick={(e) => { e.preventDefault(); onNavigate('autopilot'); }}
            className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5 hover:text-ink transition-colors"
          >
            Shoot Ops · Module 02
          </a>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-5">Order Review</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            Every new Aryeo order checked within ten minutes — while a mistake is still a note, not a revisit.
          </p>
        </div>
      </Section>

      {/* The drawing stands in for the walkthrough video until it is made. */}
      <Section id="how" className="py-10 md:py-14 bg-white/35">
        <div className="max-w-3xl">
          <figure className="border border-ink/10 rounded-sm bg-white/70 p-5 md:p-8">
            <ModuleSchematic id="order-review" className="aspect-[5/3] w-full" />
            <figcaption className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase mt-4">
              Fig. 02 · One order, eight checks, one ticket
            </figcaption>
          </figure>
          <div className="mt-8">
            <BookButton surface="under_figure" />
          </div>
        </div>
      </Section>

      {/* What it does */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl space-y-5">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What it does</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Every ten minutes the module looks at the orders that came in and runs eight checks on each one. What it can
            safely fix, it fixes — {FIXES.join(', ')} — and reads the order back to confirm the fix took.
          </p>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            Anything a person should decide becomes one ticket for that order, listing everything it found. A clean
            order is tagged as reviewed and nothing else happens.
          </p>
        </div>
      </Section>

      {/* The eight checks */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-8">The eight checks</h2>
          <ol className="space-y-4">
            {CHECKS.map((c, i) => (
              <li key={c} className="grid grid-cols-[2.5rem_1fr] gap-3 items-baseline">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">0{i + 1}</span>
                <span className="font-sans text-ink-muted leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* What it's worth */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What it's worth</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            The expensive mistakes in this business are found on site: no lockbox code at the door, a bedroom that
            wasn’t on anyone’s list, an add-on the market doesn’t sell. Order Review moves those catches to the ten
            minutes after the order lands, when fixing one is a note on the order instead of a second trip. We won’t
            put a number on it for you — count last month’s revisits and you’ll have yours.
          </p>
        </div>
      </Section>

      {/* Price */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <div className="border border-ink/15 bg-white/70 rounded-sm p-8 md:p-10">
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
          </div>
        </div>
      </Section>

      {/* Included / not included */}
      <Section className="py-12 md:py-16">
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
                  <span>
                    {item.startsWith('Placing orders') ? (
                      <>
                        Placing orders — that is{' '}
                        <a href="/shoot-ops/concierge-order-intake" onClick={toIntake} className="underline underline-offset-2 hover:text-ink">
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
      </Section>

      {/* The first two weeks */}
      <Section className="py-12 md:py-16 bg-white/35">
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
      <Section className="py-12 md:py-16">
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
      <Section className="py-12 md:py-16 bg-white/35">
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
      <Section className="py-14 md:py-20">
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
