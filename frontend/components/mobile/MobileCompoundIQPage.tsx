import React, { useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  CircleDot,
  Clock3,
  Database,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { MobileButton } from './MobileButton';
import { MobileNextCase } from './MobileNextCase';
import { MobileSubscribe } from './MobileSubscribe';
import { MobileGateSimulator } from './MobileGateSimulator';
import { MobileScenePlate } from './MobileScenePlate';
import { MobileShell } from './MobileShell';
import type { Page } from '../types';

interface MobileCompoundIQPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const mobileProof = [
  ['5', 'specialist roles'],
  ['15', 'research instruments'],
  ['3', 'action gate checks'],
  [':00 · :02 · :05', 'hourly paper loop'],
  ['0', 'live orders by design'],
];

const mobileSystem = [
  {
    number: '01',
    label: 'Research',
    title: 'Version the hypothesis',
    body: 'Own canonical data, backtests, diagnostics, stress evidence, and promotion decisions — without the ability to place an order.',
    Icon: FlaskConical,
  },
  {
    number: '02',
    label: 'Policy gate',
    title: 'Check permission at action time',
    body: 'Require an approved strategy, an enabled venue and environment, and a signal that has not expired.',
    Icon: ShieldCheck,
  },
  {
    number: '03',
    label: 'Paper executor',
    title: 'Simulate the consequence',
    body: 'Consume only gated signals and record paper fills with explicit fees and slippage. Live trading stays disabled.',
    Icon: Activity,
  },
  {
    number: '04',
    label: 'Feedback',
    title: 'Return reality to research',
    body: 'Write structured execution feedback so the next research cycle can compare expectation with outcome.',
    Icon: RotateCcw,
  },
];

const mobileStatus = [
  ['Active', 'Research platform', 'Canonical snapshots, diagnostics, backtests, stress evidence, and promotion gates.', 'green', FlaskConical],
  ['Proven · 09 Jul', 'Autonomous crypto paper loop', 'Hourly ingest, research, and paper execution ran end-to-end unattended.', 'green', Activity],
  ['Active', 'Private control dashboard', 'Strategies, signals, portfolio, and confirmed deployment controls.', 'green', LayoutDashboard],
  ['Planned', 'Stocks executor', 'A second venue specialist has not entered implementation yet.', 'sky', CircleDot],
  ['Disabled', 'Live execution', 'No live orders while the evidence and controls continue to mature.', 'amber', LockKeyhole],
] as const;

export const MobileCompoundIQPage: React.FC<MobileCompoundIQPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-3 font-mono text-[9px] tracking-[0.2em] uppercase text-amber-800 bg-amber-50/75 border border-amber-700/15 rounded-sm px-2.5 py-1">
          Build in public · In development · Paper only
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-accent mb-5">
          Trading research & execution
        </div>
        <h1 className="font-serif text-[2.6rem] leading-[1.04] text-ink mb-5 tracking-tight">
          Research proposes.
          <br />
          <span className="italic text-ink-muted/70">Gates decide.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-7">
          CompoundIQ is an in-progress, paper-first trading team. Versioned hypotheses become testable strategies; only approved, enabled, unexpired signals reach the simulator; every fill returns as feedback.
        </p>
        <div className="space-y-3">
          <MobileButton
            analytics={{ cta_id: 'try_gate', surface: 'case_hero', from_page: 'compoundiq', destination: '#compoundiq-gate' }}
            onClick={() => document.getElementById('compoundiq-gate')?.scrollIntoView({ behavior: 'smooth' })}
          >Try the gate</MobileButton>
          <MobileButton
            variant="secondary"
            analytics={{ cta_id: 'talk_to_us', surface: 'case_hero', from_page: 'compoundiq', destination: '/calendar' }}
            onClick={() => onNavigate('calendar')}
          >Talk to us</MobileButton>
        </div>

        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Governed loop">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">Paper environment</div>
              <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-widest text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> live disabled
              </div>
            </div>
            <div className="space-y-3">
              {[
                [':00', 'Market data', 'refresh reference bar', Database],
                [':02', 'Research', 'evaluate + signal', FlaskConical],
                [':05', 'Paper executor', 'gate + simulate fill', Activity],
              ].map(([time, title, detail, Icon], index) => {
                const StepIcon = Icon as React.ComponentType<{ className?: string }>;
                return (
                  <React.Fragment key={title as string}>
                    <div className="flex items-center gap-3 bg-base/45 border border-ink/10 p-3 rounded-sm">
                      <StepIcon className="w-5 h-5 text-accent flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-serif text-[17px] text-ink">{title as string}</div>
                        <div className="font-sans text-[11px] text-ink-muted">{detail as string}</div>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted/60 ml-auto">{time as string}</span>
                    </div>
                    {index < 2 && <div className="h-3 w-px bg-accent/35 mx-auto" />}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-ink/10 pt-3">
              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-green-800">
                <CheckCircle2 className="w-4 h-4" /> approved · enabled · unexpired
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-widest text-accent">
                <RotateCcw className="w-4 h-4" /> fill feedback returns to research
              </div>
            </div>
          </MobileScenePlate>
        </div>
      </section>

      <section className="px-6 py-9 bg-white/35 border-y border-ink/10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
          {mobileProof.map(([value, label]) => (
            <div key={label}>
              <div className="font-serif text-2xl text-ink whitespace-nowrap">{value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <MobileGateSimulator />

      <section className="px-6 py-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">The operating system</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-4 tracking-tight">
          Four specialists.
          <br />
          <span className="italic text-ink-muted/70">One constrained loop.</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-8">Research and execution never share working state. Each role communicates through versioned contracts and owns one narrow mandate.</p>
        <div className="space-y-5">
          {mobileSystem.map((step) => (
            <MobileScenePlate key={step.number} figLabel={`${step.number} · ${step.label}`}>
              <step.Icon className="w-7 h-7 text-accent mb-5" strokeWidth={1.4} />
              <h3 className="font-serif text-2xl text-ink mb-3">{step.title}</h3>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{step.body}</p>
            </MobileScenePlate>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 bg-alt/25">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Guardrails</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-7 tracking-tight">
          Autonomy earns
          <br />
          <span className="italic text-ink-muted/70">permission in layers.</span>
        </h2>
        <div className="space-y-4">
          {[
            [Clock3, 'Paper before live', 'Prove autonomy in simulation before consequence increases.'],
            [LockKeyhole, 'Keys stay server-side', 'Research and the browser never receive broker credentials.'],
            [GitBranch, 'Contracts before consumers', 'Shared schemas and mirrored contracts precede service dependencies.'],
            [SlidersHorizontal, 'Humans control deployment', 'Enable and disable actions require explicit confirmation.'],
          ].map(([Icon, title, body]) => {
            const ItemIcon = Icon as React.ComponentType<{ className?: string; strokeWidth?: number }>;
            return (
              <div key={title as string} className="bg-white/65 border border-ink/10 p-5 rounded-sm">
                <ItemIcon className="w-6 h-6 text-accent mb-4" strokeWidth={1.4} />
                <h3 className="font-serif text-xl text-ink mb-2">{title as string}</h3>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{body as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12 bg-ink text-base">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-4">Build status · 10 July 2026</div>
        <h2 className="font-serif text-[2.1rem] leading-[1.08] mb-4">Working in paper. Expanding in public.</h2>
        <p className="font-sans text-[13px] text-base/60 leading-relaxed mb-7">These labels describe engineering progress, not investment performance.</p>
        <div className="space-y-4">
          {mobileStatus.map(([status, title, body, tone, Icon]) => {
            const StatusIcon = Icon as React.ComponentType<{ className?: string }>;
            const toneClass = tone === 'green' ? 'text-green-300' : tone === 'sky' ? 'text-sky-300' : 'text-amber-300';
            return (
              <div key={title} className="border border-white/15 bg-white/5 p-5 rounded-sm">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <StatusIcon className={`w-5 h-5 ${toneClass}`} />
                  <div className={`font-mono text-[9px] uppercase tracking-widest ${toneClass}`}>{status}</div>
                </div>
                <h3 className="font-serif text-xl mb-2">{title}</h3>
                <p className="font-sans text-[14px] text-base/65 leading-relaxed">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-12 text-center">
        <ShieldCheck className="w-7 h-7 text-accent mx-auto mb-5" strokeWidth={1.4} />
        <h2 className="font-serif text-[2.1rem] leading-[1.08] text-ink mb-5">Where does your system need judgment without giving up control?</h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-7">Bring the decision you don't dare fully automate. We'll design the gate around it, together.</p>
        <MobileButton onClick={() => onNavigate('calendar')}>Map where autonomy stops</MobileButton>
      </section>

      <MobileNextCase
        from="compoundiq"
        to="autopilot"
        title="AutoPilot"
        hook="Governance works in trading. See it hold a real-estate delivery line together — from order email to the final gate."
        onNavigate={onNavigate}
      />

      <MobileSubscribe
        heading="Follow the CompoundIQ build"
        body="Working in paper, expanding in public — the Codex letter tracks how specialist teams like this one get designed, gated, and shipped. Every Tuesday."
        source="compoundiq"
      />
    </MobileShell>
  );
};
