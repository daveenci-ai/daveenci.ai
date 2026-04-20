import React, { useState } from 'react';
import { Hash, Send, Monitor } from 'lucide-react';
import { MobileFolioScene } from './MobileFolioScene';

interface Channel {
  id: 'slack' | 'telegram' | 'web';
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  lead: string;
  detail: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'slack',
    icon: Hash,
    name: 'Slack',
    lead: 'Threaded approvals in-channel.',
    detail: "Your team posts progress, flags blockers, and pings you when a gate opens. Reply in-thread — no new app.",
  },
  {
    id: 'telegram',
    icon: Send,
    name: 'Telegram',
    lead: 'One-tap approvals on the go.',
    detail: 'Quick pings when the team needs a decision. Approve, pause, or ask for context — from your phone.',
  },
  {
    id: 'web',
    icon: Monitor,
    name: 'Web',
    lead: 'The full command surface.',
    detail: 'Live activity feed, queue, per-agent logs. Approve, pause, reroute — one click.',
  },
];

export const MobileControls: React.FC = () => {
  const [activeId, setActiveId] = useState<Channel['id']>('slack');
  const active = CHANNELS.find((c) => c.id === activeId)!;
  const Icon = active.icon;

  return (
    <MobileFolioScene id="controls" eyebrow="Folio V — The Controls">
      <h2 className="font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2 tracking-tight">
        Where you
        <br />
        <span className="italic text-ink-muted/70">already work.</span>
      </h2>

      <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-8">
        Each team listens on Slack, Telegram, and the web panel. Approve, pause, reroute from wherever you are.
      </p>

      {/* Channel chips */}
      <div className="flex gap-2 mb-6">
        {CHANNELS.map((c) => {
          const ChipIcon = c.icon;
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-all ${
                isActive
                  ? 'bg-accent/10 border-accent text-accent ring-1 ring-accent'
                  : 'bg-white/50 border-ink/10 text-ink active:bg-accent/5'
              }`}
              aria-pressed={isActive}
            >
              <ChipIcon className="w-4 h-4" />
              <span className="font-serif text-sm">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active channel detail */}
      <article
        key={activeId}
        className="relative bg-white/60 border border-ink/10 rounded-sm p-5 shadow-sm shadow-ink/5 animate-in fade-in duration-200"
      >
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-4 h-4 text-accent" />
          <span className="font-serif text-xl text-ink">{active.name}</span>
        </div>
        <p className="font-serif italic text-lg text-ink leading-snug mb-2">{active.lead}</p>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed">{active.detail}</p>
      </article>
    </MobileFolioScene>
  );
};
