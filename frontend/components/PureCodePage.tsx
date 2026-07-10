import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, GitPullRequest, FileCode2, ShieldCheck, Rocket, Layers, Code2, Users, Building2, Briefcase, Compass, Scale, Blocks, Database, Palette, FlaskConical, BookOpen, ShieldAlert, FileCheck, Check } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { NextCase } from './NextCase';
import { Section, SectionHeader, ScrollReveal, PageHero, Button, VitruvianBackground, ProductFrame } from './Shared';
import { BookingWidget } from './BookingWidget';
import AntonSketch from '../images/Anton_Sketch.webp';
import { useIsMobile } from './mobile/useIsMobile';
import { MobilePureCodePage } from './mobile/MobilePureCodePage';
import { track } from '../lib/analytics';
import { useCaseEngaged } from '../lib/useCaseEngaged';
import type { Page } from './types';

interface PureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PureCodePage: React.FC<PureCodePageProps> = (props) => {
  useCaseEngaged('purecode');
  const isMobile = useIsMobile();
  if (isMobile) return <MobilePureCodePage {...props} />;
  return <PureCodePageDesktop {...props} />;
};

const USE_CASES = [
  { icon: Users, title: 'Engineering teams', body: 'Ship features without burning senior reviewer attention on boilerplate.' },
  { icon: Building2, title: 'CTOs & founders', body: 'Scale engineering output without proportionally scaling headcount.' },
  { icon: Briefcase, title: 'Product leads', body: 'Turn spec into shipped PR with predictable turnaround and review gates.' },
  { icon: GitPullRequest, title: 'Solo builders', body: 'A coordinated team you can wake up with a feature request — ready by morning.' },
];

const FAQ_ITEMS = [
  {
    q: 'Does PureCode replace my engineers?',
    a: "No. It handles specialist tasks with coordination and gates, freeing your engineers to focus on architecture, hard problems, and review. The three human gates ensure a human signs off before code ships.",
  },
  {
    q: 'What stacks does it work with?',
    a: 'Any stack accessible via git — TypeScript, Python, Go, Rust, and mixed codebases. PureCode adapts to your repo conventions, not the other way around.',
  },
  {
    q: 'How does it handle review and quality?',
    a: 'Sentinel runs tests, type checks, lints, and security scans in Validation stage. The finished PR arrives with passing checks, a diff rationale, and every gate decision logged.',
  },
  {
    q: 'What happens when a task is ambiguous?',
    a: "The team stops at Gate 1 (Scope) and asks. You refine the brief, approve scope, and the team proceeds. No assumptions, no silent drift.",
  },
  {
    q: 'Can I audit what each agent did?',
    a: 'Yes. Every step is logged, inspectable, and replayable. The Observability layer is non-negotiable — you see the full chain from request to merge.',
  },
  {
    q: 'How does pricing work?',
    a: "PureCode is sold as a specialist-team engagement, not a per-seat SaaS. Pricing scales with the volume of work your team ships, not the number of engineers who watch it. We'll size it on a discovery call.",
  },
];

// ─── Animated Hero Diagram (PR lifecycle) ──────────────────────────────────────

const DELIVERY_AGENTS = [
  { key: 'ts', label: 'Impl-TS' },
  { key: 'sql', label: 'Impl-SQL' },
  { key: 'style', label: 'Styler' },
  { key: 'test', label: 'Test Author' },
];
const VALIDATION_CHECKS = [
  { label: 'tests', detail: '12 passing' },
  { label: 'types', detail: 'ok' },
  { label: 'lint', detail: 'ok' },
  { label: 'security', detail: 'ok' },
];

type HeroPhase = 'scope' | 'delivery' | 'release';

