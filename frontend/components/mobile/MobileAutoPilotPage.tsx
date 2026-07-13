import React, { useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  Mail,
  ScanSearch,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { MobileButton } from './MobileButton';
import { MobileNextCase } from './MobileNextCase';
import { MobileSubscribe } from './MobileSubscribe';
import { MobileScenePlate } from './MobileScenePlate';
import { MobileShell } from './MobileShell';
import type { Page } from '../types';

interface MobileAutoPilotPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const mobileProof = [
  ['3', 'services'],
  ['10 min', 'review cadence'],
  ['8', 'order checks'],
  ['75', 'product mappings'],
  ['50', 'vision rules'],
];

const mobileWorkflow = [
  {
    number: '01',
    title: 'Intake & schedule',
    body: 'Read the order, create the Aryeo job, match the customer and services, then schedule the closest allowed appointment.',
    Icon: Mail,
  },
  {
    number: '02',
    title: 'Review & repair',
    body: 'Run eight operational checks every ten minutes. Fix known mechanical issues and route ambiguity to a person.',
    Icon: ScanSearch,
  },
  {
    number: '03',
    title: 'Verify & gate',
    body: 'Check every promised deliverable, use vision for media subtypes and quality, then deliver or hold for review.',
    Icon: Eye,
  },
];

export const MobileAutoPilotPage: React.FC<MobileAutoPilotPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.22em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          A DaVeenci team · Real estate operations
        </div>
        <h1 className="font-serif text-[2.6rem] leading-[1.04] text-ink mb-5 tracking-tight">
          From order email
          <br />
          <span className="italic text-ink-muted/70">to delivery gate.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-7">
          For f8 Real Estate Media, DaVeenci built an accountable operations team that creates, reviews, repairs, and verifies production work before release.
        </p>
        <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>

        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Control loop">
            <div className="space-y-3">
              {mobileWorkflow.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-3 bg-base/45 border border-ink/10 p-3 rounded-sm">
                    <step.Icon className="w-5 h-5 text-accent flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted/60">{step.number}</div>
                      <div className="font-serif text-[17px] text-ink">{step.title}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                  </div>
                  {index < mobileWorkflow.length - 1 && <div className="h-3 w-px bg-accent/35 mx-auto" />}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3 font-mono text-[9px] uppercase tracking-widest text-amber-800">
              <AlertTriangle className="w-4 h-4" /> uncertainty routes to a human
            </div>
          </MobileScenePlate>
        </div>
      </section>

      <section className="px-6 py-9 bg-white/35 border-y border-ink/10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6">
          {mobileProof.map(([value, label]) => (
            <div key={label}>
              <div className="font-serif text-3xl text-ink">{value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">The operating system</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-8 tracking-tight">
          Three specialists.
          <br />
          <span className="italic text-ink-muted/70">One closed loop.</span>
        </h2>
        <div className="space-y-5">
          {mobileWorkflow.map((step) => (
            <MobileScenePlate key={step.number} figLabel={step.number}>
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
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Why it is a team</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-7 tracking-tight">
          The right intelligence
          <br />
          <span className="italic text-ink-muted/70">for each decision.</span>
        </h2>
        <div className="space-y-4">
          {[
            [ShieldCheck, 'Rules for consequence', 'Deterministic, verified actions handle production write-backs.'],
            [Eye, 'Vision for perception', 'AI looks for media subtypes, quality outliers, duplicates, and coverage.'],
            [UserCheck, 'Humans for uncertainty', 'Ambiguous and unreadable findings are routed, never silently passed.'],
            [Database, 'Memory for accountability', 'State, ledgers, retries, and read-back checks make every action inspectable.'],
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
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-4">Operating state · July 2026</div>
        <h2 className="font-serif text-[2.1rem] leading-[1.08] mb-7">Live where proven. Shadowed where consequence is higher.</h2>
        <div className="space-y-4">
          {[
            ['Live · 07 Jul', 'Order Review', 'Continuous QC, safe fixes, and issue routing.', 'green'],
            ['Live · 09 Jul', 'Job Review', 'Deliverable checks, vision QA, and the morning report.', 'green'],
            ['Shadow · gated', 'Delivery reschedule', 'Isolated until the final production controls are confirmed.', 'amber'],
          ].map(([status, title, body, tone]) => (
            <div key={title} className="border border-white/15 bg-white/5 p-5 rounded-sm">
              <div className={`font-mono text-[9px] uppercase tracking-widest mb-5 ${tone === 'green' ? 'text-green-300' : 'text-amber-300'}`}>
                {status}
              </div>
              <h3 className="font-serif text-xl mb-2">{title}</h3>
              <p className="font-sans text-[14px] text-base/65 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 text-center">
        <Clock3 className="w-7 h-7 text-accent mx-auto mb-5" strokeWidth={1.4} />
        <h2 className="font-serif text-[2.1rem] leading-[1.08] text-ink mb-5">Where is your workflow still held together by attention?</h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-7">Bring us the handoffs, spot checks, and exception queues your team carries in its head.</p>
        <MobileButton onClick={() => onNavigate('calendar')}>Name the handoff that breaks</MobileButton>
      </section>

      <MobileNextCase
        from="autopilot"
        to="purecode"
        title="PureCode"
        hook="Gates caught the bad order. Watch them catch bad code — a feature request in, a shipped pull request out."
        onNavigate={onNavigate}
      />

      <MobileSubscribe
        heading="Follow the operations work"
        body="How specialist teams take over real workflows — the handoffs, the gates, the morning reports. One Codex letter every Tuesday."
        source="autopilot"
      />
    </MobileShell>
  );
};
