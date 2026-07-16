import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MobileFolioScene, MobileSceneTitle, MobileSceneSubtitle } from './MobileFolioScene';

interface Symptom {
  n: string;
  title: string;
  lead: string;
  detail: string;
}

const SYMPTOMS: Symptom[] = [
  {
    n: 'i',
    title: 'The Handoff Gap',
    lead: 'A tool can help with a task without owning the workflow.',
    detail: 'Production work still crosses inboxes, internal systems, operators, and customer commitments.',
  },
  {
    n: 'ii',
    title: 'The Governance Gap',
    lead: 'Confidence is not approval.',
    detail: 'High-consequence work needs explicit review, traceable decisions, and someone accountable for release.',
  },
  {
    n: 'iii',
    title: 'The Operating Gap',
    lead: 'Multiple prompts are not an operating system.',
    detail: 'Reliable work needs narrow roles, shared state, retries, observability, and a defined finish line.',
  },
];

export const MobileContrast: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <MobileFolioScene id="contrast" eyebrow="Folio II — Where Tools Stop" className="bg-white/40">
      <MobileSceneTitle>
        Useful tools.
        <br />
        <span className="italic text-ink-muted/70">Missing operating system.</span>
      </MobileSceneTitle>

      <MobileSceneSubtitle>
        A good AI tool can accelerate one task. Production still needs coordinated roles, integrations, memory, controls, and an accountable release gate.
      </MobileSceneSubtitle>

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
