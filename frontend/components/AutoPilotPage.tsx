import React, { useEffect } from 'react';
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Database,
  Eye,
  Mail,
  ScanSearch,
  ShieldCheck,
  UserCheck,
  Workflow,
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
import { Reveal } from './motion/Parallax';
import { Stack } from './motion/Stack';
import { useScrollProgress } from '../lib/useScrollProgress';
import { MobileAutoPilotPage } from './mobile/MobileAutoPilotPage';
import { useCaseEngaged } from '../lib/useCaseEngaged';
import type { Page } from './types';
import { CaseEvidence } from './CaseEvidence';
import { shootosEvidence } from '../content/shootosEvidence';
import { shootosModules, shootosPlatforms } from '../content/shootosModules';
import { ModuleSchematic } from './ShootOSModuleSchematics';

interface AutoPilotPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const proof = [
  { value: '4', label: 'modules' },
  { value: '10 min', label: 'order-review cadence' },
  { value: '8', label: 'order quality checks' },
  { value: '75', label: 'product mappings' },
  { value: '50', label: 'vision subtype rules' },
];

const workflow = [
  {
    id: 'order-intake',
    number: '01',
    eyebrow: 'Concierge Order Intake',
    title: 'Turn an order email into a placed, verified order.',
    body: 'Reads the concierge order email, opens the right order form for the office and region, fills every field, finds the agent by email, adds the package and selections, books the nearest open slot and submits — then reads the order number back before it counts as placed.',
    bullets: ['Email intake with structured extraction', 'Agent by email, package and regional selections', 'Read-back verification; unsure cases held for a person'],
  },
  {
    id: 'order-review',
    number: '02',
    eyebrow: 'Order Review',
    title: 'Inspect the order while it is still fixable.',
    body: 'Every ten minutes, eight operational checks run against each new order. Known mechanical issues are corrected safely with read-back verification; anything ambiguous becomes one focused ticket for a person instead of a silent pass.',
    bullets: ['Eight configurable business checks', 'Safe write-backs: notes, add-ons, on-camera email, payout tier', 'Reviewed, flagged, or retried — never quietly skipped'],
  },
  {
    id: 'daily-review',
    number: '03',
    eyebrow: 'Daily Report',
    title: 'See the whole morning before anything goes out.',
    body: 'From six o\'clock, every listing due for delivery is audited against the product matrix and its ordered image types are confirmed by vision. One report before the 9 AM window says what is complete, what is missing and what needs urgent attention.',
    bullets: ['Deliverable checks across images, video, 3D, floor plans, files and URLs', 'Complete · missing · could not verify · urgent — in one place', 'One report a day with a direct link to every job'],
  },
  {
    id: 'photo-review',
    number: '04',
    eyebrow: 'Real-time Photo Review',
    title: 'Look at every photo the way an editor would.',
    body: 'Each delivered image is checked for focus, exposure, duplicates, coverage and the photo types the order asked for. Findings name the specific frames, and a ticket is raised only when something is wrong — one per order, once.',
    bullets: ['Per-image checks with a vision veto on outliers', 'Frames named by number, so the right picture gets fixed', 'Tuned per client from before-and-after examples'],
  },
];

const safety = [
  {
    title: 'Deterministic where it matters',
    body: 'Rules and verified browser actions handle irreversible operational changes. Generative judgment is not allowed to improvise a production write-back.',
    Icon: ShieldCheck,
  },
  {
    title: 'AI where perception helps',
    body: 'Vision is used for aerial, twilight, virtual staging, coverage, duplicates, blur, and exposure — the parts that require looking rather than matching fields.',
    Icon: Eye,
  },
  {
    title: 'Humans at uncertainty',
    body: 'Unreadable fields, ambiguous findings, and quality concerns route to people. Inconclusive never becomes pass.',
    Icon: UserCheck,
  },
  {
    title: 'Every action accounted for',
    body: 'Persisted state, idempotency ledgers, retry budgets, tags, and read-back checks make every action inspectable and safe to resume.',
    Icon: Database,
  },
];

