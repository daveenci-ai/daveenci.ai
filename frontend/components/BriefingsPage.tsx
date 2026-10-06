
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, VitruvianBackground, PageHero } from './Shared';
import type { Page } from './types';
import { ArrowUpRight, Filter } from 'lucide-react';
import { briefings, type BriefingSummary } from '../content/briefings';
import { CodexCover } from './CodexCover';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileBriefingsPage } from './mobile/MobileBriefingsPage';
import { Parallax, Reveal } from './motion/Parallax';

interface BriefingsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

export const allBriefings = briefings;

const categories = ["All", "Architecture", "Engineering", "Operations", "Strategy"];

type Category = BriefingSummary['category'];

// Per-category accents for the Codex index. Existing palette tokens only; each
// card exposes its accent as `--cat` so utilities read rgb(var(--cat) / a).
export const CATEGORY_ACCENT: Record<Category, string> = {
  Architecture: 'var(--color-accent-strong)',
  Engineering: 'var(--color-status-success)',
  Operations: 'var(--color-alt)',
  Strategy: 'var(--color-status-danger)',
};

export const accentStyle = (category: string): React.CSSProperties =>
  ({ '--cat': CATEGORY_ACCENT[category as Category] ?? 'var(--color-accent)' }) as React.CSSProperties;

// A small system map per category. Dashed ink edges at rest; accent edges draw
// in on hover/focus; the live node pulses only when motion is allowed.
const MOTIFS: Record<Category, { nodes: [number, number][]; edges: [number, number][]; live: number }> = {
  Architecture: { nodes: [[120, 60], [40, 24], [200, 24], [40, 96], [200, 96]], edges: [[1, 2], [0, 1], [0, 2], [0, 3], [0, 4]], live: 0 },
  Engineering: { nodes: [[20, 60], [80, 60], [140, 28], [140, 92], [220, 60]], edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]], live: 4 },
  Operations: { nodes: [[120, 14], [204, 50], [172, 104], [68, 104], [36, 50]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], live: 0 },
  Strategy: { nodes: [[20, 100], [80, 82], [140, 56], [220, 16]], edges: [[0, 1], [1, 2], [2, 3]], live: 3 },
};

export const CategoryMotif: React.FC<{ category: Category; className?: string }> = ({ category, className = '' }) => {
  const { nodes, edges, live } = MOTIFS[category];
  const segment = ([a, b]: [number, number]) => `M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`;
  return (
    <svg aria-hidden="true" viewBox="0 0 240 120" fill="none" className={`overflow-visible ${className}`}>
      <path d={edges.map(segment).join(' ')} stroke="rgb(var(--color-ink))" strokeOpacity="0.25" strokeDasharray="3 4" />
      {edges.map((edge) => (
        <path
          key={edge.join('-')}
          d={segment(edge)}
          pathLength={1}
          stroke="rgb(var(--cat))"
          strokeWidth="1.75"
          strokeDasharray="1"
          className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0] motion-reduce:transition-none"
        />
      ))}
      {nodes.map(([x, y], index) =>
        index === live ? (
          <g key={index}>
            <circle cx={x} cy={y} r="11" fill="rgb(var(--cat))" fillOpacity="0.18" className="motion-safe:animate-pulse" />
            <circle cx={x} cy={y} r="5.5" fill="rgb(var(--cat))" />
          </g>
        ) : (
          <circle key={index} cx={x} cy={y} r="4" fill="rgb(var(--color-paper))" stroke="rgb(var(--cat))" strokeWidth="1.5" />
        )
      )}
    </svg>
  );
};

// Bento rhythm for the archive (3 columns): wide, standard, a run with one
// cover-less compact card, closing wide. Spans are recomputed per filter; a
// card that would leave a hole stretches to close its row.
const LG_PATTERN = [2, 1, 1, 1, 1, 1, 2];
const COMPACT_SLOT = 3;
const LG_SPAN: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' };
const MD_SPAN: Record<number, string> = { 1: 'md:col-span-1', 2: 'md:col-span-2' };

const fillRows = (spans: number[], cols: number) => {
  const out = [...spans];
  let used = 0;
  out.forEach((span, i) => {
    if (used + span > cols) {
      out[i - 1] += cols - used;
      used = 0;
    }
    used = (used + span) % cols;
  });
  if (used) out[out.length - 1] += cols - used;
  return out;
};

type OpenHandler = (event: React.MouseEvent<HTMLAnchorElement>) => void;

const cardShell =
  'group relative flex h-full flex-col overflow-hidden border border-ink/10 bg-paper/80 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-[rgb(var(--cat)/0.45)] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-4 focus-visible:ring-offset-canvas motion-reduce:hover:translate-y-0';

