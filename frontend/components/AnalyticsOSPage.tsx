import React from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { NextCase } from './NextCase';
import { CaseEvidence } from './CaseEvidence';
import { CaseSchematic } from './CaseSchematics';
import { Button, PageHero, ScrollReveal, Section, SectionHeader, Surface, VitruvianBackground } from './Shared';
import { Parallax, Reveal } from './motion/Parallax';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileShell } from './mobile/MobileShell';
import { MobileButton } from './mobile/MobileButton';
import { MobileNextCase } from './mobile/MobileNextCase';
import { MobileSubscribe } from './mobile/MobileSubscribe';
import { useCaseEngaged } from '../lib/useCaseEngaged';
import { analyticsOSEvidence, analyticsOSDecisions, analyticsOSTiers, analyticsOSConstraints } from '../content/analyticsOS';
import type { Page } from './types';

interface AnalyticsOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

// Design targets of the scoped engagement, not measured results.
const proof = [
  { value: '1', label: 'warehouse, client-owned' },
  { value: '3', label: 'sources to reconcile daily' },
  { value: '±2%', label: 'reconciliation tolerance, by acceptance test' },
  { value: '0', label: 'names or health data, by design' },
  { value: '12', label: 'packages across 3 tiers' },
];

const STATUS = 'New engagement · Scoped Sep 2026';

/* ------------------------------------------------------------------------ */

