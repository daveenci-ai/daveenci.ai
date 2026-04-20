import React from 'react';
import { Section, ScrollReveal, Quote, VitruvianBackground } from './Shared';
import AstridSketch from '../images/Astrid_Sketch.webp';

const PartnerBlock: React.FC = () => (
  <Section id="partner" className="bg-ink text-base relative">
    <VitruvianBackground className="opacity-[0.04] text-base" />
    <div className="max-w-5xl mx-auto relative z-10">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-8 md:order-1 order-2">
            <Quote tone="dark" attribution="Astrid Abrahamyan · Partner">
              I spend my days inside founder conversations. Each one is a workflow that's stuck — a bottleneck, a handoff, a tool that almost gets there. My job is to turn that into a team design the workshop can build, and you can actually run.
            </Quote>
          </div>
          <div className="md:col-span-4 md:order-2 order-1">
            <div className="relative w-full max-w-xs mx-auto">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-base/10 scale-[1.08] pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-base/5 scale-[1.18] pointer-events-none"
              />
              <img
                src={AstridSketch}
                alt="Astrid Abrahamyan"
                className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-base/10 filter sepia-[0.15] contrast-105"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default PartnerBlock;
