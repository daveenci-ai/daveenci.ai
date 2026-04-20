import React from 'react';
import { Section, ScrollReveal, Plate, FolioHeader } from './Shared';

const DomainCard: React.FC = () => (
  <div className="animate-card-active-1 rounded-sm h-full">
    <Plate fig="iii.a" title="Domain & Brief" tilt={false}>
      <div className="relative h-full flex flex-col items-center pt-2 pb-6">
        <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-px h-4 bg-accent/40" />

        <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
          {/* Connection — DOMAIN → BRIEF with traveling mote */}
          <line x1="82" y1="90" x2="160" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
          <circle cy="90" r="2.4" opacity="0" fill="rgb(var(--color-accent))">
            <animate attributeName="cx" values="82;160" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* DOMAIN — bullseye on the left (station 1: sonar ping + center pulse) */}
          <g transform="translate(54, 90)">
            <circle cx="0" cy="0" r="26" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 3" fill="none" opacity="0.55" className="animate-pulse" />
            <circle cx="0" cy="0" r="20" stroke="rgb(var(--color-ink))" strokeWidth="1.8" fill="none" />
            <circle cx="0" cy="0" r="12" stroke="rgb(var(--color-ink))" strokeWidth="1.3" fill="none" />
            {/* Sonar ping — expands outward during active window */}
            <circle cx="0" cy="0" r="5" fill="none" stroke="rgb(var(--color-accent))" strokeWidth="1.5" opacity="0">
              <animate attributeName="r" values="5;32;5" keyTimes="0;0.081;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.85;0;0" keyTimes="0;0.018;0.081;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-width" values="1.8;0.3;1.8;1.8" keyTimes="0;0.081;0.082;1" dur="18.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="5" fill="rgb(var(--color-accent))">
              <animate attributeName="r" values="5;7.5;5;5" keyTimes="0;0.04;0.081;1" dur="18.5s" repeatCount="indefinite" />
            </circle>
          </g>
          <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">DOMAIN</text>
          <text x="54" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">area of expertise</text>

          {/* BRIEF — document on the right. Active: lines write in sequentially (erase + redraw in accent, settle to ink). */}
          <g transform="translate(186, 90)">
            <rect x="-18" y="-22" width="36" height="44" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
            <line x1="-12" y1="-13" x2="12" y2="-13" stroke="rgb(var(--color-ink))" strokeWidth="1.2" strokeDasharray="30" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" values="0;0;30;0;0" keyTimes="0;0.136;0.137;0.155;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke" values="#1a1a1a;#1a1a1a;#3f84c8;#3f84c8;#1a1a1a;#1a1a1a" keyTimes="0;0.137;0.14;0.155;0.172;1" dur="18.5s" repeatCount="indefinite" />
            </line>
            <line x1="-12" y1="-7" x2="7" y2="-7" stroke="rgb(var(--color-ink))" strokeWidth="1.2" strokeDasharray="30" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" values="0;0;30;0;0" keyTimes="0;0.149;0.15;0.168;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke" values="#1a1a1a;#1a1a1a;#3f84c8;#3f84c8;#1a1a1a;#1a1a1a" keyTimes="0;0.15;0.153;0.168;0.185;1" dur="18.5s" repeatCount="indefinite" />
            </line>
            <line x1="-12" y1="-1" x2="12" y2="-1" stroke="rgb(var(--color-ink))" strokeWidth="1.2" strokeDasharray="30" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" values="0;0;30;0;0" keyTimes="0;0.162;0.163;0.181;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke" values="#1a1a1a;#1a1a1a;#3f84c8;#3f84c8;#1a1a1a;#1a1a1a" keyTimes="0;0.163;0.166;0.181;0.198;1" dur="18.5s" repeatCount="indefinite" />
            </line>
            <line x1="-12" y1="5" x2="9" y2="5" stroke="rgb(var(--color-ink))" strokeWidth="1.2" strokeDasharray="30" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" values="0;0;30;0;0" keyTimes="0;0.175;0.176;0.194;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke" values="#1a1a1a;#1a1a1a;#3f84c8;#3f84c8;#1a1a1a;#1a1a1a" keyTimes="0;0.176;0.179;0.194;0.211;1" dur="18.5s" repeatCount="indefinite" />
            </line>
            <line x1="-12" y1="11" x2="12" y2="11" stroke="rgb(var(--color-ink))" strokeWidth="1.2" strokeDasharray="30" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" values="0;0;30;0;0" keyTimes="0;0.188;0.189;0.207;1" dur="18.5s" repeatCount="indefinite" />
              <animate attributeName="stroke" values="#1a1a1a;#1a1a1a;#3f84c8;#3f84c8;#1a1a1a;#1a1a1a" keyTimes="0;0.189;0.192;0.207;0.224;1" dur="18.5s" repeatCount="indefinite" />
            </line>
          </g>
          <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">BRIEF</text>
          <text x="186" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">task at hand</text>
        </svg>

        <div className="text-center px-3 mt-auto">
          <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">persistent · current</p>
          <p className="text-sm text-ink-muted leading-relaxed">
            A lasting domain matched to a specific brief. The right mind on the right task.
          </p>
        </div>
      </div>
    </Plate>
  </div>
);

