import React from 'react';

interface CoverBlueprint {
  code: string;
  stages: [string, string, string, string];
  caption: string;
}

const blueprints: Record<string, CoverBlueprint> = {
  'agentic-workflow': {
    code: 'AGENT / 04',
    stages: ['Request', 'Plan', 'Specialists', 'Human gate'],
    caption: 'Reason → act → observe → reflect',
  },
  'synthetic-data': {
    code: 'DATA / 03',
    stages: ['Seed set', 'Generate', 'Validate', 'Train'],
    caption: 'Private data stays inside the boundary',
  },
  'zero-touch-crm': {
    code: 'OPS / 07',
    stages: ['Capture', 'Resolve', 'Enrich', 'Review'],
    caption: 'Every mutation leaves an evidence trail',
  },
  'rag-vs-long-context': {
    code: 'MEM / 02',
    stages: ['Query', 'Retrieve', 'Context', 'Answer'],
    caption: 'Choose memory architecture by workload',
  },
  'local-llm-stack': {
    code: 'LOCAL / 05',
    stages: ['Matter', 'Private model', 'Citations', 'Counsel'],
    caption: 'Inference remains inside the legal boundary',
  },
  'prompt-patterns': {
    code: 'REASON / 06',
    stages: ['Task', 'Explore', 'Critique', 'Select'],
    caption: 'Structure the search, then verify the answer',
  },
  'ai-compliance': {
    code: 'GOV / 08',
    stages: ['System', 'Risk class', 'Evidence', 'Sign-off'],
    caption: 'Controls become part of the operating loop',
  },
  'saas-pricing': {
    code: 'VALUE / 01',
    stages: ['Usage', 'Outcome', 'Evidence', 'Invoice'],
    caption: 'Price the measurable result, not the seat',
  },
  'automated-video': {
    code: 'MEDIA / 09',
    stages: ['Signal', 'Script', 'Render', 'QA gate'],
    caption: 'Personalization with a reviewable production line',
  },
};

interface CodexCoverProps {
  id: string;
  title: string;
  className?: string;
}

export const CodexCover: React.FC<CodexCoverProps> = ({ id, title, className = '' }) => {
  const blueprint = blueprints[id] || blueprints['agentic-workflow'];

  return (
    <div
      role="img"
      aria-label={`${title}: ${blueprint.caption}`}
      className={`relative isolate h-full w-full overflow-hidden bg-canvas text-ink ${className}`}
    >
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="none">
        <defs>
          <pattern id={`codex-grid-${id}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgb(var(--color-ink))" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
          <radialGradient id={`codex-glow-${id}`} cx="75%" cy="20%" r="70%">
            <stop offset="0%" stopColor="rgb(var(--color-accent))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="450" fill={`url(#codex-grid-${id})`} />
        <rect width="800" height="450" fill={`url(#codex-glow-${id})`} />
        <circle cx="690" cy="42" r="130" fill="none" stroke="rgb(var(--color-accent))" strokeOpacity="0.14" />
        <circle cx="690" cy="42" r="92" fill="none" stroke="rgb(var(--color-accent))" strokeOpacity="0.09" strokeDasharray="8 10" />
        <path d="M40 390 H760" stroke="rgb(var(--color-ink))" strokeOpacity="0.12" />
      </svg>

      <div aria-hidden="true" className="relative flex h-full flex-col p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="block font-mono text-[8px] md:text-[9px] uppercase tracking-[0.24em] text-accent">DaVeenci Codex</span>
            <span className="mt-1 block font-mono text-[10px] md:text-xs tracking-[0.14em] text-ink/70">{blueprint.code}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_4px_rgba(139,111,71,0.12)] transition-transform duration-500 group-hover:scale-125" />
            System map
          </div>
        </div>

        <div className="my-auto grid grid-cols-4 items-center gap-2 md:gap-4">
          {blueprint.stages.map((stage, index) => (
            <div key={stage} className="relative">
              <div className="relative z-10 min-h-16 border border-ink/15 bg-white/65 p-2.5 shadow-[3px_3px_0_rgba(26,26,26,0.06)] transition-all duration-500 group-hover:border-accent/40 group-hover:bg-white/85 md:min-h-20 md:p-4">
                <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-ink-muted/60">0{index + 1}</span>
                <strong className="mt-2 block font-serif text-[10px] font-normal leading-tight text-ink md:text-sm">{stage}</strong>
              </div>
              {index < blueprint.stages.length - 1 && (
                <span className="absolute left-full top-1/2 z-20 h-px w-2 bg-accent/60 md:w-4">
                  <span className="absolute -right-px -top-[2px] h-[5px] w-[5px] rotate-45 border-r border-t border-accent" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-ink/10 pt-3">
          <p className="font-serif text-[9px] italic leading-snug text-ink-muted md:text-xs">{blueprint.caption}</p>
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ink-muted/55">Blueprint · not a black box</span>
        </div>
      </div>
    </div>
  );
};
