import React from 'react';
import { AlertTriangle, Check, CircleDashed, Tag } from 'lucide-react';

/**
 * Drawings for the Order Review page. All order data is fictional (the same made-up listing as the Order Intake
 * page: 214 Juniper Lane, Austin TX). What each drawing shows is what the module does in production.
 */

type CheckState = 'pass' | 'flag' | 'fixed';

const HERO_CHECKS: { name: string; state: CheckState; note?: string }[] = [
  { name: 'Profile complete', state: 'pass' },
  { name: 'Placeholder item', state: 'fixed', note: 'cancelled' },
  { name: 'Exteriors only', state: 'pass' },
  { name: 'Square footage', state: 'flag', note: '2,995 · tier edge' },
  { name: 'Lockbox code', state: 'pass' },
  { name: 'Note: contact / scope', state: 'flag', note: '“call me before”' },
  { name: 'Note: arrival time', state: 'pass' },
  { name: 'Floor plan variant', state: 'pass' },
  { name: 'Same-day order', state: 'pass' },
];

const StateIcon: React.FC<{ s: CheckState }> = ({ s }) =>
  s === 'pass' ? (
    <Check className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
  ) : s === 'flag' ? (
    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
  ) : (
    <span className="w-3.5 h-3.5 rounded-full bg-accent/80 inline-block" aria-hidden="true" />
  );

/** Hero plate: one new order, nine checks, the outcome. */
export const HeroReview: React.FC = () => (
  <div className="space-y-3">
    <div className="bg-white/85 border border-ink/10 rounded-sm p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">Order #24817 · 214 Juniper Lane</span>
        <span className="font-mono text-[9px] text-ink-muted/60">new · 4 min ago</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        {HERO_CHECKS.map((c) => (
          <li key={c.name} className="flex items-center gap-2 py-1.5 border-b border-ink/5">
            <StateIcon s={c.state} />
            <span className="font-sans text-[12.5px] text-ink">{c.name}</span>
            {c.note && <span className="ml-auto font-mono text-[9px] text-ink-muted truncate">{c.note}</span>}
          </li>
        ))}
      </ul>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/90 border border-ink/15 rounded-sm p-3 shadow-md">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent mb-1">Fixed on its own</div>
        <p className="font-sans text-[12px] text-ink leading-snug">Placeholder item cancelled · beds &amp; baths note added</p>
      </div>
      <div className="bg-white/90 border border-amber-700/30 rounded-sm p-3 shadow-md">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-800 mb-1">One ticket</div>
        <p className="font-sans text-[12px] text-ink leading-snug">2 issues for a person · tagged Flagged</p>
      </div>
    </div>
  </div>
);

/** The ticket a person gets — one per flagged order. */
export const TicketMock: React.FC = () => (
  <div className="bg-white text-ink border border-ink/10 rounded-sm shadow-md overflow-hidden">
    <div className="px-5 py-3 border-b border-ink/10">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">To: your order queue</div>
      <div className="font-sans text-[14px] font-semibold mt-1">Order Review — Order #24817 — 214 Juniper Lane</div>
    </div>
    <div className="px-5 py-4 space-y-4">
      <section>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-800 mb-2">Issues requiring follow-up</div>
        <ul className="space-y-1.5 font-sans text-[13px] leading-snug">
          <li>• Square footage 2,995 sits on a pricing-tier edge — public records show 2,140 sq ft (3 beds, 2 baths).</li>
          <li>• Appointment notes ask the photographer to call the agent before arriving.</li>
        </ul>
      </section>
      <section>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mb-2">Could not verify</div>
        <p className="font-sans text-[13px] text-ink-muted">— nothing</p>
      </section>
      <section>
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-green-800 mb-2">Completed by Order Review — no action needed</div>
        <ul className="space-y-1.5 font-sans text-[13px] leading-snug">
          <li>• Placeholder item cancelled.</li>
          <li>• “Per public records: 3 Beds, 2 Baths” added to the appointment notes.</li>
        </ul>
      </section>
    </div>
  </div>
);

/** The three ways a review ends. */
export const OUTCOMES: { name: string; Icon: React.ComponentType<{ className?: string }>; tone: string; body: string }[] = [
  {
    name: 'Reviewed',
    Icon: Tag,
    tone: 'text-green-700',
    body: 'Every check passed. The order is tagged as reviewed and logged. Nobody hears about it — there was nothing to hear.',
  },
  {
    name: 'Flagged',
    Icon: AlertTriangle,
    tone: 'text-amber-700',
    body: 'One or more issues. One ticket goes to your order queue, then the order is tagged as flagged so it is never ticketed twice.',
  },
  {
    name: 'Not finished',
    Icon: CircleDashed,
    tone: 'text-ink-muted',
    body: 'A field couldn’t be read, a fix didn’t take, or the platform was slow. No tag — the next sweep looks again. A field it can’t read is never counted as a pass.',
  },
];


/* ---- Small mock panels used inside the pipeline cards (Fig. iv). Same fictional order as the hero. ---- */

