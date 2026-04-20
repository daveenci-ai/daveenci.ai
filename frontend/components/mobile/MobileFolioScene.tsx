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

/**
 * Scene display headline — normalized to the standard mobile folio scale.
 * Pass as-is for two-line hero/contrast-style headlines; use raw h1/h2
 * with custom classes only for exceptional one-offs (like the Mission page
 * where the Folio 0 needs 3rem).
 */
export const MobileSceneTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h2
    className={`font-serif text-[2.5rem] leading-[1.08] text-ink mb-5 mt-2 tracking-tight ${className}`}
  >
    {children}
  </h2>
);

/**
 * Scene subtitle — the serif italic-adjacent paragraph beneath a MobileSceneTitle.
 * Normalized to the 17px / 1.6 leading body rhythm.
 */
export const MobileSceneSubtitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <p className={`font-serif text-[17px] text-ink-muted leading-[1.6] mb-8 ${className}`}>
    {children}
  </p>
);