const titleHover =
  'decoration-[rgb(var(--cat))] decoration-2 underline-offset-[6px] group-hover:underline group-focus-visible:underline';

// Accent rule: a short category-coloured tab at rest that runs the full width on hover/focus.
const AccentRule: React.FC = () => (
  <span
    aria-hidden="true"
    className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-[0.2] bg-[rgb(var(--cat))] transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
  />
);

const Cover: React.FC<{ briefing: BriefingSummary; className?: string }> = ({ briefing, className = '' }) => (
  <div className={`relative overflow-hidden border-b border-ink/10 ${className}`}>
    <CodexCover id={briefing.id} title={briefing.title} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(var(--cat)/0.24),transparent_55%)] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[rgb(var(--cat))]" />
  </div>
);

const Meta: React.FC<{ briefing: BriefingSummary }> = ({ briefing }) => (
  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
    <span className="flex items-center gap-2 font-bold text-ink">
      <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[rgb(var(--cat))]" />
      {briefing.category}
    </span>
    <span aria-hidden="true" className="h-px w-6 bg-ink/20" />
    <span className="text-ink-muted">No. {briefing.issueNo}</span>
  </div>
);

const BODY_SIZE = {
  lead: { pad: 'p-8 lg:p-10', title: 'text-4xl lg:text-5xl', text: 'font-serif text-lg lg:text-xl max-w-xl' },
  feature: { pad: 'p-8', title: 'text-3xl lg:text-[2.125rem]', text: 'font-serif text-base lg:text-lg' },
  wide: { pad: 'p-8 lg:p-10', title: 'text-3xl lg:text-4xl', text: 'font-sans text-base' },
  standard: { pad: 'p-7', title: 'text-2xl', text: 'font-sans text-sm' },
};

