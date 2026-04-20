import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MobileFolioScene } from './MobileFolioScene';

interface Symptom {
  n: string;
  title: string;
  lead: string;
  detail: string;
}

const SYMPTOMS: Symptom[] = [
  {
    n: 'i',
    title: 'The Generalist Tax',
    lead: 'Average at each, excellent at none.',
    detail: 'One chat window, every job — coding, research, strategy, design.',
  },
  {
    n: 'ii',
    title: 'The Governance Gap',
    lead: 'When it breaks in production, you own the wreck.',
    detail: 'No review. No gate. No accountability.',
  },
  {
    n: 'iii',
    title: 'The Orchestration Gap',
    lead: "Five of the same isn't a team.",
    detail: 'A team is specialists, coordinated. AI tools are one generalist, cloned.',
  },
];

export const MobileContrast: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <MobileFolioScene id="contrast" eyebrow="Folio II — The Industry Is Wrong" className="bg-white/40">
      <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2 tracking-tight">
        One model cannot
        <br />
        <span className="italic text-ink-muted/70">be everyone.</span>
      </h2>

      <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-8">
        Every major AI product is one generalist pretending to do the work of a specialist team. It's mediocre at all of it.
      </p>

      <ol className="border-t border-ink/10">
        {SYMPTOMS.map((s, i) => {
          const isOpen = openIndex === i;
          return (
            <li key={s.n} className="border-b border-ink/10">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-baseline gap-4 py-5 text-left active:opacity-60 transition-opacity"
                aria-expanded={isOpen}
              >
                <span className="font-serif italic text-accent text-base tracking-[0.1em] flex-shrink-0 w-5">
                  {s.n}.
                </span>
                <span className="flex-1">
                  <span className="block font-serif text-xl text-ink mb-1">{s.title}</span>
                  <span className="block font-serif italic text-base text-ink-muted leading-snug">{s.lead}</span>
                </span>
                <span className="flex-shrink-0 pt-2 text-ink-muted/60">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="pl-9 pr-8 pb-5 -mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{s.detail}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </MobileFolioScene>
  );
};
