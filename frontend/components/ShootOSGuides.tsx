import React from 'react';
import type { Page } from './types';
import { guides } from '../content/guides';

interface ShootOSGuidesProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  compact?: boolean;
}

/**
 * The guides strip on /shootos: the module pages sell, the guides answer. Rendered inside the dark modules section
 * on desktop and mobile so a reader who is not ready for a call still leaves with the answer they came for.
 */
export const ShootOSGuides: React.FC<ShootOSGuidesProps> = ({ onNavigate, compact = false }) => (
  <div className={`border-t border-white/10 ${compact ? 'mt-10 pt-8' : 'mt-14 pt-10'}`}>
    <div className={`${compact ? '' : 'flex flex-col md:flex-row md:items-baseline md:justify-between gap-4'} mb-5`}>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-light mb-2">Guides</div>
        <h3 className={`font-serif ${compact ? 'text-xl' : 'text-2xl'} leading-tight`}>Straight answers on order entry, Aryeo and Spiro.</h3>
      </div>
      <a
        href="/guides"
        onClick={(e) => { e.preventDefault(); onNavigate('guides'); }}
        className={`font-serif italic text-sm text-accent-light hover:text-canvas transition-colors ${compact ? 'inline-block mt-2' : 'shrink-0'}`}
      >
        All guides →
      </a>
    </div>
    <ul className={compact ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3'}>
      {guides.map((g) => (
        <li key={g.slug}>
          <a
            href={`/guides/${g.slug}`}
            onClick={(e) => { e.preventDefault(); onNavigate('guide', undefined, g.slug); }}
            className="font-sans text-sm text-canvas/80 hover:text-canvas underline decoration-white/25 underline-offset-4 transition-colors"
          >
            {g.question}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default ShootOSGuides;
