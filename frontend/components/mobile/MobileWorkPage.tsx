import React, { useEffect } from 'react';
import { MobileShell } from './MobileShell';
import { MobileScenePlate } from './MobileScenePlate';
import { track } from '../../lib/analytics';
import type { Page } from '../types';
import { workCatalog, workStatusClass } from '../../content/workCatalog';

interface MobileWorkPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileWorkPage: React.FC<MobileWorkPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            Our Work
          </span>
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          Specialist AI teams.
          <br />
          <span className="italic text-ink-muted/70">Built in the real world.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6]">
          Every case shows its status plainly: production, endorsed practice, demonstration, or research still earning trust.
        </p>
      </section>

      {/* Cases */}
      <section className="px-6 pb-10 space-y-5">
        {workCatalog.map((item) => (
          <a
            key={item.title}
            href={item.href}
            onClick={(event) => {
              track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_page' });
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              onNavigate(item.page);
            }}
            className="block w-full text-left"
          >
            <MobileScenePlate figLabel={item.label}>
              <div className={`font-mono text-[8px] uppercase tracking-[0.14em] mb-3 ${workStatusClass(item.statusTone)}`}>{item.status}</div>
              <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-1.5 tracking-tight">
                {item.title}
              </h2>
              <p className="font-serif italic text-base text-ink-muted mb-4">{item.subtitle}</p>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">{item.blurb}</p>
              <span className="font-sans text-sm font-medium text-accent">Read the case →</span>
            </MobileScenePlate>
          </a>
        ))}
      </section>

      {/* End CTA */}
      <section className="px-6 py-10 bg-white/40">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Want a team for <br />
          <span className="italic text-accent">your domain?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          Every team we build follows the same playbook. If you have a specialized workflow that produces finished work, we can design a team for it.
        </p>
      </section>
    </MobileShell>
  );
};