export const PureCodeHeroDiagram: React.FC = () => {
  const [phase, setPhase] = useState<HeroPhase>('scope');
  const [scopeStamp, setScopeStamp] = useState(false);
  const [designStamp, setDesignStamp] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [activeCheck, setActiveCheck] = useState(-1);
  const [shipStamp, setShipStamp] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setPhase('scope');
    setScopeStamp(false);
    setDesignStamp(false);
    setActiveAgent(-1);
    setActiveCheck(-1);
    setShipStamp(false);

    // Phase 1 — Scope + Design gates (3.2s)
    add(() => setScopeStamp(true), 900);
    add(() => setDesignStamp(true), 1900);

    // Phase 2 — Delivery (4s)
    add(() => setPhase('delivery'), 3200);
    DELIVERY_AGENTS.forEach((_, i) => add(() => setActiveAgent(i), 3200 + i * 500));
    VALIDATION_CHECKS.forEach((_, i) => add(() => setActiveCheck(i), 5400 + i * 280));

    // Phase 3 — Release (3s)
    add(() => setPhase('release'), 7000);
    add(() => setShipStamp(true), 7800);

    // Loop
    add(() => setCycle(c => c + 1), 10200);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame>
      {/* Chrome header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <GitPullRequest className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-serif text-sm font-medium text-ink">PR Pipeline</div>
            <div className="font-mono text-[10px] text-ink/40">purecode · branch: feat/dark-mode</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${phase === 'release' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-ink/50">{phase === 'release' ? 'shipped' : 'running'}</span>
        </div>
      </div>

      {/* Phase body */}
      <div className="relative flex-1 min-h-[300px]">
        {/* Phase 1 — Scope + Design */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'scope' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="space-y-3">
            {/* Brief card */}
            <div className="bg-white border border-dashed border-ink/30 rounded-lg p-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1.5">Request</div>
              <div className="font-serif text-sm text-ink leading-snug">Add dark mode toggle with system preference + persistence</div>
            </div>

            {/* Gate 1 stamp */}
            <div className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 transition-all duration-500 ${scopeStamp ? 'opacity-100 translate-y-0 border-green-400/50 bg-green-50/60' : 'opacity-0 translate-y-2 border-ink/10'}`}>
              <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-wider text-green-700">Gate 1 · Scope</div>
                <div className="font-serif text-xs text-ink/70">Approved by you</div>
              </div>
              <span className="font-mono text-[9px] text-ink/40">0:04</span>
            </div>

            {/* Gate 2 stamp */}
            <div className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 transition-all duration-500 ${designStamp ? 'opacity-100 translate-y-0 border-green-400/50 bg-green-50/60' : 'opacity-0 translate-y-2 border-ink/10'}`}>
              <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-wider text-green-700">Gate 2 · Design</div>
                <div className="font-serif text-xs text-ink/70">Architect proposed 4 files · approved</div>
              </div>
              <span className="font-mono text-[9px] text-ink/40">0:41</span>
            </div>
          </div>
        </div>

        {/* Phase 2 — Delivery + Validation */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'delivery' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="space-y-2.5">
            <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Specialists working</div>
            <div className="grid grid-cols-2 gap-2">
              {DELIVERY_AGENTS.map((a, i) => {
                const isActive = activeAgent >= i;
                const isCurrent = activeAgent === i;
                return (
                  <div key={a.key} className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all duration-300 ${isActive ? 'bg-accent/5 border-accent/30' : 'bg-white border-ink/10 opacity-40'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-accent animate-pulse' : isActive ? 'bg-accent' : 'bg-ink/20'}`} />
                    <span className="font-mono text-[10px] text-ink/70 truncate">{a.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 bg-white border border-ink/10 rounded-lg p-2.5">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1.5">Validation</div>
              <div className="space-y-1">
                {VALIDATION_CHECKS.map((c, i) => {
                  const passed = activeCheck >= i;
                  return (
                    <div key={c.label} className={`flex items-center gap-2 transition-opacity duration-200 ${passed ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/15 border border-green-500/40' : 'border border-ink/15'}`}>
                        {passed && <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />}
                      </div>
                      <span className="font-mono text-[10px] text-ink/60 flex-1">{c.label}</span>
                      <span className="font-mono text-[9px] text-ink/35">{c.detail}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 — Release */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'release' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="space-y-3">
            <div className="bg-white border border-ink/10 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <GitPullRequest className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono text-[10px] text-ink/50">#247</span>
                <span className="font-serif text-sm text-ink flex-1 truncate">feat: add dark mode toggle</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[9px] text-ink/50 mb-2">
                <span className="text-green-600">+128</span>
                <span className="text-red-500">−4</span>
                <span>4 files</span>
                <span className="ml-auto">2h 18m</span>
              </div>
              <div className="h-1 rounded-full bg-ink/5 overflow-hidden">
                <div className="h-full bg-green-500/70" style={{ width: '92%' }} />
              </div>
            </div>

            <div className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 transition-all duration-500 ${shipStamp ? 'opacity-100 translate-y-0 border-green-400/50 bg-green-50/60' : 'opacity-0 translate-y-2 border-ink/10'}`}>
              <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-3 h-3 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-wider text-green-700">Gate 3 · Ship</div>
                <div className="font-serif text-xs text-ink/70">Merged to main · every signature logged</div>
              </div>
              <span className="font-mono text-[9px] text-ink/40">2:18</span>
            </div>
          </div>
        </div>
      </div>
    </ProductFrame>
  );
};

// ─── Specialist Roster (first feature-row widget) ───────────────────────────

const SPECIALIST_GROUPS: { stage: string; color: string; members: { label: string; Icon: React.FC<{ className?: string }> }[] }[] = [
  { stage: 'Control', color: 'text-accent', members: [
    { label: 'Navigator', Icon: Compass },
    { label: 'Arbiter', Icon: Scale },
  ]},
  { stage: 'Blueprint', color: 'text-accent', members: [
    { label: 'Architect', Icon: Blocks },
    { label: 'Design Reviewer', Icon: FileCheck },
  ]},
  { stage: 'Delivery', color: 'text-accent', members: [
    { label: 'Impl-TS', Icon: Code2 },
    { label: 'Impl-SQL', Icon: Database },
    { label: 'Migrator', Icon: Layers },
    { label: 'Styler', Icon: Palette },
    { label: 'Docs', Icon: BookOpen },
  ]},
  { stage: 'Validation', color: 'text-accent', members: [
    { label: 'Test Author', Icon: FlaskConical },
    { label: 'Sentinel', Icon: ShieldCheck },
    { label: 'Security', Icon: ShieldAlert },
  ]},
  { stage: 'Release', color: 'text-accent', members: [
    { label: 'Release Mgr', Icon: Rocket },
  ]},
];

const FLAT_SPECIALISTS = SPECIALIST_GROUPS.flatMap(g => g.members.map(m => ({ ...m, stage: g.stage })));

export const SpecialistRoster: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % FLAT_SPECIALISTS.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  let flatIdx = 0;
  return (
    <ProductFrame height={480}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/60">Specialist Roster · 13</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] text-accent/80">{FLAT_SPECIALISTS[activeIndex].label}</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        {SPECIALIST_GROUPS.map(group => (
          <div key={group.stage}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink-muted/50">{group.stage}</span>
              <span className="h-px flex-1 bg-ink/8" />
              <span className="font-mono text-[9px] text-ink-muted/40">{group.members.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {group.members.map(m => {
                const isActive = flatIdx === activeIndex;
                flatIdx++;
                return (
                  <div
                    key={m.label}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-all duration-300 ${isActive ? 'bg-accent/5 border-accent/40 shadow-sm' : 'bg-white border-ink/10'}`}
                  >
                    <m.Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-accent' : 'text-ink-muted/60'}`} />
                    <span className={`font-mono text-[10px] truncate ${isActive ? 'text-ink font-medium' : 'text-ink-muted/70'}`}>{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ProductFrame>
  );
};

// ─── Blueprint Builder (Row 2 widget) ──────────────────────────────────────

const BLUEPRINT_FILES: { path: string; status: 'new' | 'modified' }[] = [
  { path: 'components/ThemeProvider.tsx', status: 'new' },
  { path: 'components/DarkModeToggle.tsx', status: 'new' },
  { path: 'hooks/usePrefersDark.ts', status: 'new' },
  { path: 'tests/dark-mode.test.tsx', status: 'new' },
  { path: 'README.md', status: 'modified' },
];

export const BlueprintBuilder: React.FC = () => {
  const [visible, setVisible] = useState(0);
  const [approved, setApproved] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setVisible(0);
    setApproved(false);

    BLUEPRINT_FILES.forEach((_, i) => add(() => setVisible(i + 1), 500 + i * 450));
    add(() => setApproved(true), 500 + BLUEPRINT_FILES.length * 450 + 400);
    add(() => setCycle(c => c + 1), 500 + BLUEPRINT_FILES.length * 450 + 3000);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame height={460}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <Blocks className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-serif text-sm text-ink">Architect · proposing design</div>
            <div className="font-mono text-[10px] text-ink/40">feat/dark-mode · before a line of code</div>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted/50">Gate 2</span>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-3 flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2">
          <FileCheck className="w-3 h-3 text-ink/40" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">design.md</span>
        </div>
        <div className="space-y-1.5">
          {BLUEPRINT_FILES.map((f, i) => (
            <div
              key={f.path}
              className={`flex items-center gap-2 transition-all duration-300 ${i < visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              <FileCode2 className="w-3 h-3 text-ink/40 flex-shrink-0" />
              <span className="font-mono text-[11px] text-ink/70 truncate">{f.path}</span>
              <span className={`ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded ${f.status === 'new' ? 'text-green-700 bg-green-50 border border-green-200/60' : 'text-amber-700 bg-amber-50 border border-amber-200/60'}`}>
                {f.status === 'new' ? '+ NEW' : '~ MOD'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-3 flex items-center gap-2 bg-white border rounded-lg px-3 py-2 transition-all duration-500 ${approved ? 'opacity-100 translate-y-0 border-green-400/50 bg-green-50/60' : 'opacity-0 translate-y-2 border-ink/10'}`}>
        <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] uppercase tracking-wider text-green-700">Gate 2 · Design approved</div>
          <div className="font-serif text-xs text-ink/70">Architecture sound · no code written yet</div>
        </div>
        <span className="font-mono text-[9px] text-ink/40">0:41</span>
      </div>
    </ProductFrame>
  );
};

// ─── Validation Runner (Row 3 widget) ──────────────────────────────────────

const VALIDATION_STEPS = [
  { cmd: 'pnpm test', result: '12 tests passing', ms: 900 },
  { cmd: 'pnpm typecheck', result: '0 errors', ms: 550 },
  { cmd: 'pnpm lint', result: 'clean', ms: 400 },
  { cmd: 'pnpm audit', result: '0 high/critical', ms: 600 },
];

export const ValidationRunner: React.FC = () => {
  const [current, setCurrent] = useState(-1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    clear();
    setCurrent(-1);
    setCompleted([]);
    setDone(false);

    let t = 400;
    VALIDATION_STEPS.forEach((step, i) => {
      add(() => setCurrent(i), t);
      t += step.ms;
      add(() => setCompleted(prev => [...prev, i]), t);
    });
    add(() => setDone(true), t + 300);
    add(() => setCycle(c => c + 1), t + 3000);

    return clear;
  }, [cycle]);

  return (
    <ProductFrame height={460}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="font-serif text-sm text-ink">Sentinel · pre-ship validation</div>
            <div className="font-mono text-[10px] text-ink/40">nothing advances with a red</div>
          </div>
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-widest ${done ? 'text-green-600' : 'text-ink-muted/50'}`}>
          {done ? 'green' : 'running'}
        </span>
      </div>

      <div className="bg-ink rounded-lg flex-1 p-3.5 font-mono text-[11px] leading-relaxed overflow-hidden">
        {VALIDATION_STEPS.map((step, i) => {
          const isCompleted = completed.includes(i);
          const isCurrent = current === i && !isCompleted;
          const isPending = !isCompleted && !isCurrent;
          return (
            <div key={step.cmd} className={`flex items-baseline gap-2 py-0.5 transition-opacity duration-200 ${isPending ? 'opacity-20' : 'opacity-100'}`}>
              <span className="text-green-400/80">$</span>
              <span className="text-white/85 flex-1 truncate">{step.cmd}</span>
              {isCompleted ? (
                <span className="text-green-400">▸ {step.result}</span>
              ) : isCurrent ? (
                <span className="text-white/60 italic">running…</span>
              ) : (
                <span className="text-white/25">—</span>
              )}
            </div>
          );
        })}
        <div className={`mt-3 pt-2 border-t border-white/10 transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-green-400">✓ all checks green · safe to ship</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[{ label: 'Audit log', detail: 'every step' }, { label: 'Replay', detail: '1-click' }, { label: 'Gate 3', detail: 'you approve' }].map(chip => (
          <div key={chip.label} className="bg-white border border-ink/10 rounded-lg px-2.5 py-1.5 text-center">
            <div className="font-mono text-[8px] uppercase tracking-widest text-ink-muted/50">{chip.label}</div>
            <div className="font-serif text-[11px] text-ink/80 truncate">{chip.detail}</div>
          </div>
        ))}
      </div>
    </ProductFrame>
  );
};

// ─── Try-It Simulator (PulseNote CreatorMode equivalent) ──────────────────

interface Ticket {
  id: string;
  tag: string;
  tagColor: string;
  label: string;
  brief: string;
  files: { path: string; status: 'new' | 'modified' }[];
  agents: string[];
  checks: { label: string; detail: string }[];
  pr: { number: number; additions: number; deletions: number; files: number; durationMin: number };
}

const TICKETS: Ticket[] = [
  {
    id: 'dark-mode',
    tag: 'feat',
    tagColor: 'text-accent bg-accent/10 border-accent/20',
    label: 'Add dark mode toggle',
    brief: 'Add dark mode toggle with system preference detection + localStorage persistence.',
    files: [
      { path: 'components/ThemeProvider.tsx', status: 'new' },
      { path: 'components/DarkModeToggle.tsx', status: 'new' },
      { path: 'hooks/usePrefersDark.ts', status: 'new' },
      { path: 'tests/dark-mode.test.tsx', status: 'new' },
    ],
    agents: ['Impl-TS', 'Styler', 'Test Author', 'Docs'],
    checks: [
      { label: 'tests', detail: '14 passing' },
      { label: 'typecheck', detail: 'ok' },
      { label: 'lint', detail: 'ok' },
      { label: 'a11y', detail: 'contrast 4.8:1' },
    ],
    pr: { number: 247, additions: 128, deletions: 4, files: 4, durationMin: 138 },
  },
  {
    id: 'n-plus-one',
    tag: 'perf',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200/60',
    label: 'Fix N+1 query on /orders',
    brief: 'Replace per-order supplier lookup with a single join; add pagination protection + index.',
    files: [
      { path: 'services/orders.ts', status: 'modified' },
      { path: 'db/migrations/2026_04_22_orders_idx.sql', status: 'new' },
      { path: 'tests/orders.perf.test.ts', status: 'modified' },
    ],
    agents: ['Impl-SQL', 'Migrator', 'Impl-TS', 'Test Author'],
    checks: [
      { label: 'tests', detail: '28 passing' },
      { label: 'typecheck', detail: 'ok' },
      { label: 'perf', detail: '−92% queries' },
      { label: 'migration', detail: 'reversible' },
    ],
    pr: { number: 248, additions: 42, deletions: 37, files: 3, durationMin: 94 },
  },
  {
    id: 'rate-limit',
    tag: 'security',
    tagColor: 'text-red-700 bg-red-50 border-red-200/60',
    label: 'Add rate limit to /api/login',
    brief: '5-per-minute per-IP rate limit with Redis token bucket + exponential backoff after lockout.',
    files: [
      { path: 'middleware/rate-limit.ts', status: 'new' },
      { path: 'api/login.ts', status: 'modified' },
      { path: 'tests/rate-limit.test.ts', status: 'new' },
    ],
    agents: ['Impl-TS', 'Security', 'Test Author', 'Docs'],
    checks: [
      { label: 'tests', detail: '19 passing' },
      { label: 'typecheck', detail: 'ok' },
      { label: 'security', detail: 'brute-force mitigated' },
      { label: 'lint', detail: 'ok' },
    ],
    pr: { number: 249, additions: 87, deletions: 3, files: 3, durationMin: 72 },
  },
];

type SimPhase = 'idle' | 'scope' | 'blueprint' | 'delivery' | 'validation' | 'release';

const PHASE_ORDER: SimPhase[] = ['scope', 'blueprint', 'delivery', 'validation', 'release'];
const PHASE_LABEL: Record<Exclude<SimPhase, 'idle'>, string> = {
  scope: 'Scope',
  blueprint: 'Blueprint',
  delivery: 'Delivery',
  validation: 'Validation',
  release: 'Release',
};

export const TryItSimulator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<SimPhase>('idle');
  const [visibleFiles, setVisibleFiles] = useState(0);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [completedChecks, setCompletedChecks] = useState(0);
  const [runId, setRunId] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const demoStartFired = useRef(false);
  const demoCompleteFired = useRef(false);

  const ticket = TICKETS.find(t => t.id === selectedId) ?? null;

  useEffect(() => {
    const clear = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };
    const add = (fn: () => void, ms: number) => { timerRef.current.push(setTimeout(fn, ms)); };

    if (!ticket || runId === 0) return;

    clear();
    setPhase('scope');
    setVisibleFiles(0);
    setActiveAgent(-1);
    setCompletedChecks(0);

    const SCOPE_MS = 1500;
    const BLUEPRINT_MS = 3000;
    const DELIVERY_MS = 4000;
    const VALIDATION_MS = 3000;
    const RELEASE_DELAY = 800;

    add(() => setPhase('blueprint'), SCOPE_MS);
    ticket.files.forEach((_, i) => add(() => setVisibleFiles(i + 1), SCOPE_MS + 200 + i * 400));

    add(() => setPhase('delivery'), SCOPE_MS + BLUEPRINT_MS);
    ticket.agents.forEach((_, i) => add(() => setActiveAgent(i), SCOPE_MS + BLUEPRINT_MS + 200 + i * 700));

    add(() => setPhase('validation'), SCOPE_MS + BLUEPRINT_MS + DELIVERY_MS);
    ticket.checks.forEach((_, i) => add(() => setCompletedChecks(i + 1), SCOPE_MS + BLUEPRINT_MS + DELIVERY_MS + 200 + i * 500));

    add(() => setPhase('release'), SCOPE_MS + BLUEPRINT_MS + DELIVERY_MS + VALIDATION_MS + RELEASE_DELAY);

    return clear;
  }, [runId, ticket]);

  useEffect(() => {
    if (phase === 'release' && !demoCompleteFired.current) {
      demoCompleteFired.current = true;
      track('demo_complete', { demo_id: 'purecode_ticket_sim' });
    }
  }, [phase]);

  const handlePick = (id: string) => {
    if (!demoStartFired.current) {
      demoStartFired.current = true;
      track('demo_start', { demo_id: 'purecode_ticket_sim' });
    }
    setSelectedId(id);
    setRunId(r => r + 1);
  };

  const currentPhaseIdx = phase === 'idle' ? -1 : PHASE_ORDER.indexOf(phase);
  const isRunning = phase !== 'idle' && phase !== 'release';
  const isDone = phase === 'release';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Ticket picker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {TICKETS.map(t => {
          const isActive = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handlePick(t.id)}
              className={`text-left bg-white border rounded-lg p-4 transition-all duration-300 shadow-sm ${
                isActive ? 'border-accent/40 bg-accent/[0.03] shadow-md' : 'border-ink/10 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${t.tagColor}`}>
                  {t.tag}
                </span>
                <span className="font-mono text-[9px] text-ink-muted/50 ml-auto">#{t.pr.number}</span>
              </div>
              <div className="font-serif text-sm text-ink leading-snug">{t.label}</div>
            </button>
          );
        })}
      </div>

      {/* Phase progress */}
      <div className="grid grid-cols-5 gap-1 mb-4 px-1 md:flex md:items-center md:gap-2">
        {PHASE_ORDER.map((p, i) => {
          const passed = currentPhaseIdx > i || isDone;
          const active = currentPhaseIdx === i && !isDone;
          return (
            <React.Fragment key={p}>
              <div className="min-w-0 flex flex-col items-center gap-1 md:flex-row md:gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${passed ? 'bg-green-500' : active ? 'bg-accent animate-pulse' : 'bg-ink/15'}`} />
                <span className={`max-w-full truncate font-mono text-[8px] uppercase tracking-[0.06em] transition-colors md:text-[10px] md:tracking-widest ${passed ? 'text-green-600' : active ? 'text-accent' : 'text-ink-muted/40'}`}>
                  {PHASE_LABEL[p]}
                </span>
              </div>
              {i < PHASE_ORDER.length - 1 && <div className={`hidden md:block flex-1 h-px transition-colors ${passed ? 'bg-green-400/40' : 'bg-ink/10'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Live output panel */}
      <ProductFrame height={460}>
        {phase === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
              <GitPullRequest className="w-6 h-6 text-accent" />
            </div>
            <div className="font-serif text-xl text-ink mb-2">Pick a ticket above</div>
            <p className="font-sans text-sm text-ink-muted max-w-xs leading-relaxed">
              Watch the specialist team walk it through scope, blueprint, delivery, validation, and release — with every gate stamped.
            </p>
          </div>
        )}

        {ticket && phase !== 'idle' && (
          <>
            {/* Brief always visible at top once a ticket is picked */}
            <div className="mb-3">
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-1">Brief</div>
              <div className="bg-white border border-dashed border-ink/30 rounded-lg p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${ticket.tagColor}`}>{ticket.tag}</span>
                  <span className="font-serif text-sm text-ink">{ticket.label}</span>
                </div>
                <p className="font-sans text-[11px] text-ink-muted leading-relaxed">{ticket.brief}</p>
              </div>
            </div>

            {/* Phase-specific body */}
            <div className="relative flex-1 min-h-[240px]">
              {/* Scope */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'scope' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Gate 1 · Scope</div>
                <div className="bg-white border border-ink/10 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <Compass className="w-4 h-4 text-accent animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-sm text-ink">Navigator routing</div>
                    <div className="font-mono text-[10px] text-ink-muted/60">Arbiter verifying scope against the brief…</div>
                  </div>
                </div>
              </div>

              {/* Blueprint */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'blueprint' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Gate 2 · Blueprint</div>
                <div className="bg-white border border-ink/10 rounded-lg p-3">
                  <div className="space-y-1.5">
                    {ticket.files.map((f, i) => (
                      <div key={f.path} className={`flex items-center gap-2 transition-all duration-300 ${i < visibleFiles ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        <FileCode2 className="w-3 h-3 text-ink/40 flex-shrink-0" />
                        <span className="font-mono text-[11px] text-ink/70 truncate">{f.path}</span>
                        <span className={`ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded ${f.status === 'new' ? 'text-green-700 bg-green-50 border border-green-200/60' : 'text-amber-700 bg-amber-50 border border-amber-200/60'}`}>
                          {f.status === 'new' ? '+ NEW' : '~ MOD'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'delivery' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Delivery · specialists working</div>
                <div className="grid grid-cols-2 gap-2">
                  {ticket.agents.map((a, i) => {
                    const isActive = activeAgent >= i;
                    const isCurrent = activeAgent === i;
                    return (
                      <div key={a} className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-300 ${isActive ? 'bg-accent/5 border-accent/30' : 'bg-white border-ink/10 opacity-40'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-accent animate-pulse' : isActive ? 'bg-accent' : 'bg-ink/20'}`} />
                        <span className="font-mono text-[11px] text-ink/70 truncate">{a}</span>
                        {isActive && <Check className="w-3 h-3 text-green-600 ml-auto" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Validation */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'validation' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Sentinel · validation</div>
                <div className="bg-ink rounded-lg p-3 font-mono text-[11px] leading-relaxed">
                  {ticket.checks.map((c, i) => {
                    const passed = i < completedChecks;
                    return (
                      <div key={c.label} className={`flex items-baseline gap-2 py-0.5 transition-opacity duration-200 ${passed ? 'opacity-100' : 'opacity-30'}`}>
                        <span className="text-green-400/80">$</span>
                        <span className="text-white/85 flex-1 truncate">{c.label}</span>
                        {passed ? <span className="text-green-400">▸ {c.detail}</span> : <span className="text-white/25">—</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Release */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${phase === 'release' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest text-green-600 mb-2">Gate 3 · Ship · ready for your sign-off</div>
                <div className="bg-white border border-green-400/40 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <GitPullRequest className="w-4 h-4 text-accent" />
                    <span className="font-mono text-[10px] text-ink/50">#{ticket.pr.number}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${ticket.tagColor}`}>{ticket.tag}</span>
                    <span className="font-serif text-sm text-ink flex-1 truncate">{ticket.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[9px] text-ink/50 mb-2">
                    <span className="text-green-600">+{ticket.pr.additions}</span>
                    <span className="text-red-500">−{ticket.pr.deletions}</span>
                    <span>{ticket.pr.files} files</span>
                    <span className="ml-auto">
                      {Math.floor(ticket.pr.durationMin / 60)}h {ticket.pr.durationMin % 60}m
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                    {['Scope', 'Design', 'Checks'].map(g => (
                      <div key={g} className="flex items-center gap-1.5 bg-green-50/80 border border-green-200/60 rounded px-2 py-1">
                        <Check className="w-2.5 h-2.5 text-green-600 flex-shrink-0" strokeWidth={3} />
                        <span className="text-green-700/90 truncate">{g} ✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </ProductFrame>

      {/* Rerun affordance */}
      {ticket && isDone && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setRunId(r => r + 1)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white font-sans text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <GitPullRequest className="w-4 h-4" />
            Run again
          </button>
        </div>
      )}
      {isRunning && (
        <div className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-muted/50 mt-5">
          Pipeline running…
        </div>
      )}
    </div>
  );
};

const PureCodePageDesktop: React.FC<PureCodePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'PureCode — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="purecode" />

      {/* Hero */}
      <Section className="pt-32 pb-20 md:pt-40 md:pb-28 min-h-[90vh] flex items-center">
        <VitruvianBackground className="opacity-[0.08]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 relative z-20">
            <ScrollReveal delay={200}>
              <PageHero
                eyebrow={
                  <span className="inline-block mb-4 font-mono text-xs font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 border border-accent/10 rounded-sm">
                    A DaVeenci team · Code
                  </span>
                }
                title={<>Ship finished pull requests,<br /><span className="italic text-ink-muted/80">not AI-generated snippets.</span></>}
                description="PureCode is 13 specialist agents coordinated by a controller, gated by humans at three critical points. A feature request walks in. A shipped pull request walks out."
                size="md"
                actions={
                  <>
                    <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">Bring us a real ticket</Button>
                    <Button variant="secondary" onClick={() => onNavigate('work')} className="text-base px-8 py-4">See all work</Button>
                  </>
                }
              />
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 relative flex items-center justify-center">
            <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
              <PureCodeHeroDiagram />
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* The Product — feature rows (PulseNote-style show-then-tell) */}
      <Section id="product" pattern="grid">
        <SectionHeader eyebrow="The Product" title="What a coordinated team looks like" subtitle="Not a generalist in a chat window — a roster of specialists, each with one job, coordinated by a controller and gated by humans." />

        {/* Row 1 — Specialists (demo L, copy R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal delay={200}>
            <SpecialistRoster />
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">13 specialists, not a generalist</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                General-purpose AI coders do everything adequately and nothing expertly. PureCode routes each part of the job to the specialist that does it best — an Architect for design, a Test Author for tests, a Sentinel for validation, a Release Manager for the ship. The Navigator coordinates. The Arbiter enforces scope.
              </p>
              <ul className="space-y-3">
                {['One specialist per concern — no context loss across files', 'Controller routes the request, specialists own their outputs', 'Sentinel validates before anything reaches a human', 'Every handoff logged — inspectable and replayable'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Row 2 — Blueprint (copy L, demo R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <ScrollReveal delay={200}>
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Blueprint before a line of code</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                The Architect proposes the design first: which files are new, which get modified, what the tests look like. Gate 2 lives here — you review the plan before anyone writes a single line. The Design Reviewer double-checks the architecture against the brief. Nothing gets implemented until the blueprint is signed off.
              </p>
              <ul className="space-y-3">
                {['Design proposal shown as a file-by-file plan', 'You approve the architecture, not a finished diff', 'Impossible to drift from scope — scope is the gate', 'Changes after Gate 2 re-trigger the review'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <BlueprintBuilder />
          </ScrollReveal>
        </div>

        {/* Row 3 — Validation (demo L, copy R) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-20">
          <ScrollReveal delay={200}>
            <ValidationRunner />
          </ScrollReveal>
          <ScrollReveal delay={400} direction="left">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4">Validation that actually validates</h3>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-6">
                Sentinel runs the real checks — tests, typecheck, lint, security audit — against the specialist output before anything touches a human review queue. A red check blocks the PR. No exceptions, no overrides, no "we'll fix it in the next sprint." When you see the PR, every check is already green.
              </p>
              <ul className="space-y-3">
                {['Runs your repo\'s actual test / typecheck / lint / audit commands', 'Red blocks the PR — specialists iterate until green', 'Gate 3 arrives with passing checks + a full audit log', 'One-click replay of every agent action, every gate decision'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Try It — live pipeline simulator */}
      <Section id="try-it" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="Try It" title="Pick a ticket. Watch the team work." subtitle="Every ticket walks the same path — scope, blueprint, delivery, validation, release — with every gate stamped. Here's that pipeline running in miniature." />
        <ScrollReveal>
          <TryItSimulator />
        </ScrollReveal>
      </Section>

      {/* Use cases */}
      <Section id="use-cases" pattern="grid">
        <SectionHeader eyebrow="Use Cases" title="Who PureCode is for" subtitle="Anyone who needs code that ships — reviewed, tested, accountable." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <ScrollReveal key={uc.title} delay={i * 120} className="h-full">
                <div className="bg-white border border-ink/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group text-center h-full flex flex-col items-center rounded-lg">
                  <div className="relative w-44 h-44 mx-auto mb-6 rounded-full bg-pulse-surface border border-ink/10 group-hover:border-accent/30 transition-colors overflow-hidden flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176" fill="none">
                      <circle cx="88" cy="88" r="78" stroke="rgb(var(--color-ink))" strokeWidth="0.6" opacity="0.08" />
                      <circle cx="88" cy="88" r="60" stroke="rgb(var(--color-ink))" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.12" />
                      <circle cx="88" cy="88" r="42" stroke="rgb(var(--color-accent))" strokeWidth="0.8" opacity="0.15" />
                    </svg>
                    <Icon className="relative w-14 h-14 text-accent/70 group-hover:text-accent transition-colors duration-300" strokeWidth={1.3} />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">{uc.title}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1">{uc.body}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-20">
        <SectionHeader eyebrow="FAQ" title="Common questions." />
        <ScrollReveal>
          <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-lg px-8">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Book an intro — inline calendar */}
      <BookingWidget
        onNavigate={onNavigate}
        eyebrow="PureCode Intro"
        title="Book a PureCode intro"
        subtitle="Walk us through the kind of work your team ships today. We'll map what a PureCode team would look like for your stack."
        leftBody="We'll look at your codebase, your existing review flow, and the tickets that eat your senior engineers' time — then scope what a specialist team + human gates would mean for you."
        bookingType="demo-purecode"
        hostName="Anton Osipov"
        hostRole="Founder"
        hostImage={AntonSketch}
      />

      {/* Final CTA */}
      <Section className="py-16 md:py-24" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
              Want a team like this for your stack?
            </h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
              PureCode is one example of what a DaVeenci team looks like. We design and build specialist teams for the workflows that matter most to your business — code is just one of them.
            </p>
            <div className="flex justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">
                Bring us a real ticket
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <NextCase from="purecode" to="brandos" title="BrandOS" hook="Before you name the thing you shipped — a specialist that scores a brand name across ten weighted dimensions." onNavigate={onNavigate} />

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-serif text-lg text-ink group-hover:text-accent transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-ink-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-ink-muted leading-relaxed pb-5 animate-in fade-in slide-in-from-top-1 duration-200">{a}</p>
      )}
    </div>
  );
};

export default PureCodePage;