const DecisionTable: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="overflow-x-auto -mx-6 px-6">
    <table className={`w-full border-collapse ${compact ? 'min-w-[560px]' : 'min-w-[720px]'}`}>
      <thead>
        <tr className="border-b border-ink/15">
          {['The question', 'How it is decided', 'What the client sees'].map((h) => (
            <th key={h} className="text-left font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted/80 py-3 pr-6 font-normal">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {analyticsOSDecisions.map((row) => (
          <tr key={row.question} className="border-b border-ink/10 align-top">
            <td className="py-4 pr-6 font-serif text-base md:text-lg text-ink w-[26%]">{row.question}</td>
            <td className="py-4 pr-6 font-sans text-sm text-ink-muted leading-relaxed w-[44%]">{row.method}</td>
            <td className="py-4 font-sans text-sm text-ink leading-relaxed">
              <span className="font-serif text-base text-ink">{row.verdict}</span>
              <span className="text-ink-muted"> — {row.sees}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TierList: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={`grid grid-cols-1 ${compact ? 'gap-4' : 'lg:grid-cols-3 gap-6'}`}>
    {analyticsOSTiers.map((tier, index) => (
      <Reveal key={tier.name} enterEnd={0.8} lift={compact ? 12 : 28}>
        <article className={`h-full rounded-sm border p-6 md:p-8 flex flex-col ${index === 0 ? 'bg-ink text-canvas border-ink' : 'bg-white/65 border-ink/10'}`}>
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h3 className={`font-mono text-[10px] uppercase tracking-[0.2em] ${index === 0 ? 'text-canvas/80' : 'text-ink-muted'}`}>{tier.name}</h3>
            <span className={`font-mono text-[9px] uppercase tracking-[0.14em] ${index === 0 ? 'text-canvas/60' : 'text-ink-muted/70'}`}>{tier.weeks}</span>
          </div>
          <div className={`font-serif text-3xl md:text-4xl mb-1 ${index === 0 ? 'text-canvas' : 'text-ink'}`}>{tier.price}</div>
          <p className={`font-sans text-sm leading-relaxed mb-5 ${index === 0 ? 'text-canvas/75' : 'text-ink-muted'}`}>{tier.promise}</p>
          <ol className="space-y-2 mt-auto">
            {tier.packages.map((pkg, i) => (
              <li key={pkg} className={`flex gap-3 font-sans text-sm leading-relaxed ${index === 0 ? 'text-canvas/85' : 'text-ink-muted'}`}>
                <span className={`font-mono text-[10px] mt-1 ${index === 0 ? 'text-accent-light' : 'text-accent'}`}>{String(tier.firstPackage + i).padStart(2, '0')}</span>
                <span>{pkg}</span>
              </li>
            ))}
          </ol>
        </article>
      </Reveal>
    ))}
  </div>
);

const Constraints: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <ul className={`grid grid-cols-1 ${compact ? 'gap-3' : 'md:grid-cols-2 gap-4'}`}>
    {analyticsOSConstraints.map((c) => (
      <Reveal as="li" key={c.title} enterEnd={0.8} lift={16} className="flex gap-4 bg-white/60 border border-ink/10 rounded-sm p-5">
        <ShieldCheck aria-hidden="true" className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <h3 className="font-serif text-lg text-ink mb-1">{c.title}</h3>
          <p className="font-sans text-sm text-ink-muted leading-relaxed">{c.detail}</p>
        </div>
      </Reveal>
    ))}
  </ul>
);

/* ------------------------------------------------------------------------ */

const AnalyticsOSPageDesktop: React.FC<AnalyticsOSPageProps> = ({ onNavigate }) => (
  <div className="flex flex-col w-full overflow-x-clip">
    <Header onNavigate={onNavigate} currentPage="analytics-os" />

    <Section className="pt-40 pb-16 md:pt-48 md:pb-20" overflow={true}>
      <VitruvianBackground className="opacity-[0.1] -right-1/4 scale-[1.15]" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 relative z-20">
          <ScrollReveal immediate>
            <PageHero
              eyebrow={
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-serif italic text-base tracking-[0.15em] uppercase text-ink-muted">Case · Marketing measurement</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-800 border border-amber-800/30 px-2 py-1 rounded-sm">{STATUS}</span>
                </span>
              }
              title={<>Marketing Analytics OS<br /><span className="italic text-ink-muted/80">The measurement team.</span></>}
              description="A measurement system that follows a visitor from the ad to the approved customer. Site events, ad spend, and CRM outcomes land in one warehouse the client owns, and every campaign and landing-page test carries a verdict — keep, kill, or spend this much more to know — computed with proper statistics, not read by eye."
              actions={
                <>
                  <Button variant="primary" analytics={{ cta_id: 'bring_spreadsheet', surface: 'case_hero', from_page: 'analytics-os', destination: '/calendar' }} onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">Bring the spreadsheet you don't trust</Button>
                  <Button variant="secondary" onClick={() => onNavigate('landing', '#services')} className="text-base px-8 py-4">See the offer</Button>
                </>
              }
            />
            <p className="mt-6 max-w-2xl font-sans text-sm text-ink-muted leading-relaxed">
              Designed for a direct-to-consumer telehealth brand running Meta campaigns across several product tracks. The client is named here once they consent; until then this page describes the system, not the client.
            </p>
          </ScrollReveal>
        </div>
        <Parallax plane="plate" className="lg:col-span-5 relative flex items-center justify-center">
          <ScrollReveal delay={400} direction="left" className="w-full">
            <Surface kind="document" raised className="relative w-full bg-white/70 border border-ink/10 p-6 md:p-8 rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-ink/10">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-ink/15" /><div className="w-3 h-3 rounded-full bg-ink/15" /><div className="w-3 h-3 rounded-full bg-ink/15" /></div>
                <div className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase">Fig. i · Ad to verdict</div>
              </div>
              <CaseSchematic id="analytics-os" className="aspect-[5/3] w-full" />
            </Surface>
          </ScrollReveal>
        </Parallax>
      </div>
    </Section>

    <section className="px-6 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 border-y border-ink/10 divide-x divide-ink/10">
        {proof.map((item) => (
          <div key={item.label} className="py-6 px-4 text-center">
            <div className="font-serif text-3xl md:text-4xl text-ink">{item.value}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mt-2">{item.label}</div>
          </div>
        ))}
      </div>
    </section>

    <Section pattern="nodes" overflow={true}>
      <SectionHeader
        eyebrow="How the system decides"
        title="Every number comes with a range, every verdict with a probability."
        subtitle="Nothing is judged on clicks. Verdicts are computed from cost per approved customer against an allowable figure the client sets from margin and payback."
      />
      <ScrollReveal>
        <DecisionTable />
      </ScrollReveal>
    </Section>

    <CaseEvidence
      title="What the system is designed to read, reconcile, and hand back."
      subtitle="The same evidence standard every DaVeenci case exposes: input, the manual workflow it replaces, systems, gates, finished output, exceptions, and current status."
      items={analyticsOSEvidence}
    />

    <Section pattern="circles" overflow={true}>
      <SectionHeader
        eyebrow="Three tiers · twelve packages"
        title="Measure. Learn. Automate."
        subtitle="Each package has a plain description, a purpose, and an acceptance test the client runs. Tiers are cumulative; anything can be bought one at a time."
      />
      <TierList />
      <p className="mt-8 font-serif italic text-base text-ink-muted max-w-3xl">
        Every package ships with a named acceptance owner on the client side, a measurable acceptance test, reconciliation against the source system, documented rollback, and alerting — the same definition of done as every other build.
      </p>
    </Section>

    <Section className="bg-white/50" pattern="grid">
      <SectionHeader
        eyebrow="Constraints from day one"
        title="Built so the privacy promises are true in practice."
        subtitle="Health and regulated-data engagements are designed to the strictest state, then checked against what the tags actually fire. The design reduces risk; it does not replace counsel."
      />
      <Constraints />
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted/70">Not legal advice — whether a given law applies to a client is a question for their counsel.</p>
    </Section>

    <Section className="py-20 md:py-28" pattern="circles">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <BarChart3 className="w-8 h-8 text-accent mx-auto mb-6" strokeWidth={1.3} />
          <h2 className="font-serif text-4xl md:text-5xl text-ink mb-6">Which campaign is earning its spend?</h2>
          <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">If the answer lives in three spreadsheets and one person's judgment, that is the workflow to bring. Thirty minutes, no deck.</p>
          <div className="flex justify-center">
            <Button variant="primary" analytics={{ cta_id: 'bring_spreadsheet', surface: 'case_closing', from_page: 'analytics-os', destination: '/calendar' }} onClick={() => onNavigate('calendar')} className="text-[16px] px-8 py-4">Bring the spreadsheet you don't trust</Button>
          </div>
        </ScrollReveal>
      </div>
    </Section>

    <NextCase from="analytics-os" to="compoundiq" title="CompoundIQ" hook="Verdicts with probabilities, gates before actions — the same discipline applied to trading research." onNavigate={onNavigate} />

    <Footer
      onNavigate={onNavigate}
      newsletterHeading="Follow the measurement build"
      newsletterBody="How a client-owned warehouse, a keep/kill rule, and an experiment registry get designed, tested, and handed over. Sent when the work earns an update."
      newsletterSource="analytics-os"
    />
  </div>
);

/* ------------------------------------------------------------------------ */

const MobileAnalyticsOSPage: React.FC<AnalyticsOSPageProps> = ({ onNavigate }) => (
  <MobileShell onNavigate={onNavigate}>
    <section className="px-6 pt-10 pb-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-ink-muted/30" />
        <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Case · Marketing measurement</span>
      </div>
      <span className="inline-block font-mono text-[9px] uppercase tracking-[0.16em] text-amber-800 border border-amber-800/30 px-2 py-1 rounded-sm mb-4">{STATUS}</span>
      <h1 className="font-serif text-[2.6rem] leading-[1.06] text-ink tracking-tight mb-4">
        Marketing Analytics OS<br /><span className="italic text-ink-muted/70">The measurement team.</span>
      </h1>
      <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
        A measurement system that follows a visitor from the ad to the approved customer, with a keep / kill verdict on every campaign and test — computed, not read by eye.
      </p>
      <div className="border border-ink/10 bg-white/60 rounded-sm p-4 mb-6">
        <CaseSchematic id="analytics-os" className="aspect-[5/3] w-full" />
      </div>
      <MobileButton analytics={{ cta_id: 'bring_spreadsheet', surface: 'case_hero', from_page: 'analytics-os', destination: '/calendar' }} onClick={() => onNavigate('calendar')}>Bring the spreadsheet you don't trust</MobileButton>
      <p className="mt-5 font-sans text-[13px] text-ink-muted leading-relaxed">
        Designed for a direct-to-consumer telehealth brand. The client is named once they consent; until then this page describes the system.
      </p>
    </section>

    <section className="px-6 pb-8">
      <div className="grid grid-cols-2 gap-px bg-ink/10 border border-ink/10">
        {proof.map((item) => (
          <div key={item.label} className="bg-canvas p-4 text-center">
            <div className="font-serif text-2xl text-ink">{item.value}</div>
            <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink-muted mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="px-6 py-10 bg-white/40">
      <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-3">Every verdict carries a probability.</h2>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">Verdicts are computed from cost per approved customer against an allowable figure the client sets. Nothing is judged on clicks.</p>
      <DecisionTable compact />
    </section>

    <CaseEvidence
      compact
      title="What the system is designed to read, reconcile, and hand back."
      subtitle="Input, the manual workflow it replaces, systems, gates, finished output, exceptions, and current status."
      items={analyticsOSEvidence}
    />

    <section className="px-6 py-10">
      <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-3">Measure. Learn. Automate.</h2>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">Three cumulative tiers, twelve packages, each with an acceptance test the client runs.</p>
      <TierList compact />
    </section>

    <section className="px-6 py-10 bg-white/40">
      <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-3">Privacy promises that are true in practice.</h2>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">Designed to the strictest state, then checked against what the tags actually fire. Not legal advice.</p>
      <Constraints compact />
    </section>

    <section className="px-6 py-12 text-center">
      <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4">Which campaign is earning its spend?</h2>
      <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">If the answer lives in three spreadsheets, that is the workflow to bring.</p>
      <MobileButton analytics={{ cta_id: 'bring_spreadsheet', surface: 'case_closing', from_page: 'analytics-os', destination: '/calendar' }} onClick={() => onNavigate('calendar')}>Bring the spreadsheet you don't trust</MobileButton>
    </section>

    <MobileNextCase from="analytics-os" to="compoundiq" title="CompoundIQ" hook="Verdicts with probabilities, gates before actions — applied to trading research." onNavigate={onNavigate} />
    <MobileSubscribe heading="Follow the measurement build" body="How a client-owned warehouse, a keep/kill rule, and an experiment registry get designed, tested, and handed over." source="analytics-os" />
  </MobileShell>
);

const AnalyticsOSPage: React.FC<AnalyticsOSPageProps> = (props) => {
  useCaseEngaged('analytics-os');
  const isMobile = useIsMobile();
  if (isMobile) return <MobileAnalyticsOSPage {...props} />;
  return <AnalyticsOSPageDesktop {...props} />;
};

export default AnalyticsOSPage;
