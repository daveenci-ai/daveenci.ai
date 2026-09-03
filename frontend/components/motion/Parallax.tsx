import React from 'react';
import { useScrollProgress } from '../../lib/useScrollProgress';

/**
 * Layered-depth primitives. Three planes per scene — scaffold (slowest),
 * plate, annotation (fastest) — move at different speeds so a section reads
 * as depth rather than a flat sheet. Copy stays in normal flow at 1×.
 *
 * All motion is expressed as CSS `calc()` on a `--p` custom property written
 * by useScrollProgress, so the first paint (and the prerendered hero shell)
 * shows every plane at its resting position: `--p` defaults to 0.5 in the
 * stylesheet, which resolves every transform to identity.
 */

export type Plane = 'scaffold' | 'plate' | 'annotation';

/** Vertical travel, in px, for each plane across a full pass through the viewport.
 *  Positive = lags behind the scroll (reads as further away); negative = leads it. */
export const PLANE_AMPLITUDE: Record<Plane, number> = {
  scaffold: 140,
  plate: 44,
  annotation: -36,
};

interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  plane?: Plane;
  /** Override the plane amplitude (px). */
  amplitude?: number;
  /** Measure this element's own travel (default) or inherit `--p` from an ancestor. */
  inherit?: boolean;
  as?: 'div' | 'span' | 'figure';
  children?: React.ReactNode;
}

export const Parallax: React.FC<ParallaxProps> = ({
  plane = 'plate',
  amplitude,
  inherit = false,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useScrollProgress<HTMLDivElement>({ mode: 'through', disabled: inherit });
  const amp = amplitude ?? PLANE_AMPLITUDE[plane];
  return (
    <Tag
      ref={inherit ? undefined : ref}
      className={`plane ${className}`}
      style={{ ['--amp' as string]: `${amp}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/**
 * Progressive reveal driven by scroll position rather than a one-shot
 * observer: opacity and lift follow `--p` from 0 → 1 as the element rises
 * from the viewport bottom to `enterEnd` of the viewport height. Scrolling back
 * up reverses it, which is what makes a list feel attached to the page.
 */
interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  enterEnd?: number;
  /** Lift distance in px. */
  lift?: number;
  as?: 'div' | 'li' | 'article' | 'figure' | 'span';
  children?: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({
  enterEnd = 0.7,
  lift = 28,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) => {
  const ref = useScrollProgress<HTMLDivElement>({ mode: 'enter', enterEnd });
  return (
    <Tag
      ref={ref}
      className={`reveal-p ${className}`}
      style={{ ['--lift' as string]: `${lift}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/**
 * Pinned scene: a tall wrapper (`length` viewports) whose child sticks for the
 * duration. `--p` runs 0 → 1 across the wrapper; `onProgress` is for scrubbing
 * timelines CSS cannot reach. Under reduced motion the wrapper collapses to
 * natural height and the child simply flows.
 */
interface PinnedProps {
  length?: number;
  /** Top offset of the sticky child (space for the fixed header). */
  top?: string;
  id?: string;
  className?: string;
  stickyClassName?: string;
  onProgress?: (p: number) => void;
  children: React.ReactNode;
}

export const Pinned: React.FC<PinnedProps> = ({
  length = 2.5,
  top = '0px',
  id,
  className = '',
  stickyClassName = '',
  onProgress,
  children,
}) => {
  const ref = useScrollProgress<HTMLDivElement>({
    mode: 'pin',
    onProgress: onProgress ? (p) => onProgress(p) : undefined,
  });
  return (
    <div
      id={id}
      ref={ref}
      className={`pinned ${className}`}
      style={{ ['--pin-length' as string]: `${length * 100}vh`, ['--pin-top' as string]: top }}
    >
      <div className={`pinned-stage ${stickyClassName}`}>{children}</div>
    </div>
  );
};
