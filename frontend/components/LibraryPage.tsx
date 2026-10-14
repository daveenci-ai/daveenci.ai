import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import type { Page } from './types';
import { guides } from '../content/guides';
import { briefings } from '../content/briefings';
import { GuideTagChips } from './GuidesPage';

interface LibraryPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

/**
 * /library (Library restructure, Anton 14 Oct 2026): one place for everything we write, on two shelves — Guides
 * (one practical question each, tagged by industry and topic) and the Codex (essays and field notes). The shelves
 * keep their own addresses (/guides, /codex); this page shows the latest of each and links in.
 */
const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const latestGuides = [...guides].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  const latestCodex = [...briefings].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  const link = (page: Page, id?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page, undefined, id);
  };

  const shelfHead = (eyebrow: string, title: string, body: string, href: string, page: Page, cta: string) => (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 pb-6 border-b border-ink/10">
      <div className="max-w-2xl">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">{eyebrow}</div>
        <h2 className="font-serif text-3xl md:text-4xl md:leading-10 text-ink leading-tight mb-3">{title}</h2>
        <p className="font-sans text-ink-muted leading-relaxed">{body}</p>
      </div>
      <a href={href} onClick={link(page)} className="shrink-0 inline-flex items-center font-serif italic text-base text-accent-strong hover:text-accent-hover">
        {cta} <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
      </a>
    </div>
  );

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="library" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Library</div>
          <h1 className="font-serif text-5xl md:text-6xl md:leading-none text-ink leading-tight mb-7">What we’ve learned, written down.</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            Two shelves. Guides answer one practical question each. The Codex holds longer essays and field notes from
            the systems we build.
          </p>
        </div>
      </Section>

      <Section id="guides" className="bg-white/35" padding="py-12 md:py-16">
        {shelfHead('Guides', 'Straight answers before you automate.', 'Tagged by industry and topic. Start with the question you already have.', '/guides', 'guides', `All ${guides.length} guides`)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestGuides.map((g) => (
            <a
              key={g.slug}
              href={`/guides/${g.slug}`}
              onClick={link('guide', g.slug)}
              className="flex flex-col border border-ink/15 bg-white/70 rounded-xs p-6 hover:border-accent/60 transition-colors"
            >
              <GuideTagChips slug={g.slug} className="mb-4" />
              <h3 className="font-serif text-xl text-ink leading-snug mb-3">{g.question}</h3>
              <span className="mt-auto inline-flex items-center font-sans text-sm text-accent-strong">Read the answer <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </Section>

      <Section id="codex" padding="py-12 md:py-16">
        {shelfHead('Codex', 'Essays and field notes.', 'Architecture, engineering, operations and strategy from active AI systems.', '/codex', 'briefings', `All ${briefings.length} Codex issues`)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {latestCodex.map((b) => (
            <a
              key={b.id}
              href={`/codex/${b.id}`}
              onClick={link('briefing-detail', b.id)}
              className="flex flex-col border border-ink/15 bg-paper/80 rounded-xs p-6 hover:border-accent/60 transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted mb-4">
                {b.category} · No. {b.issueNo} · {fmtDate(b.publishedAt)}
              </div>
              <h3 className="font-serif text-xl text-ink leading-snug mb-3">{b.title}</h3>
              <p className="font-sans text-sm text-ink-muted leading-relaxed mb-5">{b.description}</p>
              <span className="mt-auto inline-flex items-center font-sans text-sm text-accent-strong">Read the issue <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LibraryPage;
