import React from 'react';
import { MobileFolioScene } from './MobileFolioScene';

interface Station {
  n: string;
  label: string;
  title: string;
  body: string;
}

const STATIONS: Station[] = [
  { n: '01', label: 'DOMAIN', title: 'Area of expertise', body: 'A lasting domain matched to a specific brief. The right mind on the right task.' },
  { n: '02', label: 'BRIEF', title: 'Task at hand', body: 'Clear scope, named owner, defined deliverable. Every team starts here.' },
  { n: '03', label: 'TOOLS', title: 'Selected, not assumed', body: "Each specialist reaches for the right tool — not every tool, every time." },
  { n: '04', label: 'CONTEXT', title: 'Memory that compounds', body: 'Layered project memory, distilled lessons, calibrated trust — carried across runs.' },
  { n: '05', label: 'HUMAN GATE', title: 'Accountable review', body: "Review at the point that matters. You approve the things that can't be un-approved." },
  { n: '06', label: 'OUTPUT', title: 'Finished work, shipped', body: 'Merged, sealed, delivered — to the surface where you already work.' },
];

export const MobileMethod: React.FC = () => (
  <MobileFolioScene id="method" eyebrow="Folio III — The Method">
    <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2 tracking-tight">
      Six stations.
      <br />
      <span className="italic text-ink-muted/70">One specialist.</span>
    </h2>

    <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-10">
      Every specialist follows the same path — domain to output, with a human gate before anything ships.
    </p>

    {/* Vertical station rail */}
    <ol className="relative border-l border-ink/10 ml-3">
      {/* Traveling accent mote on the rail */}
      <div
        aria-hidden="true"
        className="absolute left-[-3px] w-[5px] h-[5px] rounded-full bg-accent"
        style={{
          animation: 'method-rail-mote 14s linear infinite',
        }}
      />

      {STATIONS.map((s, i) => {
        const isGate = s.label === 'HUMAN GATE';
        return (
          <li key={s.n} className="relative pl-7 pb-9 last:pb-0">
            {/* Station dot */}
            <span
              className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full ring-4 ring-base ${
                isGate ? 'bg-[#16a34a]' : 'bg-ink'
              }`}
            />

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-[11px] tracking-[0.2em] text-ink-muted/70">{s.n}</span>
              <span
                className={`font-serif italic text-[11px] tracking-[0.25em] uppercase ${
                  isGate ? 'text-[#16a34a]' : 'text-accent'
                }`}
              >
                {s.label}
              </span>
            </div>
            <h3 className="font-serif text-xl text-ink leading-snug mb-1.5">{s.title}</h3>
            <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{s.body}</p>

            {/* Style the rail animation once, scoped via a global keyframe */}
            {i === 0 && (
              <style>{`
                @keyframes method-rail-mote {
                  0%   { top: 0; opacity: 0; }
                  3%   { opacity: 1; }
                  97%  { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
              `}</style>
            )}
          </li>
        );
      })}
    </ol>
  </MobileFolioScene>
);