const CardBody: React.FC<{ briefing: BriefingSummary; size: keyof typeof BODY_SIZE; heading: 'h2' | 'h3' }> = ({ briefing, size, heading: Heading }) => {
  const s = BODY_SIZE[size];
  return (
    <div className={`relative isolate flex flex-grow flex-col ${s.pad}`}>
      {(size === 'lead' || size === 'feature') && (
        <span aria-hidden="true" className="pointer-events-none absolute right-6 top-2 -z-10 select-none font-serif text-[7rem] leading-none text-[rgb(var(--cat)/0.09)]">
          {briefing.issueNo}
        </span>
      )}
      <Meta briefing={briefing} />
      <Heading className={`mt-5 font-serif leading-[1.08] tracking-tight text-ink ${s.title} ${titleHover}`}>
        {briefing.title}
      </Heading>
      <p className={`mt-4 mb-8 flex-grow leading-relaxed text-ink-muted ${s.text}`}>{briefing.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{briefing.readTime}</span>
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors group-hover:text-accent-strong">
          <span>Read Briefing</span>
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};

const FeaturedCard: React.FC<{ briefing: BriefingSummary; lead: boolean; onOpen: OpenHandler }> = ({ briefing, lead, onOpen }) => (
  <a
    href={`/codex/${briefing.id}`}
    onClick={onOpen}
    className={cardShell}
    style={{
      ...accentStyle(briefing.category),
      borderRadius: 'var(--radius-widget-document)',
      boxShadow: lead ? 'var(--shadow-widget-raised)' : 'var(--shadow-widget-product)',
    }}
  >
    <AccentRule />
    <Cover briefing={briefing} className={lead ? 'aspect-[16/9]' : 'aspect-[16/9] lg:aspect-[16/10]'} />
    <CardBody briefing={briefing} size={lead ? 'lead' : 'feature'} heading="h2" />
  </a>
);

type ArchiveVariant = 'wide' | 'standard' | 'compact';

const ArchiveCard: React.FC<{ briefing: BriefingSummary; variant: ArchiveVariant; onOpen: OpenHandler }> = ({ briefing, variant, onOpen }) => (
  <a
    href={`/codex/${briefing.id}`}
    onClick={onOpen}
    className={`${cardShell} ${variant === 'wide' ? 'md:grid md:grid-cols-[1.15fr_1fr]' : ''}`}
    style={{ ...accentStyle(briefing.category), borderRadius: 'var(--radius-widget-document)', boxShadow: 'var(--shadow-widget-document)' }}
  >
    <AccentRule />
    {variant === 'compact' ? (
      <div
        aria-hidden="true"
        className="relative flex h-52 items-end justify-between gap-4 overflow-hidden border-b border-ink/10 bg-[rgb(var(--cat)/0.07)] p-6 [background-image:linear-gradient(rgb(var(--cat)/0.09)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--cat)/0.09)_1px,transparent_1px)] [background-size:24px_24px]"
      >
        <span className="font-serif text-7xl leading-none text-[rgb(var(--cat)/0.3)]">{briefing.issueNo}</span>
        <CategoryMotif category={briefing.category} className="h-28 w-44 self-center" />
      </div>
    ) : (
      <Cover briefing={briefing} className={variant === 'wide' ? 'h-56 md:h-auto md:min-h-[18rem] md:border-b-0 md:border-r' : 'h-52'} />
    )}
    <CardBody briefing={briefing} size={variant === 'wide' ? 'wide' : 'standard'} heading="h3" />
  </a>
);

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

  const lgSpans = fillRows(filteredBriefings.map((_, i) => LG_PATTERN[i % LG_PATTERN.length]), 3);
  const mdSpans = fillRows(lgSpans.map((span) => Math.min(span, 2)), 2);

  const open = (id: string): OpenHandler => (event) => {
    event.preventDefault();
    onNavigate('briefing-detail', undefined, id);
  };

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-clip">
      <Header onNavigate={onNavigate} currentPage="briefings" />

      {/* Hero Section — the drawing sits on the scaffold plane behind the
          title and the featured covers, drifting slower than both. A faint
          blueprint grid and a cornflower glow give the masthead depth. */}
      <Section className="pt-40 pb-12 md:pt-48 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-48 -z-10 h-[56rem] w-screen -translate-x-1/2 [background-image:linear-gradient(rgb(var(--color-accent-strong)/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--color-accent-strong)/0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_55%_60%_at_50%_40%,black,transparent)] [-webkit-mask-image:radial-gradient(ellipse_55%_60%_at_50%_40%,black,transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-24 -z-10 h-[36rem] w-[min(70rem,100vw)] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--color-accent)/0.16),transparent)]"
        />
        <Parallax plane="scaffold" className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-[1.15]" />
        </Parallax>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <ScrollReveal immediate>
            <PageHero
              eyebrow="The DaVeenci Codex"
              title="Intelligence Briefings"
              description="Architectural blueprints, technical deep dives, and field-tested plays from active AI systems."
              centered
            />
            {/* Category spectrum — introduces the four accents used below. */}
            <div aria-hidden="true" className="mx-auto -mt-2 flex h-1 w-56 gap-1">
              {Object.keys(CATEGORY_ACCENT).map((cat) => (
                <span key={cat} style={accentStyle(cat)} className="flex-1 rounded-full bg-[rgb(var(--cat))]" />
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Featured pair — asymmetric: the lead briefing takes the wider, raised column. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {featuredBriefings.map((briefing, idx) => (
            <Reveal
              key={briefing.issueNo}
              enterEnd={0.84 - (idx % 2) * 0.05}
              lift={36}
              className={idx === 0 ? 'h-full lg:col-span-7' : 'lg:col-span-5 lg:mt-12'}
            >
              <FeaturedCard briefing={briefing} lead={idx === 0} onOpen={open(briefing.id)} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Archive Section with Filters */}
      <Section className="py-12 bg-white/50 border-t border-ink/5" id="archive" pattern="nodes" overflow={true}>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 border-b border-ink/10 pb-8">
          <h2 className="font-serif text-4xl lg:text-5xl tracking-tight text-ink">Latest Intelligence</h2>

          <div role="group" aria-label="Filter briefings by category" className="flex flex-wrap justify-center gap-2 bg-white/50 p-1.5 rounded-full border border-ink/10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                style={accentStyle(cat)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 ${selectedCategory === cat
                  ? 'bg-ink text-canvas shadow-md'
                  : 'text-ink-muted hover:text-ink hover:bg-white/80'
                  }`}
              >
                {cat !== 'All' && <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[rgb(var(--cat))]" />}
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBriefings.map((briefing, idx) => {
            const variant: ArchiveVariant =
              lgSpans[idx] > 1 ? 'wide' : idx % LG_PATTERN.length === COMPACT_SLOT ? 'compact' : 'standard';
            return (
              <Reveal
                key={briefing.issueNo}
                enterEnd={0.86 - (idx % 3) * 0.03}
                lift={24}
                className={`h-full ${MD_SPAN[mdSpans[idx]]} ${LG_SPAN[lgSpans[idx]]}`}
              >
                <ArchiveCard briefing={briefing} variant={variant} onOpen={open(briefing.id)} />
              </Reveal>
            );
          })}
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
