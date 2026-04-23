import React, { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, GitPullRequest, Plus, Minus } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { Widget } from '../Shared';
import {
  PureCodeHeroDiagram,
  SpecialistRoster,
  BlueprintBuilder,
  ValidationRunner,
  TryItSimulator,
} from '../PureCodePage';
import { BookingWidget } from '../BookingWidget';
import AntonSketch from '../../images/Anton_Sketch.webp';
import type { Page } from '../types';

interface MobilePureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

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

const FeatureRow: React.FC<{
  heading: string;
  body: string;
  bullets: string[];
  children: React.ReactNode;
}> = ({ heading, body, bullets, children }) => (
  <div className="space-y-5">
    <div>
      <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-3 tracking-tight">{heading}</h3>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">{body}</p>
      <ul className="space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-ink-muted">
            <div className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
            <span className="font-sans text-[14px] leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex justify-center">{children}</div>
  </div>
);

const SectionEyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="h-px w-8 bg-ink-muted/30" />
    <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">{children}</span>
  </div>
);

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
        <h1 className="font-serif text-[2.5rem] leading-[1.05] text-ink mb-5 tracking-tight">
          Ship finished pull requests,
          <br />
          <span className="italic text-ink-muted/70">not AI-generated snippets.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-6">
          PureCode is 13 specialist agents coordinated by a controller, gated by humans at three critical points. A feature request walks in. A shipped pull request walks out.
        </p>
        <div className="flex flex-col gap-3 mb-8">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>See all work</MobileButton>
        </div>

        <div className="flex justify-center">
          <PureCodeHeroDiagram />
        </div>
      </section>

      {/* The Product */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>The Product</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-8 tracking-tight">
          What a coordinated <span className="italic text-ink-muted/70">team looks like.</span>
        </h2>

        <div className="space-y-14">
          <FeatureRow
            heading="13 specialists, not a generalist"
            body="General-purpose AI coders do everything adequately and nothing expertly. PureCode routes each part of the job to the specialist that does it best."
            bullets={[
              'One specialist per concern — no context loss across files',
              'Sentinel validates before anything reaches a human',
              'Every handoff logged — inspectable and replayable',
            ]}
          >
            <SpecialistRoster />
          </FeatureRow>

          <FeatureRow
            heading="Blueprint before a line of code"
            body="The Architect proposes the design first: which files are new, which get modified, what the tests look like. Gate 2 lives here — you review the plan before anyone writes a single line."
            bullets={[
              'Design proposal shown as a file-by-file plan',
              'You approve the architecture, not a finished diff',
              'Changes after Gate 2 re-trigger the review',
            ]}
          >
            <BlueprintBuilder />
          </FeatureRow>

          <FeatureRow
            heading="Validation that actually validates"
            body="Sentinel runs the real checks — tests, typecheck, lint, security audit — against the specialist output before anything touches a human review queue. Red blocks the PR."
            bullets={[
              "Runs your repo's actual test / lint / audit commands",
              'Gate 3 arrives with passing checks + a full audit log',
              'One-click replay of every gate decision',
            ]}
          >
            <ValidationRunner />
          </FeatureRow>
        </div>
      </section>

      {/* Try It */}
      <section id="try-it" className="px-6 py-10">
        <SectionEyebrow>Try It</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-3 tracking-tight">
          Pick a ticket. <span className="italic text-ink-muted/70">Watch the team work.</span>
        </h2>
        <p className="font-serif text-[15px] text-ink-muted leading-relaxed mb-6">
          Every ticket walks the same path — scope, blueprint, delivery, validation, release — with every gate stamped.
        </p>
        <TryItSimulator />
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10 bg-white/40">
        <SectionEyebrow>Use Cases</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who PureCode is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-4">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div key={uc.title} className="bg-white border border-ink/10 p-5 shadow-sm hover:shadow-lg transition-all rounded-lg text-center flex flex-col items-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-pulse-surface border border-ink/10 overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176" fill="none">
                    <circle cx="88" cy="88" r="78" stroke="rgb(var(--color-ink))" strokeWidth="0.6" opacity="0.08" />
                    <circle cx="88" cy="88" r="60" stroke="rgb(var(--color-ink))" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.12" />
                    <circle cx="88" cy="88" r="42" stroke="rgb(var(--color-accent))" strokeWidth="0.8" opacity="0.15" />
                  </svg>
                  <Icon className="relative w-10 h-10 text-accent/80" strokeWidth={1.3} />
                </div>
                <h3 className="font-serif text-lg text-ink mb-2">{uc.title}</h3>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{uc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10">
        <SectionEyebrow>FAQ</SectionEyebrow>
        <h2 className="font-serif text-[1.9rem] leading-[1.1] text-ink mb-6 tracking-tight">
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

      {/* Book a PureCode intro */}
      <BookingWidget
        onNavigate={onNavigate}
        eyebrow="PureCode Intro"
        title="Book a PureCode intro"
        subtitle="Walk us through the kind of work your team ships today."
        leftBody="We'll look at your codebase, your existing review flow, and the tickets that eat your senior engineers' time — then scope what a specialist team + human gates would mean for you."
        bookingType="demo-purecode"
        hostName="Anton Osipov"
        hostRole="Founder"
        hostImage={AntonSketch}
      />
    </MobileShell>
  );
};
