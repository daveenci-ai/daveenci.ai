import React from 'react';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileButton } from './MobileButton';
import AstridSketch from '../../images/Astrid_Sketch.webp';
import { GiocondaBackground } from '../Shared';
import type { Page } from '../types';
import { PRACTICES } from '../../content/workCatalog';
import { track } from '../../lib/analytics';

interface MobilePartnerBlockProps {
  onNavigate: (page: Page, hash?: string) => void;
}

export const MobilePartnerBlock: React.FC<MobilePartnerBlockProps> = ({ onNavigate }) => (
  <MobileFolioScene id="partner" className="bg-white/50 overflow-hidden">
    <GiocondaBackground className="text-ink opacity-[0.06]" />
    <div className="relative z-10 flex flex-col items-center text-center mt-2">
      <div className="relative w-48 mb-5">
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-ink/10 scale-[1.08] pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 rounded-full border border-ink/5 scale-[1.18] pointer-events-none" />
        <img
          src={AstridSketch}
          alt="Astrid Abrahamyan"
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="relative w-full rounded-sm shadow-xl shadow-ink/10 border border-ink/10 filter sepia-[0.15] contrast-105"
        />
      </div>
      <div className="font-serif text-2xl text-ink leading-none">{PRACTICES.creative.lead}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted mt-2">Co-Founder</div>
    </div>

    <blockquote className="relative z-10 mt-6">
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

    <div className="relative z-10 mt-6 border-t border-ink/10 pt-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-strong">{PRACTICES.creative.name}</div>
      <p className="mt-3 font-sans text-[15px] leading-relaxed text-ink-muted">{PRACTICES.creative.summary}</p>
      <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-ink-muted/80">
        Law · Health · Non-profit · Ecommerce · Beverages
      </p>
      <ul className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-ink-muted">
        <li className="border border-ink/10 bg-white/40 px-1.5 py-2">Strategy</li>
        <li className="border border-ink/10 bg-white/40 px-1.5 py-2">Ads + content</li>
        <li className="border border-ink/10 bg-white/40 px-1.5 py-2">YouTube video</li>
      </ul>
      <MobileButton
        className="mt-5"
        onClick={() => {
          track('practice_open', { practice_id: 'creative', surface: 'homepage_practice' });
          onNavigate('creative-production');
        }}
      >
        Explore Creative Production
      </MobileButton>
    </div>
  </MobileFolioScene>
);
