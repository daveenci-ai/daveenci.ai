import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { commercialOffers } from '../content/commercialOffers';
import { Button, FolioHeader, ScrollReveal, Section } from './Shared';
import type { Page } from './types';

interface CommercialOffersProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  compact?: boolean;
}

export const CommercialOffers: React.FC<CommercialOffersProps> = ({ onNavigate, compact = false }) => {
  const content = (
    <>
      {compact ? (
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
        <div className="mb-12 md:mb-16">
          <FolioHeader
            eyebrow="Ways to work together"
            title={<>Map it. Build it.<br /><span className="italic text-ink-muted/75">Keep it earning trust.</span></>}
            subtitle="Start with a fixed-scope Blueprint. Move into production only when the value, failure modes, integrations, and human gates are clear."
          />
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'lg:grid-cols-3 gap-6'}`}>
        {commercialOffers.map((offer, index) => (
          <ScrollReveal key={offer.id} delay={compact ? 0 : index * 100} immediate={compact}>
            <article className="group h-full bg-white/65 border border-ink/10 rounded-sm p-6 md:p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl">
              <div className="flex items-start justify-between gap-5 mb-7">
                <span className="font-serif italic text-3xl text-ink-muted/30">{offer.number}</span>
                <div className="text-right">
                  <div className="font-serif text-xl md:text-2xl text-ink">{offer.price}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-1">{offer.timeline}</div>
                </div>
              </div>

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
          </ScrollReveal>
        ))}
      </div>

      <div className={`flex ${compact ? 'flex-col items-stretch mt-6' : 'flex-col md:flex-row items-center justify-between mt-10'} gap-5`}>
        <p className="font-serif italic text-base md:text-lg text-ink-muted">
          Bring one recurring workflow—not a shopping list of AI features.
        </p>
        <Button
          variant="primary"
          analytics={{ cta_id: 'start_blueprint', surface: 'commercial_offers', from_page: 'landing', destination: '/calendar' }}
          onClick={() => onNavigate('calendar')}
          className="px-7 py-4"
        >
          <span className="inline-flex items-center gap-2">Discuss a Workflow Blueprint <ArrowRight className="w-4 h-4" /></span>
        </Button>
      </div>
    </>
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
