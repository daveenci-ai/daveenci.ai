import React from 'react';

/**
 * One construction drawing per ShootOS module, in the register of CaseSchematics:
 * dashed scaffolds, ink for the mechanism, accent for the thing that moves, one
 * SMIL mote so each reads as a process. Pure SVG — identical in prerender and paint.
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

/** Order email → the platform's order form filling itself → order number read back. */
export const OrderIntakeSchematic: React.FC = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
    {/* the email */}
    <rect x="18" y="52" width="72" height="50" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <path d="M 18 52 L 54 78 L 90 52" stroke={ink} strokeWidth="1" />
    {[66, 74, 82].map((y) => <line key={y} x1="28" y1={y + 14} x2={y === 82 ? 60 : 80} y2={y + 14} stroke={scaffold} strokeWidth="1" />)}
    <Label x={54} y={116}>Concierge email</Label>
    {/* the order form */}
    <rect x="128" y="24" width="96" height="132" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <line x1="128" y1="38" x2="224" y2="38" stroke={ink} strokeWidth="1" />
    {['Address', 'Sq ft', 'Access · lockbox', 'Agent · by email', 'Package', 'Time slot'].map((t, i) => (
      <g key={t}>
        <rect x="136" y={46 + i * 17} width="80" height="11" rx="0.5" fill={scaffold} fillOpacity="0.35" stroke={scaffold} strokeWidth="0.6" />
        <rect x="136" y={46 + i * 17} width="80" height="11" rx="0.5" fill={accent} fillOpacity="0.14">
          <animate attributeName="width" values="0;80" dur="3.2s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
        </rect>
        <text x="140" y={54 + i * 17} fontSize="6" fill={muted} fontFamily="sans-serif">{t}</text>
        <path d={`M ${206} ${49 + i * 17} L ${209} ${52 + i * 17} L ${214} ${46 + i * 17}`} stroke={success} strokeWidth="1.2">
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.55;0.6;1" dur="3.2s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
        </path>
      </g>
    ))}
    <Label x={176} y={168}>Order form · no payment step</Label>
    {/* read-back */}
    <rect x="248" y="70" width="36" height="24" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
    <text x="266" y="80" textAnchor="middle" fontSize="6" fill={muted} fontFamily="sans-serif">order</text>
    <text x="266" y="89" textAnchor="middle" fontSize="7" fill={ink} fontFamily="monospace">#20726</text>
    <Label x={266} y={106}>Read back</Label>
    <line x1="90" y1="78" x2="128" y2="78" stroke={scaffold} strokeWidth="0.8" strokeDasharray="2 3" />
    <line x1="224" y1="82" x2="248" y2="82" stroke={scaffold} strokeWidth="0.8" strokeDasharray="2 3" />
    <Mote path="M 90 78 L 128 78" dur="3.2s" />
    <Mote path="M 224 82 L 248 82" dur="3.2s" begin="1.8s" color={success} />
  </svg>
);

