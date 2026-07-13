import React, { useEffect } from 'react';
import {
  Activity,
  ArrowDown,
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
import Header from './Header';
import Footer from './Footer';
import { NextCase } from './NextCase';
import {
  Button,
  PageHero,
  ScrollReveal,
  Section,
  SectionHeader,
  VitruvianBackground,
} from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileCompoundIQPage } from './mobile/MobileCompoundIQPage';
import { GateSimulator } from './GateSimulator';
import { useCaseEngaged } from '../lib/useCaseEngaged';
import type { Page } from './types';

interface CompoundIQPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const proof = [
  { value: '5', label: 'specialist roles' },
  { value: '15', label: 'research instruments' },
  { value: '3', label: 'action gate checks' },
  { value: ':00 · :02 · :05', label: 'hourly paper loop' },
  { value: '0', label: 'live orders by design' },
];

const system = [
  {
    number: '01',
    eyebrow: 'Research specialist',
    title: 'Turn a market idea into a versioned, testable artifact.',
    body: 'The research service owns hypotheses, canonical data snapshots, backtests, diagnostics, stress tests, and promotion decisions. It can propose a strategy or signal, but it cannot place an order.',
    bullets: ['Reproducible snapshots across 15 instruments', 'Hypothesis ledger, diagnostics, and stress evidence', 'Versioned strategies and promotion decisions'],
    Icon: FlaskConical,
  },
  {
    number: '02',
    eyebrow: 'Policy gate',
    title: 'Make permission a contract, not an assumption.',
    body: 'A signal becomes actionable only when its strategy is approved, the deployment is enabled for the correct venue and environment, and the signal has not expired. The consumer checks all three at execution time.',
    bullets: ['Approved strategy version', 'Venue and environment explicitly enabled', 'Fresh, unexpired signal at time of use'],
    Icon: ShieldCheck,
  },
  {
    number: '03',
    eyebrow: 'Venue executor',
    title: 'Simulate the consequence before live capital is possible.',
    body: 'The crypto service refreshes market data, consumes only gated signals, and records simulated fills with fees and slippage. It is paper-only by construction while the operating evidence is still being assembled.',
    bullets: ['Scheduled market-data ingestion', 'Idempotent paper fills with cost modeling', 'No live-order endpoint in the autonomous loop'],
    Icon: Activity,
  },
  {
    number: '04',
    eyebrow: 'Feedback specialist',
    title: 'Return execution reality to the next research cycle.',
    body: 'Every simulated fill becomes structured feedback. Research can compare expectation with execution, identify divergence, and refine or reject the next hypothesis without sharing mutable working state with execution.',
    bullets: ['Execution feedback written to shared contracts', 'Expectation-versus-outcome review', 'A closed loop without shared working state'],
    Icon: RotateCcw,
  },
];

const guardrails = [
  {
    title: 'Paper before live',
    body: 'Autonomy is proven in simulation first. Live execution remains disabled while research, controls, and operations mature.',
    Icon: Clock3,
  },
  {
    title: 'Keys stay server-side',
    body: 'Research has no broker credentials, and the browser never receives them. Execution capability stays inside the venue service.',
    Icon: LockKeyhole,
  },
  {
    title: 'Contracts before consumers',
    body: 'Shared schemas and mirrored Python and TypeScript contracts land before a service relies on them, keeping each specialist independently replaceable.',
    Icon: GitBranch,
  },
  {
    title: 'Humans control deployment',
    body: 'The private dashboard requires an explicit confirmation before enabling or disabling a deployment and explains the consequence of the action.',
    Icon: SlidersHorizontal,
  },
];

