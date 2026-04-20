import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from '../Shared';
import { MobileMenu } from './MobileMenu';
import type { Page } from '../types';

interface MobileTopBarProps {
  onNavigate: (page: Page, hash?: string) => void;
}

/**
 * The single source of truth for the mobile chrome: sticky 56px header
 * (logo left, menu button right) + full-screen menu takeover.
 *
 * Used by MobileShell for pages with a full mobile tree, and by the
 * desktop Header (mobile branch) so pages without a mobile version
 * still get the same consistent header.
 */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onNavigate }) => {
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
    <>
      <header
        data-mobile
        className="fixed top-0 inset-x-0 z-40 h-14 bg-base/85 backdrop-blur-md border-b border-ink/5 px-4 flex items-center justify-between"
      >
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

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