/** One order, eight checks, safe repairs, one ticket for what a person must decide. */
export const OrderReviewSchematic: React.FC = () => {
  const checks = ['Notes', 'Add-on', 'Exteriors', 'Sq ft', 'Lockbox', 'Appt note', 'Floor plan', 'AI read'];
  return (
    <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* the order */}
      <rect x="18" y="40" width="70" height="100" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
      <line x1="18" y1="54" x2="88" y2="54" stroke={ink} strokeWidth="1" />
      {[64, 76, 88, 100, 112].map((y, i) => <line key={y} x1="26" y1={y} x2={i === 2 ? 62 : 78} y2={y} stroke={scaffold} strokeWidth="1" />)}
      <Label x={53} y={154}>Order · every 10 min</Label>
      {/* the eight checks */}
      {checks.map((c, i) => {
        const y = 32 + i * 16;
        const state = i === 3 ? 'flag' : i === 6 ? 'fix' : 'ok';
        return (
          <g key={c}>
            <line x1="88" y1={90} x2="118" y2={y + 4} stroke={scaffold} strokeWidth="0.5" strokeDasharray="2 3" />
            <rect x="118" y={y - 2} width="12" height="12" rx="1" fill="white" stroke={ink} strokeWidth="1" />
            {state === 'ok' && <path d={`M 121 ${y + 4} L 123.5 ${y + 6.5} L 127.5 ${y + 1.5}`} stroke={success} strokeWidth="1.3" />}
            {state === 'flag' && <path d={`M 121 ${y + 1} L 127 ${y + 7} M 127 ${y + 1} L 121 ${y + 7}`} stroke={danger} strokeWidth="1.3" />}
            {state === 'fix' && <circle cx="124" cy={y + 4} r="2.4" fill={accent} />}
            <text x="136" y={y + 7} fontSize="6.5" fill={state === 'flag' ? ink : muted} fontFamily="sans-serif">{c}</text>
          </g>
        );
      })}
      <Label x={150} y={172}>8 checks</Label>
      {/* outcomes */}
      <rect x="214" y="42" width="66" height="30" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
      <path d="M 222 57 L 227 62 L 236 50" stroke={success} strokeWidth="1.5" />
      <text x="244" y="55" fontSize="6.5" fill={ink} fontFamily="sans-serif">Reviewed</text>
      <text x="244" y="64" fontSize="6" fill={muted} fontFamily="sans-serif">tag + log</text>
      <rect x="214" y="86" width="66" height="30" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
      <circle cx="229" cy="101" r="5" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1.2" />
      <text x="244" y="99" fontSize="6.5" fill={ink} fontFamily="sans-serif">Repaired</text>
      <text x="244" y="108" fontSize="6" fill={muted} fontFamily="sans-serif">read back</text>
      <rect x="214" y="130" width="66" height="30" rx="1" fill="white" stroke={danger} strokeWidth="1.2" />
      <text x="247" y="143" textAnchor="middle" fontSize="6.5" fill={ink} fontFamily="sans-serif">One ticket</text>
      <text x="247" y="152" textAnchor="middle" fontSize="6" fill={muted} fontFamily="sans-serif">for a person</text>
      <line x1="190" y1="80" x2="214" y2="57" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 3" />
      <line x1="190" y1="80" x2="214" y2="101" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 3" />
      <line x1="190" y1="80" x2="214" y2="145" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 3" />
      <Mote path="M 88 90 L 118 84" dur="3.5s" />
      <Mote path="M 190 80 L 214 145" dur="3.5s" begin="1.6s" color={danger} />
    </svg>
  );
};

/** The morning: everything due for delivery, sorted — complete, missing, urgent — into one report before nine. */
export const DailyReviewSchematic: React.FC = () => {
  const rows: Array<[number, 'ok' | 'missing' | 'urgent']> = [[64, 'ok'], [58, 'ok'], [44, 'missing'], [66, 'ok'], [30, 'urgent'], [62, 'ok'], [50, 'missing'], [68, 'ok']];
  return (
    <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
      {/* the clock line */}
      <line x1="18" y1="150" x2="200" y2="150" stroke={scaffold} strokeWidth="0.8" />
      {['6:00', '7:00', '8:00', '9:00'].map((t, i) => (
        <g key={t}>
          <line x1={26 + i * 56} y1="146" x2={26 + i * 56} y2="154" stroke={muted} strokeWidth="0.8" />
          <Label x={26 + i * 56} y={166} fill={i === 3 ? ink : muted}>{t}</Label>
        </g>
      ))}
      <line x1="194" y1="30" x2="194" y2="150" stroke={ink} strokeWidth="0.8" strokeDasharray="3 3" />
      <Label x={194} y={24} fill={ink}>Delivery window</Label>
      {/* the listings, audited through the morning */}
      {rows.map(([h, s], i) => {
        const x = 26 + i * 20;
        const color = s === 'ok' ? success : s === 'missing' ? accent : danger;
        return (
          <g key={i}>
            <rect x={x} y={140 - h} width="12" height={h} fill={color} fillOpacity={s === 'ok' ? 0.35 : 0.6} stroke={color} strokeWidth="0.8">
              <animate attributeName="opacity" values="0;1;1" keyTimes="0;0.15;1" dur="5s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
            </rect>
            {s !== 'ok' && <text x={x + 6} y={132 - h} textAnchor="middle" fontSize="7" fill={color} fontFamily="serif" fontStyle="italic">{s === 'missing' ? '−1' : '!'}</text>}
          </g>
        );
      })}
      <Label x={100} y={40}>Every listing due today</Label>
      {/* the report */}
      <rect x="216" y="48" width="66" height="92" rx="1" fill="white" stroke={ink} strokeWidth="1.2" />
      <line x1="216" y1="62" x2="282" y2="62" stroke={ink} strokeWidth="1" />
      <text x="249" y="58" textAnchor="middle" fontSize="6.5" fill={ink} fontFamily="sans-serif">Daily Report</text>
      {[['Complete', success, '6'], ['Missing items', accent, '2'], ['Urgent', danger, '1'], ['Not checked', muted, '0']].map(([t, c, n], i) => (
        <g key={t as string}>
          <circle cx="224" cy={73 + i * 15} r="2.4" fill={c as string} />
          <text x="230" y={75.5 + i * 15} fontSize="6" fill={muted} fontFamily="sans-serif">{t}</text>
          <text x="276" y={75.5 + i * 15} textAnchor="end" fontSize="6.5" fill={ink} fontFamily="monospace">{n}</text>
        </g>
      ))}
      <Label x={249} y={152}>One report · 8:45</Label>
      <Mote path="M 26 150 L 194 150" dur="5s" />
      <Mote path="M 194 100 L 216 100" dur="5s" begin="3.6s" color={ink} />
    </svg>
  );
};

