import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, PageHero, Button, Surface, Callout } from './Shared';
import type { Page } from './types';

interface PureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PureCodePage: React.FC<PureCodePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'PureCode — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="purecode" />

      <Section className="pt-44 pb-8 md:pt-52 md:pb-12">
        <GridPattern />
        <ScrollReveal>
          <PageHero
            eyebrow="A DaVeenci team · Code"
            title={<>PureCode.<br /><span className="italic text-ink-muted/80">The code team.</span></>}
            description="A feature request walks in. A shipped pull request walks out. 13 specialist agents coordinated by a controller, gated by humans at three critical points."
            size="md"
            className="max-w-3xl"
          />
        </ScrollReveal>
      </Section>

      <Section className="py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <ScrollReveal>
            <Callout variant="alt">
              <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
              <p className="font-sans text-ink-muted leading-relaxed">
                General-purpose AI coding assistants are great at snippets and bad at systems. They lose context across files, skip review, and leave the human to reconcile when something breaks in production. Teams need a coding partner that behaves like an actual team — with specialists, a controller, and review checkpoints.
              </p>
            </Callout>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">The team structure</h3>
            <p className="font-sans text-ink-muted leading-relaxed mb-6">
              PureCode is 13 specialist agents organized into five stages, each with a clear owner and a well-defined handoff. A controller named Navigator coordinates the work; Arbiter owns scope and the three human gates; Sentinel owns safety and validation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Control', 'Blueprint', 'Delivery', 'Validation', 'Release'].map((stage, i) => (
                <Surface
                  key={stage}
                  kind="document"
                  className="p-4 border border-ink/10 bg-white/60 text-center"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mb-1">
                    Stage {i + 1}
                  </div>
                  <div className="font-serif text-base text-ink">{stage}</div>
                </Surface>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">The three gates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: 'Gate 1', title: 'Scope', body: 'A human approves what the team is about to build before any code gets written.' },
                { n: 'Gate 2', title: 'Design', body: 'A human reviews the proposed architecture before implementation begins.' },
                { n: 'Gate 3', title: 'Ship', body: 'A human signs off on the finished PR before it merges to main.' },
              ].map((gate) => (
                <Callout key={gate.title} size="sm">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">{gate.n}</div>
                  <h4 className="font-serif text-lg text-ink mb-2">{gate.title}</h4>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{gate.body}</p>
                </Callout>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">What it ships</h3>
            <p className="font-sans text-ink-muted leading-relaxed">
              A finished pull request on your repository, with the scope pre-approved, the design pre-reviewed, and the diff ready for a human to sign off. The team owns the work from feature request to merge.
            </p>
          </ScrollReveal>
        </div>
      </Section>

      <Section className="py-16 md:py-24" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Want a team like this for your stack?
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
              PureCode is one example of what a DaVeenci team looks like. We design and build specialist teams for the workflows that matter most to your business — code is just one of them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="px-8 py-4">
                Talk to us
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('work')} className="px-8 py-4">
                See all work
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PureCodePage;
