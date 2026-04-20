import React from 'react';
import { MobileShell } from './MobileShell';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileHero } from './MobileHero';
import { MobileContrast } from './MobileContrast';
import { MobileMethod } from './MobileMethod';
import { MobileFounderBlock } from './MobileFounderBlock';
import { MobileAdvantage } from './MobileAdvantage';
import { MobileControls } from './MobileControls';
import { MobilePartnerBlock } from './MobilePartnerBlock';
import { MobileBooking } from './MobileBooking';
import type { Page } from '../types';

interface MobileLandingProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

/**
 * Mobile-native landing orchestrator. Each folio is its own scene. Booking
 * and Codex scenes remain as placeholders until Phase 4 / 5.
 */
const MobileLanding: React.FC<MobileLandingProps> = ({ onNavigate }) => (
  <MobileShell onNavigate={onNavigate}>
    <MobileHero onNavigate={onNavigate} />
    <MobileContrast />
    <MobileMethod />
    <MobileFounderBlock />
    <MobileAdvantage />
    <MobileControls />
    <MobilePartnerBlock />
    <MobileBooking onNavigate={onNavigate} />

    {/* Placeholder — Phase 5 */}
    <MobileFolioScene id="codex" eyebrow="Folio VII — The Codex">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-4">
          Build <span className="italic text-ink-muted/70">in public.</span>
        </h2>
        <p className="font-serif text-base text-ink-muted leading-relaxed">
          Placeholder — real scene in Phase 5.
        </p>
      </div>
    </MobileFolioScene>
  </MobileShell>
);

export default MobileLanding;
