import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, ScrollReveal } from './Shared';
import { track, type CaseId } from '../lib/analytics';
import type { Page } from './types';

interface NextCaseProps {
  from: CaseId;
  to: CaseId;
  title: string;
  hook: string;
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const NextCase: React.FC<NextCaseProps> = ({ from, to, title, hook, onNavigate }) => {
  const go = () => {
    track('next_case_click', { from_case: from, to_case: to });
    onNavigate(to);
  };

  return (
    <Section className="py-16 md:py-20 border-t border-ink/10">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-4">Next case</div>
          <p className="font-serif italic text-lg text-ink-muted leading-relaxed mb-6">{hook}</p>
          <button
            onClick={go}
            className="group inline-flex items-center gap-3 font-serif text-3xl md:text-4xl text-ink hover:text-accent transition-colors"
          >
            {title}
            <ArrowRight className="w-7 h-7 text-accent transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
          </button>
          <div className="mt-6">
            <button
              onClick={() => onNavigate('work')}
              className="font-sans text-sm text-ink-muted hover:text-ink underline underline-offset-4 decoration-ink/20 transition-colors"
            >
              All work
            </button>
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
};
