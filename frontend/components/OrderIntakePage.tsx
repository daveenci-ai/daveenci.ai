import React, { useEffect, useMemo } from 'react';
import { Check, X, Play } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, Button } from './Shared';
import type { Page } from './types';
import { readAttribution } from '../lib/attribution';

interface OrderIntakePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Anton supplies the recording; until then the page shows a marked placeholder.
const VIDEO_URL = import.meta.env.VITE_ORDER_INTAKE_VIDEO_URL || '';

const INCLUDED = [
  'One email source',
  'One destination platform (Aryeo or Spiro)',
  'Up to 12 service types mapped',
  'Approval step in your inbox',
  'Two weeks of tuning',
];

const NOT_INCLUDED = [
  'Order sources other than email (forms, phone)',
  'A second platform',
  'Custom pricing rules',
  'Photo QA — that is the Photo Review module',
];

const FAQS = [
  {
    q: 'Does it place orders without me?',
    a: 'No. You approve each one. Auto-placing is something you can turn on later, once you have watched it work.',
  },
  {
    q: 'What if my emails look different every time?',
    a: 'That is what it is for. If it cannot read one, it asks you rather than guessing.',
  },
  {
    q: 'What happens after two weeks?',
    a: 'It keeps running. Monthly operation is agreed separately.',
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

  const BookButton = ({ className = '' }: { className?: string }) => (
    <a href={bookHref} onClick={bookNow} className={`inline-block ${className}`}>
      <Button variant="primary">Book 15 minutes with Anton</Button>
    </a>
  );

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="order-intake" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Module</div>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-5">Order Intake</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            A module for real-estate media companies on Aryeo or Spiro.
          </p>
        </div>
      </Section>

      {/* Video */}
      <Section id="video" className="py-10 md:py-14 bg-white/35">
        <div className="max-w-3xl">
          <div className="aspect-video w-full border border-ink/10 rounded-sm overflow-hidden bg-ink/5">
            {VIDEO_URL ? (
              <video
                controls
                preload="metadata"
                playsInline
                className="w-full h-full object-cover"
                src={VIDEO_URL}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                <Play className="w-10 h-10 text-ink-muted/40 mb-4" aria-hidden="true" />
                <p className="font-serif italic text-lg text-ink-muted">Ninety-second walkthrough</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted/60 mt-3">
                  Placeholder — video not yet published
                </p>
              </div>
            )}
          </div>
          <div className="mt-8">
            <BookButton />
          </div>
        </div>
      </Section>

      {/* What it does */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">What it does</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed">
            It reads the concierge order email. It places the order in Aryeo or Spiro. You approve it with one
            click. Nothing goes in without your approval.
          </p>
        </div>
      </Section>

      {/* Price */}
      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <div className="border border-ink/15 bg-white/70 rounded-sm p-8 md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">Price</div>
            <div className="font-serif text-5xl md:text-6xl text-ink leading-none mb-5">$2,500<span className="text-ink-muted text-2xl md:text-3xl ml-3">fixed</span></div>
            <ul className="space-y-2 font-sans text-ink-muted leading-relaxed">
              <li>Live within a week.</li>
              <li>Refund in full if orders aren't landing correctly after two weeks.</li>
            </ul>
            <p className="font-serif italic text-sm text-ink-muted mt-6 pt-6 border-t border-ink/10">
              Monthly operation is quoted separately.
            </p>
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
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
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
          <p className="font-serif italic text-lg text-ink-muted mb-8">
            Running today at a real-estate media company in Texas.
          </p>
          <BookButton />
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default OrderIntakePage;
