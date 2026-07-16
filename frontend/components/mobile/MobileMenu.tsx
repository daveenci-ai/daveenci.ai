import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: Page, hash?: string) => void;
}

const MENU_ITEMS: { label: string; page: Page; hash?: string }[] = [
  { label: 'About', page: 'who-we-are' },
  { label: 'Services', page: 'landing', hash: '#services' },
  { label: 'Thesis', page: 'thesis' },
  { label: 'Work', page: 'work' },
  { label: 'Codex', page: 'briefings' },
  { label: 'Events', page: 'events' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, onNavigate }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while menu is open, and restore the prior scroll
  // position on close (otherwise iOS Safari may jump on reopen).
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      window.scrollTo(0, prevScroll);
    };
  }, [open]);

  // Focus trap + Escape close + initial focus
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (!el) return;

    const focusables = el.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Initial focus on close button (least-jarring entry)
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (page: Page, hash?: string) => {
    onClose();
    onNavigate(page, hash);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      data-mobile
      className="fixed inset-0 z-50 bg-canvas flex flex-col animate-in fade-in duration-200"
    >
      <h2 id="mobile-menu-title" className="sr-only">
        Navigation menu
      </h2>
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="w-11 h-11 flex items-center justify-center text-ink"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 flex flex-col justify-center px-8 gap-6">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => go(item.page, item.hash)}
            className="text-left font-serif text-4xl text-ink leading-none active:text-accent transition-colors"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <MobileButton onClick={() => go('calendar')}>Talk to us</MobileButton>
      </div>
    </div>
  );
};
