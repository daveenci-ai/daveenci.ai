import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Returns a ref and a flag that flips to true once the referenced element comes
 * within `rootMargin` of the viewport. Used to hold back work that belongs to a
 * section far below the fold — notably the calendar availability request, which
 * previously fired on mount and competed for bandwidth during the homepage's
 * Largest Contentful Paint window.
 *
 * The flag latches: once true it never goes back to false, and the observer
 * disconnects, so a section that scrolls in and out does not refetch.
 */
export function useNearViewport<T extends HTMLElement>(
  rootMargin = '400px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (isNear) return;

    const element = ref.current;
    // No element yet, or a browser without IntersectionObserver: fall back to
    // running the work immediately rather than never running it.
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return [ref, isNear];
}
