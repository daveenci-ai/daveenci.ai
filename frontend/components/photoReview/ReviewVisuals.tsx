import React from 'react';
import { Check, CircleHelp, Copy, Repeat, X } from 'lucide-react';

/**
 * Drawings for the Real-time Photo Review page (15 Oct 2026). All listing data is fictional, using the same made-up
 * addresses as the other module pages. The ticket follows the module's ticket builder (job-review-advanced ticket.js):
 * subject "Photo Review - Order N (K Issues)", the order and address first, then only the problem photos — position,
 * file name, link — near-duplicates as one line, and anything it couldn't check as one quiet line at the end.
 */

type TileState = 'ok' | 'bad' | 'dup' | 'checking' | 'queued';

const tileTone: Record<TileState, string> = {
  ok: 'border-green-700/40',
  bad: 'border-red-700 ring-1 ring-red-700/40',
  dup: 'border-accent ring-1 ring-accent/30',
  checking: 'border-ink/30 animate-pulse',
  queued: 'border-ink/10 opacity-50',
};

const Tile: React.FC<{ n: number; state: TileState; note?: string }> = ({ n, state, note }) => (
  <div className={`relative aspect-4/3 rounded-xs border bg-linear-to-br from-ink/5 to-ink/10 overflow-hidden ${tileTone[state]}`}>
    <svg viewBox="0 0 40 30" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <path d="M4 25 L14 13 L20 19 L27 10 L36 25 Z" fill="rgb(var(--color-ink) / 0.08)" />
      <circle cx="30" cy="8" r="2.5" fill="rgb(var(--color-ink) / 0.1)" />
    </svg>
    <span className="absolute left-1 top-0.5 font-mono text-[8px] text-ink-muted">{n}</span>
    <span className="absolute right-1 top-1">
      {state === 'ok' && <Check className="w-3 h-3 text-green-700" aria-hidden="true" />}
      {state === 'bad' && <X className="w-3 h-3 text-red-700" aria-hidden="true" />}
      {state === 'dup' && <Copy className="w-3 h-3 text-accent" aria-hidden="true" />}
    </span>
    {note && <span className="absolute inset-x-0 bottom-0 bg-white/85 px-1 font-mono text-[7.5px] text-ink truncate">{note}</span>}
  </div>
);

