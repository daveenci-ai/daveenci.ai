import React from 'react';
import type { CaseId } from '../lib/analytics';

/**
 * Miniature construction drawings, one per case, for the stacking Work cards.
 * Same register as the landing-page figures: dashed scaffolds in umber, ink
 * for the mechanism, accent blue for the thing that moves, a single SMIL mote
 * so the drawing reads as a process rather than an icon. Each is a pure SVG
 * (no effects), so it renders identically in the prerender and on first paint.
 */

const ink = 'rgb(var(--color-ink))';
const muted = 'rgb(var(--color-ink-muted))';
const scaffold = 'rgb(var(--color-paper-border))';
const accent = 'rgb(var(--color-accent))';
const success = 'rgb(var(--color-status-success))';
const danger = 'rgb(var(--color-status-danger))';

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; fill?: string; anchor?: 'start' | 'middle' | 'end' }> = ({ x, y, children, fill = muted, anchor = 'middle' }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize="7" fill={fill} fontFamily="serif" fontStyle="italic" letterSpacing="0.14em">
    {children}
  </text>
);

const Mote: React.FC<{ path: string; dur?: string; begin?: string; color?: string }> = ({ path, dur = '4s', begin = '0s', color = accent }) => (
  <circle r="2" fill={color} opacity="0">
    <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" />
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur={dur} begin={begin} repeatCount="indefinite" />
  </circle>
);

/** A feature request → thirteen specialists → three gates → a reviewed PR. */
const PureCodeSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    <line x1="20" y1="90" x2="280" y2="90" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 4" />
    {/* ticket */}
    <rect x="18" y="72" width="30" height="36" rx="1" stroke={ink} strokeWidth="1.2" fill="white" />
    <line x1="24" y1="82" x2="42" y2="82" stroke={ink} strokeWidth="1" />
    <line x1="24" y1="89" x2="38" y2="89" stroke={ink} strokeWidth="1" />
    <line x1="24" y1="96" x2="40" y2="96" stroke={ink} strokeWidth="1" />
    <Label x={33} y={122}>Request</Label>
    {/* specialist cluster — 13 nodes in a loose constellation */}
    {[[95, 52], [118, 40], [142, 48], [160, 66], [156, 92], [140, 116], [116, 128], [94, 118], [82, 94], [104, 78], [128, 72], [136, 96], [112, 102]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 4.5 : 3.2} fill={i % 4 === 0 ? accent : 'white'} stroke={ink} strokeWidth="1" />
    ))}
    <circle cx="121" cy="86" r="48" stroke={scaffold} strokeWidth="0.7" strokeDasharray="3 3" />
    <Label x={121} y={150}>13 specialists</Label>
    {/* three gates */}
    {[196, 216, 236].map((x, i) => (
      <g key={x}>
        <rect x={x - 7} y="83" width="14" height="14" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
        <path d={`M ${x - 4} 90 L ${x - 1} 93 L ${x + 4} 87`} stroke={i < 2 ? success : accent} strokeWidth="1.4" />
      </g>
    ))}
    <Label x={216} y={122}>3 human gates</Label>
    {/* reviewed PR */}
    <rect x="262" y="70" width="22" height="30" fill="white" stroke={accent} strokeWidth="1" />
    <rect x="266" y="66" width="22" height="30" fill={accent} stroke={accent} strokeWidth="1" />
    <line x1="270" y1="74" x2="284" y2="74" stroke="white" strokeWidth="0.8" />
    <line x1="270" y1="80" x2="282" y2="80" stroke="white" strokeWidth="0.8" />
    <line x1="270" y1="86" x2="284" y2="86" stroke="white" strokeWidth="0.8" />
    <Label x={275} y={122} fill={accent}>PR</Label>
    <Mote path="M 48 90 L 73 90 L 121 86 L 189 90 L 262 84" dur="5s" />
  </svg>
);

