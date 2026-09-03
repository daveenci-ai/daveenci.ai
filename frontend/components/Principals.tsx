import React, { useRef } from 'react';
import { Section, ScrollReveal, Quote, VitruvianBackground, GiocondaBackground } from './Shared';
import type { Page } from './types';
import AntonSketch from '../images/Anton_Sketch.webp';
import AstridSketch from '../images/Astrid_Sketch.webp';
import { PRACTICES } from '../content/workCatalog';
import { track } from '../lib/analytics';
import { useScrollProgress } from '../lib/useScrollProgress';

interface PrincipalsProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  /** Mobile tree: single column, portraits inline, no sticky swap. */
  compact?: boolean;
}

/**
 * The two founders on one dark spread, replacing two identical bands.
 * Desktop: the portrait column sticks while the quotes scroll past it, and the
 * portrait swaps from Anton to Astrid as her entry rises (`--swap`, 0 → 1,
 * written on the section from the second entry's progress). Reduced motion
 * and the compact variant show both portraits inline.
 */
const Principals: React.FC<PrincipalsProps> = ({ onNavigate, compact = false }) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const swapRef = useScrollProgress<HTMLDivElement>({
    mode: 'enter',
    enterEnd: 0.42,
    cssVar: '--swap-local',
    disabled: compact,
    onProgress: (p) => rootRef.current?.style.setProperty('--swap', p.toFixed(3)),
  });

  const openPractice = (practice: 'operations' | 'creative') => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    track('practice_open', { practice_id: practice, surface: 'homepage_practice' });
    if (practice === 'operations') onNavigate('work', '#operations');
    else onNavigate('creative-production');
  };

  const portrait = (src: string, alt: string, height: number, className: string) => (
    <div className={`relative w-full max-w-xs mx-auto ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-canvas/10 scale-[1.08] pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-canvas/5 scale-[1.18] pointer-events-none" />
      <img
        src={src}
        alt={alt}
        width={1024}
        height={height}
        loading="lazy"
        decoding="async"
        className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-canvas/10 filter sepia-[0.15] contrast-105"
      />
    </div>
  );

  const linkClass = 'mt-6 inline-flex items-center font-sans text-sm font-medium text-accent-light underline decoration-accent-light/35 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4';
  const chipClass = 'border border-canvas/15 px-3 py-2';

  const antonEntry = (
    <div className="space-y-9">
      <Quote tone="dark" attribution={`${PRACTICES.operations.lead} · Co-Founder`}>
        I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists. DaVeenci is that bet — one workshop, many teams, each one good at one thing.
      </Quote>
      <div className="border-t border-canvas/15 pt-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">{PRACTICES.operations.name}</span>
          <span aria-hidden="true" className="h-px w-8 bg-canvas/25" />
          <span className="font-serif text-sm italic text-canvas/65">Led by {PRACTICES.operations.lead}</span>
        </div>
        <p className="mt-4 max-w-3xl font-sans text-[16px] leading-relaxed text-canvas/75">{PRACTICES.operations.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/65">
          <li className={chipClass}>Code delivery</li>
          <li className={chipClass}>Operational review</li>
          <li className={chipClass}>Marketing measurement</li>
          <li className={chipClass}>Research workflows</li>
        </ul>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <a href="/work#operations" onClick={openPractice('operations')} className={linkClass}>Explore Operations Systems</a>
          <a
            href="/codex/governed-agent-operations"
            onClick={(event) => {
              event.preventDefault();
              onNavigate('briefing-detail', undefined, 'governed-agent-operations');
            }}
            className={linkClass}
          >
            How we run our own agents
          </a>
        </div>
      </div>
    </div>
  );

  const astridEntry = (
    <div className="space-y-9">
      <Quote tone="dark" attribution={`${PRACTICES.creative.lead} · Co-Founder`}>
        I spend my days inside founder conversations. Each one is a workflow that's stuck — a bottleneck, a handoff, a tool that almost gets there. My job is to turn that into a team design the workshop can build, and you can actually run.
      </Quote>
      <div className="border-t border-canvas/15 pt-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">{PRACTICES.creative.name}</span>
          <span aria-hidden="true" className="h-px w-8 bg-canvas/25" />
          <span className="font-serif text-sm italic text-canvas/65">Led by {PRACTICES.creative.lead}</span>
        </div>
        <p className="mt-4 max-w-3xl font-sans text-[16px] leading-relaxed text-canvas/75">{PRACTICES.creative.summary}</p>
        {/* Sector list matches mobile/MobilePartnerBlock.tsx — keep the two in sync. */}
        <p className="mt-3 font-serif text-sm italic leading-relaxed text-canvas/60">Law · Health · Non-profit · Ecommerce · Beverages</p>
        <ul className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/65">
          <li className={chipClass}>Campaign strategy</li>
          <li className={chipClass}>Ads + content</li>
          <li className={chipClass}>YouTube video</li>
        </ul>
        <a href="/creative-production" onClick={openPractice('creative')} className={linkClass}>Explore Creative Production</a>
      </div>
    </div>
  );

  if (compact) {
    return (
      <section id="founder" className="bg-ink text-canvas relative overflow-clip px-6 py-14" data-principals>
        <span id="partner" aria-hidden="true" />
        <VitruvianBackground className="opacity-[0.04] text-canvas" />
        <div className="relative z-10 space-y-14">
          <div>
            {portrait(AntonSketch, 'Anton Osipov', 1040, 'max-w-[13rem] mb-8')}
            {antonEntry}
          </div>
          <div className="border-t border-canvas/15 pt-14">
            {portrait(AstridSketch, 'Astrid Abrahamyan', 1024, 'max-w-[13rem] mb-8')}
            {astridEntry}
          </div>
        </div>
      </section>
    );
  }

  return (
    <Section id="founder" className="bg-ink text-canvas relative py-20 md:py-28" innerRef={rootRef}>
      {/* Legacy anchor from the second band. */}
      <span id="partner" aria-hidden="true" />
      <div className="principal-scaffold principal-scaffold-a" aria-hidden="true">
        <VitruvianBackground className="opacity-[0.04] text-canvas" />
      </div>
      <div className="principal-scaffold principal-scaffold-b" aria-hidden="true">
        <GiocondaBackground className="opacity-[0.055] text-canvas" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="mb-14 md:mb-20 flex items-center gap-4">
            <span className="h-px w-10 bg-canvas/25" aria-hidden="true" />
            <span className="font-serif italic text-base tracking-[0.15em] uppercase text-canvas/60">The Principals</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 principal-portraits">
            <div className="relative">
              {portrait(AntonSketch, 'Anton Osipov', 1040, 'principal-portrait principal-portrait-a')}
              {portrait(AstridSketch, 'Astrid Abrahamyan', 1024, 'principal-portrait principal-portrait-b')}
            </div>
          </div>

          <div className="md:col-span-8">
            <ScrollReveal>{antonEntry}</ScrollReveal>
            <div ref={swapRef} className="mt-16 pt-16 border-t border-canvas/15 md:mt-24 md:pt-24">
              <ScrollReveal>{astridEntry}</ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Principals;