/** Hero plate: photos arriving on one listing, checked as they land. */
export const HeroUploads: React.FC = () => {
  const tiles: { state: TileState; note?: string }[] = [
    { state: 'ok' }, { state: 'ok' }, { state: 'ok' }, { state: 'ok' },
    { state: 'ok' }, { state: 'ok' }, { state: 'ok' }, { state: 'bad', note: 'out of focus' },
    { state: 'ok' }, { state: 'dup', note: 'near-dup' }, { state: 'dup', note: 'near-dup' }, { state: 'checking' },
  ];
  return (
    <div className="space-y-3">
      <div className="bg-white/90 border border-ink/10 rounded-xs shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-ink/10 flex items-center justify-between gap-3">
          <span className="font-sans text-[13px] font-semibold text-ink">214 Juniper Lane · photos arriving</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent shrink-0">checking</span>
        </div>
        <div className="p-4 grid grid-cols-4 gap-2">
          {tiles.map((t, i) => (
            <Tile key={i} n={i + 1} state={t.state} note={t.note} />
          ))}
        </div>
        <div className="px-4 py-3 border-t border-ink/10 font-mono text-[10px] text-ink-muted leading-relaxed">
          <div className="flex items-center gap-2"><X className="w-3 h-3 text-red-700 shrink-0" aria-hidden="true" />Image 8 — out of focus</div>
          <div className="flex items-center gap-2"><Copy className="w-3 h-3 text-accent shrink-0" aria-hidden="true" />Images 10 &amp; 11 — near-duplicates, keep one</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: '12', l: 'uploaded' },
          { n: '9', l: 'good' },
          { n: '2', l: 'issues so far' },
        ].map((s) => (
          <div key={s.l} className="bg-white/90 border border-ink/10 rounded-xs px-3 py-2 shadow-xs">
            <div className="font-serif text-xl text-ink leading-none">{s.n}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** The ticket a person gets — one per order, only when something is wrong. */
export const TicketMock: React.FC = () => (
  <div className="bg-white text-ink border border-ink/10 rounded-xs shadow-md overflow-hidden">
    <div className="px-5 py-3 border-b border-ink/10">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">To: your order queue</div>
      <div className="font-sans text-[14px] font-semibold mt-1">Photo Review - Order 20412 (3 Issues)</div>
    </div>
    <div className="px-5 py-4 font-mono text-[11.5px] leading-relaxed space-y-3">
      <div>
        <div>Order 20412 · 214 Juniper Lane</div>
        <div className="text-ink-muted">Listing: https://yourshop.aryeo.com/admin/listings/…/edit</div>
      </div>
      <div>
        <div>Image 8 (IMG_0418.jpg) — out of focus</div>
        <div className="text-ink-muted pl-3">https://cdn…/IMG_0418.jpg</div>
      </div>
      <div>
        <div>Images 10 &amp; 11 (IMG_0422.jpg / IMG_0423.jpg) — near-duplicates, keep one</div>
        <div className="text-ink-muted pl-3">https://cdn…/IMG_0422.jpg</div>
        <div className="text-ink-muted pl-3">https://cdn…/IMG_0423.jpg</div>
      </div>
      <div>
        <div>Image 19 (IMG_0436.jpg) — yard sign with a phone number readable</div>
        <div className="text-ink-muted pl-3">https://cdn…/IMG_0436.jpg</div>
      </div>
      <div className="text-ink-muted pt-2 border-t border-ink/5">Could not verify: noise on 2 images.</div>
    </div>
  </div>
);

/** The four ways a photo's result can end. */
export const OUTCOMES: { name: string; Icon: React.ComponentType<{ className?: string }>; tone: string; body: string }[] = [
  {
    name: 'Issue',
    Icon: X,
    tone: 'text-red-700',
    body: 'The photo goes on the order’s ticket by number, file name and link, with what is wrong in plain words — so the editor opens the right frame.',
  },
  {
    name: 'Couldn’t check',
    Icon: CircleHelp,
    tone: 'text-amber-700',
    body: 'A photo that wouldn’t load or a check that didn’t answer. One quiet line on the ticket — never counted as good, never a ticket on its own.',
  },
  {
    name: 'Good',
    Icon: Check,
    tone: 'text-green-700',
    body: 'Recorded, and nothing is sent. An order where every photo is good gets no ticket at all.',
  },
  {
    name: 'Said once',
    Icon: Repeat,
    tone: 'text-ink-muted',
    body: 'A finding is never ticketed twice, and a defect on a photo and its day-to-dusk or staged version is one line, not two.',
  },
];

/* ---- Small mock panels used inside the pipeline cards (Fig. iv). Same fictional listing as the hero. ---- */

/** Step 01 — photos picked up as they land on the listing. */
export const UploadPanel: React.FC = () => {
  const rows: { file: string; pos: number; state: 'checked' | 'checking' | 'new' }[] = [
    { file: 'IMG_0418.jpg', pos: 8, state: 'checked' },
    { file: 'IMG_0422.jpg', pos: 10, state: 'checked' },
    { file: 'IMG_0423.jpg', pos: 11, state: 'checking' },
    { file: 'IMG_0425.jpg', pos: 12, state: 'new' },
  ];
  const tone = { checked: 'text-green-700', checking: 'text-accent', new: 'text-ink-muted' } as const;
  const word = { checked: 'checked', checking: 'checking', new: 'just uploaded' } as const;
  return (
    <div className="bg-white border border-ink/10 rounded-xs overflow-hidden">
      <div className="px-3 py-2 border-b border-ink/10 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
        <span>214 Juniper Lane · listing photos</span>
        <span>in listing order</span>
      </div>
      {rows.map((r) => (
        <div key={r.file} className={`flex items-center gap-3 px-3 py-2 border-b border-ink/5 last:border-0 ${r.state === 'checking' ? 'bg-accent/6' : ''}`}>
          <span className="w-6 shrink-0 font-mono text-[10px] text-ink-muted">{r.pos}</span>
          <span className="font-mono text-[11.5px] text-ink truncate">{r.file}</span>
          <span className={`ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] ${tone[r.state]}`}>{word[r.state]}</span>
        </div>
      ))}
    </div>
  );
};

/** Step 02 — focus measured against the listing's own photos; near-duplicates by fingerprint. */
export const MeasurePanel: React.FC = () => {
  const bars: { pos: number; v: number; flag?: boolean }[] = [
    { pos: 5, v: 78 }, { pos: 6, v: 70 }, { pos: 7, v: 82 }, { pos: 8, v: 22, flag: true }, { pos: 9, v: 74 }, { pos: 10, v: 68 },
  ];
  return (
    <div className="space-y-2">
      <div className="bg-white border border-ink/10 rounded-xs p-3">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mb-2">Sharpness · against this listing</div>
        <div className="flex items-end gap-2 h-16">
          {bars.map((b) => (
            <div key={b.pos} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
              <div className={`w-full rounded-t-xs ${b.flag ? 'bg-red-700/60' : 'bg-green-700/35'}`} style={{ height: `${b.v * 0.75}%` }} />
              <span className={`font-mono text-[9px] ${b.flag ? 'text-red-800' : 'text-ink-muted'}`}>{b.pos}</span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[10px] text-ink-muted mt-2">Image 8 well below the set → AI second look: out of focus</div>
      </div>
      <div className="bg-white border border-ink/10 rounded-xs px-3 py-2 flex items-center gap-3">
        <Copy className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
        <span className="font-sans text-[12.5px] text-ink">Images 10 &amp; 11 — same fingerprint</span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-accent shrink-0">keep one</span>
      </div>
    </div>
  );
};

/** Step 03 — one AI look per photo, every check asked at once: photos × checks. */
export const VisionPanel: React.FC = () => {
  const checks = ['Verticals', 'Framing', 'Angle', 'Sun', 'Signs'];
  const rows: { pos: number; cells: ('g' | 'b' | 'i')[] }[] = [
    { pos: 17, cells: ['g', 'g', 'g', 'g', 'g'] },
    { pos: 18, cells: ['g', 'g', 'g', 'i', 'g'] },
    { pos: 19, cells: ['g', 'g', 'g', 'g', 'b'] },
    { pos: 20, cells: ['g', 'g', 'g', 'g', 'g'] },
  ];
  const dot = { g: 'bg-green-700/45', b: 'bg-red-700', i: 'bg-amber-500' } as const;
  return (
    <div className="bg-white border border-ink/10 rounded-xs p-3 overflow-x-auto">
      <table className="w-full font-mono text-[10px] text-ink-muted">
        <thead>
          <tr>
            <th className="text-left font-normal pb-2 pr-2">#</th>
            {checks.map((c) => (
              <th key={c} className="font-normal pb-2 px-1 text-center uppercase tracking-[0.08em] text-[8.5px]">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.pos} className="border-t border-ink/5">
              <td className="py-1.5 pr-2 text-ink">{r.pos}</td>
              {r.cells.map((c, i) => (
                <td key={i} className="py-1.5 px-1 text-center">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${dot[c]}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="font-mono text-[10px] text-ink-muted mt-2">
        19 · signs: <span className="text-ink">yard sign, phone number readable</span>
      </div>
    </div>
  );
};

/** Step 04 — the ticket, short form. */
export const TicketPanel: React.FC = () => (
  <div className="space-y-2">
    <div className="bg-white border border-ink/10 rounded-xs p-3 font-mono text-[11px] leading-relaxed text-ink">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted mb-1.5">Photo Review - Order 20412 (3 Issues)</div>
      <div>Image 8 — out of focus</div>
      <div>Images 10 &amp; 11 — near-duplicates, keep one</div>
      <div>Image 19 — yard sign with a phone number</div>
      <div className="text-ink-muted mt-1">Could not verify: noise on 2 images.</div>
    </div>
    <div className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-green-700">
      <Check className="w-3 h-3" aria-hidden="true" /> 9 Alder Court · all good · nothing sent
    </div>
  </div>
);
