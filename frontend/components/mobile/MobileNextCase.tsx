import React from 'react';
import { track, type CaseId } from '../../lib/analytics';
import type { Page } from '../types';

interface MobileNextCaseProps {
  from: CaseId;
  to: CaseId;
  title: string;
  hook: string;
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileNextCase: React.FC<MobileNextCaseProps> = ({ from, to, title, hook, onNavigate }) => {
  const go = () => {
    track('next_case_click', { from_case: from, to_case: to });
    onNavigate(to);
  };

  return (
    <section className="px-6 py-12 border-t border-ink/10">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">Next case</div>
      <p className="font-serif italic text-[16px] text-ink-muted leading-relaxed mb-5">{hook}</p>
      <button
        onClick={go}
        className="inline-flex items-center gap-2 font-serif text-[2rem] leading-tight text-ink active:text-accent transition-colors"
      >
        {title} <span aria-hidden="true">→</span>
      </button>
      <div className="mt-5">
        <button
          onClick={() => onNavigate('work')}
          className="font-sans text-[13px] text-ink-muted underline underline-offset-4 decoration-ink/20"
        >
          All work
        </button>
      </div>
    </section>
  );
};
