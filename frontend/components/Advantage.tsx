import React from 'react';
import { Section, ScrollReveal, Plate, FolioHeader } from './Shared';

// ---------- Fig. iv.a · Structured Memory ----------

const StructuredCard: React.FC = () => (
  <Plate fig="iv.a" title="Structured Memory" tilt={false}>
    <div className="relative h-full flex flex-col items-center pt-2 pb-6">
      <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
        {/* Three memory surfaces: journal, scratchpad, file-index */}

        {/* Journal — open book (left) */}
        <g transform="translate(54, 90)">
          <path d="M -22 -14 L -22 14 L 0 10 L 0 -10 Z" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
          <path d="M 0 -10 L 0 10 L 22 14 L 22 -14 Z" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="rgb(var(--color-ink))" strokeWidth="1" />
          <line x1="-17" y1="-8" x2="-4" y2="-8" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="-17" y1="-4" x2="-6" y2="-4" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="-17" y1="0" x2="-4" y2="0" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="4" y1="-8" x2="17" y2="-8" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="4" y1="-4" x2="15" y2="-4" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="4" y1="0" x2="17" y2="0" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          {/* Currently-writing indicator */}
          <line x1="4" y1="4" x2="10" y2="4" stroke="rgb(var(--color-accent))" strokeWidth="1.2">
            <animate attributeName="stroke-dashoffset" values="0;0;8;0;0" keyTimes="0;0.3;0.31;0.45;1" dur="6s" repeatCount="indefinite" />
            <animate attributeName="stroke-dasharray" values="8" dur="6s" repeatCount="indefinite" />
          </line>
        </g>
        <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">JOURNAL</text>
        <text x="54" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">per project</text>

        {/* Center pulsing indicator — "always on" memory */}
        <circle cx="120" cy="90" r="2.2" fill="rgb(var(--color-accent))" className="animate-pulse" />

        {/* File index (right) — stacked cards with tabs */}
        <g transform="translate(186, 90)">
          <rect x="-18" y="-11" width="36" height="22" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
          <rect x="-15" y="-14" width="30" height="4" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.1" />
          <line x1="-13" y1="-5" x2="13" y2="-5" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="-13" y1="0" x2="9" y2="0" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          <line x1="-13" y1="5" x2="13" y2="5" stroke="rgb(var(--color-ink))" strokeWidth="0.8" />
          {/* Retrieval highlight — one record briefly gets accent tint */}
          <rect x="-15" y="-7" width="30" height="4" fill="rgb(var(--color-accent))" fillOpacity="0">
            <animate attributeName="fill-opacity" values="0;0;0.25;0;0" keyTimes="0;0.55;0.6;0.72;1" dur="6s" repeatCount="indefinite" />
          </rect>
        </g>
        <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">INDEX</text>
        <text x="186" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">searchable</text>
      </svg>

      <div className="text-center px-3 mt-auto">
        <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">notes · scratchpad · searchable</p>
        <p className="text-sm text-ink-muted leading-relaxed">
          Each project keeps a journal. Each run keeps a scratchpad. Every decision and observation is filed — not scrolled.
        </p>
      </div>
    </div>
  </Plate>
);

// ---------- Fig. iv.b · Distilled Lessons ----------

