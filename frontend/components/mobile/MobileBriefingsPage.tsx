import React, { useEffect, useState } from 'react';
import { MobileShell } from './MobileShell';
import { briefings as allBriefings } from '../../content/briefings';
import { accentStyle, CategoryMotif } from '../codexAccents';
import type { Page } from '../types';
import { CodexCover } from '../CodexCover';
import { Reveal } from '../motion/Parallax';
import { useScrollProgress } from '../../lib/useScrollProgress';

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

  // Hero copy settles upward and fades as the masthead scrolls out.
  const heroRef = useScrollProgress<HTMLElement>({ mode: 'exit' });

  return (
    <MobileShell onNavigate={onNavigate} showBottomCTA={false}>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden px-6 pt-10 pb-8">
        {/* Hero depth: faint blueprint grid and a cornflower glow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(var(--color-accent-strong)/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--color-accent-strong)/0.07)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)] [-webkit-mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 bg-[radial-gradient(closest-side,rgb(var(--color-accent)/0.18),transparent)]" />
        <div className="relative flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            The DaVeenci Codex
          </span>
        </div>
        <div className="hero-copy relative">
          <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-4 tracking-tight">
            Intelligence <br />
            <span className="italic text-ink-muted/70">briefings.</span>
          </h1>
          <p className="font-serif text-[16px] text-ink-muted leading-[1.6]">
            Architectural blueprints, technical deep dives, and field-tested plays from active AI systems.
          </p>
        </div>
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
                style={accentStyle(cat)}
                className={`flex flex-shrink-0 items-center gap-2 px-4 py-1.5 rounded-full border text-[13px] font-serif italic transition-all ${
                  active
                    ? 'bg-accent/10 text-accent-strong border-accent'
                    : 'bg-white/60 text-ink-muted border-ink/10'
                }`}
              >
                {cat !== 'All' && <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[rgb(var(--cat))]" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Article list */}
      {/* Featured briefings get a taller cover and larger title; every third
          archive card swaps its cover for the category motif to break the rhythm. */}
      <div className="px-6 py-6 space-y-6">
        {filtered.map((b, i) => (
          <Reveal key={b.id} enterEnd={0.86} lift={20}>
            <a
              href={`/codex/${b.id}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate('briefing-detail', undefined, b.id);
              }}
              style={accentStyle(b.category)}
              className={`group relative block overflow-hidden rounded-sm border bg-paper/80 active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 ${
                b.featured ? 'border-[rgb(var(--cat)/0.35)] shadow-lg' : 'border-ink/10 shadow-sm'
              }`}
            >
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 z-20 bg-[rgb(var(--cat))] ${b.featured ? 'h-1' : 'h-0.5'}`} />
              {!b.featured && i % 3 === 2 ? (
                <div aria-hidden="true" className="flex h-32 items-end justify-between gap-4 border-b border-ink/10 bg-[rgb(var(--cat)/0.07)] px-4 pb-4">
                  <span className="font-serif text-6xl leading-none text-[rgb(var(--cat)/0.3)]">{b.issueNo}</span>
                  <CategoryMotif category={b.category} className="h-20 w-36 self-center" />
                </div>
              ) : (
                <div className={`relative w-full overflow-hidden border-b border-ink/10 bg-ink/5 ${b.featured ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}>
                  <CodexCover id={b.id} title={b.title} />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(var(--cat)/0.24),transparent_55%)] mix-blend-multiply" />
                </div>
              )}
              <div className={b.featured ? 'p-5' : 'p-4'}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-ink">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[rgb(var(--cat))]" />
                    {b.category}
                  </span>
                  <span className="text-ink-muted/40">·</span>
                  <span className="font-mono text-[9px] tracking-[0.1em] text-ink-muted">#{b.issueNo}</span>
                </div>
                <h2 className={`font-serif text-ink mb-2 ${b.featured ? 'text-[1.75rem] leading-[1.15] tracking-tight' : 'text-[1.375rem] leading-[1.25]'}`}>{b.title}</h2>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed line-clamp-3">{b.description}</p>
                <span className="mt-3 block font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">{b.readTime}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="h-12" />
    </MobileShell>
  );
};
