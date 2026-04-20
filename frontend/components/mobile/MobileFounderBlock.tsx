import React from 'react';
import { MobileFolioScene } from './MobileFolioScene';
import AntonSketch from '../../images/Anton_Sketch.jpg';

export const MobileFounderBlock: React.FC = () => (
  <MobileFolioScene id="founder" className="bg-ink text-base">
    <div className="flex flex-col items-center text-center mt-2">
      <div className="relative w-52 mb-6">
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-base/10 scale-[1.08] pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-base/5 scale-[1.18] pointer-events-none" />
        <img
          src={AntonSketch}
          alt="Anton Osipov"
          className="relative w-full rounded-sm shadow-2xl shadow-black/40 border border-base/10 filter sepia-[0.15] contrast-105"
        />
      </div>
      <div className="font-serif text-2xl text-base leading-none">Anton Osipov</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-base/50 mt-2">Founder</div>
    </div>

    <blockquote className="mt-10 relative">
      <span
        aria-hidden="true"
        className="absolute -top-2 -left-1 font-serif text-6xl text-accent/30 leading-none select-none"
      >
        "
      </span>
      <p className="font-serif italic text-[1.375rem] leading-[1.4] text-base/90 pl-6">
        I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists.
      </p>
    </blockquote>

    <p className="font-sans text-[16px] text-base/70 leading-relaxed mt-6 pl-6">
      DaVeenci is that bet — one workshop, many teams, each one good at one thing.
    </p>
  </MobileFolioScene>
);
