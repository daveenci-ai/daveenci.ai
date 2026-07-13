import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { homeProof } from '../content/homeProof';
import { track } from '../lib/analytics';
import type { Page } from './types';

interface ProofRailProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  compact?: boolean;
}

export const ProofRail: React.FC<ProofRailProps> = ({ onNavigate, compact = false }) => {
  const openDemo = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    track('cta_click', {
      cta_id: 'watch_ticket_move',
      surface: 'home_proof',
      from_page: 'landing',
      destination: '/purecode#try-it',
    });
    onNavigate('purecode', '#try-it');
  };

  return (
    <section
      aria-labelledby="operating-proof-heading"
      className={compact ? 'px-6 pb-10' : 'relative z-20 px-6 pb-14 md:pb-18'}
    >
      <a
        href="/purecode#try-it"
        onClick={openDemo}
        className={`group mx-auto block border border-ink/10 bg-white/65 backdrop-blur-md shadow-[0_18px_50px_-34px_rgba(26,26,26,0.55)] transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_24px_60px_-30px_rgba(139,111,71,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 ${compact ? 'rounded-sm p-5' : 'max-w-7xl rounded-lg p-5 md:p-7'}`}
      >
        <div className={compact ? '' : 'grid items-center gap-6 lg:grid-cols-[1.1fr_2fr_auto]'}>
          <div>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
              {homeProof.eyebrow}
            </p>
            <h2 id="operating-proof-heading" className="font-serif text-lg md:text-xl leading-snug text-ink">
              {homeProof.statement}
            </h2>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 ${compact ? 'mt-5' : ''}`}>
            {homeProof.stages.map((stage, index) => (
              <div key={stage.label} className="relative border-l border-ink/10 px-3 py-2 first:border-l-0 md:first:border-l">
                <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-ink-muted/65 mb-1">
                  {String(index + 1).padStart(2, '0')} · {stage.label}
                </span>
                <strong className="block font-serif text-sm md:text-base font-normal text-ink">{stage.value}</strong>
                {index < homeProof.stages.length - 1 && (
                  <ArrowRight aria-hidden="true" className="hidden md:block absolute -right-2 top-1/2 z-10 w-4 h-4 -translate-y-1/2 rounded-full bg-canvas p-0.5 text-accent" />
                )}
              </div>
            ))}
          </div>

          <span className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent ${compact ? 'mt-5' : ''}`}>
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            Run the flow
          </span>
        </div>
      </a>
    </section>
  );
};
