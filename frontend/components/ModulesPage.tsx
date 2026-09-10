import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import type { Page } from './types';

interface ModulesPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const MODULES: { title: string; blurb: string; price: string; page: Page; path: string }[] = [
  {
    title: 'Concierge Order Intake',
    blurb: 'Reads the concierge order email and places the order in Aryeo or Spiro — then confirms it exists. Anything it is not sure about is held for a person.',
    price: '$2,500, fixed',
    page: 'order-intake',
    path: '/shootos/concierge-order-intake',
  },
];

const ModulesPage: React.FC<ModulesPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="modules" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Modules</div>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-7">
            One job, done properly.
          </h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            A module does one job inside an operation you already run. Fixed price, live within a week.
          </p>
        </div>
      </Section>

      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl space-y-6">
          {MODULES.map((module) => (
            <a
              key={module.title}
              href={module.path}
              onClick={(e) => { e.preventDefault(); onNavigate(module.page); }}
              className="group block border border-ink/10 bg-white/70 rounded-sm p-8 transition-all hover:border-accent/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h2 className="font-serif text-3xl text-ink group-hover:text-accent transition-colors">{module.title}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted shrink-0">{module.price}</span>
              </div>
              <p className="font-sans text-ink-muted leading-relaxed mb-5">{module.blurb}</p>
              <span className="inline-flex items-center gap-2 font-serif italic text-sm text-accent">
                Read the details <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ModulesPage;
