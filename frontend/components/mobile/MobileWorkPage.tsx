import React, { useEffect } from 'react';
import { MobileShell } from './MobileShell';
import { MobileScenePlate } from './MobileScenePlate';
import type { Page } from '../types';

interface WorkItem {
  page: Page;
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
    page: 'shootos',
    label: 'Real estate media',
    title: 'ShootOS',
    subtitle: 'The real estate media team.',
    blurb: 'Stills, video, 3D tours, AI virtual staging — one property in, one listing-ready package out. Built for volume teams.',
  },
  {
    page: 'book-demo',
    label: 'Content',
    title: 'PulseNote',
    subtitle: 'The content team.',
    blurb: 'Meeting transcripts in. Publish-ready newsletters, social posts, and visuals out. One workflow across every platform you publish to.',
  },
  {
    page: 'brand-analyzer',
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
          <span className="italic text-ink-muted/70">Built, shipped, operating.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6]">
          Each example below is a complete team we've designed and built — specialist agents coordinated by a controller, gated by humans at the right points, accountable to the finished work.
        </p>
      </section>

      {/* Cases */}
      <section className="px-6 pb-10 space-y-5">
        {WORK_ITEMS.map((item) => (
          <button
            key={item.title}
            onClick={() => onNavigate(item.page)}
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
