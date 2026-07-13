import React from 'react';
import { Section, ScrollReveal, Quote, VitruvianBackground } from './Shared';
import type { Page } from './types';
import AntonSketch from '../images/Anton_Sketch.webp';

interface FounderBlockProps {
  onNavigate: (page: Page) => void;
}

const FounderBlock: React.FC<FounderBlockProps> = (_props) => (
  <Section id="founder" className="bg-ink text-base relative">
    <VitruvianBackground className="opacity-[0.04] text-base" />
    <div className="max-w-5xl mx-auto relative z-10">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-4">
            <div className="relative w-full max-w-xs mx-auto">
              {/* Construction circles around portrait — Leonardo scaffolding */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-base/10 scale-[1.08] pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-base/5 scale-[1.18] pointer-events-none"
              />
              <img
                src={AntonSketch}
                alt="Anton Osipov"
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-base/10 filter sepia-[0.15] contrast-105"
              />
            </div>
          </div>
          <div className="md:col-span-8">
            <Quote tone="dark" attribution="Anton Osipov · Founder">
              I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists. DaVeenci is that bet — one workshop, many teams, each one good at one thing.
            </Quote>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default FounderBlock;
