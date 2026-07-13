import React from 'react';
import { Section, SectionHeader, ScrollReveal, Button, BriefingCard } from './Shared';
import type { Page } from './types';
import { briefings } from '../content/briefings';

interface NewsletterProps {
   onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onNavigate }) => {
   const homepageBriefings = briefings.filter((briefing) =>
      ['agentic-workflow', 'synthetic-data', 'zero-touch-crm'].includes(briefing.id)
   );

   return (
      <Section id="newsletter" pattern="circles" className="relative overflow-visible" overflow={true}>
         <SectionHeader
            eyebrow="Folio VII — The Codex"
            title="Build in public."
            subtitle="Essays and briefings on specialist AI teams — how we're building them, what we're learning, what we got wrong this week."
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {homepageBriefings.map((briefing, index) => (
               <ScrollReveal key={briefing.id} delay={100 + index * 200}>
                  <BriefingCard
                     {...briefing}
                     coverId={briefing.id}
                     href={`/codex/${briefing.id}`}
                     onNavigate={(event) => {
                        event.preventDefault();
                        onNavigate?.('briefing-detail', undefined, briefing.id);
                     }}
                  />
               </ScrollReveal>
            ))}
         </div>

         <div className="flex justify-center">
            <Button variant="secondary" onClick={() => {
               onNavigate?.('briefings');
               window.scrollTo(0, 0);
            }}>
               View Full Archive
            </Button>
         </div>
      </Section>
   );
};

export default Newsletter;
