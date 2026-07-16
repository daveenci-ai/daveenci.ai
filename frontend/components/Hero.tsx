
import React from 'react';
import { Cpu, Activity } from 'lucide-react';
import { Section, ScrollReveal, Button, VitruvianBackground, PageHero, Plate, SectionDivider } from './Shared';
import type { Page } from './types';

const HeroDiagram: React.FC = () => (
  <Plate fig="i" title="Team Structure">
    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
        <defs>
          {/* Cross-hatch pattern — sketchbook shading technique */}
          <pattern id="xhatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="rgb(var(--color-ink))" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Construction circle — golden ratio scaffolding */}
        <circle cx="150" cy="125" r="95" stroke="rgb(var(--color-paper-border))" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />

        {/* Vitruvian central axes */}
        <line x1="150" y1="15" x2="150" y2="235" stroke="rgb(var(--color-paper-border))" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="40" y1="125" x2="260" y2="125" stroke="rgb(var(--color-paper-border))" strokeWidth="0.4" strokeDasharray="2 4" />

        {/* Radial connections — dashed, not arrows */}
        <line x1="150" y1="125" x2="70" y2="55" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="230" y2="55" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="70" y2="195" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="150" y1="125" x2="230" y2="195" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 2" />

        {/* Shipped line — animated ink-wet pulse up to output */}
        <line x1="150" y1="98" x2="150" y2="42" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-pulse" />

        {/* Central controller */}
        <circle cx="150" cy="125" r="28" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.5" className="animate-spin-slow origin-[150px_125px]" strokeDasharray="4 3" />
        <circle cx="150" cy="125" r="7" fill="rgb(var(--color-accent))" />
        <text x="150" y="170" textAnchor="middle" fontSize="9" fill="rgb(var(--color-accent))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">CONTROLLER</text>

        {/* Specialist — SCOPE: bullseye / target */}
        <g>
          <circle cx="70" cy="55" r="8" fill="none" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
          <circle cx="70" cy="55" r="4.5" fill="none" stroke="rgb(var(--color-ink))" strokeWidth="0.9" />
          <circle cx="70" cy="55" r="1.6" fill="rgb(var(--color-ink))" />
        </g>
        <text x="70" y="40" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">SCOPE</text>

        {/* Specialist — DESIGN: cross-hatched disc */}
        <circle cx="230" cy="55" r="8" fill="url(#xhatch)" stroke="rgb(var(--color-ink))" strokeWidth="1" />
        <text x="230" y="40" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">DESIGN</text>

        {/* Specialist — BUILD: stacked blocks (code / artifacts) */}
        <g>
          <rect x="62" y="188" width="16" height="2.5" fill="rgb(var(--color-ink))" />
          <rect x="62" y="193.5" width="12" height="2.5" fill="rgb(var(--color-ink))" />
          <rect x="62" y="199" width="16" height="2.5" fill="rgb(var(--color-ink))" />
        </g>
        <text x="70" y="218" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">BUILD</text>

        {/* Human gate — square + checkmark */}
        <rect x="222" y="187" width="16" height="16" rx="1" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
        <path d="M 226 195 L 230 199 L 236 191" stroke="rgb(var(--color-accent))" strokeWidth="1.5" fill="none" />
        <text x="230" y="218" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">HUMAN GATE</text>

        {/* Output — SHIPPED: stacked pages / finished work */}
        <g>
          <rect x="137" y="28" width="14" height="14" fill="white" stroke="rgb(var(--color-accent))" strokeWidth="0.9" />
          <rect x="140" y="25" width="14" height="14" fill="white" stroke="rgb(var(--color-accent))" strokeWidth="0.9" />
          <rect x="143" y="22" width="14" height="14" fill="rgb(var(--color-accent))" stroke="rgb(var(--color-accent))" strokeWidth="0.9" />
          <line x1="145" y1="26" x2="155" y2="26" stroke="white" strokeWidth="0.6" />
          <line x1="145" y1="29" x2="153" y2="29" stroke="white" strokeWidth="0.6" />
          <line x1="145" y1="32" x2="155" y2="32" stroke="white" strokeWidth="0.6" />
        </g>
        <text x="150" y="16" textAnchor="middle" fontSize="7" fill="rgb(var(--color-accent))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">SHIPPED</text>

        {/* Flow motes — faint ink drops traveling specialist → controller */}
        {[{ x: 70, y: 55, d: 0 }, { x: 230, y: 55, d: 0.7 }, { x: 70, y: 195, d: 1.4 }].map(({ x, y, d }) => (
          <circle key={`${x}-${y}`} r="1.4" fill="rgb(var(--color-accent))" opacity="0">
            <animate attributeName="cx" values={`${x};150`} dur="2.8s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${y};125`} dur="2.8s" begin={`${d}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0" dur="2.8s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
        ))}

    </svg>

    {/* Annotation pills — repositioned to avoid overlapping nodes */}
    <div className="absolute top-2 -left-4 md:-left-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
      <Cpu className="w-4 h-4 text-accent" />
      <span className="text-xs font-medium text-ink">Specialist team</span>
    </div>

    <div className="absolute bottom-2 -right-4 md:-right-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
      <Activity className="w-4 h-4 text-ink-muted" />
      <span className="text-xs font-medium text-ink">Human-gated</span>
    </div>
  </Plate>
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
          <ScrollReveal immediate>
            <SectionDivider className="mb-6" width="w-full max-w-[60%]" />
            <PageHero
              eyebrow="A workshop for governed AI operations"
              title={<>Difficult workflows.<br /><span className="italic text-ink-muted/80">Built to operate.</span></>}
              description="DaVeenci maps, builds, and improves production systems for recurring work that crosses tools, teams, and judgment—with specialist AI roles, explicit human gates, and accountable finished outputs."
              actions={
                <>
                  <Button variant="primary" analytics={{ cta_id: 'start_blueprint', surface: 'landing_hero', from_page: 'landing', destination: '/calendar' }} onClick={() => onNavigate?.('calendar')} className="text-base px-8 py-4">Start with a Workflow Blueprint</Button>
                  <Button variant="secondary" analytics={{ cta_id: 'see_work', surface: 'landing_hero', from_page: 'landing', destination: '/work' }} onClick={() => onNavigate?.('work')} className="text-base px-8 py-4">See the work</Button>
                </>
              }
            />
            <p className="mt-8 text-xs md:text-sm text-ink-muted/60 font-medium tracking-wide">
              Blueprint $5,000 · Production builds from $14,000 · Ongoing operation from $2,500/month
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
