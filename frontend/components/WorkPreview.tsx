import React from 'react';
import { Section, SectionHeader, ScrollReveal, Surface, Button } from './Shared';
import type { Page } from './types';

interface WorkPreviewProps {
  onNavigate: (page: Page) => void;
}

const examples = [
  {
    page: 'purecode' as Page,
    label: 'Code',
    title: 'PureCode',
    blurb: 'A specialist AI team that turns a feature request into a shipped pull request. 13 agents, 3 human gates.',
  },
  {
    page: 'shootos' as Page,
    label: 'Real estate media',
    title: 'ShootOS',
    blurb: 'A media team for volume real estate. Stills, video, 3D tours, virtual staging — one property in, listing-ready package out.',
  },
];

const WorkPreview: React.FC<WorkPreviewProps> = ({ onNavigate }) => (
  <Section id="work" pattern="nodes">
    <SectionHeader
      eyebrow="Folio III — The Work"
      title="Examples of what we build."
      subtitle="Every team follows the same playbook: specialist agents, orchestrated, human-gated, shipping finished work."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {examples.map((example, i) => (
        <ScrollReveal key={example.title} delay={100 + i * 150}>
          <Surface
            kind="document"
            onClick={() => onNavigate(example.page)}
            className="cursor-pointer h-full p-8 md:p-10 bg-white/60 border border-ink/10 hover:shadow-2xl hover:border-accent/30 transition-all duration-300 group flex flex-col"
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
              {example.label}
            </span>
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
