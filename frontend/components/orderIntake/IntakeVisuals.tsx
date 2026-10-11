import React from 'react';
import { ArrowDown, Check, Lock, MapPin, Star } from 'lucide-react';

/**
 * Drawings for the Concierge Order Intake page. Every value shown is fictional (one made-up listing used
 * throughout: 214 Juniper Lane, Austin TX). What each drawing shows is what the module does in production —
 * see the page's comments for the source of each claim.
 */

const LISTING = {
  address: '214 Juniper Lane, Unit 4B, Austin, TX 78704',
  sqft: '2,140',
  beds: '3 bd · 2 ba',
  pkg: 'Reach',
  selections: 'Video tour, 3D tour',
  requested: 'Thu, Nov 12 · 1:00 PM Central',
  lockbox: 'Yes · code 4120 · front door',
  agent: 'Dana Ruiz · dana@realty.example',
  notes: 'Dog in the backyard — please keep the gate closed.',
};

export const Row: React.FC<{ k: string; v: React.ReactNode; hot?: boolean; mono?: boolean }> = ({ k, v, hot, mono }) => (
  <div className={`grid grid-cols-[6.5rem_1fr] gap-3 items-baseline py-1.5 border-b border-ink/5 last:border-0 ${hot ? 'bg-accent/[0.06] -mx-2 px-2 rounded-sm' : ''}`}>
    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/70">{k}</span>
    <span className={`${mono ? 'font-mono text-[11px]' : 'font-sans text-[13px]'} text-ink leading-snug`}>{v}</span>
  </div>
);

/** Hero plate: the concierge email in, the placed order out, with the order number read back. */
export const HeroPipeline: React.FC = () => (
  <div className="space-y-3">
    <div className="bg-white/80 border border-ink/10 rounded-sm p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">Inbox · new concierge order</span>
        <span className="font-mono text-[9px] text-ink-muted/60">9:42 AM</span>
      </div>
      <Row k="Address" v={LISTING.address} />
      <Row k="Package" v={`${LISTING.pkg} + ${LISTING.selections}`} />
      <Row k="Requested" v={LISTING.requested} />
      <Row k="Lockbox" v={LISTING.lockbox} />
    </div>
    <div className="flex items-center justify-center gap-3 text-accent">
      <span className="h-px w-10 bg-accent/30" />
      <ArrowDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
      <span className="font-mono text-[9px] uppercase tracking-[0.2em]">read · fill · book · verify</span>
      <span className="h-px w-10 bg-accent/30" />
    </div>
    <div className="bg-white/90 border border-ink/15 rounded-sm p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">Order placed</span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-green-700">
          <Check className="w-3 h-3" aria-hidden="true" /> verified
        </span>
      </div>
      <Row k="Order #" v="24817 — read back from the platform" mono hot />
      <Row k="Booked" v="Thu, Nov 12 · 1:30 PM Central" />
      <Row k="Agent" v="found by email" />
    </div>
  </div>
);

/** Fig. — the email, field by field. */
export const ParsedEmail: React.FC = () => (
  <div className="bg-white/85 border border-ink/10 rounded-sm p-5 shadow-sm">
    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted mb-3">What it reads from every order email</div>
    <Row k="Address" v={LISTING.address} hot />
    <Row k="Sq ft" v={LISTING.sqft} />
    <Row k="Beds / baths" v={LISTING.beds} />
    <Row k="Package" v={LISTING.pkg} hot />
    <Row k="Selections" v={LISTING.selections} hot />
    <Row k="Requested" v={LISTING.requested} hot />
    <Row k="Lockbox" v={LISTING.lockbox} />
    <Row k="Agent" v={LISTING.agent} hot />
    <Row k="Office area" v="South Austin" />
    <Row k="Agent notes" v={LISTING.notes} />
  </div>
);

/** Small mock panels used inside the pipeline cards. */
export const AddressPanel: React.FC = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 bg-white border border-ink/15 rounded-sm px-3 py-2">
      <MapPin className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
      <span className="font-sans text-[13px] text-ink truncate">214 Juniper Lane, Austin, TX 78704</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-green-50/70 border border-green-700/20 rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-green-800">Map shown · accepted</div>
      <div className="bg-white border border-ink/10 rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">Unit 4B · email wins</div>
    </div>
  </div>
);