const DistilledCard: React.FC = () => (
  <Plate fig="iv.b" title="Distilled Lessons" tilt={false}>
    <div className="relative h-full flex flex-col items-center pt-2 pb-6">
      <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
        {/* Left cluster: many observations (small dots scattered) */}
        <g transform="translate(54, 90)">
          {[
            { x: -18, y: -14 }, { x: -8, y: -16 }, { x: 6, y: -12 }, { x: 14, y: -10 },
            { x: -14, y: -4 }, { x: -2, y: -6 }, { x: 10, y: -2 }, { x: 18, y: -4 },
            { x: -16, y: 4 }, { x: -4, y: 6 }, { x: 8, y: 4 }, { x: 16, y: 8 },
            { x: -10, y: 12 }, { x: 2, y: 14 }, { x: 12, y: 12 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="1.6" fill="rgb(var(--color-ink))" opacity="0.45">
              <animate attributeName="opacity" values="0.45;0.45;0.85;0.45;0.45" keyTimes="0;0.2;0.25;0.35;1" dur="6s" begin={`${(i * 0.05) % 1}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
        <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">OBSERVATIONS</text>
        <text x="54" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">thousands of runs</text>

        {/* Funnel / arrow: dots flow right into the distilled rule */}
        <path d="M 82 82 L 112 88 L 112 92 L 82 98 Z" fill="rgb(var(--color-accent))" fillOpacity="0.15" stroke="rgb(var(--color-accent))" strokeWidth="0.9" />
        {[0, 1, 2].map((i) => (
          <circle key={`mote-${i}`} cy="90" r="1.8" fill="rgb(var(--color-accent))" opacity="0">
            <animate attributeName="cx" values="82;140" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.15;0.85;1" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Right: a distilled rule "scroll" / rule card */}
        <g transform="translate(186, 90)">
          <rect x="-22" y="-15" width="44" height="30" rx="1" fill="white" stroke="rgb(var(--color-accent))" strokeWidth="1.4" />
          <rect x="-22" y="-15" width="44" height="6" fill="rgb(var(--color-accent))" fillOpacity="0.18" />
          {/* "Rule: if X, then Y" — schematic lines */}
          <line x1="-17" y1="-5" x2="12" y2="-5" stroke="rgb(var(--color-accent))" strokeWidth="1" />
          <line x1="-17" y1="0" x2="17" y2="0" stroke="rgb(var(--color-accent))" strokeWidth="1" />
          <line x1="-17" y1="5" x2="8" y2="5" stroke="rgb(var(--color-accent))" strokeWidth="1" />
          <line x1="-17" y1="10" x2="14" y2="10" stroke="rgb(var(--color-accent))" strokeWidth="1" />
        </g>
        <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">RULE</text>
        <text x="186" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">carried forward</text>
      </svg>

      <div className="text-center px-3 mt-auto">
        <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">patterns · rules · compounded</p>
        <p className="text-sm text-ink-muted leading-relaxed">
          Thousands of observations distill into rules of thumb. The team walks into every new engagement smarter than the last.
        </p>
      </div>
    </div>
  </Plate>
);

// ---------- Fig. iv.c · Calibrated Trust ----------

const CalibratedCard: React.FC = () => {
  // Specialist accuracy bars (0-100)
  const bars = [
    { label: 'α', accuracy: 92, color: 'accent' },
    { label: 'β', accuracy: 74, color: 'ink' },
    { label: 'γ', accuracy: 86, color: 'accent' },
    { label: 'δ', accuracy: 58, color: 'ink' },
  ];

  return (
    <Plate fig="iv.c" title="Calibrated Trust" tilt={false}>
      <div className="relative h-full flex flex-col items-center pt-2 pb-6">
        <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
          {/* Horizontal "track" axis */}
          <line x1="60" y1="130" x2="210" y2="130" stroke="rgb(var(--color-paper-border))" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />

          {/* 4 specialist accuracy bars, vertical */}
          {bars.map((b, i) => {
            const x = 70 + i * 34;
            const barHeight = (b.accuracy / 100) * 55;
            const baseY = 130;
            const isHigh = b.accuracy > 75;
            return (
              <g key={b.label}>
                {/* Bar body */}
                <rect
                  x={x - 11}
                  y={baseY - barHeight}
                  width="22"
                  height={barHeight}
                  fill={isHigh ? 'rgb(var(--color-accent))' : 'rgb(var(--color-ink))'}
                  fillOpacity={isHigh ? 0.75 : 0.22}
                  stroke={isHigh ? 'rgb(var(--color-accent))' : 'rgb(var(--color-ink))'}
                  strokeWidth="1"
                />
                {/* Specialist label */}
                <text x={x} y={baseY + 10} textAnchor="middle" fontSize="9" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic">{b.label}</text>
                {/* Accuracy percent */}
                <text x={x} y={baseY - barHeight - 4} textAnchor="middle" fontSize="7" fill={isHigh ? 'rgb(var(--color-accent))' : 'rgb(var(--color-ink-muted))'} fontFamily="serif" fontStyle="italic" fontWeight={isHigh ? '600' : '400'}>{b.accuracy}%</text>
                {/* Subtle pulse on high-accuracy bars */}
                {isHigh && (
                  <rect
                    x={x - 11}
                    y={baseY - barHeight}
                    width="22"
                    height={barHeight}
                    fill="rgb(var(--color-accent))"
                    opacity="0"
                  >
                    <animate attributeName="opacity" values="0;0.25;0" keyTimes="0;0.5;1" dur="2.8s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            );
          })}
        </svg>

        <div className="text-center px-3 mt-auto">
          <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">accuracy · track record · weighted</p>
          <p className="text-sm text-ink-muted leading-relaxed">
            Each specialist carries a trust score from actual outcomes. When specialists disagree, track record decides.
          </p>
        </div>
      </div>
    </Plate>
  );
};

const Advantage: React.FC = () => (
  <Section id="advantage" pattern="nodes" overflow={true} className="bg-white/50">
    <ScrollReveal delay={100}>
      <FolioHeader
        eyebrow="Folio IV — The Advantage"
        title={<>A tool is free.<br />A team remembers.</>}
        subtitle="Open-source AI tools are an excellent place to start — fast, free, and transparent. What separates a tool from a team is what it remembers, distills, and trusts over time."
      />
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mt-4">
      <ScrollReveal delay={200}>
        <StructuredCard />
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <DistilledCard />
      </ScrollReveal>
      <ScrollReveal delay={400}>
        <CalibratedCard />
      </ScrollReveal>
    </div>
  </Section>
);

export default Advantage;
