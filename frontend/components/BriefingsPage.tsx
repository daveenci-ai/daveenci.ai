
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, BriefingCard, VitruvianBackground, PageHero } from './Shared';
import type { Page } from './types';
import { Filter } from 'lucide-react';
import { briefings } from '../content/briefings';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileBriefingsPage } from './mobile/MobileBriefingsPage';

interface BriefingsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const allBriefings = briefings;

const categories = ["All", "Architecture", "Engineering", "Operations", "Strategy"];

const BriefingsPage: React.FC<BriefingsPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileBriefingsPage {...props} />;
  return <BriefingsPageDesktop {...props} />;
};

const BriefingsPageDesktop: React.FC<BriefingsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredBriefings = allBriefings.filter(
    (b) => !b.featured && (selectedCategory === "All" || b.category === selectedCategory)
  );

  const featuredBriefings = allBriefings.filter((b) => b.featured);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header onNavigate={onNavigate} currentPage="briefings" />

      {/* Hero Section */}
      <Section className="pt-40 pb-12 md:pt-48 md:pb-20">
        <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-[1.15]" />
        <div className="text-center max-w-4xl mx-auto mb-16">
          <ScrollReveal immediate>
            <PageHero
              eyebrow="The DaVeenci Codex"
              title="Intelligence Briefings"
              description="Architectural blueprints, technical deep dives, and field-tested plays from active AI systems."
              centered
            />
          </ScrollReveal>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {featuredBriefings.map((briefing, idx) => (
            <ScrollReveal key={briefing.issueNo} delay={idx * 150} className="h-full">
              <BriefingCard
                {...briefing}
                coverId={briefing.id}
                href={`/codex/${briefing.id}`}
                className="h-full md:aspect-[16/9] shadow-lg border-accent/20"
                onNavigate={(event) => {
                  event.preventDefault();
                  onNavigate('briefing-detail', undefined, briefing.id);
                }}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Archive Section with Filters */}
      <Section className="py-12 bg-white/50 border-t border-ink/5" id="archive" pattern="nodes" overflow={true}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="font-serif text-3xl text-ink">Latest Intelligence</h2>

          <div role="group" aria-label="Filter briefings by category" className="flex flex-wrap justify-center gap-2 bg-white/50 p-1.5 rounded-full border border-ink/10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-accent text-white shadow-md'
                  : 'text-ink-muted hover:text-ink hover:bg-white/80'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBriefings.map((briefing, idx) => (
            <ScrollReveal key={briefing.issueNo} delay={idx * 50}>
              <BriefingCard
                {...briefing}
                coverId={briefing.id}
                href={`/codex/${briefing.id}`}
                onNavigate={(event) => {
                  event.preventDefault();
                  onNavigate('briefing-detail', undefined, briefing.id);
                }}
              />
            </ScrollReveal>
          ))}
        </div>

        {filteredBriefings.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <Filter className="w-12 h-12 mx-auto mb-4 text-ink-muted" />
            <p className="font-serif text-xl">No briefings found in this category.</p>
          </div>
        )}
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default BriefingsPage;
