import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import { LibraryTrail } from './LibraryTrail';
import type { Page } from './types';
import { guidesWithTag } from '../content/guides';
import { INDUSTRY_LABELS, TAG_LABELS, TOPIC_LABELS, isGuideTag, tagListFor, type GuideTag } from '../content/guideTags';

interface GuidesPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  /** Active filter from the address (?tag=); anything that isn't a known tag shows every guide. */
  tag?: string | null;
  onTagChange?: (tag: GuideTag | null) => void;
}

const FILTERS: { tag: GuideTag | null; label: string; industry?: boolean }[] = [
  { tag: null, label: 'All' },
  ...(Object.keys(INDUSTRY_LABELS) as GuideTag[]).map((t) => ({ tag: t, label: TAG_LABELS[t], industry: true })),
  ...(Object.keys(TOPIC_LABELS) as GuideTag[]).map((t) => ({ tag: t, label: TAG_LABELS[t] })),
];

/** A guide's tags as small chips; the industry tag is marked with the accent diamond. */
export const GuideTagChips: React.FC<{ slug: string; className?: string }> = ({ slug, className = '' }) => (
  <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tags">
    {tagListFor(slug).map((t) => (
      <li
        key={t}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted border border-ink/15 rounded-full px-2.5 py-1"
      >
        {t in INDUSTRY_LABELS && <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />}
        {TAG_LABELS[t]}
      </li>
    ))}
  </ul>
);

const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate, tag = null, onTagChange }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const active: GuideTag | null = isGuideTag(tag) ? tag : null;
  const list = guidesWithTag(active);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="guides" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <LibraryTrail onNavigate={onNavigate} shelf="guides" className="mb-5" />
          <h1 className="font-serif text-5xl md:text-6xl md:leading-none text-ink leading-tight mb-7">Straight answers before you automate.</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            The questions teams ask before they hand a workflow to software, answered from systems that run every day.
            Filter by industry or topic.
          </p>
        </div>
      </Section>

      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <div role="group" aria-label="Filter guides by tag" className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map((f) => {
              const on = active === f.tag;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => onTagChange?.(f.tag)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 ${
                    on ? 'bg-ink text-canvas border-ink' : 'bg-white/60 text-ink-muted border-ink/10 hover:text-ink hover:bg-white'
                  }`}
                >
                  {f.industry && <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-accent" />}
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-8">
            {list.map((g) => (
              <a
                key={g.slug}
                href={`/guides/${g.slug}`}
                onClick={(e) => { e.preventDefault(); onNavigate('guide', undefined, g.slug); }}
                className="block border border-ink/15 bg-white/70 rounded-xs p-8 hover:border-accent/60 transition-colors"
              >
                <GuideTagChips slug={g.slug} className="mb-4" />
                <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">{g.question}</h2>
                <p className="font-sans text-ink-muted leading-relaxed mb-4">{g.description}</p>
                <span className="inline-flex items-center font-sans text-sm text-accent-strong">Read the answer <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></span>
              </a>
            ))}
            {list.length === 0 && (
              <p className="font-serif italic text-lg text-ink-muted">No guides with this tag yet.</p>
            )}
          </div>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default GuidesPage;
