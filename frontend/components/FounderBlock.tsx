import React from 'react';
import { Section, ScrollReveal } from './Shared';
import type { Page } from './types';
import AntonSketch from '../images/Anton_Sketch.jpg';

interface FounderBlockProps {
  onNavigate: (page: Page) => void;
}

const FounderBlock: React.FC<FounderBlockProps> = ({ onNavigate }) => (
  <Section id="founder" className="bg-alt/20">
    <div className="max-w-4xl mx-auto">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <img
              src={AntonSketch}
              alt="Anton Osipov"
              className="w-full max-w-xs mx-auto rounded-sm shadow-sm border border-ink/10"
            />
          </div>
          <div className="md:col-span-8">
            <blockquote className="font-serif text-xl md:text-2xl text-ink leading-relaxed mb-6 italic">
              "I spent a decade shipping software with mediocre AI help. Then I stopped trying to hire a generalist tool, and started building a team of specialists. DaVeenci is that bet — one workshop, many teams, each one good at one thing. PureCode is team one. I'd like to show you how it works."
            </blockquote>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-sans text-ink font-medium">Anton Osipov</div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-muted">Founder</div>
              </div>
              <button
                onClick={() => onNavigate('who-we-are')}
                className="font-sans text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                Read the full story →
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </Section>
);

export default FounderBlock;
