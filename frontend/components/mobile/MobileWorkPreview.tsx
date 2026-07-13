import React, { useEffect, useRef } from 'react';
import { MobileButton } from './MobileButton';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileScenePlate } from './MobileScenePlate';
import { track, type CaseId } from '../../lib/analytics';
import type { Page } from '../types';

interface MobileWorkPreviewProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const CASES: Array<{
  page: CaseId;
  label: string;
  status: string;
  title: string;
  blurb: string;
}> = [
  {
    page: 'purecode',
    label: 'Code',
    status: 'Operating',
    title: 'PureCode',
    blurb: 'A feature request becomes a shipped pull request through 13 specialist agents and three human gates.',
  },
  {
    page: 'autopilot',
    label: 'Real estate operations',
    status: 'Operating',
    title: 'AutoPilot',
    blurb: 'Three coordinated services create, review, repair, and verify production work before release.',
  },
  {
    page: 'compoundiq',
    label: 'Trading research & execution',
    status: 'In development · Paper only',
    title: 'CompoundIQ',
    blurb: 'Versioned research, explicit action gates, paper execution, and structured feedback in one constrained loop.',
  },
];

export const MobileWorkPreview: React.FC<MobileWorkPreviewProps> = ({ onNavigate }) => {
  const impressionTracked = useRef(false);

  useEffect(() => {
    const element = document.getElementById('selected-work');
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || impressionTracked.current) return;
      impressionTracked.current = true;
      track('work_preview_viewed', { surface: 'work_preview' });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
  <MobileFolioScene id="selected-work" eyebrow="Selected work" className="bg-white/30">
    <h2 className="font-serif text-[2.35rem] leading-[1.08] text-ink mb-4 tracking-tight">
      Built in the
      <br />
      <span className="italic text-ink-muted/70">real world.</span>
    </h2>
    <p className="font-serif text-[16px] text-ink-muted leading-relaxed mb-7">
      Some teams are operating today. Others are being proven in public. Every one makes its roles and gates explicit.
    </p>

    <div className="space-y-4 mb-7">
      {CASES.map((item) => (
        <a
          key={item.title}
          href={`/${item.page}`}
          onClick={(event) => {
            track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_preview' });
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate(item.page);
          }}
          className="block w-full text-left"
        >
          <MobileScenePlate figLabel={item.label} className="p-4">
            <div className={`font-mono text-[8px] uppercase tracking-[0.14em] mb-3 ${item.page === 'compoundiq' ? 'text-amber-800' : 'text-green-700'}`}>
              {item.status}
            </div>
            <h3 className="font-serif text-[1.65rem] leading-none text-ink mb-2">{item.title}</h3>
            <p className="font-sans text-[13px] text-ink-muted leading-relaxed">{item.blurb}</p>
          </MobileScenePlate>
        </a>
      ))}
    </div>

    <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
      See all work
    </MobileButton>
  </MobileFolioScene>
  );
};
