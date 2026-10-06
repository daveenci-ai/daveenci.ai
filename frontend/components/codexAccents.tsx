import React from 'react';
import type { BriefingSummary } from '../content/briefings';

type Category = BriefingSummary['category'];

// Per-category accents for the Codex index. Existing palette tokens only; each
// card exposes its accent as `--cat` so utilities read rgb(var(--cat) / a).
export const CATEGORY_ACCENT: Record<Category, string> = {
  Architecture: 'var(--color-accent-strong)',
  Engineering: 'var(--color-status-success)',
  Operations: 'var(--color-alt)',
  Strategy: 'var(--color-status-danger)',
};

export const accentStyle = (category: string): React.CSSProperties =>
  ({ '--cat': CATEGORY_ACCENT[category as Category] ?? 'var(--color-accent)' }) as React.CSSProperties;

// A small system map per category. Dashed ink edges at rest; accent edges draw
// in on hover/focus; the live node pulses only when motion is allowed.
const MOTIFS: Record<Category, { nodes: [number, number][]; edges: [number, number][]; live: number }> = {
  Architecture: { nodes: [[120, 60], [40, 24], [200, 24], [40, 96], [200, 96]], edges: [[1, 2], [0, 1], [0, 2], [0, 3], [0, 4]], live: 0 },
  Engineering: { nodes: [[20, 60], [80, 60], [140, 28], [140, 92], [220, 60]], edges: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]], live: 4 },
  Operations: { nodes: [[120, 14], [204, 50], [172, 104], [68, 104], [36, 50]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]], live: 0 },
  Strategy: { nodes: [[20, 100], [80, 82], [140, 56], [220, 16]], edges: [[0, 1], [1, 2], [2, 3]], live: 3 },
};

export const CategoryMotif: React.FC<{ category: Category; className?: string }> = ({ category, className = '' }) => {
  const { nodes, edges, live } = MOTIFS[category];
  const segment = ([a, b]: [number, number]) => `M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`;
  return (
    <svg aria-hidden="true" viewBox="0 0 240 120" fill="none" className={`overflow-visible ${className}`}>
      <path d={edges.map(segment).join(' ')} stroke="rgb(var(--color-ink))" strokeOpacity="0.25" strokeDasharray="3 4" />
      {edges.map((edge) => (
        <path
          key={edge.join('-')}
          d={segment(edge)}
          pathLength={1}
          stroke="rgb(var(--cat))"
          strokeWidth="1.75"
          strokeDasharray="1"
          className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0] motion-reduce:transition-none"
        />
      ))}
      {nodes.map(([x, y], index) =>
        index === live ? (
          <g key={index}>
            <circle cx={x} cy={y} r="11" fill="rgb(var(--cat))" fillOpacity="0.18" className="motion-safe:animate-pulse" />
            <circle cx={x} cy={y} r="5.5" fill="rgb(var(--cat))" />
          </g>
        ) : (
          <circle key={index} cx={x} cy={y} r="4" fill="rgb(var(--color-paper))" stroke="rgb(var(--cat))" strokeWidth="1.5" />
        )
      )}
    </svg>
  );
};