/** Order intake → schedule → route → QC → verified delivery. */
const ShootOSSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    {/* map with route */}
    <rect x="18" y="26" width="124" height="128" rx="1" stroke={scaffold} strokeWidth="0.8" fill="white" fillOpacity="0.5" />
    {[46, 74, 102].map((y) => <line key={y} x1="18" y1={y} x2="142" y2={y} stroke={scaffold} strokeWidth="0.4" strokeDasharray="2 3" />)}
    {[50, 82, 114].map((x) => <line key={x} x1={x} y1="26" x2={x} y2="154" stroke={scaffold} strokeWidth="0.4" strokeDasharray="2 3" />)}
    <path d="M 34 132 C 40 96, 70 100, 72 70 S 110 44, 126 42" stroke={accent} strokeWidth="1.4" strokeDasharray="3 2" />
    {[[34, 132], [72, 70], [126, 42]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="4" fill="white" stroke={ink} strokeWidth="1.2" />
        <circle cx={x} cy={y} r="1.5" fill={ink} />
      </g>
    ))}
    <Label x={80} y={168}>Route · 3 shoots</Label>
    {/* calendar */}
    <rect x="166" y="30" width="60" height="44" rx="1" stroke={ink} strokeWidth="1" fill="white" />
    <line x1="166" y1="40" x2="226" y2="40" stroke={ink} strokeWidth="1" />
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
      <rect key={`${r}-${c}`} x={171 + c * 14} y={45 + r * 9} width="10" height="6" fill={r === 1 && c === 2 ? accent : scaffold} fillOpacity={r === 1 && c === 2 ? 1 : 0.35} />
    )))}
    <Label x={196} y={86}>Schedule</Label>
    {/* QC + delivery */}
    <rect x="166" y="104" width="22" height="22" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 171 115 L 175 119 L 183 109" stroke={success} strokeWidth="1.5" />
    <Label x={177} y={140}>QC</Label>
    <rect x="206" y="104" width="30" height="22" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 206 104 L 221 116 L 236 104" stroke={ink} strokeWidth="1" />
    <Label x={221} y={140}>Delivered</Label>
    <line x1="142" y1="90" x2="160" y2="90" stroke={scaffold} strokeWidth="0.8" strokeDasharray="2 3" />
    <line x1="196" y1="74" x2="196" y2="100" stroke={scaffold} strokeWidth="0.8" strokeDasharray="2 3" />
    <Mote path="M 34 132 C 40 96, 70 100, 72 70 S 110 44, 126 42" dur="4.5s" />
  </svg>
);

/** Hypothesis → versioned research → action gate → paper execution → feedback. */
const CompoundIQSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    <path d="M 60 50 H 240 A 20 20 0 0 1 240 130 H 60 A 20 20 0 0 1 60 50 Z" stroke={scaffold} strokeWidth="0.8" strokeDasharray="3 3" />
    {/* research doc */}
    <rect x="44" y="36" width="30" height="28" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <line x1="50" y1="45" x2="68" y2="45" stroke={ink} strokeWidth="1" />
    <line x1="50" y1="51" x2="64" y2="51" stroke={ink} strokeWidth="1" />
    <text x="59" y="60" textAnchor="middle" fontSize="6" fill={accent} fontFamily="monospace">v12</text>
    <Label x={59} y={26}>Research</Label>
    {/* gate */}
    <rect x="140" y="38" width="22" height="22" rx="1" fill="white" stroke={ink} strokeWidth="1.4" />
    <path d="M 145 49 L 149 53 L 157 43" stroke={accent} strokeWidth="1.5" />
    <Label x={151} y={26}>Action gate</Label>
    {/* paper execution chart */}
    <rect x="224" y="34" width="44" height="32" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <polyline points="228,60 236,52 244,55 252,44 260,48 266,40" stroke={accent} strokeWidth="1.4" />
    <Label x={246} y={26}>Paper only</Label>
    {/* feedback */}
    <rect x="128" y="118" width="46" height="24" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <line x1="134" y1="126" x2="168" y2="126" stroke={ink} strokeWidth="1" />
    <line x1="134" y1="133" x2="160" y2="133" stroke={ink} strokeWidth="1" />
    <Label x={151} y={160}>Structured feedback</Label>
    <path d="M 240 130 L 234 124 M 240 130 L 234 136" stroke={scaffold} strokeWidth="0.9" />
    <path d="M 60 50 L 66 44 M 60 50 L 66 56" stroke={scaffold} strokeWidth="0.9" />
    <Mote path="M 74 50 H 140 M 162 50 H 224 A 20 20 0 0 1 240 130 H 174" dur="5.5s" />
  </svg>
);

