import React, { useEffect, useState } from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';
import { Section, ScrollReveal, Plate, FolioHeader } from './Shared';

const JOBS = ['CODE', 'RESEARCH', 'STRATEGY', 'DESIGN'];

const GeneralistDiagram: React.FC = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % JOBS.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <Plate fig="ii" title="The Generalist">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
        {/* Faint construction circle — sketchbook scaffolding echo */}
        <circle cx="150" cy="125" r="95" stroke="rgb(var(--color-paper-border))" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.35" />

        {/* WRECK — ongoing system error popups, piling up and cycling */}
        <text x="150" y="16" textAnchor="middle" fontSize="7" fill="rgb(var(--color-status-danger))" fontFamily="serif" fontStyle="italic" letterSpacing="0.15em">
          WRECK
          <animate attributeName="opacity" values="0.5;1;0.55;1;0.5" dur="1.4s" repeatCount="indefinite" />
        </text>

        {/* Shockwave ring — expands outward each time the main error detonates */}
        <circle cx="151" cy="32" r="5" fill="none" stroke="rgb(var(--color-status-danger))" strokeWidth="0.8">
          <animate attributeName="r" values="5;5;18" keyTimes="0;0.6;1" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;0.55;0;0" keyTimes="0;0.6;0.7;0.95;1" dur="3.6s" repeatCount="indefinite" />
        </circle>

        {/* Error stack — pops in, shakes when the red alert arrives, then resets */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 0,0; 0.8,-0.5; -0.8,0.5; 0.5,0.3; -0.5,-0.3; 0,0; 0,0"
            keyTimes="0;0.6;0.64;0.68;0.72;0.76;0.8;1"
            dur="3.6s"
            repeatCount="indefinite" />

          <rect x="129" y="33" width="20" height="20" fill="white" stroke="rgb(var(--color-status-danger))" strokeWidth="0.9" opacity="0">
            <animate attributeName="opacity" values="0;0.5;0.5;0.5;0" keyTimes="0;0.12;0.9;0.95;1" dur="3.6s" repeatCount="indefinite" />
          </rect>
          <rect x="137" y="27" width="20" height="20" fill="white" stroke="rgb(var(--color-status-danger))" strokeWidth="0.9" opacity="0">
            <animate attributeName="opacity" values="0;0;0.8;0.8;0" keyTimes="0;0.32;0.4;0.95;1" dur="3.6s" repeatCount="indefinite" />
          </rect>
          <rect x="141" y="22" width="20" height="20" fill="rgb(var(--color-status-danger))" fillOpacity="0.18" stroke="rgb(var(--color-status-danger))" strokeWidth="1.1" opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.58;0.68;0.95;1" dur="3.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-width" values="1.1;1.8;1.1;1.8;1.1" keyTimes="0;0.7;0.78;0.86;0.95" dur="3.6s" repeatCount="indefinite" />
          </rect>

          {/* X crack — flickers rapidly while the red alert is visible */}
          <g opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.62;0.7;0.95;1" dur="3.6s" repeatCount="indefinite" />
            <line x1="145" y1="26" x2="157" y2="38" stroke="rgb(var(--color-status-danger))" strokeWidth="1.6">
              <animate attributeName="opacity" values="1;0.2;1;0.3;1" dur="0.45s" repeatCount="indefinite" />
            </line>
            <line x1="157" y1="26" x2="145" y2="38" stroke="rgb(var(--color-status-danger))" strokeWidth="1.6">
              <animate attributeName="opacity" values="1;0.3;1;0.2;1" dur="0.45s" repeatCount="indefinite" />
            </line>
          </g>
        </g>

        {/* Broken pipeline — red dashed with marching-ants animation */}
        <line x1="150" y1="53" x2="150" y2="68" stroke="rgb(var(--color-status-danger))" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite" />
        </line>

        {/* NO GATE — prominent empty dashed box, dashes march around to show it's "open/broken" */}
        <rect x="115" y="68" width="70" height="20" rx="1" fill="white" stroke="rgb(var(--color-paper-border))" strokeWidth="1.2" strokeDasharray="3 2">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <text x="150" y="81" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">NO GATE</text>

        <line x1="150" y1="88" x2="150" y2="104" stroke="rgb(var(--color-status-danger))" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1s" repeatCount="indefinite" />
        </line>

        {/* Red flow motes — "outputs" escaping the chat, sailing through the empty gate, piling into WRECK */}
        {[0, 0.8, 1.6].map((delay, i) => (
          <circle key={i} cx="150" r="1.8" fill="rgb(var(--color-status-danger))" opacity="0">
            <animate attributeName="cy" from="104" to="44" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.15;0.85;1" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Overloaded chat — all 4 jobs visible at once, one cycles bright */}
        <rect x="78" y="104" width="144" height="118" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
        <line x1="78" y1="120" x2="222" y2="120" stroke="rgb(var(--color-ink))" strokeWidth="0.5" opacity="0.3" />
        <circle cx="86" cy="112" r="1.6" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
        <circle cx="92" cy="112" r="1.6" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
        <circle cx="98" cy="112" r="1.6" fill="rgb(var(--color-ink-muted))" opacity="0.5" />

        {JOBS.map((job, i) => {
          const y = 138 + i * 18;
          const isActive = i === active;
          return (
            <text
              key={job}
              x="94"
              y={y}
              fontSize="10"
              fontFamily="serif"
              fontStyle="italic"
              letterSpacing="0.15em"
              fill={isActive ? 'rgb(var(--color-accent))' : 'rgb(var(--color-ink-muted))'}
              opacity={isActive ? 1 : 0.35}
              style={{ transition: 'opacity 600ms, fill 600ms' }}
            >
              {job}?
              {isActive && <tspan dx="2" className="animate-pulse">|</tspan>}
            </text>
          );
        })}

        {/* Typing indicator at bottom of chat — generalist "still thinking", never finishes */}
        {[0, 1, 2].map((i) => (
          <circle key={`dot-${i}`} cx={140 + i * 5} cy="212" r="1.4" fill="rgb(var(--color-ink-muted))">
            <animate attributeName="opacity" values="0.15;0.9;0.15" dur="1.4s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Annotation pills */}
      <div className="absolute top-2 -left-4 md:-left-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
        <Cpu className="w-4 h-4 text-ink-muted" />
        <span className="text-xs font-medium text-ink">One chat, every job</span>
      </div>

      <div className="absolute bottom-2 -right-4 md:-right-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
        <AlertTriangle className="w-4 h-4 text-status-danger" />
        <span className="text-xs font-medium text-ink">No gate</span>
      </div>
    </Plate>
  );
};

const symptoms = [
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

const Contrast: React.FC = () => (
  <Section id="contrast" pattern="nodes" overflow={true} className="bg-white/50">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 xl:gap-32 items-center">
      <div className="lg:col-span-5 lg:order-1 order-2 relative h-[420px] flex items-center justify-center">
        <ScrollReveal delay={300} direction="right" className="w-full flex justify-center">
          <GeneralistDiagram />
        </ScrollReveal>
      </div>

      <div className="lg:col-span-7 lg:order-2 order-1 relative z-20">
        <ScrollReveal delay={100}>
          <FolioHeader
            eyebrow="Folio II — The Industry Is Wrong"
            title={<>One model cannot<br />be everyone.</>}
            subtitle="Every major AI product is one generalist pretending to do the work of a specialist team. It's mediocre at all of it."
          />

          <ol className="space-y-8 max-w-xl border-l border-ink/10 pl-6">
            {symptoms.map((s) => (
              <li key={s.n} className="flex gap-5 items-baseline">
                <span className="font-serif italic text-accent text-lg tracking-[0.1em] flex-shrink-0 w-6 text-right">{s.n}.</span>
                <div>
                  <h3 className="font-serif text-xl text-ink mb-2">{s.title}</h3>
                  <p className="font-serif italic text-lg text-ink leading-snug mb-1">{s.lead}</p>
                  <p className="text-ink-muted leading-relaxed">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </div>
    </div>
  </Section>
);

export default Contrast;
