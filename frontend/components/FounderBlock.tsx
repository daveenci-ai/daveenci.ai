import React from 'react';
import { Section, ScrollReveal, Quote, VitruvianBackground } from './Shared';
import type { Page } from './types';
import AntonSketch from '../images/Anton_Sketch.webp';
import { PRACTICES } from '../content/workCatalog';
import { track } from '../lib/analytics';

interface FounderBlockProps {
  onNavigate: (page: Page, hash?: string) => void;
}

const FounderBlock: React.FC<FounderBlockProps> = ({ onNavigate }) => (
  <Section id="founder" className="bg-ink text-canvas relative py-16 md:py-20">
    <VitruvianBackground className="opacity-[0.04] text-canvas" />
    <div className="max-w-5xl mx-auto relative z-10">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4">
            <div className="relative w-full max-w-xs mx-auto">
              {/* Construction circles around portrait — Leonardo scaffolding */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-canvas/10 scale-[1.08] pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-canvas/5 scale-[1.18] pointer-events-none"
              />
              <img
                src={AntonSketch}
                alt="Anton Osipov"
                width={1024}
                height={1040}
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-canvas/10 filter sepia-[0.15] contrast-105"
              />
            </div>
          </div>
          <div className="md:col-span-8 space-y-9">
            <Quote tone="dark" attribution={`${PRACTICES.operations.lead} · Co-Founder`}>
              I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists. DaVeenci is that bet — one workshop, many teams, each one good at one thing.
            </Quote>
            <div className="border-t border-canvas/15 pt-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">{PRACTICES.operations.name}</span>
                <span aria-hidden="true" className="h-px w-8 bg-canvas/25" />
                <span className="font-serif text-sm italic text-canvas/65">Led by {PRACTICES.operations.lead}</span>
              </div>
              <p className="mt-4 max-w-3xl font-sans text-[16px] leading-relaxed text-canvas/75">
                {PRACTICES.operations.summary}
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/65 sm:grid-cols-3">
                <li className="border border-canvas/15 px-3 py-2">Code delivery</li>
                <li className="border border-canvas/15 px-3 py-2">Operational review</li>
                <li className="border border-canvas/15 px-3 py-2">Research workflows</li>
              </ul>
              <a
                href="/work#operations"
                onClick={(event) => {
                  event.preventDefault();
                  track('practice_open', { practice_id: 'operations', surface: 'homepage_practice' });
                  onNavigate('work', '#operations');
                }}
                className="mt-6 inline-flex items-center font-sans text-sm font-medium text-accent-light underline decoration-accent-light/35 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
              >
                Explore Operations Systems
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default FounderBlock;
