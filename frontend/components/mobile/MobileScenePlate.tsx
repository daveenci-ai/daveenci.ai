import React from 'react';

interface MobileScenePlateProps {
  figLabel?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Paper-plate widget for mobile — the small-scale cousin of the desktop
 * Plate primitive. Three chrome dots + Fig label header, followed by
 * content. Used for Fig. i hero illustration, Advantage carousel cards,
 * About distinction cards, and the Fig. d Start Here CTA block.
 *
 * Default surface is bg-white/60. Focal carousel cards can override to
 * bg-white/70 via the className prop.
 */
export const MobileScenePlate: React.FC<MobileScenePlateProps> = ({
  figLabel,
  className = '',
  children,
}) => (
  <div
    className={`relative border border-ink/10 bg-white/60 backdrop-blur-[2px] rounded-sm p-5 shadow-sm shadow-ink/5 ${className}`}
  >
    <div className="flex justify-between items-center mb-3 pb-2 border-b border-ink/10">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-ink/15" />
        <div className="w-2 h-2 rounded-full bg-ink/15" />
        <div className="w-2 h-2 rounded-full bg-ink/15" />
      </div>
      {figLabel && (
        <div className="font-serif italic text-[9px] tracking-[0.25em] text-ink-muted uppercase">
          {figLabel}
        </div>
      )}
    </div>
    {children}
  </div>
);
