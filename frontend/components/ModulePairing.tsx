import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, ScrollReveal, Section, SectionDivider } from './Shared';
import type { Page } from './types';
import { track } from '../lib/analytics';
import { modulePairings, shootOpsModules, starterModuleTerms, type StarterModuleId } from '../content/shootOpsModules';

// "Pairs with" band (13 Oct 2026): Concierge Order Intake and Order Review are the two fixed-price starter modules,
// and each page points at the other. Copy lives in content/shootOpsModules.ts (modulePairings); the card reads the
// other module's question, summary, price and address from the same catalogue as /shoot-ops and /modules.

interface ModulePairingProps {
  current: StarterModuleId;
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ModulePairing: React.FC<ModulePairingProps> = ({ current, onNavigate }) => {
  const pairing = modulePairings[current];
  const other = shootOpsModules.find((m) => m.id === pairing.with);
  const self = shootOpsModules.find((m) => m.id === current);
  if (!other?.page || !other.path) return null;

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    track('cta_click', {
      cta_id: 'module_pairing',
      surface: 'pairs_with',
      from_page: self?.path ?? '',
      destination: other.path as string,
    });
    onNavigate(other.page as Page);
  };

  return (
    <Section id="pairs-with" className="py-20 md:py-24 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5">
          <ScrollReveal>
            <SectionDivider className="mb-6" width="w-full max-w-[60%]" />
            <Eyebrow className="mb-4">{pairing.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl md:text-4xl md:leading-10 font-bold text-ink leading-[1.1] tracking-tight mb-5">{pairing.title}</h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed">{pairing.body}</p>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-7">
          <ScrollReveal direction="left">
            <a
              href={other.path}
              onClick={open}
              className="group block border border-ink/15 bg-white/80 rounded-xs p-8 md:p-10 shadow-widget-raised hover:border-accent/40 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Shoot Ops · Module {other.number}</span>
                <span className="font-serif italic text-3xl text-ink-muted/30">{other.number}</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl md:leading-10 text-ink leading-tight mb-2 group-hover:text-accent transition-colors">{other.title}</h3>
              <p className="font-serif italic text-lg text-ink-muted mb-4">{other.question}</p>
              <p className="font-sans text-ink-muted leading-relaxed mb-6">{other.summary}</p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-ink/10">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{other.price}</span>
                <span className="inline-flex items-center gap-2 font-serif italic text-base text-accent">
                  See {other.title}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </a>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mt-4">{starterModuleTerms}</p>
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default ModulePairing;
