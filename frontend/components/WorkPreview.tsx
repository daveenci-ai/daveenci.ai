import React, { useEffect, useRef } from 'react';
import { Section, ScrollReveal, Surface, Button, FolioHeader } from './Shared';
import { CaseSchematic } from './CaseSchematics';
import { track } from '../lib/analytics';
import { useScrollProgress } from '../lib/useScrollProgress';
import type { Page } from './types';
import { featuredWork, workStatusClass } from '../content/workCatalog';

interface WorkPreviewProps {
  onNavigate: (page: Page) => void;
}

const FIG = ['ii.a', 'ii.b', 'ii.c', 'ii.d'];

/**
 * Stacking-card scene. Each case card sticks below the header; the next one
 * slides up over it, and the covered card scales down and dims (`--cover`,
 * written per frame from the stack's scroll progress). The visitor reads one
 * case at a time without the page getting longer than a plain grid would be.
 * Reduced motion: the cards simply stack in flow.
 */
const WorkPreview: React.FC<WorkPreviewProps> = ({ onNavigate }) => {
  const impressionTracked = useRef(false);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const element = document.getElementById('selected-work');
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || impressionTracked.current) return;
      impressionTracked.current = true;
      track('work_preview_viewed', { surface: 'work_preview' });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // One subscriber for the whole stack: four rect reads per frame, no state.
  const stackRef = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    cssVar: '--stack-p',
    onProgress: () => {
      const cards = cardsRef.current;
      for (let i = 0; i < cards.length - 1; i += 1) {
        const rect = cards[i].getBoundingClientRect();
        const next = cards[i + 1].getBoundingClientRect();
        const cover = Math.min(1, Math.max(0, (rect.bottom - next.top) / Math.max(rect.height, 1)));
        cards[i].style.setProperty('--cover', cover.toFixed(3));
      }
    },
  });

  return (
  <Section id="selected-work" pattern="nodes">
    <ScrollReveal className="mb-12 md:mb-16">
      <FolioHeader
        eyebrow="Folio II — Selected work"
        title="What specialist teams look like in practice."
        subtitle="Some are operating today. Others are being proven in public. Every one separates roles, makes its gates explicit, and stays accountable to the finished work."
      />
    </ScrollReveal>

    <div ref={stackRef} className="work-stack" style={{ ['--stack-top' as string]: '6.5rem', ['--stack-step' as string]: '1rem' }}>
      {featuredWork.map((example, i) => (
        <a
          key={example.page}
          ref={(node) => { if (node) cardsRef.current[i] = node; }}
          href={example.href}
          className="stack-card block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{ ['--stack-index' as string]: i }}
          onClick={(event) => {
            track('select_content', { content_type: 'case_study', content_id: example.page, surface: 'work_preview' });
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            onNavigate(example.page);
          }}
        >
          <Surface kind="document" raised className="work-card bg-paper border border-ink/10 hover:border-accent/30 transition-colors duration-300 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 md:p-10 lg:p-12 min-h-[440px] items-center">
              <div className="lg:col-span-6 flex flex-col h-full">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{example.label}</span>
                  <span className={`font-mono text-[8px] uppercase tracking-[0.14em] text-right ${workStatusClass(example.statusTone)}`}>{example.status}</span>
                </div>
                <span className="font-serif italic text-sm text-ink-muted mb-2">{String(i + 1).padStart(2, '0')} / {String(featuredWork.length).padStart(2, '0')}</span>
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink mb-5 leading-[1.05] group-hover:text-accent transition-colors">{example.title}</h3>
                <p className="font-serif text-lg md:text-xl text-ink-muted leading-relaxed mb-8 max-w-xl">{example.previewBlurb}</p>
                <span className="mt-auto font-sans text-sm font-medium text-accent-strong inline-flex items-center gap-1 group-hover:gap-2 transition-all">Read the case <span aria-hidden="true">→</span></span>
              </div>
              <div className="lg:col-span-6">
                <div className="relative bg-white/70 border border-ink/10 rounded-sm p-5 md:p-6" style={{ boxShadow: 'var(--shadow-widget-document)' }}>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-ink/10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-ink/15" />
                      <div className="w-2.5 h-2.5 rounded-full bg-ink/15" />
                      <div className="w-2.5 h-2.5 rounded-full bg-ink/15" />
                    </div>
                    <div className="font-serif italic text-[10px] tracking-[0.2em] text-ink-muted uppercase">Fig. {FIG[i] ?? 'ii'} · {example.title}</div>
                  </div>
                  <CaseSchematic id={example.page} className="aspect-[5/3] w-full" />
                </div>
              </div>
            </div>
          </Surface>
        </a>
      ))}
    </div>

    <div className="flex justify-center mt-16 md:mt-24">
      <Button variant="secondary" onClick={() => onNavigate('work')} className="px-8 py-4">
        See all work
      </Button>
    </div>
  </Section>
  );
};

export default WorkPreview;
