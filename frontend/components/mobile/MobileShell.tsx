import React from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';

interface MobileShellProps {
  onNavigate: (page: Page, hash?: string) => void;
  showBottomCTA?: boolean;
  children: React.ReactNode;
}

/**
 * Mobile chrome wrapper used by the landing + who-we-are + briefings pages.
 * Renders the shared MobileTopBar at the top, wraps children in a content
 * area with padding for the fixed header + optional bottom CTA bar.
 */
export const MobileShell: React.FC<MobileShellProps> = ({
  onNavigate,
  showBottomCTA = true,
  children,
}) => (
  <div className="relative" data-mobile>
    <MobileTopBar onNavigate={onNavigate} />

    <main
      className={`pt-14 ${
        showBottomCTA ? 'pb-[calc(env(safe-area-inset-bottom)+5rem)]' : ''
      }`}
    >
      {children}
    </main>

    {showBottomCTA && (
      <div className="fixed inset-x-0 bottom-0 z-30 bg-base/95 backdrop-blur-md border-t border-ink/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
      </div>
    )}
  </div>
);
