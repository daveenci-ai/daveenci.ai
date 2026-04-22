import React, { useEffect, useState } from 'react';
import { ChevronDown, GitPullRequest, FileCode2, ShieldCheck, Rocket, Layers, Code2, Users, Building2, Briefcase } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, SectionHeader, ScrollReveal, PageHero, Button, Surface, Plate, Callout, VitruvianBackground } from './Shared';
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

          <div className="lg:col-span-6 relative h-[400px] md:h-[480px] flex items-center justify-center">
            <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
              <Plate fig="i" title="Team Structure">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 300" fill="none">
                  {/* Orbit ring */}
                  <circle cx="150" cy="150" r="110" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.3" />

                  {/* Controller (Navigator) — center */}
                  <circle cx="150" cy="150" r="26" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.5" />
                  <text x="150" y="148" textAnchor="middle" fontSize="9" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-accent))" letterSpacing="0.1em">NAVIGATOR</text>
                  <text x="150" y="160" textAnchor="middle" fontSize="7" fontFamily="serif" fill="rgb(var(--color-ink-muted))">controller</text>
                  <circle cx="150" cy="150" r="3" fill="rgb(var(--color-accent))">
                    <animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite" />
                  </circle>

                  {/* 5 stage nodes around the orbit */}
                  {STAGES.map((stage, i) => {
                    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                    const x = 150 + Math.cos(angle) * 110;
                    const y = 150 + Math.sin(angle) * 110;
                    return (
                      <g key={stage.label}>
                        <line x1={150 + Math.cos(angle) * 28} y1={150 + Math.sin(angle) * 28} x2={x} y2={y} stroke="rgb(var(--color-ink-muted))" strokeWidth="0.8" opacity="0.35" />
                        <circle cx={x} cy={y} r="18" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />
                        <text x={x} y={y - 1} textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink))" letterSpacing="0.08em">{stage.label}</text>
                        <text x={x} y={y + 8} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">0{i + 1}</text>
                      </g>
                    );
                  })}

                  {/* Gate badge — bottom right */}
                  <g transform="translate(240, 240)">
                    <rect x="-28" y="-12" width="56" height="24" rx="2" fill="#16a34a" fillOpacity="0.1" stroke="#16a34a" strokeWidth="1.2" />
                    <text x="0" y="3" textAnchor="middle" fontSize="8" fontFamily="serif" fontStyle="italic" fill="#16a34a" letterSpacing="0.15em">HUMAN GATE</text>
                  </g>
                </svg>
              </Plate>
            </ScrollReveal>
          </div>
        </div>
      </Section>

      {/* Problem */}
      <Section className="py-12 md:py-16">
        <ScrollReveal>
          <Callout variant="alt" className="max-w-4xl mx-auto">
            <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
            <p className="font-sans text-ink-muted leading-relaxed">
              General-purpose AI coding assistants are great at snippets and bad at systems. They lose context across files, skip review, and leave the human to reconcile when something breaks in production. Teams need a coding partner that behaves like an actual team — with specialists, a controller, and review checkpoints.
            </p>
          </Callout>
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
                <Surface kind="document" className="relative h-full p-6 border border-ink/10 bg-white/70 flex flex-col">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Stage {i + 1}</div>
                  <Icon className="w-6 h-6 text-ink mb-4" />
                  <h3 className="font-serif text-xl text-ink mb-2">{stage.label}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{stage.body}</p>
                </Surface>
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
              <Callout>
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">{gate.n}</div>
                <h4 className="font-serif text-xl text-ink mb-3">{gate.title}</h4>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">{gate.body}</p>
              </Callout>
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
                <div className="h-full bg-white border border-ink/10 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-serif text-xl text-ink mb-2">{uc.title}</h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">{uc.body}</p>
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
          <div className="max-w-3xl mx-auto bg-white shadow-xl border border-ink/10 rounded-sm px-8">
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
