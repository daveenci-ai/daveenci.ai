import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useScrollProgress } from '../../lib/useScrollProgress';

/**
 * Stacking cards. Direct children carrying `stack-card` stick below the fixed
 * header (each one a little lower than the last) and the next card slides
 * over the previous one; the covered card scales down and dims through
 * `--cover` (0 → 1), written per frame from the container's scroll progress.
 * Layout and reduced-motion fallbacks live in index.css (`.stack-card`).
 *
 * Children need only `className="stack-card"`; the container assigns
 * `--stack-index` itself.
 */
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sticky offset of the first card (room for the fixed header). */
  top?: string;
  /** Extra offset per card, so the stack's edges stay visible. */
  step?: string;
  /** Mobile spacing (tighter gap, smaller offsets). */
  compact?: boolean;
  children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = ({ top, step, compact = false, className = '', style, children, ...rest }) => {
  const el = useRef<HTMLDivElement | null>(null);

  const cards = useCallback(() => (el.current ? Array.from(el.current.querySelectorAll<HTMLElement>(':scope > .stack-card')) : []), []);

  useLayoutEffect(() => {
    cards().forEach((card, i) => card.style.setProperty('--stack-index', String(i)));
  });

  const progressRef = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    cssVar: '--stack-p',
    onProgress: () => {
      const list = cards();
      if (list.length < 2) return;
      // Read every rect first, then write, so no write forces a re-layout
      // before the next read.
      const rects = list.map((card) => card.getBoundingClientRect());
      for (let i = 0; i < list.length - 1; i += 1) {
        const rect = rects[i];
        const cover = Math.min(1, Math.max(0, (rect.bottom - rects[i + 1].top) / Math.max(rect.height, 1)));
        list[i].style.setProperty('--cover', cover.toFixed(3));
      }
    },
  });

  const setRef = useCallback((node: HTMLDivElement | null) => {
    el.current = node;
    progressRef(node);
  }, [progressRef]);

  return (
    <div
      ref={setRef}
      className={`work-stack ${compact ? 'work-stack-mobile' : ''} ${className}`}
      style={{
        ['--stack-top' as string]: top ?? (compact ? '4.5rem' : '6.5rem'),
        ['--stack-step' as string]: step ?? (compact ? '0.6rem' : '1rem'),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
