import React, { useEffect, useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileButton } from './MobileButton';
import { MobileErrorBoundary } from './MobileErrorBoundary';
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
}) => {
  const [bottomCtaVisible, setBottomCtaVisible] = useState(false);

  useEffect(() => {
    if (!showBottomCTA) return;
    const updateVisibility = () => {
      setBottomCtaVisible(window.scrollY > Math.min(window.innerHeight * 0.75, 640));
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [showBottomCTA]);

  return (
  <div className="relative" data-mobile>
    <MobileTopBar onNavigate={onNavigate} />

    <main
      className={`pt-14 ${
        showBottomCTA ? 'pb-[calc(env(safe-area-inset-bottom)+5rem)]' : ''
      }`}
    >
      <MobileErrorBoundary>{children}</MobileErrorBoundary>
    </main>

    {showBottomCTA && (
      <div
        aria-hidden={!bottomCtaVisible}
        className={`fixed inset-x-0 bottom-0 z-30 bg-base/95 backdrop-blur-md border-t border-ink/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] transition-transform duration-300 ${bottomCtaVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
      >
        <MobileButton
          tabIndex={bottomCtaVisible ? 0 : -1}
          analytics={{ cta_id: 'talk_to_us', surface: 'mobile_sticky', from_page: window.location.pathname, destination: '/calendar' }}
          onClick={() => onNavigate('calendar')}
        >Talk to us</MobileButton>
      </div>
    )}
  </div>
  );
};
