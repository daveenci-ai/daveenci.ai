import React from 'react';
import { Section, SectionHeader, ScrollReveal, Card } from './Shared';
import PilotPurgatory from '../images/The Pilot Purgatory.jpg';
import ToolFatigue from '../images/The Tool Fatigue.jpg';
import MarginSqueeze from '../images/The Margin Squeeze.jpg';

const Problems: React.FC = () => (
  <Section id="problems" pattern="grid" className="bg-white/40">
    <SectionHeader
      eyebrow="Folio II — The Problem"
      title="Where Teams Get Stuck"
      subtitle="Most companies have 'AI Initiatives'. Few have shipped outcomes."
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <ScrollReveal delay={100} className="h-full">
        <Card title="The Pilot Purgatory" label="Symptom A" image={PilotPurgatory} className="h-full">
          <p>You have 12 distinct experiments running. None are production-grade. Your team is "learning" but not shipping.</p>
          <div className="mt-4 pt-4 border-t border-ink/10">
            <a href="https://hbr.org/2023/11/how-to-avoid-pilot-purgatory-in-generative-ai" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1">
              Source: HBR Review &rarr;
            </a>
          </div>
        </Card>
      </ScrollReveal>
      <ScrollReveal delay={300} className="h-full">
        <Card title="The Tool Fatigue" label="Symptom B" image={ToolFatigue} className="h-full">
          <p>Subscriptions to ChatGPT Team, Claude, Jasper, and Copy.ai—yet work is still being done manually in spreadsheets.</p>
          <div className="mt-4 pt-4 border-t border-ink/10">
            <a href="https://zapier.com/blog/state-of-business-automation-2021/" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1">
              Source: Zapier Report &rarr;
            </a>
          </div>
        </Card>
      </ScrollReveal>
      <ScrollReveal delay={500} className="h-full">
        <Card title="The Margin Squeeze" label="Symptom C" image={MarginSqueeze} className="h-full">
          <p>Revenue is growing, but headcount costs are growing faster. You need to break the linear relationship between growth and hiring.</p>
          <div className="mt-4 pt-4 border-t border-ink/10">
            <a href="https://a16z.com/the-economic-case-for-generative-ai-and-foundation-models/" target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1">
              Source: a16z Economics &rarr;
            </a>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  </Section>
);

export default Problems;
