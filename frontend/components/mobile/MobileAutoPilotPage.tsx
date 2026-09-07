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
import { Reveal } from '../motion/Parallax';
import { Stack } from '../motion/Stack';
import { useScrollProgress } from '../../lib/useScrollProgress';
import type { Page } from '../types';
import { CaseEvidence } from '../CaseEvidence';
import { shootosEvidence } from '../../content/shootosEvidence';
import { shootosModules, shootosPlatforms } from '../../content/shootosModules';

interface MobileAutoPilotPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const mobileProof = [
  ['4', 'modules'],
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
    body: 'Check every promised deliverable, confirm media subtypes with vision, review each photo, then deliver or hold for review.',
    Icon: Eye,
  },
];

export const MobileAutoPilotPage: React.FC<MobileAutoPilotPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hero planes: copy settles, the figure lags as the hero scrolls out.
  const heroRef = useScrollProgress<HTMLElement>({ mode: 'exit' });

  return (
    <MobileShell onNavigate={onNavigate}>
      <section ref={heroRef} className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.22em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          ShootOS · A specialist practice by DaVeenci
        </div>
        <div className="hero-copy">
        <h1 className="font-serif text-[2.6rem] leading-[1.04] text-ink mb-5 tracking-tight">
          From order email
          <br />
          <span className="italic text-ink-muted/70">to delivery gate.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6] mb-7">
          ShootOS is a set of modules for real-estate media companies, each doing one job inside the platform you already run — starting with Order Intake.
        </p>
        </div>
        {/* Built for = platforms. Parity with the desktop tree. */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Built for</span>
            <span aria-hidden="true" className="h-px w-5 bg-ink-muted/30" />
          </div>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {shootosPlatforms.map((platform) => (
              <li key={platform.name} className={`font-serif text-[17px] ${platform.state === 'built' ? 'text-ink' : 'text-ink-muted/70'}`}>
                {platform.name}
                {platform.state === 'on request' && <span className="font-mono text-[8px] uppercase tracking-widest text-ink-muted/60 ml-1 align-middle">on request</span>}
              </li>
            ))}
          </ul>
        </div>
        <MobileButton analytics={{ cta_id: 'name_handoff', surface: 'case_hero', from_page: 'autopilot', destination: '/calendar' }} onClick={() => onNavigate('calendar')}>Name the handoff that breaks</MobileButton>
        <MobileButton
          variant="secondary"
          className="mt-3"
          onClick={() => document.getElementById('autopilot-workflow')?.scrollIntoView({ behavior: 'smooth' })}
        >
          See the workflow
        </MobileButton>

        <div className="mt-8 hero-plate">
          <MobileScenePlate figLabel="Fig. i · Control loop">
            <div className="space-y-3">
              {mobileWorkflow.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-3 bg-canvas/45 border border-ink/10 p-3 rounded-sm">
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

      <CaseEvidence
        compact
        title="The workflow, controls, and operating truth."
        subtitle="The evidence ledger separates the ShootOS practice from the AutoPilot system running inside it."
        items={shootosEvidence}
      />

      {/* id matches the desktop tree so the hero's "See the workflow" lands here. */}
      <section id="autopilot-workflow" className="px-6 py-12 scroll-mt-16">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">The operating system</span>
        </div>
        <h2 className="font-serif text-[2.15rem] leading-[1.08] text-ink mb-8 tracking-tight">
          Four modules.
          <br />
          <span className="italic text-ink-muted/70">One closed loop.</span>
        </h2>
        {/* One stage at a time: cards stack under the top bar, as on the homepage. */}
        <Stack compact>
          {mobileWorkflow.map((step) => (
            <div key={step.number} className="stack-card">
              <MobileScenePlate figLabel={step.number} className="!bg-paper !backdrop-blur-none shadow-lg shadow-ink/10">
                <step.Icon className="w-7 h-7 text-accent mb-5" strokeWidth={1.4} />
                <h3 className="font-serif text-2xl text-ink mb-3">{step.title}</h3>
                <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{step.body}</p>
              </MobileScenePlate>
            </div>
          ))}
        </Stack>
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
              <Reveal key={title as string} enterEnd={0.86} lift={16} className="bg-white/65 border border-ink/10 p-5 rounded-sm">
                <ItemIcon className="w-6 h-6 text-accent mb-4" strokeWidth={1.4} />
                <h3 className="font-serif text-xl text-ink mb-2">{title as string}</h3>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{body as string}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section id="shootos-modules" className="px-6 py-12 bg-ink text-canvas scroll-mt-16">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-4">The modules · September 2026</div>
        <h2 className="font-serif text-[2.1rem] leading-[1.08] mb-4">Four modules. Start with Order Intake.</h2>
        <p className="font-sans text-[14px] text-canvas/65 leading-relaxed mb-7">Each module runs inside the platform you already use and stops when it is not sure. Order Intake is the first, small one; the rest follow once it is live.</p>
        <div className="space-y-4">
          {shootosModules.map((module) => {
            const tone = module.status === 'live' ? 'text-green-300' : 'text-amber-300';
            const inner = (
              <>
                <div className={`font-mono text-[9px] uppercase tracking-widest mb-4 ${tone}`}>{module.statusNote}</div>
                <h3 className="font-serif text-xl mb-1">{module.number} · {module.title}</h3>
                <p className="font-serif italic text-[13px] text-canvas/60 mb-2">{module.question}</p>
                <p className="font-sans text-[14px] text-canvas/75 leading-relaxed">{module.summary}</p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-widest text-canvas/60">
                  <span>{module.price ?? 'Scoped per shop'}</span>
                  {module.page && <span className="font-serif italic normal-case tracking-normal text-sm text-accent-light">Details →</span>}
                </div>
              </>
            );
            return module.page ? (
              <a key={module.title} href={module.path} onClick={(e) => { e.preventDefault(); onNavigate(module.page as Page); }} className="block border border-white/15 bg-white/5 p-5 rounded-sm">
                {inner}
              </a>
            ) : (
              <div key={module.title} className="border border-white/15 bg-white/5 p-5 rounded-sm">{inner}</div>
            );
          })}
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
        body="How specialist teams take over real workflows — the handoffs, the gates, the morning reports. Sent when the work earns an update."
        source="shootos"
      />
    </MobileShell>
  );
};