const CapabilityCard: React.FC = () => (
  <div className="animate-card-active-2 rounded-sm h-full">
    <Plate fig="iii.b" title="Tools & Context" tilt={false}>
      <div className="relative h-full flex flex-col items-center pt-2 pb-6">
        <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-px h-4 bg-accent/40" />

        <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
          {/* Connection — TOOLS → CONTEXT with traveling mote */}
          <line x1="78" y1="90" x2="162" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
          <circle cy="90" r="2.4" opacity="0" fill="rgb(var(--color-accent))">
            <animate attributeName="cx" values="78;162" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* TOOLS on left — checkbox list, 3 of 4 tools selected. Active: checks wink in sequence. */}
          <g transform="translate(54, 90)">
            {/* Row 1 — checked */}
            <rect x="-20" y="-19" width="8" height="8" rx="0.7" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
            <path d="M -18.5 -15 L -16.5 -13 L -13.5 -17" stroke="rgb(var(--color-accent))" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="opacity" values="1;1;0.15;1;1" keyTimes="0;0.27;0.28;0.292;1" dur="18.5s" repeatCount="indefinite" />
            </path>
            <line x1="-9" y1="-15" x2="16" y2="-15" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />

            {/* Row 2 — unchecked */}
            <rect x="-20" y="-9" width="8" height="8" rx="0.7" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
            <line x1="-9" y1="-5" x2="9" y2="-5" stroke="rgb(var(--color-ink))" strokeWidth="1.2" opacity="0.4" />

            {/* Row 3 — checked */}
            <rect x="-20" y="1" width="8" height="8" rx="0.7" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
            <path d="M -18.5 5 L -16.5 7 L -13.5 3" stroke="rgb(var(--color-accent))" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="opacity" values="1;1;0.15;1;1" keyTimes="0;0.296;0.306;0.318;1" dur="18.5s" repeatCount="indefinite" />
            </path>
            <line x1="-9" y1="5" x2="18" y2="5" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />

            {/* Row 4 — checked */}
            <rect x="-20" y="11" width="8" height="8" rx="0.7" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
            <path d="M -18.5 15 L -16.5 17 L -13.5 13" stroke="rgb(var(--color-accent))" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="opacity" values="1;1;0.15;1;1" keyTimes="0;0.322;0.332;0.344;1" dur="18.5s" repeatCount="indefinite" />
            </path>
            <line x1="-9" y1="15" x2="12" y2="15" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
          </g>
          <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">TOOLS</text>
          <text x="54" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">fit for purpose</text>

          {/* CONTEXT on right — 4-layer database. Each layer filled with gradient accent-blue.
              Active: each layer brightens briefly top→bottom as memory is queried. */}
          <g transform="translate(186, 90)">
            {/* Cylinder sides */}
            <line x1="-20" y1="-15" x2="-20" y2="17" stroke="rgb(var(--color-accent))" strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="20" y1="-15" x2="20" y2="17" stroke="rgb(var(--color-accent))" strokeWidth="1.2" strokeOpacity="0.7" />

            {/* 4 layer bodies — blue gradient from light (top) to dark (bottom) */}
            <rect x="-20" y="-15" width="40" height="8" fill="rgb(var(--color-accent))" fillOpacity="0.2">
              <animate attributeName="fill-opacity" values="0.2;0.2;0.42;0.2;0.2" keyTimes="0;0.405;0.418;0.43;1" dur="18.5s" repeatCount="indefinite" />
            </rect>
            <rect x="-20" y="-7" width="40" height="8" fill="rgb(var(--color-accent))" fillOpacity="0.4">
              <animate attributeName="fill-opacity" values="0.4;0.4;0.62;0.4;0.4" keyTimes="0;0.418;0.43;0.442;1" dur="18.5s" repeatCount="indefinite" />
            </rect>
            <rect x="-20" y="1" width="40" height="8" fill="rgb(var(--color-accent))" fillOpacity="0.6">
              <animate attributeName="fill-opacity" values="0.6;0.6;0.82;0.6;0.6" keyTimes="0;0.438;0.45;0.462;1" dur="18.5s" repeatCount="indefinite" />
            </rect>
            <rect x="-20" y="9" width="40" height="8" fill="rgb(var(--color-accent))" fillOpacity="0.85">
              <animate attributeName="fill-opacity" values="0.85;0.85;1;0.85;0.85" keyTimes="0;0.458;0.47;0.482;1" dur="18.5s" repeatCount="indefinite" />
            </rect>

            {/* Bottom arc — closes the cylinder */}
            <path d="M -20 17 A 20 3 0 0 0 20 17" fill="rgb(var(--color-accent))" fillOpacity="0.85" stroke="rgb(var(--color-accent))" strokeWidth="1.2" />

            {/* Divider ellipses (between layers) */}
            <ellipse cx="0" cy="9" rx="20" ry="3" fill="rgb(var(--color-accent))" fillOpacity="0.7" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
            <ellipse cx="0" cy="1" rx="20" ry="3" fill="rgb(var(--color-accent))" fillOpacity="0.5" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
            <ellipse cx="0" cy="-7" rx="20" ry="3" fill="rgb(var(--color-accent))" fillOpacity="0.3" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />

            {/* Top opening ellipse — lightest */}
            <ellipse cx="0" cy="-15" rx="20" ry="3" fill="rgb(var(--color-accent))" fillOpacity="0.1" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
          </g>
          <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">CONTEXT</text>
          <text x="186" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">earned depth</text>
        </svg>

        <div className="text-center px-3 mt-auto">
          <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">purpose-built · earned</p>
          <p className="text-sm text-ink-muted leading-relaxed">
            Instruments fit for the work, and depth built from it. The specialist's working memory.
          </p>
        </div>
      </div>
    </Plate>
  </div>
);

