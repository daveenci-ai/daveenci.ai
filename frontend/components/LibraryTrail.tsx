import React from 'react';
import type { Page } from './types';

interface LibraryTrailProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  /** The shelf this page sits on. */
  shelf: 'guides' | 'codex';
  /** True on an item page (a guide or a Codex issue): the shelf name becomes a link too. */
  item?: boolean;
  className?: string;
}

/** "Library › Guides" / "Library › Codex" — the trail above every Library page (Library restructure, 14 Oct 2026). */
export const LibraryTrail: React.FC<LibraryTrailProps> = ({ onNavigate, shelf, item = false, className = '' }) => {
  const go = (page: Page) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };
  const shelfLabel = shelf === 'guides' ? 'Guides' : 'Codex';
  const shelfPage: Page = shelf === 'guides' ? 'guides' : 'briefings';
  const shelfHref = shelf === 'guides' ? '/guides' : '/codex';
  return (
    <nav aria-label="Breadcrumb" className={`font-mono text-[10px] uppercase tracking-[0.22em] text-accent ${className}`}>
      <a href="/library" onClick={go('library')} className="hover:text-ink transition-colors">Library</a>
      <span aria-hidden="true" className="mx-2 text-ink-muted/50">›</span>
      {item ? (
        <a href={shelfHref} onClick={go(shelfPage)} className="hover:text-ink transition-colors">{shelfLabel}</a>
      ) : (
        <span aria-current="page">{shelfLabel}</span>
      )}
    </nav>
  );
};

export default LibraryTrail;
