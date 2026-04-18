
import React from 'react';
import { Cpu, Activity } from 'lucide-react';
import { Section, ScrollReveal, Button, VitruvianBackground, PageHero, Surface } from './Shared';
import type { Page } from './types';

const HeroDiagram: React.FC = () => (
  <Surface kind="document" raised className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square bg-white border border-ink/10 p-6 md:p-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">System Architecture v2.0</div>
    </div>

    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
        <path d="M 30 125 C 60 125, 100 50, 150 50 C 200 50, 220 30, 240 30" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" fill="none" />
        <path d="M 30 125 C 60 125, 100 200, 150 200 C 200 200, 240 230, 270 230" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" fill="none" />
        <path d="M 30 125 L 270 125" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-pulse" />

        <line x1="150" y1="50" x2="150" y2="200" stroke="rgb(var(--color-paper-border))" strokeWidth="1.5" strokeDasharray="4 4" />

        <circle cx="30" cy="125" r="6" fill="rgb(var(--color-ink))" />
        <text x="30" y="155" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" letterSpacing="0.05em">INPUT</text>

        <circle cx="150" cy="125" r="30" fill="rgb(var(--color-accent))" fillOpacity="0.1" stroke="rgb(var(--color-accent))" strokeWidth="1" className="animate-spin-slow origin-[150px_125px]" strokeDasharray="4 2" />
        <circle cx="150" cy="125" r="4" fill="rgb(var(--color-accent))" />
        <text x="150" y="175" textAnchor="middle" fontSize="10" fontWeight="500" fill="rgb(var(--color-accent))" fontFamily="monospace" letterSpacing="0.05em">PROCESSING</text>

        <circle cx="150" cy="50" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
        <circle cx="150" cy="200" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />

        <rect x="260" y="115" width="20" height="20" rx="2" fill="rgb(var(--color-accent))" />
        <text x="270" y="160" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" letterSpacing="0.05em">OUTPUT</text>
        <rect x="265" y="220" width="16" height="16" rx="2" fill="rgb(var(--color-ink))" />
      </svg>

      <div className="absolute top-4 right-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Activity className="w-4 h-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink">Efficiency +40%</span>
      </div>

      <div className="absolute bottom-12 left-8 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
        <Cpu className="w-4 h-4 text-accent" />
        <span className="text-xs font-medium text-ink">Automated</span>
      </div>
    </div>
  </Surface>
);

interface HeroProps {
  onNavigate?: (page: Page, hash?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <Section className="pt-44 pb-24 md:pt-52 md:pb-32 min-h-screen flex items-center">
      <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-125" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-6 relative z-20">
          <ScrollReveal delay={200}>
            <PageHero
              eyebrow="Folio I — The Thesis"
              title={<>AI teams.<br /><span className="italic text-ink-muted/80">Not AI tools.</span></>}
              description="Daveenci builds specialist AI teams that ship finished work — code, media, research — each one orchestrated, human-gated, and accountable to its output."
              actions={
                <>
                  <Button variant="primary" onClick={() => onNavigate?.('calendar')} className="text-base px-8 py-4">Talk to us</Button>
                  <Button variant="secondary" onClick={() => onNavigate?.('work')} className="text-base px-8 py-4">See the work</Button>
                </>
              }
            />
            <p className="mt-8 text-xs md:text-sm text-ink-muted/60 font-medium tracking-wide">
              One workshop. Many specialist teams. Each one shipping finished work.
            </p>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center">
          <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
            <HeroDiagram />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
