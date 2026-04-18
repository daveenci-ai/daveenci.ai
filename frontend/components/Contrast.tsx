import React from 'react';
import { Section, SectionHeader, ScrollReveal, Surface } from './Shared';

const cards = [
  {
    label: 'Symptom A',
    title: 'The Generalist Tax',
    body: 'One chat window, every job. Coding, research, strategy, design. Average at each, excellent at none.',
  },
  {
    label: 'Symptom B',
    title: 'The Governance Gap',
    body: 'No review. No gate. No accountability. When it breaks in production, you own the wreck.',
  },
  {
    label: 'Symptom C',
    title: 'The Orchestration Gap',
    body: "A team isn't five instances of the same person. It's specialists, coordinated. AI tools are five instances of the same person.",
  },
];

const Contrast: React.FC = () => (
  <Section id="contrast" pattern="grid" className="bg-white/40">
    <SectionHeader
      eyebrow="Folio II — The Industry Is Wrong"
      title="One model cannot be everyone."
      subtitle="Every major AI product is one generalist pretending to do the work of a specialist team. It's mediocre at all of it."
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card, i) => (
        <ScrollReveal key={card.title} delay={100 + i * 150} className="h-full">
          <Surface
            kind="document"
            className="relative bg-white border border-ink/10 p-8 md:p-10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-accent/30 group flex flex-col h-full"
          >
            <span className="block text-xs font-bold text-accent uppercase tracking-wider mb-3">
              {card.label}
            </span>
            <h3 className="font-serif text-xl md:text-2xl text-ink mb-4">{card.title}</h3>
            <p className="font-sans text-ink-muted leading-relaxed flex-grow">{card.body}</p>
          </Surface>
        </ScrollReveal>
      ))}
    </div>
  </Section>
);

export default Contrast;