/** Ad → site event → client-owned warehouse → verdict. */
const AnalyticsOSSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    <line x1="20" y1="70" x2="280" y2="70" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 4" />
    {/* ad */}
    <rect x="18" y="50" width="40" height="40" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 33 62 L 47 70 L 33 78 Z" fill={accent} />
    <Label x={38} y={104}>Ad</Label>
    {/* site event */}
    <rect x="90" y="50" width="52" height="40" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <line x1="90" y1="58" x2="142" y2="58" stroke={ink} strokeWidth="0.8" />
    <rect x="98" y="66" width="24" height="4" fill={scaffold} fillOpacity="0.5" />
    <rect x="98" y="74" width="34" height="4" fill={scaffold} fillOpacity="0.5" />
    <path d="M 128 72 L 128 84 L 131 81 L 134 87 L 136 86 L 133 80 L 137 80 Z" fill={ink} />
    <Label x={116} y={104}>Site event</Label>
    {/* warehouse */}
    <ellipse cx="188" cy="54" rx="18" ry="6" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 170 54 V 84 A 18 6 0 0 0 206 84 V 54" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 170 64 A 18 6 0 0 0 206 64 M 170 74 A 18 6 0 0 0 206 74" stroke={ink} strokeWidth="0.8" />
    <Label x={188} y={104}>Warehouse</Label>
    <Label x={188} y={114} fill={accent}>client-owned</Label>
    {/* verdicts */}
    <g>
      <rect x="230" y="40" width="50" height="14" rx="1" fill="white" stroke={success} strokeWidth="1.1" />
      <text x="255" y="50" textAnchor="middle" fontSize="7" fill={success} fontFamily="monospace" letterSpacing="0.12em">KEEP</text>
      <rect x="230" y="62" width="50" height="14" rx="1" fill="white" stroke={danger} strokeWidth="1.1" />
      <text x="255" y="72" textAnchor="middle" fontSize="7" fill={danger} fontFamily="monospace" letterSpacing="0.12em">KILL</text>
      <rect x="230" y="84" width="50" height="14" rx="1" fill="white" stroke={accent} strokeWidth="1.1" />
      <text x="255" y="94" textAnchor="middle" fontSize="6.4" fill={accent} fontFamily="monospace" letterSpacing="0.06em">SPEND $X</text>
    </g>
    <Label x={255} y={114}>Verdict · p</Label>
    <path d="M 58 70 H 90 M 142 70 H 170 M 206 70 H 230" stroke={ink} strokeWidth="0.8" strokeDasharray="3 2" />
    <Mote path="M 58 70 H 90 M 142 70 H 170 M 206 70 H 230" dur="4s" />
    <Mote path="M 58 70 H 230" dur="4s" begin="2s" color={success} />
  </svg>
);


/** Meeting transcript → review-ready newsletter, social posts, and visuals. */
const PulseNoteSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    {/* transcript with a waveform */}
    <rect x="24" y="48" width="52" height="66" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <polyline points="30,70 34,62 38,76 42,58 46,80 50,66 54,74 58,60 62,78 66,68 70,72" stroke={accent} strokeWidth="1.2" />
    {[88, 96, 104].map((y) => <line key={y} x1="30" y1={y} x2={y === 96 ? 62 : 70} y2={y} stroke={ink} strokeWidth="1" />)}
    <Label x={50} y={130}>Transcript</Label>
    {/* fan-out lines */}
    <path d="M 76 81 C 100 81, 100 56, 130 56 M 76 81 H 130 M 76 81 C 100 81, 100 106, 130 106" stroke={scaffold} strokeWidth="0.8" strokeDasharray="3 2" />
    {/* newsletter */}
    <rect x="130" y="42" width="56" height="28" rx="1" fill="white" stroke={ink} strokeWidth="1.1" />
    <line x1="136" y1="50" x2="170" y2="50" stroke={ink} strokeWidth="1.2" />
    <line x1="136" y1="57" x2="180" y2="57" stroke={ink} strokeWidth="0.8" />
    <line x1="136" y1="63" x2="174" y2="63" stroke={ink} strokeWidth="0.8" />
    <Label x={158} y={36}>Newsletter</Label>
    {/* social post */}
    <rect x="130" y="76" width="56" height="18" rx="9" fill="white" stroke={ink} strokeWidth="1.1" />
    <circle cx="140" cy="85" r="4" fill={accent} fillOpacity="0.4" stroke={accent} strokeWidth="0.8" />
    <line x1="148" y1="85" x2="178" y2="85" stroke={ink} strokeWidth="0.9" />
    <Label x={158} y={106}>Social posts</Label>
    {/* visual */}
    <rect x="130" y="112" width="56" height="30" rx="1" fill="white" stroke={ink} strokeWidth="1.1" />
    <path d="M 134 138 L 148 122 L 158 132 L 166 126 L 182 138 Z" fill={accent} fillOpacity="0.3" stroke={accent} strokeWidth="0.8" />
    <Label x={158} y={154}>Visuals</Label>
    {/* review gate */}
    <path d="M 186 56 C 210 56, 210 92, 226 92 M 186 85 H 226 M 186 127 C 210 127, 210 92, 226 92" stroke={scaffold} strokeWidth="0.8" strokeDasharray="3 2" />
    <rect x="226" y="80" width="24" height="24" rx="1" fill="white" stroke={ink} strokeWidth="1.4" />
    <path d="M 231 92 L 236 97 L 245 86" stroke={success} strokeWidth="1.6" />
    <Label x={238} y={118}>Review</Label>
    <path d="M 250 92 H 272" stroke={ink} strokeWidth="0.9" strokeDasharray="3 2" />
    <path d="M 268 88 L 274 92 L 268 96" stroke={ink} strokeWidth="1" />
    <Label x={266} y={78} fill={accent}>Publish</Label>
    <Mote path="M 76 81 C 100 81, 100 56, 130 56" dur="3.6s" />
    <Mote path="M 186 85 H 226" dur="3.6s" begin="1.2s" color={success} />
  </svg>
);

