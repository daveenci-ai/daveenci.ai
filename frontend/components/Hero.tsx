
import React from 'react';
import { Cpu, Activity } from 'lucide-react';
import { Section, ScrollReveal, Button, VitruvianBackground, PageHero, Surface } from './Shared';
import type { Page } from './types';

const HeroDiagram: React.FC = () => (
  <Surface kind="document" raised className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square bg-white/60 backdrop-blur-[2px] border border-ink/10 p-6 md:p-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
        <div className="w-3 h-3 rounded-full bg-ink/10"></div>
      </div>
      <div className="font-serif italic text-[10px] tracking-[0.2em] text-ink/40 uppercase">Plate I · Team Structure</div>
    </div>

    <div className="relative h-full w-full">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
        <defs>
          {/* Cross-hatch pattern — sketchbook shading technique */}
          <pattern id="xhatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="rgb(var(--color-ink))" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Construction circles — golden ratio scaffolding */}
        <circle cx="150" cy="125" r="95" stroke="rgb(var(--color-paper-border))" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
        <circle cx="150" cy="125" r="60" stroke="rgb(var(--color-paper-border))" strokeWidth="0.6" strokeDasharray="2 2" fill="none" />

        {/* Vitruvian central axes */}
        <line x1="150" y1="15" x2="150" y2="235" stroke="rgb(var(--color-paper-border))" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="40" y1="125" x2="260" y2="125" stroke="rgb(var(--color-paper-border))" strokeWidth="0.4" strokeDasharray="2 4" />

        {/* Radial connections — dashed, not arrows */}
        <line x1="150" y1="125" x2="70" y2="55" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="230" y2="55" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="70" y2="195" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="230" y2="195" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />

        {/* Shipped line — animated ink-wet pulse up to output */}
        <line x1="150" y1="98" x2="150" y2="35" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-pulse" />

        {/* Central controller */}
        <circle cx="150" cy="125" r="28" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-spin-slow origin-[150px_125px]" strokeDasharray="4 3" />
        <circle cx="150" cy="125" r="7" fill="rgb(var(--color-accent))" />
        <text x="150" y="170" textAnchor="middle" fontSize="9" fill="rgb(var(--color-accent))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">CONTROLLER</text>

        {/* Specialist node — Scope (top-left) */}
        <circle cx="70" cy="55" r="8" fill="rgb(var(--color-ink))" />
        <text x="70" y="42" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">SCOPE</text>

        {/* Specialist node — Design (top-right, cross-hatched to show sketchbook shading) */}
        <circle cx="230" cy="55" r="8" fill="url(#xhatch)" stroke="rgb(var(--color-ink))" strokeWidth="1" />
        <text x="230" y="42" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">DESIGN</text>

        {/* Specialist node — Build (bottom-left) */}
        <circle cx="70" cy="195" r="8" fill="rgb(var(--color-ink))" />
        <text x="70" y="217" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">BUILD</text>

        {/* Human gate (bottom-right) — distinct shape (square + check) */}
        <rect x="222" y="187" width="16" height="16" rx="1" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
        <path d="M 226 195 L 230 199 L 236 191" stroke="rgb(var(--color-accent))" strokeWidth="1.5" fill="none" />
        <text x="230" y="217" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">HUMAN GATE</text>

        {/* Output — shipped work at top */}
        <rect x="140" y="22" width="20" height="18" rx="1" fill="rgb(var(--color-accent))" />
        <text x="150" y="16" textAnchor="middle" fontSize="7" fill="rgb(var(--color-accent))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">SHIPPED</text>

        {/* Margin annotation — sketchbook fig. label */}
        <text x="22" y="24" fontSize="8" fill="rgb(var(--color-paper-border))" fontFamily="serif" fontStyle="italic">fig. i</text>
      </svg>

      {/* Sketchbook margin notes */}
      <div className="absolute top-4 right-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Activity className="w-4 h-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink">Human-gated</span>
      </div>

      <div className="absolute bottom-12 left-8 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
        <Cpu className="w-4 h-4 text-accent" />
        <span className="text-xs font-medium text-ink">Specialist team</span>
      </div>
    </div>
  </Surface>
);

interface HeroProps {
  onNavigate?: (page: Page, hash?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <Section className="pt-44 pb-24 md:pt-52 md:pb-32 min-h-screen flex items-center" overflow={true}>
      <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-[1.15]" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
        <div className="lg:col-span-7 relative z-20">
          <ScrollReveal delay={200}>
            <PageHero
              eyebrow="Folio I — The Thesis"
              title={<>AI teams.<br /><span className="italic text-ink-muted/80">Not AI tools.</span></>}
              description="DaVeenci builds specialist AI teams that ship finished work — code, media, research — each one orchestrated, human-gated, and accountable to its output."
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

        <div className="lg:col-span-5 relative h-[420px] flex items-center justify-center">
          <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
            <HeroDiagram />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
