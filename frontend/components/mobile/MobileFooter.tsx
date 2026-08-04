import React from 'react';
import { Logo } from '../Shared';
import type { Page } from '../types';

interface MobileFooterProps {
  onNavigate: (page: Page, hash?: string) => void;
  /** Extra classes — MobileShell uses this to clear the sticky CTA bar. */
  className?: string;
}

const LINK_GROUPS: { heading: string; links: { label: string; page: Page; hash?: string }[] }[] = [
  {
    heading: 'Work',
    links: [
      { label: 'All work', page: 'work' },
      { label: 'PureCode', page: 'purecode' },
      { label: 'ShootOS', page: 'autopilot' },
      { label: 'CompoundIQ', page: 'compoundiq' },
      { label: 'Creative Production', page: 'creative-production' },
      { label: 'BrandOS', page: 'brandos' },
      { label: 'PulseNote', page: 'pulsenote' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', page: 'who-we-are' },
      { label: 'Services', page: 'landing', hash: '#services' },
      { label: 'Thesis', page: 'thesis' },
      { label: 'Events', page: 'events' },
      { label: 'Codex', page: 'briefings' },
      { label: 'Talk to us', page: 'calendar' },
    ],
  },
];

/**
 * Mobile footer. The mobile tree previously ended each page on whatever its
 * last section happened to be, which left mobile visitors with no secondary
 * navigation and — more seriously — no route to the privacy policy anywhere
 * in the UI. Rendered by MobileShell, so every mobile page gets it.
 *
 * Deliberately not a copy of the desktop Footer: no newsletter form here,
 * because the case pages already end with MobileSubscribe and two capture
 * forms on one screen reads as a bug.
 */
export const MobileFooter: React.FC<MobileFooterProps> = ({ onNavigate, className = '' }) => {
  const go = (page: Page, hash?: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onNavigate(page, hash);
  };

  return (
    <footer className={`bg-ink text-canvas px-6 pt-12 pb-10 ${className}`}>
      <div className="grid grid-cols-2 gap-8">
        {LINK_GROUPS.map((group) => (
          <div key={group.heading}>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/60 mb-4">
              {group.heading}
            </h2>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.hash ? `/${link.hash}` : `/${link.page}`}
                    onClick={go(link.page, link.hash)}
                    className="block py-2 text-[15px] text-canvas/85 active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-canvas/10 flex items-center justify-between gap-4">
        <Logo className="w-8 h-8 opacity-90" />
        <div className="text-right text-[11px] text-canvas/60 leading-relaxed">
          <a
            href="mailto:anton@daveenci.ai"
            className="block py-1 underline underline-offset-4 active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >anton@daveenci.ai</a>
          <div>© {new Date().getFullYear()} DaVeenci</div>
          <a
            href="/privacy"
            onClick={go('privacy')}
            className="inline-block py-2 underline underline-offset-4 active:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};
