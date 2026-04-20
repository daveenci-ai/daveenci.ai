import React from 'react';
import { MobileFolioScene } from './MobileFolioScene';
import AstridSketch from '../../images/Astrid_Sketch.jpg';

export const MobilePartnerBlock: React.FC = () => (
  <MobileFolioScene id="partner" className="bg-white/50">
    <div className="flex flex-col items-center text-center mt-2">
      <div className="relative w-56 mb-6">
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-ink/10 scale-[1.08] pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-ink/5 scale-[1.18] pointer-events-none" />
        <img
          src={AstridSketch}
          alt="Astrid Abrahamyan"
          className="relative w-full rounded-sm shadow-xl shadow-ink/10 border border-ink/10 filter sepia-[0.15] contrast-105"
        />
      </div>
      <div className="font-serif text-2xl text-ink leading-none">Astrid Abrahamyan</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted mt-2">Partner</div>
    </div>

    <blockquote className="mt-10 relative">
      <span
        aria-hidden="true"
        className="absolute -top-2 -left-1 font-serif text-6xl text-accent/30 leading-none select-none"
      >
        "
      </span>
      <p className="font-serif italic text-[1.375rem] leading-[1.4] text-ink pl-6">
        Every team we build starts the same way — a founder showing me the workflow that's eating their week.
      </p>
    </blockquote>

    <p className="font-sans text-[16px] text-ink-muted leading-relaxed mt-6 pl-6">
      My job is to turn that conversation into a team design the workshop can build, and you can actually run.
    </p>
  </MobileFolioScene>
);