/** A name goes in; ten weighted dimensions score it; a scorecard comes out. */
const BrandOSSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    {/* name input */}
    <rect x="22" y="70" width="66" height="26" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <text x="30" y="87" fontSize="9" fill={ink} fontFamily="serif" fontStyle="italic">Name?</text>
    <line x1="72" y1="76" x2="72" y2="90" stroke={accent} strokeWidth="1.2" />
    <Label x={55} y={112}>Input</Label>
    <path d="M 88 83 H 108" stroke={scaffold} strokeWidth="0.8" strokeDasharray="3 2" />
    {/* ten weighted dimension bars */}
    {[0.9, 0.6, 1.0, 0.7, 0.45, 0.8, 0.55, 0.85, 0.35, 0.65].map((w, i) => (
      <g key={i}>
        <rect x="110" y={36 + i * 11} width="64" height="6" fill={scaffold} fillOpacity="0.25" />
        <rect x="110" y={36 + i * 11} width={64 * w} height="6" fill={accent} fillOpacity={0.35 + w * 0.5} />
      </g>
    ))}
    <line x1="110" y1="34" x2="110" y2="148" stroke={ink} strokeWidth="0.8" />
    <Label x={142} y={162}>10 weighted dimensions</Label>
    <path d="M 176 92 H 200" stroke={scaffold} strokeWidth="0.8" strokeDasharray="3 2" />
    {/* scorecard with dial */}
    <rect x="202" y="50" width="76" height="84" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 214 106 A 26 26 0 0 1 266 106" stroke={scaffold} strokeWidth="2" strokeLinecap="round" />
    <path d="M 214 106 A 26 26 0 0 1 252.4 83.2" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
    <text x="240" y="104" textAnchor="middle" fontSize="8" fill={ink} fontFamily="serif" fontStyle="italic">score</text>
    <line x1="212" y1="118" x2="268" y2="118" stroke={ink} strokeWidth="0.8" />
    <line x1="212" y1="125" x2="256" y2="125" stroke={ink} strokeWidth="0.8" />
    <Label x={240} y={148}>Scorecard</Label>
    <Label x={240} y={44} fill={accent}>calibrated to stage</Label>
    <Mote path="M 88 83 H 110" dur="3s" />
    <Mote path="M 176 92 H 202" dur="3s" begin="1.5s" />
  </svg>
);

export const CASE_SCHEMATICS: Partial<Record<CaseId, React.FC>> = {
  purecode: PureCodeSchematic,
  autopilot: ShootOSSchematic,
  compoundiq: CompoundIQSchematic,
  'analytics-os': AnalyticsOSSchematic,
  pulsenote: PulseNoteSchematic,
  brandos: BrandOSSchematic,
};

export const CaseSchematic: React.FC<{ id: CaseId; className?: string }> = ({ id, className = '' }) => {
  const Drawing = CASE_SCHEMATICS[id];
  if (!Drawing) return null;
  return (
    <div className={className}>
      <Drawing />
    </div>
  );
};
