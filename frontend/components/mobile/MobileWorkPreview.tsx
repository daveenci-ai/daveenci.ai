import React from 'react';
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

export const MobileWorkPreview: React.FC<MobileWorkPreviewProps> = ({ onNavigate }) => (
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
        <button
          key={item.title}
          onClick={() => {
            track('select_content', { content_type: 'case_study', content_id: item.page, surface: 'work_preview' });
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
        </button>
      ))}
    </div>

    <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
      See all work
    </MobileButton>
  </MobileFolioScene>
);
