import React from 'react';
import { Check, CircleDashed, CircleHelp, X } from 'lucide-react';

/**
 * Drawings for the Daily Report page (15 Oct 2026). All listing data is fictional, using the same made-up
 * addresses as the Order Intake and Order Review pages. The report's shape follows the module's report builder:
 * missing items first, then could not verify, then not checked, every complete listing as one line, and the
 * counts last. Image sub-types are read from the delivered files' names; there is no vision call.
 */

/** Hero plate: the morning report as it lands. */
export const HeroReport: React.FC = () => (
  <div className="space-y-3">
    <div className="bg-white/90 border border-ink/10 rounded-xs shadow-xs overflow-hidden">
      <div className="px-4 py-3 border-b border-ink/10 flex items-center justify-between gap-3">
        <span className="font-sans text-[13px] font-semibold text-ink">Daily Report · Thu 11-12 · 2 issues</span>
        <span className="font-mono text-[9px] text-ink-muted/70 shrink-0">8:41 AM</span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <section>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-800 mb-1.5">Missing items (1) · hold the delivery</div>
          <div className="font-sans text-[13px] text-ink">214 Juniper Lane</div>
          <div className="font-mono text-[10px] text-ink-muted mt-0.5">Ordered: Signature photos, Aerial add-on, Floor plan</div>
          <ul className="mt-1.5 space-y-1">
            <li className="flex items-center gap-2 font-sans text-[12.5px] text-ink"><X className="w-3.5 h-3.5 text-red-700 shrink-0" aria-hidden="true" />Aerial image — no file named AERIAL</li>
            <li className="flex items-center gap-2 font-sans text-[12.5px] text-ink"><X className="w-3.5 h-3.5 text-red-700 shrink-0" aria-hidden="true" />Floor plan — missing</li>
          </ul>
        </section>
        <section className="pt-3 border-t border-ink/5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-800 mb-1.5">Could not verify (1) · check by hand</div>
          <div className="flex items-center gap-2 font-sans text-[12.5px] text-ink"><CircleHelp className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />1730 Ridge Road — property website page didn’t load</div>
        </section>
        <section className="pt-3 border-t border-ink/5">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-green-800 mb-1.5">Complete (14)</div>
          <div className="flex items-center gap-2 font-sans text-[12.5px] text-ink-muted"><Check className="w-3.5 h-3.5 text-green-700 shrink-0" aria-hidden="true" />9 Alder Court — all 4 deliverables present</div>
          <div className="font-mono text-[10px] text-ink-muted/60 mt-1 pl-5.5">+ 13 more, one line each</div>
        </section>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {[
        { n: '16', l: 'in scope' },
        { n: '16', l: 'reviewed' },
        { n: '0', l: 'not checked' },
      ].map((s) => (
        <div key={s.l} className="bg-white/90 border border-ink/10 rounded-xs px-3 py-2 shadow-xs">
          <div className="font-serif text-xl text-ink leading-none">{s.n}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted mt-1">{s.l}</div>
        </div>
      ))}
    </div>
  </div>
);

/** The full report a person gets — one email a day, which your ticket system turns into one ticket. */
export const ReportMock: React.FC = () => (
  <div className="bg-white text-ink border border-ink/10 rounded-xs shadow-md overflow-hidden">
    <div className="px-5 py-3 border-b border-ink/10">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">To: your order queue</div>
      <div className="font-sans text-[14px] font-semibold mt-1">Daily Report — 11-12-2026 — (2 Issues)</div>
    </div>
    <div className="px-5 py-4 font-mono text-[11.5px] leading-relaxed space-y-3">
      <div className="text-ink-muted">Run: 6:42 AM · delivery window 9:00 AM · hold flagged until 11:30 AM</div>
      <section>
        <div className="text-red-800">MISSING ITEMS (1) — hold these deliveries</div>
        <div className="mt-1">1) 214 Juniper Lane</div>
        <div className="text-ink-muted pl-3">Ordered: Signature photos, Aerial add-on, Floor plan</div>
        <div className="pl-3">✗ Aerial image — MISSING (no file named AERIAL)</div>
        <div className="pl-6 text-ink-muted">as of 6:18 — 38 images on the listing</div>
        <div className="pl-3">✗ Floor plan — MISSING</div>
      </section>
      <section>
        <div className="text-amber-800">COULD NOT VERIFY (1) — check these by hand</div>
        <div className="mt-1">2) 1730 Ridge Road</div>
        <div className="pl-3">? Custom property website — COULD NOT VERIFY: page didn’t load</div>
      </section>
      <section>
        <div className="text-green-800">COMPLETE (14)</div>
        <div className="pl-3 text-ink-muted">✓ 9 Alder Court — all 4 deliverables present</div>
        <div className="pl-3 text-ink-muted">✓ 55 Marsh Hollow — all 3 deliverables present</div>
        <div className="pl-3 text-ink-muted/60">…</div>
      </section>
      <section className="text-ink-muted">
        <div>── SUMMARY ──</div>
        <div>In scope 16 · Reviewed 16 · Missing 1 · Could not verify 1 · Complete 14 · Not checked 0</div>
      </section>
    </div>
  </div>
);

