import React, { useEffect, useState } from 'react';
import { Section, SectionHeader, ScrollReveal, Surface } from './Shared';

// --- Animated widgets, one per symptom ----------------------------------------

const JOBS = ['CODE', 'RESEARCH', 'STRATEGY', 'DESIGN'];

const GeneralistTaxWidget: React.FC = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % JOBS.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative w-full h-[96px] mb-6">
      <svg viewBox="0 0 240 96" className="w-full h-full overflow-visible">
        <rect x="60" y="18" width="120" height="60" rx="2" fill="white" stroke="rgb(var(--color-paper-border))" strokeWidth="1" />
        <circle cx="70" cy="28" r="1.6" fill="rgb(var(--color-paper-border))" />
        <circle cx="76" cy="28" r="1.6" fill="rgb(var(--color-paper-border))" />
        <line x1="78" y1="55" x2="78" y2="65" stroke="rgb(var(--color-accent))" strokeWidth="1.2" className="animate-pulse" />
        <text x="120" y="62" textAnchor="middle" fontFamily="serif" fontSize="11" fontStyle="italic" letterSpacing="0.15em" fill="rgb(var(--color-accent))">
          {JOBS[active]}?
        </text>
        {JOBS.map((job, i) => {
          const positions = [{ x: 30, y: 24 }, { x: 210, y: 24 }, { x: 30, y: 76 }, { x: 210, y: 76 }];
          const p = positions[i];
          return (
            <text key={job} x={p.x} y={p.y} textAnchor="middle" fontFamily="serif" fontSize="8" fontStyle="italic" letterSpacing="0.15em" fill="rgb(var(--color-ink-muted))" opacity={i === active ? 1 : 0.22} style={{ transition: 'opacity 600ms ease' }}>
              {job}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const GovernanceGapWidget: React.FC = () => (
  <div className="relative w-full h-[96px] mb-6 overflow-hidden">
    <svg viewBox="0 0 240 96" className="w-full h-full overflow-visible">
      <circle cx="24" cy="48" r="6" fill="rgb(var(--color-ink))" />
      <text x="24" y="74" textAnchor="middle" fontFamily="serif" fontSize="7" fontStyle="italic" letterSpacing="0.15em" fill="rgb(var(--color-ink-muted))">INPUT</text>
      <line x1="34" y1="48" x2="206" y2="48" stroke="rgb(var(--color-paper-border))" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="100" y="34" width="40" height="28" rx="1" fill="none" stroke="rgb(var(--color-accent))" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      <text x="120" y="78" textAnchor="middle" fontFamily="serif" fontSize="7" fontStyle="italic" letterSpacing="0.15em" fill="rgb(var(--color-accent))" opacity="0.7">NO GATE</text>
      <rect x="200" y="40" width="16" height="16" fill="#b91c1c" opacity="0.85" />
      <text x="208" y="74" textAnchor="middle" fontFamily="serif" fontSize="7" fontStyle="italic" letterSpacing="0.15em" fill="#b91c1c">WRECK</text>
      {[0, 1.2, 2.4].map((delay, i) => (
        <circle key={i} cx="30" cy="48" r="3" fill="rgb(var(--color-accent))">
          <animate attributeName="cx" from="30" to="200" dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  </div>
);

const OrchestrationGapWidget: React.FC = () => (
  <div className="relative w-full h-[96px] mb-6">
    <svg viewBox="0 0 240 96" className="w-full h-full overflow-visible">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx={40 + i * 40} cy="40" r="11" fill="rgb(var(--color-ink))" className="animate-pulse" style={{ animationDuration: '1.6s' }} />
          <circle cx={40 + i * 40} cy="40" r="14" fill="none" stroke="rgb(var(--color-ink))" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" />
        </g>
      ))}
      <text x="120" y="80" textAnchor="middle" fontFamily="serif" fontSize="8" fontStyle="italic" letterSpacing="0.2em" fill="rgb(var(--color-ink-muted))">5× THE SAME PERSON</text>
    </svg>
  </div>
);

// --- Main component -----------------------------------------------------------

const cards = [
  {
    label: 'Symptom A',
    title: 'The Generalist Tax',
    body: 'One chat window, every job. Coding, research, strategy, design. Average at each, excellent at none.',
    Widget: GeneralistTaxWidget,
  },
  {
    label: 'Symptom B',
    title: 'The Governance Gap',
    body: 'No review. No gate. No accountability. When it breaks in production, you own the wreck.',
    Widget: GovernanceGapWidget,
  },
  {
    label: 'Symptom C',
    title: 'The Orchestration Gap',
    body: "A team isn't five instances of the same person. It's specialists, coordinated. AI tools are five instances of the same person.",
    Widget: OrchestrationGapWidget,
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
            className="relative bg-white border border-ink/10 p-8 md:p-10 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-accent/30 group flex flex-col h-full"
          >
            <card.Widget />
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
