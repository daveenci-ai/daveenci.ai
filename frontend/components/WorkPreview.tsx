import React from 'react';
import { Section, ScrollReveal, Surface, Button, FolioHeader } from './Shared';
import { track } from '../lib/analytics';
import type { Page } from './types';

interface WorkPreviewProps {
  onNavigate: (page: Page) => void;
}

const examples = [
  {
    page: 'purecode' as const,
    label: 'Code',
    status: 'Operating',
    title: 'PureCode',
    blurb: 'A specialist AI team that turns a feature request into a shipped pull request. 13 agents, 3 human gates.',
  },
  {
    page: 'autopilot' as const,
    label: 'Real estate operations',
    status: 'Operating',
    title: 'AutoPilot',
    blurb: 'Three coordinated services that create and schedule orders, continuously review operations, safely repair known exceptions, and verify delivery.',
  },
  {
    page: 'compoundiq' as const,
    label: 'Trading research & execution',
    status: 'In development · Paper only',
    title: 'CompoundIQ',
    blurb: 'Versioned market research, explicit action gates, paper execution, and structured feedback — designed to earn autonomy safely.',
  },
];

const WorkPreview: React.FC<WorkPreviewProps> = ({ onNavigate }) => (
  <Section id="selected-work" pattern="nodes">
    <ScrollReveal className="mb-12 md:mb-16">
      <FolioHeader
        eyebrow="Selected work"
        title="What specialist teams look like in practice."
        subtitle="Some are operating today. Others are being proven in public. Every one separates roles, makes its gates explicit, and stays accountable to the finished work."
      />
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {examples.map((example, i) => (
        <ScrollReveal key={example.title} delay={100 + i * 150}>
          <Surface
            kind="document"
            onClick={() => {
              track('select_content', { content_type: 'case_study', content_id: example.page, surface: 'work_preview' });
              onNavigate(example.page);
            }}
            className="cursor-pointer h-full p-8 md:p-10 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group flex flex-col"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {example.label}
              </span>
              <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${example.page === 'compoundiq' ? 'text-amber-800' : 'text-green-700'}`}>
                {example.status}
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 group-hover:text-accent transition-colors">
              {example.title}
            </h3>
            <p className="font-sans text-ink-muted leading-relaxed mb-6 flex-grow">{example.blurb}</p>
            <span className="font-sans text-sm font-medium text-accent group-hover:translate-x-1 transition-transform">
              Read the case →
            </span>
          </Surface>
        </ScrollReveal>
      ))}
    </div>

    <div className="flex justify-center">
      <Button variant="secondary" onClick={() => onNavigate('work')} className="px-8 py-4">
        See all work
      </Button>
    </div>
  </Section>
);

export default WorkPreview;
