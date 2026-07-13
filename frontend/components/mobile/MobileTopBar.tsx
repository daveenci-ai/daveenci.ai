import React, { useEffect, useRef, useState } from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Logo } from '../Shared';
import { MobileMenu } from './MobileMenu';
import type { Page } from '../types';

interface MobileTopBarProps {
  onNavigate: (page: Page, hash?: string) => void;
  /**
   * If provided, replaces the left-side logo with a back-arrow button that
   * navigates to this page. Use on reader-mode routes (Codex article detail)
   * where the contextual "back to list" affordance matters more than home.
   */
  backTo?: Page;
  /** Scroll progress bar (0-100) shown as a thin 2px strip below the header. */
  progress?: number;
}

/**
 * The single source of truth for the mobile chrome: sticky 56px header +
 * full-screen menu takeover. Used by MobileShell and the desktop Header's
 * mobile branch, so every page shows the same header on phones.
 *
 * Accepts optional back-button and progress-bar props for reader pages.
 */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onNavigate,
  backTo,
  progress,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const prevMenuOpen = useRef(false);

  useEffect(() => {
    if (prevMenuOpen.current && !menuOpen) {
      menuTriggerRef.current?.focus();
    }
    prevMenuOpen.current = menuOpen;
  }, [menuOpen]);

  const showProgress = typeof progress === 'number';

  return (
    <>
      <header
        data-mobile
        className="fixed top-0 inset-x-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-ink/5"
      >
        <div className="h-14 px-4 flex items-center justify-between">
          {backTo ? (
            <button
              onClick={() => onNavigate(backTo)}
              aria-label="Back"
              className="w-11 h-11 flex items-center justify-center -ml-2 text-ink"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              aria-label="Home"
              className="flex items-center h-11 px-1"
            >
              <Logo className="w-8 h-8 text-ink" />
            </button>
          )}

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
        </div>

        {showProgress && (
          <div className="h-0.5 bg-ink/5">
            <div
              className="h-full bg-accent transition-all duration-100"
              style={{ width: `${Math.max(0, Math.min(100, progress!))}%` }}
            />
          </div>
        )}
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