const buildStatus = [
  {
    status: 'Active',
    title: 'Research platform',
    body: 'Canonical snapshots, hypothesis tracking, backtests, market-structure diagnostics, stress evidence, and promotion gates.',
    tone: 'text-green-300',
    Icon: FlaskConical,
  },
  {
    status: 'Proven · 09 Jul',
    title: 'Autonomous crypto paper loop',
    body: 'Hourly ingest, research, and paper execution completed end-to-end without a manual trigger.',
    tone: 'text-green-300',
    Icon: Activity,
  },
  {
    status: 'Active',
    title: 'Private control dashboard',
    body: 'Strategies, signals, portfolio, and deployment controls are visible behind authenticated access.',
    tone: 'text-green-300',
    Icon: LayoutDashboard,
  },
  {
    status: 'Planned',
    title: 'Stocks executor',
    body: 'A second venue specialist is part of the architecture but has not entered implementation yet.',
    tone: 'text-sky-300',
    Icon: CircleDot,
  },
  {
    status: 'Disabled',
    title: 'Live execution',
    body: 'No live orders. The system remains deliberately paper-only while evidence and controls compound.',
    tone: 'text-amber-300',
    Icon: LockKeyhole,
  },
];

const CompoundIQControlLoop: React.FC = () => (
  <div className="relative bg-white/70 border border-ink/10 shadow-widget-raised p-5 md:p-7 rounded-sm overflow-hidden">
    <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(rgb(var(--color-ink))_1px,transparent_1px)] [background-size:18px_18px]" />
    <div className="relative flex items-start justify-between border-b border-ink/10 pb-4 mb-5 gap-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">CompoundIQ · paper environment</div>
        <div className="font-serif text-lg text-ink mt-1">Governed trading loop</div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-amber-800 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> live disabled
      </div>
    </div>

    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        { time: ':00', label: 'Market data', detail: 'refresh reference bar', Icon: Database },
        { time: ':02', label: 'Research', detail: 'evaluate + signal', Icon: FlaskConical },
        { time: ':05', label: 'Paper executor', detail: 'gate + simulate fill', Icon: Activity },
      ].map((stage, index) => (
        <React.Fragment key={stage.label}>
          <div className="relative bg-canvas/50 border border-ink/10 p-4 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <stage.Icon className="w-5 h-5 text-accent" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted/60">{stage.time}</span>
            </div>
            <div className="font-serif text-lg text-ink">{stage.label}</div>
            <div className="font-sans text-xs text-ink-muted mt-1">{stage.detail}</div>
          </div>
          {index < 2 && <ArrowDown className="sm:hidden w-4 h-4 text-accent mx-auto -my-1" />}
        </React.Fragment>
      ))}
    </div>

    <div className="relative mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="border border-green-700/20 bg-green-50/60 p-3 rounded-sm">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-widest">gate passed</span>
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2">Approved · enabled · unexpired.</p>
      </div>
      <div className="border border-accent/20 bg-accent/5 p-3 rounded-sm">
        <div className="flex items-center gap-2 text-accent">
          <RotateCcw className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-widest">feedback returns</span>
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2">Simulated fill, fees, and slippage.</p>
      </div>
    </div>
  </div>
);

