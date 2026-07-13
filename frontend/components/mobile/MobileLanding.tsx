import React from 'react';
import { MobileShell } from './MobileShell';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileHero } from './MobileHero';
import { MobileContrast } from './MobileContrast';
import { MobileMethod } from './MobileMethod';
import { MobileFounderBlock } from './MobileFounderBlock';
import { MobileAdvantage } from './MobileAdvantage';
import { MobileControls } from './MobileControls';
import { MobileWorkPreview } from './MobileWorkPreview';
import { MobilePartnerBlock } from './MobilePartnerBlock';
import { MobileBooking } from './MobileBooking';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';
import { ProofRail } from '../ProofRail';

interface MobileLandingProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

/**
 * Mobile-native landing orchestrator. Each folio keeps its own composition
 * while reusing shared proof, content, and navigation logic.
 */
const MobileLanding: React.FC<MobileLandingProps> = ({ onNavigate }) => (
  <MobileShell onNavigate={onNavigate}>
    <MobileHero onNavigate={onNavigate} />
    <ProofRail onNavigate={onNavigate} compact />
    <MobileContrast />
    <MobileWorkPreview onNavigate={onNavigate} />
    <MobileMethod />
    <MobileFounderBlock />
    <MobileAdvantage />
    <MobileControls />
    <MobilePartnerBlock />
    <MobileBooking onNavigate={onNavigate} />

    <MobileFolioScene id="codex" eyebrow="Folio VII — The Codex">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-4">
          Build <span className="italic text-ink-muted/70">in public.</span>
        </h2>
        <p className="font-serif text-[16px] text-ink-muted leading-relaxed">
          Essays and briefings on specialist AI teams — how we build them,
          what we learn, and what we get wrong along the way.
        </p>

        <div className="my-8 border-y border-ink/10 py-5">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
            Latest intelligence
          </span>
          <p className="font-serif italic text-lg text-ink leading-snug">
            Architecture, engineering, operations, and strategy from the workshop.
          </p>
        </div>

        <MobileButton variant="secondary" onClick={() => onNavigate('briefings')}>
          Read the Codex
        </MobileButton>
      </div>
    </MobileFolioScene>
  </MobileShell>
);

export default MobileLanding;