const DeliveryCard: React.FC = () => (
  <div className="animate-card-active-3 rounded-sm h-full">
    <Plate fig="iii.c" title="Gate & Output" tilt={false}>
      <div className="relative h-full flex flex-col items-center pt-2 pb-6">
        <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-px h-4 bg-accent/40" />

        <svg viewBox="0 50 240 120" className="w-full max-w-[320px] mx-auto">
          {/* Connection — approved work flows from the gate to the output */}
          <line x1="78" y1="90" x2="158" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
          {/* Green mote (already approved at the gate) traveling to the output */}
          <circle cy="90" r="2.4" opacity="0" fill="#16a34a">
            <animate attributeName="cx" values="78;158" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* HUMAN GATE — left (station 5: checkmark stamps in with scale bounce + rect flashes green) */}
          <g transform="translate(54, 90)">
            <rect x="-20" y="-20" width="40" height="40" rx="1" fill="white" stroke="#16a34a" strokeWidth="1.6">
              <animate attributeName="stroke-width" values="1.6;1.6;2.4;1.6;1.6" keyTimes="0;0.54;0.578;0.62;1" dur="18.5s" repeatCount="indefinite" />
            </rect>
            {/* Checkmark — snaps down with overshoot bounce */}
            <path d="M -12 0 L -3 9 L 12 -8" stroke="#16a34a" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animateTransform attributeName="transform" type="scale" values="1;1;0.3;1.25;0.95;1;1" keyTimes="0;0.54;0.554;0.572;0.59;0.62;1" dur="18.5s" repeatCount="indefinite" additive="replace" />
            </path>
          </g>
          <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">HUMAN GATE</text>
          <text x="54" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">review · approve</text>

          {/* OUTPUT — right, stacked pages with green seal.
              Station 6 animation: pages briefly spread apart, then merge back into the stack, then the seal stamps down. */}
          <g transform="translate(186, 90)">
            {/* Back page — spreads down-left then merges back */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 0;-12 16;0 0;0 0" keyTimes="0;0.675;0.697;0.733;1" dur="18.5s" repeatCount="indefinite" />
              <rect x="-22" y="-4" width="32" height="32" fill="white" stroke="rgb(var(--color-accent))" strokeWidth="1" opacity="0.55" />
            </g>
            {/* Middle page — spreads down-right then merges back */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 0;12 14;0 0;0 0" keyTimes="0;0.675;0.703;0.739;1" dur="18.5s" repeatCount="indefinite" />
              <rect x="-17" y="-9" width="32" height="32" fill="white" stroke="rgb(var(--color-accent))" strokeWidth="1.1" opacity="0.8" />
            </g>
            {/* Top page + content lines + seal — lifts up, settles, then seal stamps */}
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -16;0 0;0 0" keyTimes="0;0.675;0.709;0.745;1" dur="18.5s" repeatCount="indefinite" />
              <rect x="-12" y="-14" width="32" height="32" fill="rgb(var(--color-accent))" fillOpacity="0.14" stroke="rgb(var(--color-accent))" strokeWidth="1.4" />
              <line x1="-9" y1="-9" x2="14" y2="-9" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
              <line x1="-9" y1="-4" x2="16" y2="-4" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
              <line x1="-9" y1="1" x2="10" y2="1" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
              <line x1="-9" y1="6" x2="15" y2="6" stroke="rgb(var(--color-accent))" strokeWidth="1.1" />
              {/* Green approval seal — stamps down with bounce after pages merge */}
              <g transform="translate(15, -10)">
                <g>
                  <animateTransform attributeName="transform" type="scale" values="1;1;1;1.5;0.85;1.15;1;1" keyTimes="0;0.675;0.745;0.769;0.793;0.811;0.829;1" dur="18.5s" repeatCount="indefinite" />
                  <circle cx="0" cy="0" r="4" fill="white" stroke="#16a34a" strokeWidth="1.6" />
                  <path d="M -2.3 0 L -0.6 1.7 L 2.3 -2.3" stroke="#16a34a" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            </g>
          </g>
          <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">OUTPUT</text>
          <text x="186" y="154" textAnchor="middle" fontSize="8" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" opacity="0.7">signed · shipped</text>
        </svg>

        <div className="text-center px-3 mt-auto">
          <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">approved · accountable</p>
          <p className="text-sm text-ink-muted leading-relaxed">
            Every output crosses a human. Approved delivery, signed and shipped.
          </p>
        </div>
      </div>
    </Plate>
  </div>
);

const SpecialistTrack: React.FC = () => (
  <div className="relative h-14 mb-4 hidden md:block">
    {/* Track line — spans from station 1 to station 6 */}
    <div className="absolute top-1/2 h-px bg-ink-muted/30 -translate-y-1/2" style={{ left: '10%', right: '10%' }} />

    {/* 6 station markers — 2 per card. Tight pairs (gap 12%) with wider gaps between cards (22%). */}
    {[10, 22, 44, 56, 78, 90].map((pos) => (
      <div
        key={pos}
        className="absolute top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-base border border-ink-muted/50"
        style={{ left: `${pos}%` }}
      />
    ))}

    {/* Moving specialist — bullseye glyph with caption floating above. The caption travels with the ball. */}
    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 animate-specialist-run z-10">
      {/* Caption floats above the ball and rides with it */}
      <p className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif italic text-[11px] tracking-[0.25em] uppercase text-accent/85">
        AI Specialist
      </p>
      {/* Mini-bullseye specialist avatar — matches Fig. iii.a's DOMAIN glyph */}
      <svg viewBox="0 0 40 40" className="w-9 h-9 block" style={{ filter: 'drop-shadow(0 0 10px rgba(63, 132, 200, 0.55))' }}>
        <circle cx="20" cy="20" r="18" fill="none" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" className="animate-pulse" />
        <circle cx="20" cy="20" r="14" fill="rgb(var(--color-base))" stroke="rgb(var(--color-accent))" strokeWidth="1.8" />
        <circle cx="20" cy="20" r="9" fill="none" stroke="rgb(var(--color-accent))" strokeWidth="1.2" />
        <circle cx="20" cy="20" r="4.5" fill="rgb(var(--color-accent))" />
      </svg>
    </div>
  </div>
);

const Method: React.FC = () => (
  <Section id="method" pattern="circles" overflow={true}>
    <ScrollReveal delay={100}>
      <FolioHeader
        eyebrow="Folio III — The Method"
        title={<>A specialist for each job.<br />A gate for every output.</>}
        subtitle="Three beats. The specialist focuses on one domain, brings purpose-built tools and earned context, then ships through a human gate."
      />
    </ScrollReveal>

    <SpecialistTrack />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      <ScrollReveal delay={200}>
        <DomainCard />
      </ScrollReveal>
      <ScrollReveal delay={300}>
        <CapabilityCard />
      </ScrollReveal>
      <ScrollReveal delay={400}>
        <DeliveryCard />
      </ScrollReveal>
    </div>
  </Section>
);

export default Method;
