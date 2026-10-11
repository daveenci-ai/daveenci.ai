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
];

const StateIcon: React.FC<{ s: CheckState }> = ({ s }) =>
  s === 'pass' ? (
    <Check className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
  ) : s === 'flag' ? (
    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
  ) : (
    <span className="w-3.5 h-3.5 rounded-full bg-accent/80 inline-block" aria-hidden="true" />
  );

/** Hero plate: one new order, eight checks, the outcome. */
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

