import React from 'react';
import { Section, ScrollReveal, Quote, GiocondaBackground } from './Shared';
import AstridSketch from '../images/Astrid_Sketch.webp';
import type { Page } from './types';
import { PRACTICES } from '../content/workCatalog';
import { track } from '../lib/analytics';

interface PartnerBlockProps {
  onNavigate: (page: Page, hash?: string) => void;
}

const PartnerBlock: React.FC<PartnerBlockProps> = ({ onNavigate }) => (
  <Section id="partner" className="bg-ink text-canvas relative py-16 md:py-20">
    <GiocondaBackground className="opacity-[0.055] text-canvas" />
    <div className="max-w-5xl mx-auto relative z-10">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 md:order-1 order-2 space-y-9">
            <Quote tone="dark" attribution={`${PRACTICES.creative.lead} · Co-Founder`}>
              I spend my days inside founder conversations. Each one is a workflow that's stuck — a bottleneck, a handoff, a tool that almost gets there. My job is to turn that into a team design the workshop can build, and you can actually run.
            </Quote>
            <div className="border-t border-canvas/15 pt-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">{PRACTICES.creative.name}</span>
                <span aria-hidden="true" className="h-px w-8 bg-canvas/25" />
                <span className="font-serif text-sm italic text-canvas/65">Led by {PRACTICES.creative.lead}</span>
              </div>
              <p className="mt-4 max-w-3xl font-sans text-[16px] leading-relaxed text-canvas/75">
                {PRACTICES.creative.summary}
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-canvas/65 sm:grid-cols-3">
                <li className="border border-canvas/15 px-3 py-2">Campaign strategy</li>
                <li className="border border-canvas/15 px-3 py-2">Ads + content</li>
                <li className="border border-canvas/15 px-3 py-2">YouTube video</li>
              </ul>
              <a
                href="/creative-production"
                onClick={(event) => {
                  event.preventDefault();
                  track('practice_open', { practice_id: 'creative', surface: 'homepage_practice' });
                  onNavigate('creative-production');
                }}
                className="mt-6 inline-flex items-center font-sans text-sm font-medium text-accent-light underline decoration-accent-light/35 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
              >
                Explore Creative Production
              </a>
            </div>
          </div>
          <div className="md:col-span-4 md:order-2 order-1">
            <div className="relative w-full max-w-xs mx-auto">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-canvas/10 scale-[1.08] pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-canvas/5 scale-[1.18] pointer-events-none"
              />
              <img
                src={AstridSketch}
                alt="Astrid Abrahamyan"
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-canvas/10 filter sepia-[0.15] contrast-105"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default PartnerBlock;
