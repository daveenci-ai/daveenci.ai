import React, { useEffect } from 'react';
import { MobileShell } from './MobileShell';
import { MobileScenePlate } from './MobileScenePlate';
import { track, type CaseId } from '../../lib/analytics';
import type { Page } from '../types';

interface WorkItem {
  page: CaseId;
  label: string;
  title: string;
  subtitle: string;
  blurb: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    page: 'purecode',
    label: 'Code',
    title: 'PureCode',
    subtitle: 'The code team.',
    blurb: 'A feature request walks in. A shipped pull request walks out. 13 specialist agents, 3 human gates, orchestrated end-to-end.',
  },
  {
    page: 'autopilot',
    label: 'Real estate operations',
    title: 'AutoPilot',
    subtitle: 'The production operations team.',
    blurb: 'Order email in. Scheduled job, continuous QC, safe remediation, and verified delivery out — three coordinated services across the production loop.',
  },
  {
    page: 'compoundiq',
    label: 'Trading research & execution',
    title: 'CompoundIQ',
    subtitle: 'The governed trading team.',
    blurb: 'Hypothesis in. Versioned research, explicit action gates, paper execution, and structured feedback out — an in-progress system designed to earn autonomy safely.',
  },
  {
    page: 'pulsenote',
    label: 'Content',
    title: 'PulseNote',
    subtitle: 'The content team.',
    blurb: 'Meeting transcripts in. Publish-ready newsletters, social posts, and visuals out. One workflow across every platform you publish to.',
  },
  {
    page: 'brandos',
    label: 'Brand',
    title: 'BrandOS',
    subtitle: 'The brand team.',
    blurb: 'A name, positioning, or launch idea goes in. Weighted scoring across 10 dimensions, calibrated to your business stage. Specialist-grade naming diligence.',
  },
];

interface MobileWorkPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const MobileWorkPage: React.FC<MobileWorkPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Our Work — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
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
          Each example below is a specialist team we've designed and built. Some are operating today; others are being proven in public. Every one coordinates narrow roles, human gates, and accountable finished work.
        </p>
      </section>

      {/* Cases */}
      <section className="px-6 pb-10 space-y-5">
        {WORK_ITEMS.map((item) => (
          <button
            key={item.title}
            onClick={() => {
              track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_page' });
              onNavigate(item.page);
            }}
            className="block w-full text-left"
          >
            <MobileScenePlate figLabel={item.label}>
              <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-1.5 tracking-tight">
                {item.title}
              </h2>
              <p className="font-serif italic text-base text-ink-muted mb-4">{item.subtitle}</p>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">{item.blurb}</p>
              <span className="font-sans text-sm font-medium text-accent">Read the case →</span>
            </MobileScenePlate>
          </button>
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
