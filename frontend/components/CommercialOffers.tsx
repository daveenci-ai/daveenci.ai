import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { commercialOffers } from '../content/commercialOffers';
import { Button, FolioHeader, Section } from './Shared';
import { Reveal } from './motion/Parallax';
import type { Page } from './types';

interface CommercialOffersProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  compact?: boolean;
}

export const CommercialOffers: React.FC<CommercialOffersProps> = ({ onNavigate, compact = false }) => {
  const header = compact ? (
    <div className="mb-7">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-ink-muted/30" />
        <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Ways to work together</span>
      </div>
      <h2 className="font-serif text-[2.35rem] leading-[1.06] text-ink mb-4 tracking-tight">
        Map it. Build it.<br /><span className="italic text-ink-muted/70">Keep it earning trust.</span>
      </h2>
      <p className="font-serif text-[16px] text-ink-muted leading-relaxed">
        Start with a fixed-scope Blueprint. Move into production only when the value, failure modes, integrations, and human gates are clear.
      </p>
    </div>
  ) : (
    <FolioHeader
      eyebrow="Folio VI — Ways to work together"
      title={<>Map it. Build it.<br /><span className="italic text-ink-muted/75">Keep it earning trust.</span></>}
      subtitle="Start with a fixed-scope Blueprint. Move into production only when the value, failure modes, integrations, and human gates are clear."
      className="offers-header"
    />
  );

  const cta = (
    <div className={`flex ${compact ? 'flex-col items-stretch mt-6' : 'flex-col items-start mt-2'} gap-5`}>
      <p className="font-serif italic text-base md:text-lg text-ink-muted">
        Bring one recurring workflow—not a shopping list of AI features.
      </p>
      <Button
        variant="primary"
        analytics={{ cta_id: 'start_blueprint', surface: 'commercial_offers', from_page: 'landing', destination: '/calendar' }}
        onClick={() => onNavigate('calendar')}
        className="px-7 py-4"
      >
        <span className="inline-flex items-center gap-2">Start with a Workflow Blueprint <ArrowRight className="w-4 h-4" /></span>
      </Button>
    </div>
  );

  const cards = commercialOffers.map((offer) => {
    const card = (
      <article className={`group h-full bg-white/65 border rounded-sm p-6 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${offer.productized ? 'border-accent/35 hover:border-accent/60' : 'border-ink/10 hover:border-accent/35'}`}>
        <div className="flex items-start justify-between gap-5 mb-7">
          <span className="font-serif italic text-3xl text-ink-muted/30">{offer.number}</span>
          <div className="text-right">
            <div className="font-serif text-xl md:text-2xl text-ink">{offer.price}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-1">{offer.timeline}</div>
          </div>
        </div>

        {offer.productized && (
          <span className="mb-3 inline-block w-fit font-mono text-[9px] uppercase tracking-[0.18em] text-accent-strong">Productized system</span>
        )}
        <h3 className="font-serif text-2xl md:text-3xl text-ink mb-3">{offer.title}</h3>
        <p className="font-sans text-sm md:text-[15px] text-ink-muted leading-relaxed mb-6">{offer.description}</p>

        <ul className="space-y-3 mb-7 flex-grow">
          {offer.deliverables.map((deliverable) => (
            <li key={deliverable} className="flex items-start gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <Check aria-hidden="true" className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.8} />
              <span>{deliverable}</span>
            </li>
          ))}
        </ul>

        <p className="border-t border-ink/10 pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted/70 leading-relaxed">
          {offer.note}
        </p>
      </article>
    );
    return compact ? (
      <Reveal key={offer.id} enterEnd={0.85} lift={14}>{card}</Reveal>
    ) : (
      // Scroll-driven: each tier rises into place as it reaches the sticky header.
      <Reveal key={offer.id} enterEnd={0.78} lift={36}>{card}</Reveal>
    );
  });

  const content = compact ? (
    <>
      {header}
      <div className="grid grid-cols-1 gap-4">{cards}</div>
      {cta}
    </>
  ) : (
    // Sticky header column + scrolling ladder: the promise stays put while the
    // tiers move past it — the same layered idea as the founders' spread.
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className="lg:col-span-5 aside-sticky">
        {header}
        {cta}
      </div>
      <div className="lg:col-span-7 grid grid-cols-1 gap-6">{cards}</div>
    </div>
  );

  if (compact) {
    return (
      <section id="services" aria-label="Ways to work with DaVeenci" className="px-6 py-12 bg-alt/25 border-y border-ink/10 scroll-mt-20">
        {content}
      </section>
    );
  }

  return (
    <Section id="services" className="scroll-mt-24 bg-alt/20" pattern="grid">
      {content}
    </Section>
  );
};

export default CommercialOffers;
