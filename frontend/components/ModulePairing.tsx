import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Eyebrow, ScrollReveal, Section, SectionDivider } from './Shared';
import type { Page } from './types';
import { track } from '../lib/analytics';
import { modulePairings, shootOpsModules, starterModuleTerms, type StarterModuleId } from '../content/shootOpsModules';

// "Pairs with" band. The three fixed-price modules (Concierge Order Intake, Order Review, Daily Report) each show
// the other two (Anton, 13 Oct 2026 for two modules; 15 Oct 2026 for three). Copy lives in
// content/shootOpsModules.ts (modulePairings); each card reads the module's question, summary, price and address
// from the same catalogue as /shoot-ops and /modules.

interface ModulePairingProps {
  current: StarterModuleId;
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ModulePairing: React.FC<ModulePairingProps> = ({ current, onNavigate }) => {
  const pairing = modulePairings[current];
  const self = shootOpsModules.find((m) => m.id === current);
  const others = pairing.with
    .map((id) => shootOpsModules.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => !!m?.page && !!m.path);
  if (!others.length) return null;

  const open = (page: Page, path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    track('cta_click', {
      cta_id: 'module_pairing',
      surface: 'pairs_with',
      from_page: self?.path ?? '',
      destination: path,
    });
    onNavigate(page);
  };

  return (
    <Section id="pairs-with" className="scroll-mt-20" padding="py-20 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-4">
          <ScrollReveal>
            <SectionDivider className="mb-6" width="w-full max-w-[60%]" />
            <Eyebrow className="mb-4">{pairing.eyebrow}</Eyebrow>
            <h2 className="font-serif text-3xl md:text-4xl md:leading-10 font-bold text-ink leading-[1.1] tracking-tight mb-5">{pairing.title}</h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed">{pairing.body}</p>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {others.map((other, i) => (
              <ScrollReveal key={other.id} direction="left" delay={i * 120} className="h-full">
                <a
                  href={other.path}
                  onClick={open(other.page as Page, other.path as string)}
                  className="group h-full flex flex-col border border-ink/15 bg-white/80 rounded-xs p-7 md:p-8 shadow-widget-raised hover:border-accent/40 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Shoot Ops · Module {other.number}</span>
                    <span className="font-serif italic text-3xl text-ink-muted/30">{other.number}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-ink leading-tight mb-2 group-hover:text-accent transition-colors">{other.title}</h3>
                  <p className="font-serif italic text-lg text-ink-muted mb-4">{other.question}</p>
                  <p className="font-sans text-ink-muted leading-relaxed mb-6 grow">{other.summary}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-ink/10">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">{other.price}</span>
                    <span className="inline-flex items-center gap-2 font-serif italic text-base text-accent">
                      See {other.title}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
          <p className="font-sans text-sm text-ink-muted leading-relaxed mt-4">{starterModuleTerms}</p>
        </div>
      </div>
    </Section>
  );
};

export default ModulePairing;
