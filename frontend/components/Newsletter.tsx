import React from 'react';
import { Section, SectionHeader, ScrollReveal, Button, BriefingCard } from './Shared';
import type { Page } from './types';
import AgenticWorkflowImage from '../images/001 - What is an Agentic Workflow.jpg';
import SyntheticDataImage from '../images/002 - Synthetic Data Pipelines.jpg';
import ZeroTouchCRMImage from '../images/003 - Zero-Touch CRM.jpg';

interface NewsletterProps {
   onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onNavigate }) => {
   return (
      <Section id="newsletter" pattern="circles" className="relative overflow-visible" overflow={true}>
         <SectionHeader
            eyebrow="Folio VII — The Codex"
            title="Build in public."
            subtitle="Essays and briefings on specialist AI teams — how we're building them, what we're learning, what we got wrong this week."
         />

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ScrollReveal delay={100}>
               <BriefingCard
                  title="The Agentic Workflow"
                  description="Why chat interfaces are a dead end, and how to architect autonomous agent swarms that do the work for you."
                  image={AgenticWorkflowImage}
                  issueNo="042"
                  category="Architecture"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'agentic-workflow')}
               />
            </ScrollReveal>
            <ScrollReveal delay={300}>
               <BriefingCard
                  title="Synthetic Data Pipelines"
                  description="Running out of human data? Here is the playbook for generating high-fidelity synthetic datasets to fine-tune your models."
                  image={SyntheticDataImage}
                  issueNo="043"
                  category="Engineering"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'synthetic-data')}
               />
            </ScrollReveal>
            <ScrollReveal delay={500}>
               <BriefingCard
                  title="The Zero-Touch CRM"
                  description="A technical deep dive into self-healing customer databases that enrich themselves without sales rep intervention."
                  image={ZeroTouchCRMImage}
                  issueNo="044"
                  category="Operations"
                  onClick={() => onNavigate?.('briefing-detail', undefined, 'zero-touch-crm')}
               />
            </ScrollReveal>
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