const Field: React.FC<{ k: string; v: React.ReactNode; hot?: boolean; mono?: boolean }> = ({ k, v, hot, mono }) => (
  <div className={`grid grid-cols-[6.5rem_1fr] gap-3 items-baseline py-1.5 border-b border-ink/5 last:border-0 ${hot ? 'bg-accent/[0.06] -mx-2 px-2 rounded-sm' : ''}`}>
    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/70">{k}</span>
    <span className={`${mono ? 'font-mono text-[11px]' : 'font-sans text-[13px]'} text-ink leading-snug`}>{v}</span>
  </div>
);

/** Step 01 — the orders list: untagged orders are picked up; anything tagged is left alone. */
export const SweepPanel: React.FC = () => {
  const rows: { n: string; addr: string; tag?: string; pick: boolean }[] = [
    { n: '24817', addr: '214 Juniper Lane', pick: true },
    { n: '24816', addr: '9 Alder Court', tag: 'Reviewed', pick: false },
    { n: '24815', addr: '1730 Ridge Road', pick: true },
    { n: '24814', addr: '55 Marsh Hollow', tag: 'Rush', pick: false },
  ];
  return (
    <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-ink/10 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">All orders · newest first</div>
      {rows.map((r) => (
        <div key={r.n} className={`flex items-center gap-3 px-3 py-2 border-b border-ink/5 last:border-0 ${r.pick ? 'bg-accent/[0.06]' : ''}`}>
          <span className="font-mono text-[11px] text-ink">#{r.n}</span>
          <span className="font-sans text-[12.5px] text-ink truncate">{r.addr}</span>
          <span className="ml-auto shrink-0">
            {r.tag ? (
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-muted border border-ink/15 rounded-full px-2 py-0.5">{r.tag} · skip</span>
            ) : (
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-accent">untagged · review</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

/** Step 02 — what it reads from each order. */
export const ReadPanel: React.FC = () => (
  <div className="bg-white border border-ink/10 rounded-sm p-3">
    <Field k="Line items" v="Signature photos · Floor plan · Skip to add-on menu" hot />
    <Field k="Sq ft" v="2,995" />
    <Field k="Access" v="Lockbox (code below)" />
    <Field k="Code" v="4120" mono />
    <Field k="Appt. notes" v={<span className="font-mono text-[11px] leading-snug">Call me 30 min before you head over. Dog in the backyard.</span>} hot />
    <Field k="Profile notes" v="Profile complete" />
    <Field k="Requested" v="Thu, Nov 12 · 1:00 PM" />
    <Field k="Public record" v="2,140 sq ft · 3 bd · 2 ba" />
  </div>
);

/** Step 03 — every check ends one of three ways; "couldn't read" is never a pass. */
export const ResultsPanel: React.FC = () => {
  const items: { name: string; state: 'pass' | 'flag' | 'unread'; note: string }[] = [
    { name: 'Lockbox code', state: 'pass', note: 'code present' },
    { name: 'Square footage', state: 'flag', note: '2,995 · tier edge' },
    { name: 'Notes · patterns', state: 'flag', note: '“call me … before”' },
    { name: 'Notes · AI read', state: 'pass', note: 'no order change' },
    { name: 'Floor plan size', state: 'unread', note: 'field not read · look again' },
  ];
  const tone = { pass: 'text-green-700', flag: 'text-amber-800', unread: 'text-ink-muted' } as const;
  const word = { pass: 'pass', flag: 'flag', unread: 'can’t read' } as const;
  return (
    <ul className="space-y-1.5">
      {items.map((c) => (
        <li key={c.name} className="flex items-center gap-3 bg-white border border-ink/10 rounded-sm px-3 py-2">
          <span className={`w-16 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] ${tone[c.state]}`}>{word[c.state]}</span>
          <span className="font-sans text-[13px] text-ink">{c.name}</span>
          <span className="ml-auto hidden sm:inline font-mono text-[9px] text-ink-muted truncate">{c.note}</span>
        </li>
      ))}
    </ul>
  );
};

/** Step 04 — fixes made on the order, each confirmed by reading the order again. */
export const FixPanel: React.FC = () => (
  <div className="space-y-2">
    <div className="bg-white border border-ink/10 rounded-sm p-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">Line items</div>
      <div className="flex items-center justify-between py-1 font-sans text-[12.5px] text-ink-muted">
        <span className="line-through">Skip to add-on menu</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em]">cancelled</span>
      </div>
      <div className="flex items-center justify-between py-1 font-sans text-[12.5px] text-ink">
        <span>Signature photos · Floor plan</span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-green-700"><Check className="w-3 h-3" aria-hidden="true" />still there</span>
      </div>
    </div>
    <div className="bg-white border border-ink/10 rounded-sm p-3 font-mono text-[11px] leading-relaxed text-ink">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">Appointment notes</div>
      <span className="text-ink-muted">Call me 30 min before you head over. Dog in the backyard.</span>
      <br />
      <span className="bg-accent/10 rounded-sm px-1">Per public records: 3 Beds, 2 Baths. HOA property, check for amenities.</span>
    </div>
    <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-green-700">
      <Check className="w-3 h-3" aria-hidden="true" /> reloaded · both changes confirmed
    </div>
  </div>
);
