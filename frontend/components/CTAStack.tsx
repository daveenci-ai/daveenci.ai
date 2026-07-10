import React from 'react';
import { Section, ScrollReveal, Surface, Button } from './Shared';
import type { Page } from './types';

interface CTAStackProps {
  onNavigate: (page: Page) => void;
}

const CTAStack: React.FC<CTAStackProps> = ({ onNavigate }) => {
  const scrollToCodex = () => {
    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cards = [
    {
      title: 'Talk to us',
      detail: '30 minutes with Anton or Astrid. Bring the workflow you want a team for.',
      cta: 'Book a call',
      onClick: () => onNavigate('calendar'),
      variant: 'primary' as const,
    },
    {
      title: 'See the work',
      detail: 'Case studies: PureCode, AutoPilot, CompoundIQ, and the teams still taking shape.',
      cta: 'Browse work',
      onClick: () => onNavigate('work'),
      variant: 'secondary' as const,
    },
    {
      title: 'Subscribe to the Codex',
      detail: 'One essay or briefing a week. Build-in-public, voice of the workshop.',
      cta: 'Subscribe',
      onClick: scrollToCodex,
      variant: 'secondary' as const,
    },
  ];

  return (
    <Section id="cta-stack" pattern="grid">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <ScrollReveal key={card.title} delay={100 + i * 100}>
            <Surface
              kind="document"
              className="p-8 md:p-10 bg-white/60 border border-ink/10 h-full flex flex-col"
            >
              <h3 className="font-serif text-2xl text-ink mb-3">{card.title}</h3>
              <p className="font-sans text-ink-muted leading-relaxed mb-8 flex-grow">{card.detail}</p>
              <Button variant={card.variant} onClick={card.onClick} className="w-full">
                {card.cta}
              </Button>
            </Surface>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
};

export default CTAStack;