const AutoPilotControlPanel: React.FC = () => (
  <div className="relative bg-white/70 border border-ink/10 shadow-widget-raised p-5 md:p-7 rounded-sm overflow-hidden">
    <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(rgb(var(--color-ink))_1px,transparent_1px)] [background-size:18px_18px]" />
    <div className="relative flex items-center justify-between border-b border-ink/10 pb-4 mb-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">ShootOS · four modules</div>
        <div className="font-serif text-lg text-ink mt-1">Production control loop</div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-green-700">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> live
      </div>
    </div>

    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Concierge Order Intake', detail: 'place + verify', Icon: Mail },
        { label: 'Order Review', detail: 'check + repair', Icon: ScanSearch },
        { label: 'Daily Report', detail: 'audit + report', Icon: CalendarCheck },
        { label: 'Real-time Photo Review', detail: 'look + ticket', Icon: Eye },
      ].map((stage, index) => (
        <React.Fragment key={stage.label}>
          <div className="relative bg-canvas/50 border border-ink/10 p-4 rounded-sm">
            <stage.Icon className="w-5 h-5 text-accent mb-5" />
            <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted/60">0{index + 1}</div>
            <div className="font-serif text-[17px] text-ink">{stage.label}</div>
            <div className="font-sans text-xs text-ink-muted mt-1">{stage.detail}</div>
          </div>

        </React.Fragment>
      ))}
    </div>

    <div className="relative mt-5 grid grid-cols-2 gap-3">
      <div className="border border-green-700/20 bg-green-50/60 p-3 rounded-sm">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-widest">deliver</span>
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2">Verified work advances.</p>
      </div>
      <div className="border border-amber-700/20 bg-amber-50/60 p-3 rounded-sm">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-widest">human gate</span>
        </div>
        <p className="font-sans text-xs text-ink-muted mt-2">Uncertainty is routed, not hidden.</p>
      </div>
    </div>
  </div>
);