export const FormPanel: React.FC = () => (
  <div className="bg-white border border-ink/10 rounded-sm p-3">
    <Row k="Sq ft" v={LISTING.sqft} />
    <Row k="Access" v="Lockbox" />
    <Row k="Code" v={<span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" aria-hidden="true" />4120</span>} />
    <Row k="Region" v="from the office's area" />
    <Row k="Appt. notes" v={<span className="font-mono text-[11px] leading-snug">Lockbox available: Yes · Code: 4120 · Location: front door · Notes from agent: Dog in the backyard…</span>} />
  </div>
);

export const ServicesPanel: React.FC = () => (
  <div className="space-y-2">
    <div className="bg-white border border-ink/10 rounded-sm px-3 py-2 flex items-center justify-between">
      <span className="font-sans text-[13px] text-ink">dana@realty.example</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-green-700">agent on file</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {['Reach package', 'Video tour · TX', '3D tour · TX'].map((s) => (
        <span key={s} className="font-mono text-[10px] uppercase tracking-[0.1em] bg-accent/10 border border-accent/20 text-ink rounded-full px-3 py-1">{s}</span>
      ))}
    </div>
  </div>
);

export const SlotsPanel: React.FC = () => {
  const slots = ['11:00 AM', '12:30 PM', '1:30 PM', '3:00 PM', '4:30 PM'];
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Thu, Nov 12 · Central</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">asked 1:00 PM · ±3 h</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {slots.map((s) => (
          <span
            key={s}
            className={`text-center font-mono text-[10px] rounded-sm py-1.5 border ${s === '1:30 PM' ? 'bg-accent text-white border-accent' : 'bg-white text-ink-muted border-ink/10'}`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

export const VerifyPanel: React.FC = () => (
  <ol className="space-y-1.5">
    {[
      ['Claim saved', 'before the click'],
      ['Submit', 'no payment step'],
      ['Order #24817', 'read back · verified'],
    ].map(([a, b], i) => (
      <li key={a} className="flex items-center gap-3 bg-white border border-ink/10 rounded-sm px-3 py-2">
        <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] flex items-center justify-center">{i + 1}</span>
        <span className="font-sans text-[13px] text-ink">{a}</span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">{b}</span>
      </li>
    ))}
  </ol>
);

/** The inbox: every order email ends with a star or a label that says what happened. */
export const LABELS: { name: string; bg: string; text: string; when: string }[] = [
  { name: 'NEW CLIENT', bg: '#16a765', text: '#fff', when: 'The listing agent isn’t in your system yet, so the order waits for a person to add them.' },
  { name: 'NO AVAILABILITY', bg: '#cc3a21', text: '#fff', when: 'No open slot within three hours of the requested time.' },
  { name: 'ADDRESS ISSUE', bg: '#cc3a21', text: '#fff', when: 'The order form wouldn’t accept the address after three tries.' },
  { name: 'NEW REGION', bg: '#16a765', text: '#fff', when: 'The agent’s office is in an area you haven’t mapped to a region yet.' },
  { name: 'ERROR', bg: '#434343', text: '#fff', when: 'Something kept failing after three tries, about twenty minutes apart.' },
];

export const InboxMock: React.FC = () => {
  const rows: { subject: string; label?: string; star?: boolean }[] = [
    { subject: 'New concierge order — 214 Juniper Lane', star: true },
    { subject: 'New concierge order — 9 Alder Court', label: 'NEW CLIENT' },
    { subject: 'New concierge order — 1730 Ridge Road', star: true },
    { subject: 'New concierge order — 55 Marsh Hollow', label: 'NO AVAILABILITY' },
    { subject: 'New concierge order — 402 Pecan Street', star: true },
  ];
  return (
    <div className="bg-white border border-ink/10 rounded-sm shadow-md overflow-hidden">
      <div className="px-4 py-2.5 border-b border-ink/10 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">Orders inbox</div>
      {rows.map((r) => {
        const l = LABELS.find((x) => x.name === r.label);
        return (
          <div key={r.subject} className="flex items-center gap-3 px-4 py-2.5 border-b border-ink/5 last:border-0">
            <Star className={`w-4 h-4 shrink-0 ${r.star ? 'fill-amber-400 text-amber-500' : 'text-ink/20'}`} aria-hidden="true" />
            {l && (
              <span className="shrink-0 rounded-sm px-1.5 py-0.5 font-sans text-[10px] font-semibold" style={{ background: l.bg, color: l.text }}>
                {l.name}
              </span>
            )}
            <span className="font-sans text-[13px] text-ink truncate">{r.subject}</span>
          </div>
        );
      })}
    </div>
  );
};
