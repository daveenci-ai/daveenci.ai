import React, { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, PageHero, Button, Surface, Callout } from './Shared';
import type { Page } from './types';

interface ShootOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ShootOSPage: React.FC<ShootOSPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'ShootOS — Daveenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="shootos" />

      <Section className="pt-44 pb-8 md:pt-52 md:pb-12">
        <GridPattern />
        <ScrollReveal>
          <PageHero
            eyebrow="A Daveenci team · Real estate media"
            title={<>ShootOS.<br /><span className="italic text-ink-muted/80">The real estate media team.</span></>}
            description="Stills, video, 3D tours, AI virtual staging. One property in. One listing-ready media package out. Built for volume real estate teams, not one-off shoots."
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
                Real estate teams need listing-ready media — stills, video, 3D tours, staging — fast and at volume. Traditional production is a human-intensive multi-vendor coordination problem. The outcome: slow turnaround, inconsistent quality, and costs that don't scale with listing velocity.
              </p>
            </Callout>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">The pipeline</h3>
            <p className="font-sans text-ink-muted leading-relaxed mb-6">
              A single pipeline ingests raw capture, routes each asset to the specialist that handles it best (stills → color + crop; video → cut + grade; 3D → stitch; staging → AI virtual dressing), and outputs a packaged listing kit ready to hand to the agent.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Stills', 'Video', '3D', 'Staging'].map((asset) => (
                <Surface
                  key={asset}
                  kind="product"
                  className="p-4 border border-ink/10 bg-pulse-surface text-center"
                >
                  <div className="font-serif text-base text-ink">{asset}</div>
                </Surface>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">What it ships</h3>
            <p className="font-sans text-ink-muted leading-relaxed mb-6">
              A complete listing media package, agent-ready, branded, and consistent across an entire brokerage's inventory. Turnaround measured in hours, not days.
            </p>
            <p className="font-sans text-ink-muted leading-relaxed">
              The product has its own domain and dedicated site for the full pitch, sample outputs, and onboarding.
            </p>
            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() => window.open('https://shootos.ai', '_blank')}
                className="px-6 py-3"
              >
                <span className="flex items-center gap-2">
                  Visit shootos.ai
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Section className="py-16 md:py-24" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Want a team like this for your domain?
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
              ShootOS is one example of a Daveenci team. We design specialist teams for industries where the workflow is complex, multi-stage, and the output needs to be production-ready.
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

export default ShootOSPage;
