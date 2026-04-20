import React, { useRef, useState, useEffect } from 'react';
import { MobileFolioScene } from './MobileFolioScene';

interface Card {
  fig: string;
  eyebrow: string;
  title: string;
  body: string;
}

const CARDS: Card[] = [
  {
    fig: 'iv.a',
    eyebrow: 'notes · scratchpad · searchable',
    title: 'Structured Memory',
    body: 'Each project keeps a journal. Each run keeps a scratchpad. Every decision and observation is filed — not scrolled.',
  },
  {
    fig: 'iv.b',
    eyebrow: 'patterns · rules · compounded',
    title: 'Distilled Lessons',
    body: 'Thousands of observations distill into rules of thumb. The team walks into every new engagement smarter than the last.',
  },
  {
    fig: 'iv.c',
    eyebrow: 'accuracy · track record · weighted',
    title: 'Calibrated Trust',
    body: 'Each specialist carries a trust score from actual outcomes. When specialists disagree, track record decides.',
  },
];

export const MobileAdvantage: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>('[data-card-index]');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number(visible[0].target.getAttribute('data-card-index'));
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root: el, threshold: [0.5, 0.75, 1] }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <MobileFolioScene id="advantage" eyebrow="Folio IV — The Advantage" className="bg-white/40">
      <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2 tracking-tight">
        A tool is free.
        <br />
        <span className="italic text-ink-muted/70">A team remembers.</span>
      </h2>

      <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-8">
        Open-source AI is a fast, free place to start. What separates a tool from a team is what it remembers, distills, and trusts over time.
      </p>

      {/* Swipeable card rail */}
      <div
        ref={scrollerRef}
        className="-mx-6 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-2 flex-shrink-0" />
        {CARDS.map((card, i) => (
          <article
            key={card.fig}
            data-card-index={i}
            className="snap-center flex-shrink-0 w-[82vw] max-w-[360px] bg-white/70 border border-ink/10 rounded-sm p-5 shadow-sm shadow-ink/5"
          >
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-ink/10">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-ink/15" />
                <div className="w-2 h-2 rounded-full bg-ink/15" />
                <div className="w-2 h-2 rounded-full bg-ink/15" />
              </div>
              <div className="font-serif italic text-[9px] tracking-[0.25em] text-ink-muted uppercase">
                Fig. {card.fig}
              </div>
            </div>
            <div className="font-serif italic tracking-[0.2em] text-[10px] font-semibold uppercase text-accent mb-2">
              {card.eyebrow}
            </div>
            <h3 className="font-serif text-2xl text-ink mb-3 leading-tight">{card.title}</h3>
            <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{card.body}</p>
          </article>
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>

      {/* Pager dots */}
      <div className="flex justify-center gap-2 mt-1">
        {CARDS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              activeIndex === i ? 'w-6 bg-accent' : 'w-1.5 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </MobileFolioScene>
  );
};
