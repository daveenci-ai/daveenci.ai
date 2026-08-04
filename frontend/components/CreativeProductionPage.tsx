import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import {
  Button,
  GiocondaBackground,
  PageHero,
  ProductFrame,
  ScrollReveal,
  Section,
  SectionHeader,
} from './Shared';
import AstridSketch from '../images/Astrid_Sketch.webp';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileCreativeProductionPage } from './mobile/MobileCreativeProductionPage';
import type { Page } from './types';
import { PRACTICES } from '../content/workCatalog';
import {
  CREATIVE_CONVERSION_PHRASE,
  creativeAudiences,
  creativeChannels,
  creativeDeliverables,
  creativeFaqs,
  creativeSectors,
  creativeWorkflow,
  creativeWorkflowPrinciples,
} from '../content/creativeProduction';
import { track } from '../lib/analytics';

const BookingWidget = lazy(() =>
  import('./BookingWidget').then((module) => ({ default: module.BookingWidget })),
);

interface CreativeProductionPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const CreativeProductionWorkflowPanel: React.FC = () => (
  <ProductFrame height={460} className="max-w-xl">
    <div className="flex items-start justify-between gap-5 border-b border-ink/10 pb-4">
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-strong">Creative Production</div>
        <div className="mt-1 font-serif text-lg text-ink">Campaign control loop</div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">
        <span className="h-2 w-2 rounded-full bg-green-600" /> human released
      </div>
    </div>

    <div className="mt-4 grid flex-1 grid-cols-2 gap-2.5 overflow-hidden">
      {creativeWorkflow.map((stage) => (
        <div
          key={stage.number}
          className={`relative flex min-h-0 flex-col justify-between border p-3 ${
            stage.gate
              ? 'border-amber-700/35 bg-amber-50/70'
              : 'border-ink/10 bg-white/65'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <stage.Icon className={`h-4 w-4 ${stage.gate ? 'text-amber-800' : 'text-accent-strong'}`} strokeWidth={1.6} />
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">{stage.number}</span>
          </div>
          <div className="mt-3">
            <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">{stage.label}</div>
            <div className="mt-1 font-serif text-sm leading-tight text-ink">{stage.evidence}</div>
          </div>
          {stage.gate && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-amber-700/20 pt-2 font-mono text-[7px] uppercase tracking-[0.15em] text-amber-900">
              <ShieldCheck className="h-3 w-3" /> release authority
            </div>
          )}
        </div>
      ))}
    </div>
  </ProductFrame>
);

const CreativeFaqItem: React.FC<{ index: number; question: string; answer: string }> = ({ index, question, answer }) => {
  const [open, setOpen] = useState(false);
  const panelId = `creative-faq-panel-${index}`;
  const buttonId = `creative-faq-button-${index}`;

  return (
    <div className="border-b border-ink/10 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
        >
          <span className="font-serif text-lg text-ink transition-colors group-hover:text-accent-strong">{question}</span>
          <ChevronDown className={`h-5 w-5 flex-shrink-0 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      {open && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5 pr-10">
          <p className="font-sans leading-relaxed text-ink-muted">{answer}</p>
        </div>
      )}
    </div>
  );
};

export const CreativeProductionHero: React.FC = () => {
  const scrollToBooking = () => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToWorkflow = () => document.getElementById('creative-workflow')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Section className="flex min-h-[90vh] items-center pt-36 pb-20 md:pt-44 md:pb-28" overflow>
      <GiocondaBackground className="-right-1/4 text-ink opacity-[0.065]" />
      <div id="creative-hero" className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative z-10 lg:col-span-6">
          <ScrollReveal immediate>
            <PageHero
              eyebrow={
                <span className="inline-block border border-accent/15 bg-accent/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-strong">
                  {PRACTICES.creative.name} · Led by {PRACTICES.creative.lead}
                </span>
              }
              title={<>Turn campaign work<br /><span className="italic text-ink-muted/80">into a production rhythm.</span></>}
              description="Strategy, paid campaigns, content, ads, and YouTube video—run through one governed workflow with a person approving before anything publishes."
              size="md"
              actions={
                <>
                  <Button
                    variant="primary"
                    analytics={{ cta_id: 'bring_next_campaign', surface: 'practice_hero', from_page: 'creative-production', destination: '#booking' }}
                    onClick={scrollToBooking}
                    className="px-8 py-4 text-base focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                  >
                    {CREATIVE_CONVERSION_PHRASE}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={scrollToWorkflow}
                    className="px-8 py-4 text-base focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                  >
                    See the workflow
                  </Button>
                </>
              }
            />
          </ScrollReveal>
        </div>
        <div className="relative z-10 lg:col-span-6">
          <ScrollReveal delay={300} direction="left">
            <CreativeProductionWorkflowPanel />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

const CreativeProductionPageDesktop: React.FC<CreativeProductionPageProps> = ({ onNavigate }) => {
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
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header onNavigate={onNavigate} currentPage="creative-production" />

      <CreativeProductionHero />

      <Section className="bg-white/25 py-20 md:py-24" pattern="grid">
        <SectionHeader
          eyebrow="What the practice covers"
          title="Direction and production, kept in one loop."
          subtitle="The work is concrete: decide what the campaign needs to do, produce the connected assets, control the release, and bring evidence back into the next cycle."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {creativeDeliverables.map((deliverable, index) => (
            <ScrollReveal key={deliverable.title} delay={index * 100} className="h-full">
              <article className="flex h-full flex-col border border-ink/10 bg-white/65 p-7 shadow-sm md:p-8">
                <div className="mb-7 flex items-start justify-between gap-5">
                  <deliverable.Icon className="h-7 w-7 text-accent-strong" strokeWidth={1.45} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{deliverable.eyebrow}</span>
                </div>
                <h3 className="font-serif text-3xl leading-tight text-ink">{deliverable.title}</h3>
                <p className="mt-4 font-sans leading-relaxed text-ink-muted">{deliverable.body}</p>
                <ul className="mt-7 space-y-2 border-t border-ink/10 pt-5">
                  {deliverable.examples.map((example) => (
                    <li key={example} className="flex items-center gap-3 font-sans text-sm text-ink-muted">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-accent-strong" />
                      {example}
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <section className="border-y border-canvas/10 bg-ink py-14 text-canvas md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">Channels</div>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Stated plainly.</h2>
          </div>
          <ul className="flex flex-wrap gap-3" aria-label="Creative Production channels">
            {creativeChannels.map((channel) => (
              <li key={channel} className="border border-canvas/20 bg-canvas/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-canvas/85">
                {channel}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section id="creative-workflow" className="scroll-mt-24 py-20 md:py-28" overflow>
        <GiocondaBackground className="left-1/3 text-ink opacity-[0.045]" />
        <SectionHeader
          eyebrow="The governed workflow"
          title="Creative work with a visible release gate."
          subtitle="Intake, strategy, production, approval, publication, and measurement form one traceable loop. The gate is a decision, not a decorative checkmark."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {creativeWorkflow.map((stage, index) => (
            <ScrollReveal key={stage.number} delay={index * 75} className="h-full">
              <article className={`relative flex h-full flex-col border p-7 md:p-8 ${stage.gate ? 'border-amber-800/35 bg-amber-50/75' : 'border-ink/10 bg-white/65'}`}>
                <div className="mb-9 flex items-start justify-between gap-5">
                  <stage.Icon className={`h-7 w-7 ${stage.gate ? 'text-amber-900' : 'text-accent-strong'}`} strokeWidth={1.4} />
                  <span className="font-serif text-4xl italic text-ink-muted/35">{stage.number}</span>
                </div>
                <div className={`font-mono text-[9px] uppercase tracking-[0.2em] ${stage.gate ? 'text-amber-900' : 'text-accent-strong'}`}>
                  {stage.label}
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">{stage.title}</h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">{stage.body}</p>
                <div className="mt-auto border-t border-ink/10 pt-5">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-muted">Leaves behind</span>
                  <p className="mt-1 font-serif text-base text-ink">{stage.evidence}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {creativeWorkflowPrinciples.map((principle) => (
            <div key={principle.title} className="flex items-start gap-4 border-t border-ink/15 pt-5">
              <principle.Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-strong" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-ink">{principle.title}</h3>
                <p className="mt-1 font-sans text-sm leading-relaxed text-ink-muted">{principle.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PROOF PLACEHOLDER: add a client-approved campaign artifact, named
          testimonial, or measured result here only after Astrid confirms the
          source, permission, time period, and exact claim. */}
      <Section className="bg-alt/15 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-strong">Sectors served</div>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">Different contexts.<br /><span className="italic text-ink-muted/80">The same proof standard.</span></h2>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Sectors served">
            {creativeSectors.map((sector) => (
              <li key={sector} className="border border-ink/10 bg-white/55 p-5 text-center font-serif text-lg text-ink">
                {sector}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="py-20 md:py-28">
        <SectionHeader
          eyebrow="Who it is for"
          title="Teams with a creative system hiding in their heads."
          subtitle="The practice is useful when the output recurs, the channels multiply, and approvals are still carried through memory and follow-up."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {creativeAudiences.map((audience, index) => (
            <ScrollReveal key={audience.title} delay={index * 100} className="h-full">
              <article className="h-full border border-ink/10 bg-white/55 p-7 md:p-8">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent-strong">0{index + 1}</span>
                <h3 className="mt-7 font-serif text-2xl text-ink">{audience.title}</h3>
                <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">{audience.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section id="creative-faq" className="bg-white/20 py-20 md:py-24">
        <SectionHeader eyebrow="FAQ" title="Common questions." />
        <ScrollReveal>
          <div className="mx-auto max-w-3xl border border-ink/10 bg-white/65 px-7 shadow-sm md:px-9">
            {creativeFaqs.map((item, index) => (
              <CreativeFaqItem key={item.question} index={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      <Suspense fallback={<section id="booking" aria-label="Loading booking calendar" className="min-h-[780px] scroll-mt-24 border-t border-ink/5 bg-alt/20" />}>
        <BookingWidget
          onNavigate={onNavigate}
          sectionId="booking"
          sectionClassName="scroll-mt-24 bg-alt/20 border-t border-ink/5"
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

      <Section className="py-16 text-center md:py-24" overflow>
        <GiocondaBackground className="text-ink opacity-[0.04]" />
        <div className="relative mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">Ready to make the next cycle visible?</h2>
            <p className="mx-auto mt-5 max-w-2xl font-sans text-lg leading-relaxed text-ink-muted">
              Start with the real brief, the channels it must cross, and the person who owns the release decision.
            </p>
            <Button
              variant="primary"
              analytics={{ cta_id: 'bring_next_campaign', surface: 'practice_closing', from_page: 'creative-production', destination: '#booking' }}
              onClick={scrollToBooking}
              className="mt-8 px-8 py-4 text-base focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              {CREATIVE_CONVERSION_PHRASE}
            </Button>
          </ScrollReveal>
        </div>
      </Section>

      <Section className="border-t border-ink/10 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-strong">Next case</div>
          <p className="mt-4 font-serif text-lg italic leading-relaxed text-ink-muted">
            See one content workflow in miniature: a meeting becomes review-ready material across the channels a team already uses.
          </p>
          <a
            href="/pulsenote"
            onClick={openPulseNote}
            className="group mt-6 inline-flex items-center gap-3 font-serif text-3xl text-ink transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 md:text-4xl"
          >
            PulseNote
            <ArrowRight className="h-7 w-7 text-accent-strong transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
          </a>
          <div className="mt-6">
            <a
              href="/work"
              onClick={(event) => { event.preventDefault(); onNavigate('work'); }}
              className="font-sans text-sm text-ink-muted underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              All work
            </a>
          </div>
        </div>
      </Section>

      <Footer
        onNavigate={onNavigate}
        newsletterHeading="Follow the creative production work"
        newsletterBody="Field notes on briefs, approvals, channel handoffs, and the production systems behind accountable creative output."
        newsletterSource="creative-production"
      />
    </div>
  );
};

const CreativeProductionPage: React.FC<CreativeProductionPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileCreativeProductionPage {...props} />;
  return <CreativeProductionPageDesktop {...props} />;
};

export default CreativeProductionPage;