const CompoundIQPageDesktop: React.FC<CompoundIQPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="compoundiq" />

      <Section className="pt-36 pb-20 md:pt-44 md:pb-28 min-h-[90vh] flex items-center" overflow>
        <VitruvianBackground className="opacity-[0.08] -right-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6 relative z-10">
            <ScrollReveal immediate>
              <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.22em] uppercase text-amber-800 bg-amber-50/75 border border-amber-700/15 rounded-sm px-2.5 py-1">
                Build in public · In development · Paper only
              </div>
              <PageHero
                eyebrow="A DaVeenci team · Trading research & execution"
                title={<>Research proposes.<br /><span className="italic text-ink-muted/80">Gates decide.</span></>}
                description="CompoundIQ is an in-progress, paper-first trading team. Versioned hypotheses become testable strategies; only approved, enabled, unexpired signals can reach the simulator; every fill returns as feedback."
                size="md"
                actions={
                  <>
                    <Button
                      variant="primary"
                      analytics={{ cta_id: 'try_gate', surface: 'case_hero', from_page: 'compoundiq', destination: '#compoundiq-gate' }}
                      onClick={() => document.getElementById('compoundiq-gate')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-[16px] px-8 py-4"
                    >Try the gate</Button>
                    <Button
                      variant="secondary"
                      analytics={{ cta_id: 'talk_to_us', surface: 'case_hero', from_page: 'compoundiq', destination: '/calendar' }}
                      onClick={() => onNavigate('calendar')}
                      className="text-[16px] px-8 py-4"
                    >Talk to us</Button>
                  </>
                }
              />
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6">
            <ScrollReveal delay={350} direction="left">
              <CompoundIQControlLoop />
            </ScrollReveal>
          </div>
        </div>
      </Section>

      <section className="border-y border-ink/10 bg-white/35">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {proof.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <div className="font-serif text-2xl md:text-3xl text-ink whitespace-nowrap">{item.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <GateSimulator />

      <Section id="compoundiq-system" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="The operating system"
          title="Four specialists. One constrained loop."
          subtitle="Research and execution never share working state. Each role has a narrow mandate, communicates through versioned contracts, and can be stopped without confusing the rest of the team."
        />
        <div className="space-y-10">
          {system.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 100}>
              <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/55 border border-ink/10 p-8 md:p-10 shadow-sm rounded-sm">
                <div className="lg:col-span-2 flex lg:block items-center gap-4">
                  <step.Icon className="w-9 h-9 text-accent" strokeWidth={1.4} />
                  <div className="font-serif italic text-4xl text-ink-muted/35 lg:mt-8">{step.number}</div>
                </div>
                <div className="lg:col-span-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">{step.eyebrow}</div>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">{step.title}</h2>
                  <p className="font-sans text-[17px] leading-relaxed text-ink-muted">{step.body}</p>
                </div>
                <div className="lg:col-span-4 lg:border-l border-ink/10 lg:pl-8 flex items-center">
                  <ul className="space-y-3 w-full">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-ink-muted">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="py-20 md:py-28 bg-alt/25">
        <SectionHeader
          eyebrow="Guardrails are part of the product"
          title="Autonomy earns permission in layers."
          subtitle="CompoundIQ separates the ability to form an opinion from the authority to act on it. Every boundary is visible, testable, and deliberately harder to cross."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guardrails.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 100}>
              <div className="h-full bg-white/65 border border-ink/10 p-7 md:p-8 rounded-sm">
                <item.Icon className="w-7 h-7 text-accent mb-6" strokeWidth={1.4} />
                <h3 className="font-serif text-2xl text-ink mb-3">{item.title}</h3>
                <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <section className="bg-ink text-canvas py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-4">Build status · 10 July 2026</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">Working in paper. Expanding in public.</h2>
            <p className="font-sans text-canvas/65 leading-relaxed mt-5">These labels describe engineering progress, not investment performance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {buildStatus.map((item) => (
              <div key={item.title} className="border border-white/15 bg-white/5 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-8 gap-3">
                  <item.Icon className={`w-5 h-5 flex-shrink-0 ${item.tone}`} />
                  <span className={`font-mono text-[9px] uppercase tracking-widest text-right ${item.tone}`}>{item.status}</span>
                </div>
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-canvas/65 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section className="py-20 md:py-28" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-6" strokeWidth={1.3} />
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6">Where does your system need judgment without giving up control?</h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">Bring the decision you don't dare fully automate. We'll design the gate around it, together.</p>
            <div className="flex justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-[16px] px-8 py-4">Map where autonomy stops</Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <NextCase from="compoundiq" to="autopilot" title="AutoPilot" hook="Governance works in trading. See it hold a real-estate delivery line together — from order email to the final gate." onNavigate={onNavigate} />

      <Footer
        onNavigate={onNavigate}
        newsletterHeading="Follow the CompoundIQ build"
        newsletterBody="Working in paper, expanding in public — the Codex tracks how specialist teams like this one get designed, gated, and shipped. Sent when the work earns an update."
        newsletterSource="compoundiq"
      />
    </div>
  );
};

const CompoundIQPage: React.FC<CompoundIQPageProps> = (props) => {
  useCaseEngaged('compoundiq');
  const isMobile = useIsMobile();
  if (isMobile) return <MobileCompoundIQPage {...props} />;
  return <CompoundIQPageDesktop {...props} />;
};

export default CompoundIQPage;