const AutoPilotPageDesktop: React.FC<AutoPilotPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Hero planes: `--p` runs 0 → 1 as the hero scrolls out; copy settles, the
  // figure lags (same rules as the homepage hero, see index.css).
  const heroRef = useScrollProgress<HTMLElement>({ mode: 'exit' });

  return (
    <div className="flex flex-col w-full overflow-x-clip min-h-screen">
      <Header onNavigate={onNavigate} currentPage="autopilot" />

      <Section className="pt-36 pb-20 md:pt-44 md:pb-28 min-h-[90vh] flex items-center" overflow innerRef={heroRef}>
        <div className="hero-scaffold absolute inset-0 pointer-events-none" aria-hidden="true">
          <VitruvianBackground className="opacity-[0.08] -right-1/4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6 relative z-10 hero-copy">
            <ScrollReveal immediate>
              <PageHero
                eyebrow="ShootOS · A specialist real-estate-media practice by DaVeenci"
                title={<>From order email<br /><span className="italic text-ink-muted/80">to delivery gate.</span></>}
                description="ShootOS is a set of modules for real-estate media companies, each doing one job inside the platform you already run — starting with Concierge Order Intake. They place and schedule orders, review them continuously, repair known exceptions safely, and verify every deliverable before release."
                size="md"
                actions={
                  <>
                    <Button variant="primary" analytics={{ cta_id: 'name_handoff', surface: 'case_hero', from_page: 'autopilot', destination: '/calendar' }} onClick={() => onNavigate('calendar')} className="text-[16px] px-8 py-4">Name the handoff that breaks</Button>
                    <Button variant="secondary" onClick={() => document.getElementById('autopilot-workflow')?.scrollIntoView({ behavior: 'smooth' })} className="text-[16px] px-8 py-4">See the workflow</Button>
                  </>
                }
              />
              {/* Built for = the ordering platforms the modules drive. */}
              <div className="mt-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">Built for</span>
                  <span aria-hidden="true" className="h-px w-6 bg-ink-muted/30" />
                </div>
                <ul className="flex flex-wrap items-center gap-x-9 gap-y-5">
                  {shootosPlatforms.map((platform) => (
                    <li key={platform.name} className="flex items-center">
                      <img src={platform.logo} alt={platform.name} width={platform.width} height={platform.height} className="h-7 md:h-8 w-auto" loading="lazy" decoding="async" />
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-xs text-ink-muted mt-3">The modules drive each platform&rsquo;s own order forms and pages, so a new platform is a mapping, not a rebuild.</p>
              </div>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-6 hero-plate">
            <ScrollReveal delay={350} direction="left">
              <AutoPilotControlPanel />
            </ScrollReveal>
          </div>
        </div>
      </Section>

      <section className="border-y border-ink/10 bg-white/35">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {proof.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <div className="font-serif text-3xl text-ink">{item.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <CaseEvidence
        title="The workflow, the controls, and what exists today."
        subtitle="ShootOS is presented as an operating practice, not a concept. This ledger separates the reusable vertical knowledge from the modules running inside it."
        items={shootosEvidence}
      />

      <Section id="autopilot-workflow" className="py-20 md:py-28" pattern="grid">
        <SectionHeader
          eyebrow="The operating system"
          title="Four modules. One closed loop."
          subtitle="Each module owns one stage of the work, shares state with the next, and knows exactly when to stop and ask a human."
        />
        {/* One stage at a time: the cards stack, each sliding over the last. */}
        <Stack>
          {workflow.map((step) => (
            <article key={step.number} className="stack-card grid grid-cols-1 lg:grid-cols-12 gap-8 bg-paper border border-ink/10 p-8 md:p-10 shadow-lg shadow-ink/5 rounded-sm">
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase">Fig. {step.number} · {step.eyebrow}</div>
                  </div>
                  <div className="border border-ink/10 bg-white/60 rounded-sm p-3">
                    <ModuleSchematic id={step.id} className="aspect-[5/3] w-full" />
                  </div>
                </div>
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="font-serif italic text-3xl text-ink-muted/35">{step.number}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{step.eyebrow}</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">{step.title}</h2>
                  <p className="font-sans text-[17px] leading-relaxed text-ink-muted mb-6">{step.body}</p>
                  <ul className="space-y-2.5">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-ink-muted">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
          ))}
        </Stack>
      </Section>

      <Section className="py-20 md:py-28 bg-alt/25">
        <SectionHeader
          eyebrow="Why it is a team"
          title="The right kind of intelligence for each decision."
          subtitle="ShootOS does not ask one model to improvise the whole workflow. It assigns rules, perception, memory, and judgment to the layer best suited to each one."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safety.map((item, index) => (
            <Reveal key={item.title} enterEnd={0.82 - (index % 2) * 0.05} lift={28} className="h-full">
              <div className="h-full bg-white/65 border border-ink/10 p-7 md:p-8 rounded-sm">
                <item.Icon className="w-7 h-7 text-accent mb-6" strokeWidth={1.4} />
                <h3 className="font-serif text-2xl text-ink mb-3">{item.title}</h3>
                <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section id="shootos-modules" className="bg-ink text-canvas py-20 md:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-4">The modules · September 2026</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">Four modules. One question each. Start with Concierge Order Intake.</h2>
            <p className="font-sans text-canvas/65 mt-5 leading-relaxed">Each module runs inside the platform you already use and stops when it is not sure. Concierge Order Intake is the first, small one — a way to see how we work. The other three follow once it is live, each fitted to how your shop runs — and everything can be customised.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {shootosModules.map((module) => {
              const tone = module.status === 'live' ? 'text-green-300' : 'text-amber-300';
              const card = (
                <>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="font-serif italic text-2xl text-canvas/35">{module.number}</span>
                    <span className={`font-mono text-[9px] uppercase tracking-widest text-right ${tone}`}>{module.statusNote}</span>
                  </div>
                  <h3 className="font-serif text-2xl mb-1">{module.title}</h3>
                  <p className="font-serif italic text-sm text-canvas/60 mb-3">{module.question}</p>
                  <p className="font-sans text-sm text-canvas/80 leading-relaxed mb-3">{module.summary}</p>
                  <p className="font-sans text-xs text-canvas/55 leading-relaxed">{module.detail}</p>
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-canvas/60">{module.price ?? 'Scoped per shop'}</span>
                    {module.page && <span className="font-serif italic text-sm text-accent-light">See the module →</span>}
                  </div>
                </>
              );
              return module.page ? (
                <a
                  key={module.title}
                  href={module.path}
                  onClick={(e) => { e.preventDefault(); onNavigate(module.page as Page); }}
                  className="block border border-white/15 bg-white/5 p-6 rounded-sm transition-colors hover:border-accent-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
                >
                  {card}
                </a>
              ) : (
                <div key={module.title} className="border border-white/15 bg-white/5 p-6 rounded-sm">{card}</div>
              );
            })}
          </div>
        </div>
      </section>

      <Section className="py-20 md:py-28" pattern="circles">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <Workflow className="w-8 h-8 text-accent mx-auto mb-6" strokeWidth={1.3} />
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6">Where is your workflow still held together by attention?</h2>
            <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">Bring us the handoffs, spot checks, and exception queues your team carries in its head. We will map where specialists, safe actions, and human gates belong.</p>
            <div className="flex justify-center">
              <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-[16px] px-8 py-4">Name the handoff that breaks</Button>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <NextCase from="autopilot" to="purecode" title="PureCode" hook="Gates caught the bad order. Watch them catch bad code — a feature request in, a shipped pull request out." onNavigate={onNavigate} />

      <Footer
        onNavigate={onNavigate}
        newsletterHeading="Follow the operations work"
        newsletterBody="How specialist teams take over real workflows — the handoffs, the gates, the morning reports. Sent when the work earns an update."
        newsletterSource="shootos"
      />
    </div>
  );
};

const AutoPilotPage: React.FC<AutoPilotPageProps> = (props) => {
  useCaseEngaged('autopilot');
  const isMobile = useIsMobile();
  if (isMobile) return <MobileAutoPilotPage {...props} />;
  return <AutoPilotPageDesktop {...props} />;
};

export default AutoPilotPage;
