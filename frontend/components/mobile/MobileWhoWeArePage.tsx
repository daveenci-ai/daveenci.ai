import React, { useEffect, useRef, useState } from 'react';
import { MobileShell } from './MobileShell';
import { MobileFolioScene } from './MobileFolioScene';
import { MobileFounderBlock } from './MobileFounderBlock';
import { MobilePartnerBlock } from './MobilePartnerBlock';
import type { Page } from '../types';

interface MobileWhoWeArePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

interface Distinction {
  n: string;
  fig: string;
  title: string;
  eyebrow: string;
  body: string;
}

const DISTINCTIONS: Distinction[] = [
  {
    n: '01',
    fig: 'a',
    title: 'Teams',
    eyebrow: 'one tool · many specialists',
    body: 'The industry ships one more generalist chatbox every quarter. We ship specialist teams — multiple agents, one controller, human gates.',
  },
  {
    n: '02',
    fig: 'b',
    title: 'Builders',
    eyebrow: 'slides off · outputs on',
    body: 'Consultants hand you a deck. We hand you a repo, a pipeline, a dashboard, an output.',
  },
  {
    n: '03',
    fig: 'c',
    title: 'Governance',
    eyebrow: 'human in the loop',
    body: 'Human gates at the critical points. You own the output — not the liability.',
  },
];

export const MobileWhoWeArePage: React.FC<MobileWhoWeArePageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Who we are — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

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
    <MobileShell onNavigate={onNavigate}>
      {/* Hero — Folio 0 · The Mission */}
      <MobileFolioScene id="mission" eyebrow="Folio 0 — The Mission">
        <h1 className="font-serif text-[3rem] leading-[1.05] text-ink mb-6 mt-2 tracking-tight">
          We build the team.
          <br />
          <span className="italic text-ink-muted/70">You own the output.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.65]">
          DaVeenci is two people and a workshop. We design specialist AI teams for founders whose work is stuck between a chat window and a team they can't afford to hire.
        </p>
      </MobileFolioScene>

      {/* Anton */}
      <MobileFounderBlock />

      {/* Astrid */}
      <MobilePartnerBlock />

      {/* The Distinction — swipeable 3 cards */}
      <MobileFolioScene id="distinction" eyebrow="The Distinction" className="bg-white/40">
        <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-8 mt-2">
          Why <span className="italic text-ink-muted/70">DaVeenci.</span>
        </h2>

        <div
          ref={scrollerRef}
          className="-mx-6 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="w-2 flex-shrink-0" />
          {DISTINCTIONS.map((d, i) => (
            <article
              key={d.fig}
              data-card-index={i}
              className="snap-center flex-shrink-0 w-[82vw] max-w-[360px] bg-white/80 border border-ink/10 rounded-sm p-5 shadow-sm shadow-ink/5"
            >
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-ink/10">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-ink/15" />
                  <div className="w-2 h-2 rounded-full bg-ink/15" />
                  <div className="w-2 h-2 rounded-full bg-ink/15" />
                </div>
                <div className="font-serif italic text-[9px] tracking-[0.25em] text-ink-muted uppercase">
                  Fig. {d.fig}
                </div>
              </div>
              <div className="font-serif italic tracking-[0.2em] text-[10px] font-semibold uppercase text-accent mb-2">
                {d.eyebrow}
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3 leading-tight">{d.title}</h3>
              <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{d.body}</p>
            </article>
          ))}
          <div className="w-2 flex-shrink-0" />
        </div>

        <div className="flex justify-center gap-2">
          {DISTINCTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeIndex === i ? 'w-6 bg-accent' : 'w-1.5 bg-ink/20'
              }`}
            />
          ))}
        </div>
      </MobileFolioScene>

      {/* Start here CTA widget */}
      <MobileFolioScene id="start-here" eyebrow="Fig. d · Start Here">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-serif text-[2.25rem] leading-[1.1] text-ink mb-4">
            Want a team for <br />
            <span className="italic text-accent">your domain?</span>
          </h2>
          <p className="font-sans text-[16px] text-ink-muted leading-relaxed mb-8">
            Thirty minutes with us. No slide deck. Bring the workflow you want a team for and we'll tell you honestly whether we're the right shop to build it.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate('calendar')}
              className="w-full py-3.5 bg-accent text-white font-medium tracking-[0.15em] uppercase text-sm rounded-sm shadow-md"
            >
              Talk to us
            </button>
            <button
              onClick={() => onNavigate('work')}
              className="w-full py-3.5 bg-white/60 border border-ink/20 text-ink font-medium tracking-[0.15em] uppercase text-sm rounded-sm"
            >
              See the work
            </button>
          </div>
        </div>
      </MobileFolioScene>
    </MobileShell>
  );
};
