import React from 'react';

interface MobileFolioSceneProps {
  id?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A single full-viewport scene for the mobile landing. Designed for vertical
 * scroll: fills at least one viewport height, reserves space at top for the
 * fixed header (56px) and at bottom for the persistent CTA bar (~72px).
 *
 * Content inside is a flex column — use `mt-auto` on trailing elements to
 * push them to the thumb zone.
 */
export const MobileFolioScene: React.FC<MobileFolioSceneProps> = ({
  id,
  eyebrow,
  className = '',
  children,
}) => (
  <section
    id={id}
    className={`relative min-h-screen flex flex-col px-6 pt-6 pb-24 ${className}`}
  >
    {eyebrow && (
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-8 bg-ink-muted/30" />
        <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
          {eyebrow}
        </span>
      </div>
    )}
    <div className="flex-1 flex flex-col">{children}</div>
  </section>
);