/** The four places a listing can land in the report. */
export const OUTCOMES: { name: string; Icon: React.ComponentType<{ className?: string }>; tone: string; body: string }[] = [
  {
    name: 'Missing items',
    Icon: X,
    tone: 'text-red-700',
    body: 'Something that was ordered isn’t on the listing. It leads the report, with what was ordered and exactly what is absent, so it can be held and fixed before it goes out.',
  },
  {
    name: 'Could not verify',
    Icon: CircleHelp,
    tone: 'text-amber-700',
    body: 'A panel didn’t load or a product isn’t in your matrix yet. It is listed as work for a person — never counted as complete.',
  },
  {
    name: 'Not checked',
    Icon: CircleDashed,
    tone: 'text-ink-muted',
    body: 'Anything the run didn’t reach before the cutoff, or that failed to open, is listed with a direct link — so unfinished work never looks clean.',
  },
  {
    name: 'Complete',
    Icon: Check,
    tone: 'text-green-700',
    body: 'Everything ordered is there. One line per listing, at the bottom — the report is about what needs a person.',
  },
];

/* ---- Small mock panels used inside the pipeline cards (Fig. iv). Same fictional listings as the hero. ---- */

/** Step 01 — the day's list, taken once from a saved view of your listings. */
export const ListPanel: React.FC = () => {
  const rows: { addr: string; state: 'done' | 'now' | 'queued' }[] = [
    { addr: '9 Alder Court', state: 'done' },
    { addr: '214 Juniper Lane', state: 'now' },
    { addr: '1730 Ridge Road', state: 'queued' },
    { addr: '55 Marsh Hollow', state: 'queued' },
  ];
  const tag = { done: 'checked', now: 'checking', queued: 'next sweep' } as const;
  const tone = { done: 'text-green-700', now: 'text-accent', queued: 'text-ink-muted' } as const;
  return (
    <div className="bg-white border border-ink/10 rounded-xs overflow-hidden">
      <div className="px-3 py-2 border-b border-ink/10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
        <span>Saved view · due for delivery (16)</span>
        <span>6:00 · snapshot</span>
      </div>
      {rows.map((r) => (
        <div key={r.addr} className={`flex items-center gap-3 px-3 py-2 border-b border-ink/5 last:border-0 ${r.state === 'now' ? 'bg-accent/6' : ''}`}>
          <span className="font-sans text-[12.5px] text-ink truncate">{r.addr}</span>
          <span className={`ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] ${tone[r.state]}`}>{tag[r.state]}</span>
        </div>
      ))}
    </div>
  );
};

const Row: React.FC<{ k: string; v: React.ReactNode; hot?: boolean }> = ({ k, v, hot }) => (
  <div className={`grid grid-cols-[6.5rem_1fr] gap-3 items-baseline py-1.5 border-b border-ink/5 last:border-0 ${hot ? 'bg-accent/6 -mx-2 px-2 rounded-xs' : ''}`}>
    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/70">{k}</span>
    <span className="font-sans text-[13px] text-ink leading-snug">{v}</span>
  </div>
);

/** Step 02 — what it reads from one listing. */
export const ListingPanel: React.FC = () => (
  <div className="bg-white border border-ink/10 rounded-xs p-3">
    <Row k="Ordered" v="Signature photos · Aerial add-on · Floor plan" hot />
    <Row k="Images" v="38" />
    <Row k="Video" v="0" />
    <Row k="Floor plans" v="0" hot />
    <Row k="Website" v="Custom address registered" />
    <Row
      k="File names"
      v={<span className="font-mono text-[11px] leading-snug">001_214-juniper-ln.jpg … 038_214-juniper-ln.jpg</span>}
      hot
    />
  </div>
);

/** Step 03 — the ordered products become a list of deliverables; each is present, missing or unreadable. */
export const MatrixPanel: React.FC = () => {
  const items: { name: string; from: string; state: 'ok' | 'missing' | 'unread' }[] = [
    { name: 'Images', from: 'Signature photos', state: 'ok' },
    { name: 'Aerial image', from: 'Aerial add-on', state: 'missing' },
    { name: 'Floor plan', from: 'Floor plan', state: 'missing' },
    { name: 'Property website', from: 'Signature photos', state: 'ok' },
  ];
  const tone = { ok: 'text-green-700', missing: 'text-red-800', unread: 'text-ink-muted' } as const;
  const word = { ok: 'present', missing: 'missing', unread: 'can’t read' } as const;
  return (
    <ul className="space-y-1.5">
      {items.map((c) => (
        <li key={c.name} className="flex items-center gap-3 bg-white border border-ink/10 rounded-xs px-3 py-2">
          <span className={`w-16 shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] ${tone[c.state]}`}>{word[c.state]}</span>
          <span className="font-sans text-[13px] text-ink">{c.name}</span>
          <span className="ml-auto hidden sm:inline font-mono text-[9px] text-ink-muted truncate">from: {c.from}</span>
        </li>
      ))}
    </ul>
  );
};

/** Step 04 — the report is written once, when the list is done or the cutoff arrives. */
export const SendPanel: React.FC = () => (
  <div className="space-y-2">
    <div className="bg-white border border-ink/10 rounded-xs p-3 font-mono text-[11px] leading-relaxed text-ink">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">Sweeps this morning</div>
      <div className="flex justify-between"><span>6:00 · list taken, 16 listings</span><span className="text-ink-muted">6 checked</span></div>
      <div className="flex justify-between"><span>6:10 · resumed</span><span className="text-ink-muted">11 checked</span></div>
      <div className="flex justify-between"><span>6:40 · list finished</span><span className="text-green-700">16 checked</span></div>
    </div>
    <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-green-700">
      <Check className="w-3 h-3" aria-hidden="true" /> one report sent · later sweeps send nothing
    </div>
  </div>
);
