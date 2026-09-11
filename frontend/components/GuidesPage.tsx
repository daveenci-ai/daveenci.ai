import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import type { Page } from './types';
import { guides } from '../content/guides';

interface GuidesPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="guides" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Guides</div>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-7">Straight answers for real-estate media shops.</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            The questions owners ask about order intake, Aryeo and Spiro, answered from work that runs every day.
          </p>
        </div>
      </Section>

      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl space-y-8">
          {guides.map((g) => (
            <a
              key={g.slug}
              href={`/guides/${g.slug}`}
              onClick={(e) => { e.preventDefault(); onNavigate('guide', undefined, g.slug); }}
              className="block border border-ink/15 bg-white/70 rounded-sm p-8 hover:border-accent/60 transition-colors"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">{g.question}</h2>
              <p className="font-sans text-ink-muted leading-relaxed mb-4">{g.description}</p>
              <span className="inline-flex items-center font-sans text-sm text-accent-strong">Read the answer <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default GuidesPage;
