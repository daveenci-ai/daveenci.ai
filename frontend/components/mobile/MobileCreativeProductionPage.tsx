import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Minus, Plus, ShieldCheck } from 'lucide-react';
import { GiocondaBackground } from '../Shared';
import { MobileButton } from './MobileButton';
import { MobileScenePlate } from './MobileScenePlate';
import { MobileShell } from './MobileShell';
import AstridSketch from '../../images/Astrid_Sketch.webp';
import type { Page } from '../types';
import { PRACTICES } from '../../content/workCatalog';
import {
  CREATIVE_CONVERSION_PHRASE,
  creativeAudiences,
  creativeChannels,
  creativeDeliverables,
  creativeFaqs,
  creativeSectors,
  creativeWorkflow,
} from '../../content/creativeProduction';
import { track } from '../../lib/analytics';

const BookingWidget = lazy(() =>
  import('../BookingWidget').then((module) => ({ default: module.BookingWidget })),
);

interface MobileCreativeProductionPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const SectionEyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-5 flex items-center gap-3">
    <span className="h-px w-8 bg-ink-muted/30" />
    <span className="font-serif text-[11px] italic uppercase tracking-[0.3em] text-ink-muted">{children}</span>
  </div>
);

export const MobileCreativeProductionHero: React.FC = () => {
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToWorkflow = () => document.getElementById('creative-workflow')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative overflow-hidden px-6 pt-10 pb-12">
      <GiocondaBackground className="text-ink opacity-[0.065]" />
      <div id="creative-hero" className="relative z-10">
        <div className="mb-5 inline-block border border-accent/15 bg-accent/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-accent-strong">
          {PRACTICES.creative.name} · {PRACTICES.creative.lead}
        </div>
        <h1 className="mb-5 font-serif text-[2.55rem] leading-[1.04] tracking-tight text-ink">
          Turn campaign work
          <br />
          <span className="italic text-ink-muted/75">into a production rhythm.</span>
        </h1>
        <p className="mb-7 font-serif text-[16px] leading-[1.6] text-ink-muted">
          Strategy, paid campaigns, content, ads, and YouTube video—run through one governed workflow with a person approving before anything publishes.
        </p>
        <div className="space-y-3">
          <MobileButton
            analytics={{ cta_id: 'bring_next_campaign', surface: 'practice_hero', from_page: 'creative-production', destination: '#booking' }}
            onClick={scrollToBooking}
          >
            {CREATIVE_CONVERSION_PHRASE}
          </MobileButton>
          <MobileButton variant="secondary" onClick={scrollToWorkflow}>See the workflow</MobileButton>
        </div>

        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Campaign loop">
            <div className="grid grid-cols-2 gap-2.5">
              {creativeWorkflow.map((stage) => (
                <div
                  key={stage.number}
                  className={`min-h-[108px] border p-3 ${stage.gate ? 'border-amber-800/35 bg-amber-50/75' : 'border-ink/10 bg-canvas/50'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <stage.Icon className={`h-4 w-4 ${stage.gate ? 'text-amber-900' : 'text-accent-strong'}`} strokeWidth={1.5} />
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-muted">{stage.number}</span>
                  </div>
                  <div className="mt-4 font-mono text-[8px] uppercase tracking-[0.14em] text-ink-muted">{stage.label}</div>
                  <div className="mt-1 font-serif text-sm leading-tight text-ink">{stage.evidence}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-amber-900">
              <ShieldCheck className="h-4 w-4" /> a person owns the release
            </div>
          </MobileScenePlate>
        </div>
      </div>
    </section>
  );
};

export const MobileCreativeProductionPage: React.FC<MobileCreativeProductionPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });

  const openPulseNote = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    track('practice_case_click', { practice_id: 'creative', case_id: 'pulsenote', surface: 'practice_page' });
    onNavigate('pulsenote');
  };

  return (
    <MobileShell onNavigate={onNavigate} showBottomCTA={false}>
      <MobileCreativeProductionHero />

      <section className="bg-white/30 px-6 py-12">
        <SectionEyebrow>What the practice covers</SectionEyebrow>
        <h2 className="mb-7 font-serif text-[2.15rem] leading-[1.08] tracking-tight text-ink">
          Direction and production,
          <br />
          <span className="italic text-ink-muted/75">kept in one loop.</span>
        </h2>
        <div className="space-y-4">
          {creativeDeliverables.map((deliverable) => (
            <MobileScenePlate key={deliverable.title} figLabel={deliverable.eyebrow}>
              <deliverable.Icon className="mb-5 h-7 w-7 text-accent-strong" strokeWidth={1.4} />
              <h3 className="font-serif text-2xl text-ink">{deliverable.title}</h3>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-muted">{deliverable.body}</p>
              <ul className="mt-5 space-y-2 border-t border-ink/10 pt-4">
                {deliverable.examples.map((example) => (
                  <li key={example} className="flex items-center gap-2.5 font-sans text-[13px] text-ink-muted">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-accent-strong" /> {example}
                  </li>
                ))}
              </ul>
            </MobileScenePlate>
          ))}
        </div>
      </section>

      <section className="bg-ink px-6 py-12 text-canvas">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-light">Channels · stated plainly</div>
        <h2 className="mt-3 font-serif text-[2rem] leading-tight">Work where the campaign needs to work.</h2>
        <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Creative Production channels">
          {creativeChannels.map((channel) => (
            <li key={channel} className="border border-canvas/20 bg-canvas/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.13em] text-canvas/85">
              {channel}
            </li>
          ))}
        </ul>
      </section>

      <section id="creative-workflow" className="relative scroll-mt-16 overflow-hidden px-6 py-12">
        <GiocondaBackground className="text-ink opacity-[0.04]" />
        <div className="relative z-10">
          <SectionEyebrow>The governed workflow</SectionEyebrow>
          <h2 className="mb-5 font-serif text-[2.15rem] leading-[1.08] tracking-tight text-ink">
            Creative work with a
            <br />
            <span className="italic text-ink-muted/75">visible release gate.</span>
          </h2>
          <p className="mb-8 font-serif text-[15px] leading-relaxed text-ink-muted">
            The gate is a decision, not a decorative checkmark. Each stage leaves behind something the next person can inspect.
          </p>
          <div className="space-y-4">
            {creativeWorkflow.map((stage) => (
              <article key={stage.number} className={`border p-5 ${stage.gate ? 'border-amber-800/35 bg-amber-50/80' : 'border-ink/10 bg-white/70'}`}>
                <div className="flex items-start justify-between gap-4">
                  <stage.Icon className={`h-6 w-6 ${stage.gate ? 'text-amber-900' : 'text-accent-strong'}`} strokeWidth={1.4} />
                  <span className="font-serif text-3xl italic text-ink-muted/35">{stage.number}</span>
                </div>
                <div className={`mt-5 font-mono text-[9px] uppercase tracking-[0.18em] ${stage.gate ? 'text-amber-900' : 'text-accent-strong'}`}>{stage.label}</div>
                <h3 className="mt-2 font-serif text-xl leading-tight text-ink">{stage.title}</h3>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-muted">{stage.body}</p>
                <div className="mt-5 border-t border-ink/10 pt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">Leaves behind</span>
                  <p className="mt-1 font-serif text-[15px] text-ink">{stage.evidence}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF PLACEHOLDER: replace only with a client-approved artifact,
          testimonial, or measured result with source and time period. */}
      <section className="bg-alt/15 px-6 py-12">
        <SectionEyebrow>Sectors served</SectionEyebrow>
        <h2 className="font-serif text-[2.05rem] leading-[1.1] text-ink">
          Different contexts.
          <br />
          <span className="italic text-ink-muted/75">The same proof standard.</span>
        </h2>
        <ul className="mt-7 grid grid-cols-2 gap-3" aria-label="Sectors served">
          {creativeSectors.map((sector) => (
            <li key={sector} className="border border-ink/10 bg-white/60 p-4 text-center font-serif text-base text-ink">
              {sector}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 py-12">
        <SectionEyebrow>Who it is for</SectionEyebrow>
        <h2 className="mb-7 font-serif text-[2.05rem] leading-[1.1] text-ink">Teams with a creative system hiding in their heads.</h2>
        <div className="space-y-4">
          {creativeAudiences.map((audience, index) => (
            <article key={audience.title} className="border border-ink/10 bg-white/60 p-5">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent-strong">0{index + 1}</span>
              <h3 className="mt-5 font-serif text-xl text-ink">{audience.title}</h3>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-muted">{audience.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/25 px-6 py-12">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <h2 className="mb-6 font-serif text-[2.05rem] leading-[1.1] text-ink">Common questions.</h2>
        <ol className="border border-ink/10 bg-white/65 px-5">
          {creativeFaqs.map((item, index) => {
            const isOpen = openFaq === index;
            const panelId = `mobile-creative-faq-panel-${index}`;
            const buttonId = `mobile-creative-faq-button-${index}`;
            return (
              <li key={item.question} className="border-b border-ink/10 last:border-b-0">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-baseline gap-3 py-4 text-left"
                  >
                    <span className="flex-1 font-serif text-base leading-snug text-ink">{item.question}</span>
                    <span className="flex-shrink-0 pt-1 text-ink-muted/70">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="-mt-1 pb-4 pr-7">
                    <p className="font-sans text-[14px] leading-relaxed text-ink-muted">{item.answer}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <Suspense fallback={<section id="booking" aria-label="Loading booking calendar" className="min-h-[780px] scroll-mt-16 border-t border-ink/5 bg-alt/20" />}>
        <BookingWidget
          onNavigate={onNavigate}
          sectionId="booking"
          sectionClassName="scroll-mt-16 bg-alt/20 border-t border-ink/5"
          eyebrow="Creative Production Working Session"
          title="Map the next production cycle"
          subtitle="Bring one campaign, content program, or video pipeline that needs a clearer operating rhythm."
          leftBody="We will look at the brief, channels, production handoffs, approval owners, and release decision—then determine whether a governed Creative Production engagement is the right next step."
          bookingType="creative-production"
          hostName={PRACTICES.creative.lead}
          hostRole="Co-Founder"
          hostImage={AstridSketch}
          reasonOptions={['Creative Production (we will prioritize together)', 'Marketing strategy', 'Paid campaign management', 'Content development', 'Ads', 'YouTube video']}
          defaultReason="Creative Production (we will prioritize together)"
        />
      </Suspense>

      <section className="relative overflow-hidden px-6 py-14 text-center">
        <GiocondaBackground className="text-ink opacity-[0.04]" />
        <div className="relative z-10">
          <h2 className="font-serif text-[2.05rem] leading-[1.1] text-ink">Ready to make the next cycle visible?</h2>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-muted">
            Start with the real brief, the channels it must cross, and the person who owns the release decision.
          </p>
          <MobileButton
            analytics={{ cta_id: 'bring_next_campaign', surface: 'practice_closing', from_page: 'creative-production', destination: '#booking' }}
            onClick={scrollToBooking}
            className="mt-7"
          >
            {CREATIVE_CONVERSION_PHRASE}
          </MobileButton>
        </div>
      </section>

      <section className="border-t border-ink/10 px-6 py-12 text-center">
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-strong">Next case</div>
        <p className="mt-4 font-serif text-[15px] italic leading-relaxed text-ink-muted">
          See one content workflow in miniature: a meeting becomes review-ready material across the channels a team already uses.
        </p>
        <a
          href="/pulsenote"
          onClick={openPulseNote}
          className="mt-6 inline-flex items-center gap-3 font-serif text-3xl text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          PulseNote <ArrowRight className="h-6 w-6 text-accent-strong" strokeWidth={1.4} />
        </a>
        <div className="mt-5">
          <a
            href="/work"
            onClick={(event) => { event.preventDefault(); onNavigate('work'); }}
            className="font-sans text-sm text-ink-muted underline decoration-ink/20 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            All work
          </a>
        </div>
      </section>
    </MobileShell>
  );
};
