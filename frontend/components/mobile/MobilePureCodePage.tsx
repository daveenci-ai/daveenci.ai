import React, { useEffect } from 'react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';

interface MobilePureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const STAGES = ['Control', 'Blueprint', 'Delivery', 'Validation', 'Release'];

const GATES = [
  { n: 'Gate 1', title: 'Scope', body: 'A human approves what the team is about to build before any code gets written.' },
  { n: 'Gate 2', title: 'Design', body: 'A human reviews the proposed architecture before implementation begins.' },
  { n: 'Gate 3', title: 'Ship', body: 'A human signs off on the finished PR before it merges to main.' },
];

export const MobilePureCodePage: React.FC<MobilePureCodePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'PureCode — DaVeenci';
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
            A DaVeenci team · Code
          </span>
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          PureCode.
          <br />
          <span className="italic text-ink-muted/70">The code team.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6]">
          A feature request walks in. A shipped pull request walks out. 13 specialist agents coordinated by a controller, gated by humans at three critical points.
        </p>
      </section>

      {/* Problem */}
      <section className="px-6 pb-8">
        <div className="bg-alt/10 border-l-2 border-alt p-5 rounded-sm">
          <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
            General-purpose AI coding assistants are great at snippets and bad at systems. They lose context across files, skip review, and leave the human to reconcile when something breaks in production. Teams need a coding partner that behaves like an actual team — with specialists, a controller, and review checkpoints.
          </p>
        </div>
      </section>

      {/* Team structure */}
      <section className="px-6 pb-10">
        <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-4 tracking-tight">
          The team structure.
        </h3>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">
          PureCode is 13 specialist agents organized into five stages, each with a clear owner and a well-defined handoff. A controller named Navigator coordinates the work; Arbiter owns scope and the three human gates; Sentinel owns safety and validation.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {STAGES.map((stage, i) => (
            <div key={stage} className="p-3 border border-ink/10 bg-white/60 rounded-sm text-center">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1">
                Stage {i + 1}
              </div>
              <div className="font-serif text-[15px] text-ink">{stage}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gates */}
      <section className="px-6 pb-10">
        <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-4 tracking-tight">
          The three gates.
        </h3>
        <div className="space-y-3">
          {GATES.map((gate) => (
            <div key={gate.title} className="bg-accent/5 border border-accent/20 p-4 rounded-sm">
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1.5">
                {gate.n}
              </div>
              <h4 className="font-serif text-lg text-ink mb-1.5">{gate.title}</h4>
              <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{gate.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ships */}
      <section className="px-6 pb-10">
        <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-4 tracking-tight">
          What it ships.
        </h3>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
          A finished pull request on your repository, with the scope pre-approved, the design pre-reviewed, and the diff ready for a human to sign off. The team owns the work from feature request to merge.
        </p>
      </section>

      {/* End CTA */}
      <section className="px-6 py-10 bg-white/40 border-t border-ink/5">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Want a team like this for <br />
          <span className="italic text-accent">your stack?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          PureCode is one example of what a DaVeenci team looks like. We design and build specialist teams for the workflows that matter most to your business — code is just one of them.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
            See all work
          </MobileButton>
        </div>
      </section>
    </MobileShell>
  );
};
