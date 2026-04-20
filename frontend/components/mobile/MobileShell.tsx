import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../Shared';
import { MobileMenu } from './MobileMenu';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';

interface MobileShellProps {
  onNavigate: (page: Page, hash?: string) => void;
  showBottomCTA?: boolean;
  children: React.ReactNode;
}

/**
 * Mobile chrome wrapper: sticky transparent header + full-screen menu takeover
 * + optional persistent bottom "Talk to us" bar. Children render in a scroll
 * container scoped below the header.
 */
export const MobileShell: React.FC<MobileShellProps> = ({
  onNavigate,
  showBottomCTA = true,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const prevMenuOpen = useRef(false);

  // Restore focus to the menu trigger when the dialog closes
  useEffect(() => {
    if (prevMenuOpen.current && !menuOpen) {
      menuTriggerRef.current?.focus();
    }
    prevMenuOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <div className="relative" data-mobile>
      {/* Sticky header */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 bg-base/85 backdrop-blur-md border-b border-ink/5 px-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          aria-label="Home"
          className="flex items-center h-11 px-1"
        >
          <Logo className="w-8 h-8 text-ink" />
        </button>
        <button
          ref={menuTriggerRef}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className="w-11 h-11 flex items-center justify-center text-ink"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <main className="pt-14">{children}</main>

      {/* Persistent bottom CTA */}
      {showBottomCTA && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-base/95 backdrop-blur-md border-t border-ink/10 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
        </div>
      )}

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
