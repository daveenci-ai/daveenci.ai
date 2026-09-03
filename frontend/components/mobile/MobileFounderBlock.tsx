import React from 'react';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileButton } from './MobileButton';
import { Reveal } from '../motion/Parallax';
import AntonSketch from '../../images/Anton_Sketch.webp';
import { VitruvianBackground } from '../Shared';
import type { Page } from '../types';
import { PRACTICES } from '../../content/workCatalog';
import { track } from '../../lib/analytics';

interface MobileFounderBlockProps {
  onNavigate: (page: Page, hash?: string) => void;
}

export const MobileFounderBlock: React.FC<MobileFounderBlockProps> = ({ onNavigate }) => (
  <MobileFolioScene id="founder" className="bg-ink text-canvas overflow-hidden">
    <VitruvianBackground className="text-canvas opacity-[0.04]" />
    <div className="relative z-10 flex flex-col items-center text-center mt-2">
      <div className="relative w-48 mb-5">
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-canvas/10 scale-[1.08] pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-canvas/5 scale-[1.18] pointer-events-none" />
        <img
          src={AntonSketch}
          alt="Anton Osipov"
          width={1024}
          height={1040}
          loading="lazy"
          decoding="async"
          className="relative w-full rounded-sm shadow-2xl shadow-black/40 border border-canvas/10 filter sepia-[0.15] contrast-105"
        />
      </div>
      <div className="font-serif text-2xl text-canvas leading-none">{PRACTICES.operations.lead}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-canvas/70 mt-2">Co-Founder</div>
    </div>

    <Reveal enterEnd={0.85} lift={16} className="relative z-10 mt-6">
      <blockquote>
        <span
          aria-hidden="true"
          className="absolute -top-2 -left-1 font-serif text-6xl text-accent/30 leading-none select-none"
        >
          "
        </span>
        <p className="font-serif italic text-[1.375rem] leading-[1.4] text-canvas/90 pl-6">
          I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists.
        </p>
      </blockquote>
    </Reveal>

    <div className="relative z-10 mt-6 border-t border-canvas/15 pt-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">{PRACTICES.operations.name}</div>
      <p className="mt-3 font-sans text-[15px] leading-relaxed text-canvas/75">{PRACTICES.operations.summary}</p>
      <ul className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-canvas/70">
        <li className="border border-canvas/15 px-1.5 py-2">Code delivery</li>
        <li className="border border-canvas/15 px-1.5 py-2">Ops review</li>
        <li className="border border-canvas/15 px-1.5 py-2">Research</li>
      </ul>
      <MobileButton
        variant="secondary"
        className="mt-5"
        onClick={() => {
          track('practice_open', { practice_id: 'operations', surface: 'homepage_practice' });
          onNavigate('work', '#operations');
        }}
      >
        Explore Operations Systems
      </MobileButton>
    </div>
  </MobileFolioScene>
);
