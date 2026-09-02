import { useEffect, useRef, useCallback, type RefCallback } from 'react';

/**
 * Scroll-linked progress for the layered homepage.
 *
 * One passive scroll listener drives every subscriber from a single
 * requestAnimationFrame. Each subscriber is measured only while it is near the
 * viewport (IntersectionObserver with a generous margin), and the result is
 * written to a CSS custom property (`--p` by default) on the element itself —
 * so the browser does the animating through `calc()` transforms and React never
 * re-renders per frame. A subscriber can also take a JS callback when it needs
 * to scrub something CSS cannot reach (SMIL timelines, Web Animations).
 *
 * Progress definitions (`mode`):
 *   through — 0 when the element's top reaches the viewport bottom,
 *             1 when its bottom leaves the viewport top. 0.5 ≈ centred.
 *             Parallax planes use this: (p − 0.5) × amplitude.
 *   enter   — 0 when the element's top reaches the viewport bottom,
 *             1 when its top reaches `enterEnd` × viewport height (default 60%).
 *             Progressive reveals use this.
 *   pin     — for a tall wrapper with a sticky child: 0 while the wrapper's top
 *             is at or below the viewport top, 1 when its bottom meets the
 *             viewport bottom. Pinned scenes use this as their timeline.
 *   exit    — 0 while the element's top is at or below the viewport top,
 *             1 when it has scrolled fully out above. The hero uses this so
 *             its resting state (scroll 0) is exactly the prerendered shell.
 *
 * Reduced motion: when `prefers-reduced-motion: reduce` is set, nothing is
 * measured; the element receives the value of `reducedValue` (default: the
 * resting value for its mode) exactly once, so every scene renders in its
 * finished, static state.
 */

export type ProgressMode = 'through' | 'enter' | 'pin' | 'exit';

export interface ScrollProgressOptions {
  mode?: ProgressMode;
  /** CSS custom property written on the element. */
  cssVar?: string;
  /** For `enter`: viewport fraction (0–1, from the top) where progress reaches 1. */
  enterEnd?: number;
  /** Value written under reduced motion. Defaults per mode: through 0.5, enter 1, pin 1. */
  reducedValue?: number;
  /** Optional JS callback with the clamped progress. */
  onProgress?: (p: number, el: HTMLElement) => void;
  /** Skip measuring entirely (keeps the resting value). */
  disabled?: boolean;
}

interface Subscriber {
  el: HTMLElement;
  opts: Required<Pick<ScrollProgressOptions, 'mode' | 'cssVar' | 'enterEnd'>>;
  /** Live options, so a caller's latest onProgress is the one that runs. */
  live: { current: ScrollProgressOptions };
  near: boolean;
  last: number;
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const restingValue = (mode: ProgressMode) => (mode === 'through' ? 0.5 : mode === 'exit' ? 0 : 1);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function measure(sub: Subscriber, vh: number): number {
  const rect = sub.el.getBoundingClientRect();
  switch (sub.opts.mode) {
    case 'enter': {
      const end = vh * sub.opts.enterEnd;
      return clamp01((vh - rect.top) / Math.max(vh - end, 1));
    }
    case 'pin': {
      const travel = rect.height - vh;
      if (travel <= 0) return 1;
      return clamp01(-rect.top / travel);
    }
    case 'exit':
      return clamp01(-rect.top / Math.max(rect.height, 1));
    case 'through':
    default:
      return clamp01((vh - rect.top) / (vh + rect.height));
  }
}

// --- Singleton manager -------------------------------------------------------

const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;
let intersection: IntersectionObserver | null = null;

function flush() {
  frame = 0;
  const vh = window.innerHeight;
  // Measure every subscriber before writing anything: a style write between
  // reads would force a synchronous re-layout for the next read.
  const updates: Array<[Subscriber, number]> = [];
  subscribers.forEach((sub) => {
    if (!sub.near) return;
    const p = measure(sub, vh);
    if (Math.abs(p - sub.last) < 0.0005) return;
    updates.push([sub, p]);
  });
  for (const [sub, p] of updates) {
    sub.last = p;
    sub.el.style.setProperty(sub.opts.cssVar, p.toFixed(4));
    sub.live.current.onProgress?.(p, sub.el);
  }
}

function schedule() {
  if (frame) return;
  frame = window.requestAnimationFrame(flush);
}

function ensureListening() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  if (typeof IntersectionObserver !== 'undefined') {
    intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          subscribers.forEach((sub) => {
            if (sub.el === entry.target) sub.near = entry.isIntersecting;
          });
        }
        schedule();
      },
      // Start measuring one viewport early so planes are already in position
      // when a section slides in; stop one viewport late.
      { rootMargin: '100% 0px 100% 0px' },
    );
  }
}

function subscribe(sub: Subscriber) {
  ensureListening();
  subscribers.add(sub);
  if (intersection) {
    intersection.observe(sub.el);
  } else {
    sub.near = true;
  }
  schedule();
  return () => {
    subscribers.delete(sub);
    intersection?.unobserve(sub.el);
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(REDUCED_QUERY).matches;
}

/**
 * Attach to an element with the returned ref callback. The element receives
 * `--p` (or `cssVar`) as a CSS custom property; use it in `calc()` transforms.
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  options: ScrollProgressOptions = {},
): RefCallback<T> {
  const optsRef = useRef(options);
  optsRef.current = options;
  const elRef = useRef<T | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const attach = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    const el = elRef.current;
    if (!el || typeof window === 'undefined') return;

    const o = optsRef.current;
    const mode: ProgressMode = o.mode ?? 'through';
    const cssVar = o.cssVar ?? '--p';
    const enterEnd = o.enterEnd ?? 0.6;

    if (o.disabled || prefersReducedMotion()) {
      const v = o.reducedValue ?? restingValue(mode);
      el.style.setProperty(cssVar, String(v));
      o.onProgress?.(v, el);
      return;
    }

    const sub: Subscriber = {
      el,
      opts: { mode, cssVar, enterEnd },
      live: optsRef,
      near: false,
      last: -1,
    };
    cleanupRef.current = subscribe(sub);
  }, []);

  useEffect(() => {
    attach();
    // Re-attach when the preference flips at runtime (e.g. OS setting change).
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(REDUCED_QUERY);
    const onChange = () => attach();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [attach]);

  return useCallback<RefCallback<T>>((node) => {
    elRef.current = node;
    if (node) attach();
    else {
      cleanupRef.current?.();
      cleanupRef.current = null;
    }
  }, [attach]);
}