/** A delivered set, every frame looked at; the one that is wrong is named. */
export const PhotoReviewSchematic: React.FC = () => {
  const cells = Array.from({ length: 12 }, (_, i) => i);
  const bad = 7;
  const dup = 10;
  return (
    <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" aria-hidden="true">
      {cells.map((i) => {
        const x = 20 + (i % 4) * 42;
        const y = 34 + Math.floor(i / 4) * 34;
        const isBad = i === bad;
        const isDup = i === dup || i === dup - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width="36" height="26" rx="1" fill="white" stroke={isBad ? danger : isDup ? accent : ink} strokeWidth={isBad ? 1.4 : 0.9} />
            <path d={`M ${x + 4} ${y + 20} L ${x + 13} ${y + 10} L ${x + 19} ${y + 16} L ${x + 25} ${y + 8} L ${x + 32} ${y + 20}`} stroke={isBad ? danger : scaffold} strokeWidth={isBad ? 1 : 1.2} strokeOpacity={isBad ? 0.6 : 1} />
            <circle cx={x + 27} cy={y + 7} r="2" fill={isBad ? danger : scaffold} fillOpacity={isBad ? 0.5 : 1} />
            {isBad && <text x={x + 18} y={y + 24} textAnchor="middle" fontSize="6" fill={danger} fontFamily="serif" fontStyle="italic">blur</text>}
            <rect x={x} y={y} width="36" height="26" rx="1" fill={accent} fillOpacity="0.12">
              <animate attributeName="opacity" values="0;1;0;0" keyTimes="0;0.05;0.12;1" dur="6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            </rect>
          </g>
        );
      })}
      <path d={`M ${20 + 2 * 42 + 36} ${34 + 2 * 34 + 13} L ${20 + 3 * 42} ${34 + 2 * 34 + 13}`} stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
      <Label x={104} y={150}>Every frame · focus, exposure, duplicates</Label>
      {/* the ticket */}
      <rect x="206" y="52" width="76" height="70" rx="1" fill="white" stroke={danger} strokeWidth="1.2" />
      <text x="244" y="66" textAnchor="middle" fontSize="6.5" fill={ink} fontFamily="sans-serif">One ticket</text>
      <line x1="214" y1="72" x2="274" y2="72" stroke={scaffold} strokeWidth="0.8" />
      <text x="214" y="84" fontSize="6" fill={muted} fontFamily="sans-serif">photo 08 · blur</text>
      <text x="214" y="96" fontSize="6" fill={muted} fontFamily="sans-serif">photos 10–11 · duplicate</text>
      <text x="214" y="108" fontSize="6" fill={ink} fontFamily="serif" fontStyle="italic">only when</text>
      <text x="214" y="116" fontSize="6" fill={ink} fontFamily="serif" fontStyle="italic">something is wrong</text>
      <line x1={20 + 3 * 42 + 36} y1={34 + 34 + 13} x2="206" y2="87" stroke={scaffold} strokeWidth="0.6" strokeDasharray="2 3" />
      <Mote path={`M ${20 + 3 * 42 + 36} ${34 + 34 + 13} L 206 87`} dur="6s" begin="3.2s" color={danger} />
    </svg>
  );
};

export const MODULE_SCHEMATICS: Record<string, React.FC> = {
  'order-intake': OrderIntakeSchematic,
  'order-review': OrderReviewSchematic,
  'daily-review': DailyReviewSchematic,
  'photo-review': PhotoReviewSchematic,
};

export const ModuleSchematic: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  const Drawing = MODULE_SCHEMATICS[id];
  if (!Drawing) return null;
  return (
    <div className={className}>
      <Drawing />
    </div>
  );
};
