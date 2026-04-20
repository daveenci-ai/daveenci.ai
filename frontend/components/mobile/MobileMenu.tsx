import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Page } from '../types';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: Page, hash?: string) => void;
}

const MENU_ITEMS: { label: string; page: Page }[] = [
  { label: 'About', page: 'who-we-are' },
  { label: 'Thesis', page: 'thesis' },
  { label: 'Work', page: 'work' },
  { label: 'Codex', page: 'briefings' },
  { label: 'Events', page: 'events' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, onNavigate }) => {
  // Lock body scroll while menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const go = (page: Page) => {
    onClose();
    onNavigate(page);
  };

  return (
    <div className="fixed inset-0 z-50 bg-base flex flex-col animate-in fade-in duration-200">
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="w-11 h-11 flex items-center justify-center text-ink"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => go(item.page)}
            className="text-left font-serif text-4xl text-ink leading-none active:text-accent transition-colors"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <button
          onClick={() => go('calendar')}
          className="w-full py-4 bg-accent text-white font-medium tracking-[0.15em] uppercase text-sm rounded-sm"
        >
          Talk to us
        </button>
      </div>
    </div>
  );
};
