import React from 'react';
import { Hash, Send, Monitor, Eye, Check } from 'lucide-react';
import { Section, ScrollReveal, Plate, FolioHeader } from './Shared';

const feedRows = [
  { label: 'architect', action: 'proposed PR #42', age: '00:12', status: 'done' as const },
  { label: 'reviewer', action: 'flagged token risk', age: '00:47', status: 'done' as const },
  { label: 'tester', action: 'all 42 tests pass', age: '01:23', status: 'done' as const },
  { label: 'pilot', action: 'awaiting approval', age: '01:58', status: 'gate' as const },
];

const ControlPanelDiagram: React.FC = () => (
  <Plate fig="v" title="The Control Panel">
    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
      {/* Browser window frame */}
      <rect x="12" y="12" width="276" height="226" rx="3" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />

      {/* Chrome bar */}
      <rect x="12" y="12" width="276" height="22" rx="3" fill="rgb(var(--color-base))" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
      <line x1="12" y1="34" x2="288" y2="34" stroke="rgb(var(--color-ink))" strokeWidth="0.5" opacity="0.3" />

      {/* Traffic lights */}
      <circle cx="22" cy="23" r="2" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
      <circle cx="30" cy="23" r="2" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
      <circle cx="38" cy="23" r="2" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />

      {/* URL bar */}
      <rect x="50" y="18" width="180" height="10" rx="1.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="0.4" opacity="0.5" />
      <text x="58" y="25" fontSize="5" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" letterSpacing="0.05em">daveenci.ai/control/purecode</text>

      {/* Status bar */}
      <circle cx="26" cy="50" r="2.8" fill="rgb(var(--color-status-success))">
        <animate attributeName="opacity" values="1;0.35;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="34" y="53" fontSize="8" fill="rgb(var(--color-ink))" fontFamily="serif" letterSpacing="0.1em" fontWeight="600">PureCode · 3 AGENTS ACTIVE</text>
      <text x="280" y="53" fontSize="6.5" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" textAnchor="end">1 pending</text>

      {/* Separator */}
      <line x1="20" y1="64" x2="280" y2="64" stroke="rgb(var(--color-ink))" strokeWidth="0.5" opacity="0.2" />

      {/* Section label */}
      <text x="20" y="78" fontSize="5.5" fill="rgb(var(--color-accent))" fontFamily="monospace" letterSpacing="0.25em">ACTIVITY</text>

      {/* Feed rows */}
      {feedRows.map((row, i) => {
        const y = 95 + i * 18;
        const isGate = row.status === 'gate';
        return (
          <g key={row.label}>
            {isGate ? (
              <circle cx="26" cy={y - 2.5} r="1.6" fill="rgb(var(--color-status-danger))">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.9s" repeatCount="indefinite" />
              </circle>
            ) : (
              <circle cx="26" cy={y - 2.5} r="1.4" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
            )}
            <text x="34" y={y} fontSize="7.5" fill="rgb(var(--color-ink))" fontFamily="serif" fontStyle="italic" letterSpacing="0.05em">{row.label}</text>
            <text x="86" y={y} fontSize="7.5" fill={isGate ? 'rgb(var(--color-status-danger))' : 'rgb(var(--color-ink-muted))'} fontFamily="serif">{row.action}</text>
            <text x="278" y={y} fontSize="6" fill="rgb(var(--color-ink-muted))" fontFamily="monospace" textAnchor="end">{row.age}</text>
          </g>
        );
      })}

      {/* Separator before actions */}
      <line x1="20" y1="180" x2="280" y2="180" stroke="rgb(var(--color-ink))" strokeWidth="0.5" opacity="0.2" />

      {/* Action buttons */}
      <rect x="20" y="194" width="80" height="28" rx="1.5" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.2">
        <animate attributeName="stroke-width" values="1.2;1.9;1.2" dur="1.8s" repeatCount="indefinite" />
      </rect>
      <text x="60" y="213" fontSize="7.5" textAnchor="middle" fill="rgb(var(--color-accent))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em" fontWeight="600">APPROVE</text>

      <rect x="110" y="194" width="80" height="28" rx="1.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1" />
      <text x="150" y="213" fontSize="7.5" textAnchor="middle" fill="rgb(var(--color-ink))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">PAUSE</text>

      <rect x="200" y="194" width="80" height="28" rx="1.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1" />
      <text x="240" y="213" fontSize="7.5" textAnchor="middle" fill="rgb(var(--color-ink))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">REROUTE</text>
    </svg>

    <div className="absolute top-2 -left-4 md:-left-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
      <Eye className="w-4 h-4 text-accent" />
      <span className="text-xs font-medium text-ink">Live oversight</span>
    </div>

    <div className="absolute bottom-2 -right-4 md:-right-6 bg-canvas shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
      <Check className="w-4 h-4 text-status-success" />
      <span className="text-xs font-medium text-ink">One-click control</span>
    </div>
  </Plate>
);

const channels = [
  {
    n: 'i',
    icon: Hash,
    name: 'Slack',
    lead: 'Threaded approvals in-channel.',
    detail: 'Your team posts progress, flags blockers, and pings you when a gate opens. Reply in-thread — no new app.',
  },
  {
    n: 'ii',
    icon: Send,
    name: 'Telegram',
    lead: 'One-tap approvals on the go.',
    detail: 'Quick pings when the team needs a decision. Approve, pause, or ask for context — from your phone.',
  },
  {
    n: 'iii',
    icon: Monitor,
    name: 'Web',
    lead: 'The full command surface.',
    detail: 'Live activity feed, queue, per-agent logs. Approve, pause, reroute — one click (Fig. V).',
  },
];

const Controls: React.FC = () => (
  <Section id="controls" pattern="circles" overflow={true}>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 xl:gap-32 items-center">
      <div className="lg:col-span-5 lg:order-1 order-2 relative h-[420px] flex items-center justify-center">
        <ScrollReveal delay={300} direction="right" className="w-full flex justify-center">
          <ControlPanelDiagram />
        </ScrollReveal>
      </div>

      <div className="lg:col-span-7 lg:order-2 order-1 relative z-20">
        <ScrollReveal delay={100}>
          <FolioHeader
            eyebrow="Folio V — The Controls"
            title={<>Where you<br />already work.</>}
            subtitle="Each team listens on Slack, Telegram, and the web panel. Approve, pause, reroute from wherever you are."
          />

          <ol className="space-y-8 max-w-xl border-l border-ink/10 pl-6">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.n} className="flex gap-5 items-baseline">
                  <span className="font-serif italic text-accent text-lg tracking-[0.1em] flex-shrink-0 w-6 text-right">{c.n}.</span>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-ink-muted" />
                      <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                    </div>
                    <p className="font-serif italic text-lg text-ink leading-snug mb-1">{c.lead}</p>
                    <p className="text-ink-muted leading-relaxed">{c.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </ScrollReveal>
      </div>
    </div>
  </Section>
);

export default Controls;
