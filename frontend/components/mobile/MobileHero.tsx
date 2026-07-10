import React from 'react';
import { MobileFolioScene, MobileSceneSubtitle } from './MobileFolioScene';
import { MobileScenePlate } from './MobileScenePlate';
import type { Page } from '../types';

interface MobileHeroProps {
  onNavigate: (page: Page) => void;
}

/**
 * Folio I — mobile hero. Typography-first: eyebrow → display headline →
 * subtitle → Fig. i mini-plate → "See the work" link in thumb zone.
 * The persistent "Talk to us" CTA lives in MobileShell.
 */
export const MobileHero: React.FC<MobileHeroProps> = ({ onNavigate }) => (
  <MobileFolioScene id="hero" eyebrow="Folio I — The Thesis">
    <h1 className="font-serif text-[3.25rem] leading-[1.02] text-ink mb-6 mt-2 tracking-tight">
      AI teams.
      <br />
      <span className="italic text-ink-muted/70">Not AI tools.</span>
    </h1>

    <MobileSceneSubtitle>
      DaVeenci builds specialist AI teams that ship finished work — each one orchestrated, human-gated, and accountable to its output.
    </MobileSceneSubtitle>

    {/* Fig. i — mini plate with simplified team motif */}
    <MobileScenePlate figLabel="Fig. i · The Team">
      <svg viewBox="0 0 200 140" className="w-full h-auto max-w-[260px] mx-auto block">
        {/* Orbital ring */}
        <circle cx="100" cy="70" r="48" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />

        {/* Three specialists at 12, 4, 8 */}
        <circle cx="100" cy="22" r="9" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />
        <circle cx="142" cy="96" r="9" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />
        <circle cx="58" cy="96" r="9" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />

        {/* Spokes to controller */}
        <line x1="100" y1="31" x2="100" y2="58" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.8" opacity="0.5" />
        <line x1="133" y1="91" x2="112" y2="78" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.8" opacity="0.5" />
        <line x1="67" y1="91" x2="88" y2="78" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.8" opacity="0.5" />

        {/* Controller — accent pulsing core */}
        <circle cx="100" cy="70" r="13" fill="rgb(var(--color-accent))" fillOpacity="0.15" stroke="rgb(var(--color-accent))" strokeWidth="1.5" />
        <circle cx="100" cy="70" r="4" fill="rgb(var(--color-accent))">
          <animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </MobileScenePlate>

    {/* Thumb-zone secondary action */}
    <div className="mt-auto pt-8">
      <button
        onClick={() => onNavigate('work')}
        className="inline-flex items-center gap-2 -ml-3 px-3 py-3 font-serif italic text-[16px] text-accent tracking-[0.03em] active:text-ink transition-colors"
      >
        See the work <span aria-hidden="true">→</span>
      </button>
    </div>
  </MobileFolioScene>
);
