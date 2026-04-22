import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, GitPullRequest, FileCode2, ShieldCheck, Rocket, Layers, Code2, Users, Building2, Briefcase, Compass, Scale, Blocks, Database, Palette, FlaskConical, BookOpen, ShieldAlert, FileCheck, Check } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, SectionHeader, ScrollReveal, PageHero, Eyebrow, Button, VitruvianBackground, Widget, IconBadge, ProblemCallout, ProductFrame } from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobilePureCodePage } from './mobile/MobilePureCodePage';
import type { Page } from './types';

interface PureCodePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PureCodePage: React.FC<PureCodePageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobilePureCodePage {...props} />;
  return <PureCodePageDesktop {...props} />;
};

const STAGES = [
  { icon: Layers, label: 'Control', body: 'Navigator routes the request. Arbiter checks scope.' },
  { icon: FileCode2, label: 'Blueprint', body: 'Design specialist drafts the architecture before a line is written.' },
  { icon: Code2, label: 'Delivery', body: 'Implementation agents write the code — one specialist per concern.' },
  { icon: ShieldCheck, label: 'Validation', body: 'Sentinel runs tests, lints, security checks. Nothing advances with a red.' },
  { icon: Rocket, label: 'Release', body: 'Finished PR lands in your repo with diff, tests, and rationale ready for sign-off.' },
];

const GATES = [
  { n: 'Gate 1', title: 'Scope', body: 'A human approves what the team is about to build before any code gets written.' },
  { n: 'Gate 2', title: 'Design', body: 'A human reviews the proposed architecture before implementation begins.' },
  { n: 'Gate 3', title: 'Ship', body: 'A human signs off on the finished PR before it merges to main.' },
];

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

const PureCodeHeroDiagram: React.FC = () => {
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

const SpecialistRoster: React.FC = () => {
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
                    <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">Talk to us</Button>
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
      </Section>

      {/* Problem */}
      <Section className="py-12 md:py-16">
        <ScrollReveal>
          <ProblemCallout className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
            <p className="font-sans text-ink-muted leading-relaxed">
              General-purpose AI coding assistants are great at snippets and bad at systems. They lose context across files, skip review, and leave the human to reconcile when something breaks in production. Teams need a coding partner that behaves like an actual team — with specialists, a controller, and review checkpoints.
            </p>
          </ProblemCallout>
        </ScrollReveal>
      </Section>

      {/* Stages */}
      <Section id="how-it-works" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="How It Works" title="Five stages. Thirteen specialists. Three gates." subtitle="Every feature request walks the same path — from Control to Release — with a human at the points that matter." />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <ScrollReveal key={stage.label} delay={i * 100}>
                <Widget interactive className="h-full p-6 flex flex-col">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Stage {i + 1}</div>
                  <IconBadge className="mb-4"><Icon className="w-5 h-5 text-accent" /></IconBadge>
                  <h3 className="font-serif text-xl text-ink mb-2">{stage.label}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{stage.body}</p>
                </Widget>
              </ScrollReveal>
            );
          })}
        </div>
      </Section>

      {/* Three gates */}
      <Section className="py-20">
        <SectionHeader eyebrow="Governance" title="Three gates. Three signatures." subtitle="Autonomy is an antifeature for code that ships to production. PureCode pauses at the decisions that can't be un-approved." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {GATES.map((gate, i) => (
            <ScrollReveal key={gate.title} delay={i * 120}>
              <Widget interactive className="h-full p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">{gate.n}</div>
                <h4 className="font-serif text-xl text-ink mb-3">{gate.title}</h4>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{gate.body}</p>
              </Widget>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Use cases */}
      <Section id="use-cases" className="bg-alt/30 py-20">
        <SectionHeader eyebrow="Use Cases" title="Who PureCode is for." subtitle="Anyone who needs code that ships — reviewed, tested, accountable." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <ScrollReveal key={uc.title} delay={i * 100}>
                <Widget interactive className="h-full p-6">
                  <IconBadge size="lg" className="mb-4"><Icon className="w-6 h-6 text-accent" /></IconBadge>
                  <h3 className="font-serif text-xl text-ink mb-2">{uc.title}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{uc.body}</p>
                </Widget>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">
                Talk to us
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('work')} className="text-base px-8 py-4">
                See all work
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

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
