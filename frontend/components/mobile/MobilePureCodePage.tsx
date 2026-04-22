import React, { useEffect, useState } from 'react';
import { Layers, FileCode2, Code2, ShieldCheck, Rocket, Users, Building2, Briefcase, GitPullRequest, Plus, Minus } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { MobileScenePlate } from './MobileScenePlate';
import { Widget, IconBadge, ProblemCallout } from '../Shared';
import type { Page } from '../types';

interface MobilePureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const STAGES = [
  { icon: Layers, label: 'Control', body: 'Navigator routes the request. Arbiter checks scope.' },
  { icon: FileCode2, label: 'Blueprint', body: 'Design specialist drafts the architecture before a line is written.' },
  { icon: Code2, label: 'Delivery', body: 'Implementation agents write the code — one specialist per concern.' },
  { icon: ShieldCheck, label: 'Validation', body: 'Sentinel runs tests, lints, security checks. Nothing advances with a red.' },
  { icon: Rocket, label: 'Release', body: 'Finished PR lands with diff, tests, and rationale — ready for sign-off.' },
];

const GATES = [
  { n: 'Gate 1', title: 'Scope', body: 'A human approves what the team is about to build before any code gets written.' },
  { n: 'Gate 2', title: 'Design', body: 'A human reviews the proposed architecture before implementation begins.' },
  { n: 'Gate 3', title: 'Ship', body: 'A human signs off on the finished PR before it merges to main.' },
];

const USE_CASES = [
  { icon: Users, title: 'Engineering teams', body: 'Ship features without burning senior reviewer attention on boilerplate.' },
  { icon: Building2, title: 'CTOs & founders', body: 'Scale engineering output without proportionally scaling headcount.' },
  { icon: Briefcase, title: 'Product leads', body: 'Turn spec into shipped PR with predictable turnaround.' },
  { icon: GitPullRequest, title: 'Solo builders', body: 'A coordinated team ready to build a feature by morning.' },
];

const FAQS = [
  { q: 'Does PureCode replace my engineers?', a: "No. It handles specialist tasks with coordination and gates, freeing your engineers to focus on architecture, hard problems, and review. Three human gates ensure a human signs off before code ships." },
  { q: 'What stacks does it work with?', a: 'Any stack accessible via git — TypeScript, Python, Go, Rust, and mixed codebases. PureCode adapts to your repo conventions, not the other way around.' },
  { q: 'How does review and quality work?', a: 'Sentinel runs tests, type checks, lints, and security scans. The finished PR arrives with passing checks, a diff rationale, and every gate decision logged.' },
  { q: 'What if the task is ambiguous?', a: "The team stops at Gate 1 (Scope) and asks. You refine the brief, approve scope, and the team proceeds. No assumptions." },
  { q: 'Can I audit what each agent did?', a: 'Yes. Every step is logged, inspectable, and replayable. You see the full chain from request to merge.' },
  { q: 'How does pricing work?', a: "PureCode is sold as a specialist-team engagement, not per-seat SaaS. Pricing scales with volume of work shipped, not headcount. We'll size it on a discovery call." },
];

export const MobilePureCodePage: React.FC<MobilePureCodePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          A DaVeenci team · Code
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          Ship finished pull requests,
          <br />
          <span className="italic text-ink-muted/70">not AI-generated snippets.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
          PureCode is 13 specialist agents coordinated by a controller, gated by humans at three critical points. A feature request walks in. A shipped pull request walks out.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>See all work</MobileButton>
        </div>

        {/* Fig — Team structure mini-plate */}
        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Team Structure">
            <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[280px] mx-auto block">
              <circle cx="100" cy="100" r="72" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />
              <circle cx="100" cy="100" r="20" fill="rgb(var(--color-accent))" fillOpacity="0.15" stroke="rgb(var(--color-accent))" strokeWidth="1.3" />
              <text x="100" y="98" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-accent))" letterSpacing="0.08em">NAVIGATOR</text>
              <text x="100" y="108" textAnchor="middle" fontSize="5" fontFamily="serif" fill="rgb(var(--color-ink-muted))">controller</text>
              {STAGES.map((stage, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 72;
                const y = 100 + Math.sin(angle) * 72;
                return (
                  <g key={stage.label}>
                    <line x1={100 + Math.cos(angle) * 22} y1={100 + Math.sin(angle) * 22} x2={x} y2={y} stroke="rgb(var(--color-ink-muted))" strokeWidth="0.7" opacity="0.35" />
                    <circle cx={x} cy={y} r="13" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                    <text x={x} y={y - 1} textAnchor="middle" fontSize="5" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink))">{stage.label}</text>
                    <text x={x} y={y + 6} textAnchor="middle" fontSize="4" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">0{i + 1}</text>
                  </g>
                );
              })}
            </svg>
          </MobileScenePlate>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 pb-8">
        <ProblemCallout className="p-5">
          <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
            General-purpose AI coding assistants are great at snippets and bad at systems. Teams need a coding partner that behaves like an actual team — with specialists, a controller, and review checkpoints.
          </p>
        </ProblemCallout>
      </section>

      {/* Stages */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">How It Works</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Five stages. <br />
          <span className="italic text-ink-muted/70">Three gates.</span>
        </h2>
        <ol className="space-y-4">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <Widget as="li" key={stage.label} className="flex gap-4 p-4">
                <IconBadge><Icon className="w-5 h-5 text-accent" /></IconBadge>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-ink-muted">Stage {i + 1}</span>
                    <h3 className="font-serif text-lg text-ink">{stage.label}</h3>
                  </div>
                  <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{stage.body}</p>
                </div>
              </Widget>
            );
          })}
        </ol>
      </section>

      {/* Gates */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Governance</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Three gates. <span className="italic text-ink-muted/70">Three signatures.</span>
        </h2>
        <div className="space-y-3">
          {GATES.map((gate) => (
            <Widget key={gate.title} className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1.5">{gate.n}</div>
              <h4 className="font-serif text-lg text-ink mb-1.5">{gate.title}</h4>
              <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{gate.body}</p>
            </Widget>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Use Cases</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who PureCode is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-3">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <Widget key={uc.title} className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <IconBadge size="sm"><Icon className="w-4 h-4 text-accent" /></IconBadge>
                  <h3 className="font-serif text-lg text-ink">{uc.title}</h3>
                </div>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{uc.body}</p>
              </Widget>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">FAQ</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <Widget as="ol" className="px-5">
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <li key={i} className="border-b border-ink/10 last:border-b-0">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-baseline gap-3 py-4 text-left active:opacity-60 transition-opacity"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-serif text-base text-ink leading-snug">{item.q}</span>
                  <span className="flex-shrink-0 pt-1 text-ink-muted/60">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-4 pr-8 -mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{item.a}</p>
                  </div>
                )}
              </li>
            );
          })}
        </Widget>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-10 bg-white/40 border-t border-ink/5">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Want a team like this <br />
          <span className="italic text-accent">for your stack?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          PureCode is one example of what a DaVeenci team looks like. We design and build specialist teams for the workflows that matter most — code is just one of them.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>See all work</MobileButton>
        </div>
      </section>
    </MobileShell>
  );
};
