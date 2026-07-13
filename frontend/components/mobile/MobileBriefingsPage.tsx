import React, { useEffect, useState } from 'react';
import { MobileShell } from './MobileShell';
import { allBriefings } from '../BriefingsPage';
import type { Page } from '../types';
import { CodexCover } from '../CodexCover';

interface MobileBriefingsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const CATEGORIES = ['All', 'Architecture', 'Engineering', 'Operations', 'Strategy'];

export const MobileBriefingsPage: React.FC<MobileBriefingsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered =
    selectedCategory === 'All' ? allBriefings : allBriefings.filter((b) => b.category === selectedCategory);

  return (
    <MobileShell onNavigate={onNavigate} showBottomCTA={false}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            The DaVeenci Codex
          </span>
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-4 tracking-tight">
          Intelligence <br />
          <span className="italic text-ink-muted/70">briefings.</span>
        </h1>
        <p className="font-serif text-[16px] text-ink-muted leading-[1.6]">
          Architectural blueprints, technical deep dives, and field-tested plays from active AI systems.
        </p>
      </section>

      {/* Category filter — horizontal scroll */}
      <div className="sticky top-14 z-30 bg-canvas/90 backdrop-blur-md border-y border-ink/5">
        <div role="group" aria-label="Filter briefings by category" className="flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const active = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={active}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full border text-[13px] font-serif italic transition-all ${
                  active
                    ? 'bg-accent/10 text-accent border-accent'
                    : 'bg-white/60 text-ink-muted border-ink/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Article list */}
      <div className="px-6 py-6 space-y-6">
        {filtered.map((b) => (
          <a
            key={b.id}
            href={`/codex/${b.id}`}
            onClick={(event) => {
              event.preventDefault();
              onNavigate('briefing-detail', undefined, b.id);
            }}
            className="block active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-sm"
          >
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm mb-3 bg-ink/5 border border-ink/10">
              <CodexCover id={b.id} title={b.title} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent">{b.category}</span>
              <span className="text-ink-muted/40">·</span>
              <span className="font-mono text-[9px] tracking-[0.1em] text-ink-muted">#{b.issueNo}</span>
            </div>
            <h3 className="font-serif text-[1.375rem] leading-[1.25] text-ink mb-2">{b.title}</h3>
            <p className="font-sans text-[14px] text-ink-muted leading-relaxed line-clamp-3">{b.description}</p>
            <span className="mt-3 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">{b.readTime}</span>
          </a>
        ))}
      </div>

      <div className="h-12" />
    </MobileShell>
  );
};
