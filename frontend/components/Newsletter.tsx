import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Section, SectionHeader, ScrollReveal, Button } from './Shared';
import { CodexCover } from './CodexCover';
import type { Page } from './types';
import { briefings, type BriefingSummary } from '../content/briefings';

interface NewsletterProps {
   onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

interface HomepageBriefingProps {
   briefing: BriefingSummary;
   onNavigate?: NewsletterProps['onNavigate'];
}

const openBriefing = (
   event: React.MouseEvent<HTMLAnchorElement>,
   briefing: BriefingSummary,
   onNavigate?: NewsletterProps['onNavigate']
) => {
   event.preventDefault();
   onNavigate?.('briefing-detail', undefined, briefing.id);
};

const FeaturedBriefing: React.FC<HomepageBriefingProps> = ({ briefing, onNavigate }) => (
   <a
      href={`/codex/${briefing.id}`}
      onClick={(event) => openBriefing(event, briefing, onNavigate)}
      className="group grid h-full overflow-hidden border border-ink/10 bg-white/55 shadow-[0_18px_50px_-32px_rgba(26,26,26,0.3)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_28px_70px_-35px_rgba(63,132,200,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 md:grid-cols-[1.08fr_0.92fr]"
      style={{ borderRadius: 'var(--radius-widget-document)' }}
   >
      <div className="relative h-60 overflow-hidden border-b border-ink/10 md:h-auto md:min-h-[430px] md:border-b-0 md:border-r">
         <CodexCover
            id={briefing.id}
            title={briefing.title}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
         />
      </div>

      <div className="relative flex flex-col p-7 md:p-9">
         <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
            <span className="text-accent">Featured field note</span>
            <span>No. {briefing.issueNo}</span>
         </div>

         <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
            {briefing.category}
         </span>
         <h3 className="font-serif text-3xl leading-[1.08] text-ink transition-colors duration-300 group-hover:text-accent md:text-4xl">
            {briefing.title}
         </h3>
         <p className="mt-5 font-sans text-sm leading-relaxed text-ink-muted md:text-base">
            {briefing.description}
         </p>

         <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/70">
               {briefing.readTime}
            </span>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors group-hover:text-accent">
               Read briefing
               <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
         </div>
      </div>
   </a>
);

const SupportingBriefing: React.FC<HomepageBriefingProps> = ({ briefing, onNavigate }) => (
   <a
      href={`/codex/${briefing.id}`}
      onClick={(event) => openBriefing(event, briefing, onNavigate)}
      className="group relative flex min-h-[202px] flex-1 flex-col overflow-hidden border border-ink/10 bg-white/45 p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-white/65 hover:shadow-[0_22px_55px_-38px_rgba(63,132,200,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 md:p-8"
      style={{ borderRadius: 'var(--radius-widget-document)' }}
   >
      <div className="absolute inset-y-0 left-0 w-0.5 origin-bottom scale-y-0 bg-accent transition-transform duration-500 group-hover:scale-y-100" />

      <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.17em] text-ink-muted">
         <span className="text-accent">{briefing.category}</span>
         <span>No. {briefing.issueNo}</span>
      </div>

      <h3 className="mt-5 font-serif text-2xl leading-tight text-ink transition-colors duration-300 group-hover:text-accent md:text-3xl">
         {briefing.title}
      </h3>
      <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ink-muted">
         {briefing.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
         <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/70">
            {briefing.readTime}
         </span>
         <ArrowUpRight className="h-4 w-4 text-ink transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
      </div>
   </a>
);

const Newsletter: React.FC<NewsletterProps> = ({ onNavigate }) => {
   const homepageBriefings = briefings.filter((briefing) =>
      ['governed-agent-operations', 'agentic-workflow', 'zero-touch-crm'].includes(briefing.id)
   ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

   const [featuredBriefing, ...supportingBriefings] = homepageBriefings;

   return (
      <Section id="newsletter" pattern="circles" className="relative overflow-visible" overflow={true}>
         <SectionHeader
            eyebrow="Folio VII — The Codex"
            title="Notes from the work."
            subtitle="System diagrams, operating lessons, and implementation economics from the workflows we're building."
         />

         <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:gap-8">
            {featuredBriefing && (
               <ScrollReveal delay={100} className="h-full">
                  <FeaturedBriefing briefing={featuredBriefing} onNavigate={onNavigate} />
               </ScrollReveal>
            )}

            <div className="flex flex-col gap-6">
               {supportingBriefings.map((briefing, index) => (
                  <ScrollReveal key={briefing.id} delay={200 + index * 120} className="flex flex-1">
                     <SupportingBriefing briefing={briefing} onNavigate={onNavigate} />
                  </ScrollReveal>
               ))}
            </div>
         </div>

         <div className="flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-lg font-serif text-base italic leading-relaxed text-ink-muted">
               Practical notes when the work earns one—not a generic AI news feed.
            </p>
            <Button variant="secondary" onClick={() => {
               onNavigate?.('briefings');
               window.scrollTo(0, 0);
            }}>
               Explore the Codex
            </Button>
         </div>
      </Section>
   );
};

export default Newsletter;
