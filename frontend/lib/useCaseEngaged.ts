import { useEffect } from 'react';
import { track, type CaseId } from './analytics';

/**
 * Fires case_engaged once per mount when the visitor has either
 * (a) accumulated 30 seconds with the tab visible, or
 * (b) scrolled past 50% of the document height.
 *
 * Scroll depth uses an IntersectionObserver on a sentinel pinned at half the
 * document height; the sentinel is repositioned as lazy content changes the
 * page height (ResizeObserver on <body>).
 */
export const useCaseEngaged = (caseId: CaseId): void => {
  useEffect(() => {
    let fired = false;
    let seconds = 0;

    const cleanups: Array<() => void> = [];
    const cleanup = () => cleanups.splice(0).forEach((fn) => fn());

    const fire = (trigger: 'active_time' | 'scroll_depth') => {
      if (fired) return;
      fired = true;
      track('case_engaged', { case_id: caseId, trigger });
      cleanup();
    };

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        seconds += 1;
        if (seconds >= 30) fire('active_time');
      }
    }, 1000);
    cleanups.push(() => window.clearInterval(interval));

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText =
      'position:absolute;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden;';
    const reposition = () => {
      sentinel.style.top = `${document.documentElement.scrollHeight * 0.5}px`;
    };
    reposition();
    document.body.appendChild(sentinel);
    cleanups.push(() => sentinel.remove());

    // scroll_depth requires BOTH the 50% sentinel being in view AND a real
    // scroll (scrollY > 8). Without the scroll requirement, a page whose
    // lazy content hasn't loaded yet has scrollHeight ≈ viewport height, the
    // sentinel starts inside the viewport, and the observer's initial
    // callback would fire a false engagement on load.
    let sentinelInView = false;
    const evaluateScrollDepth = () => {
      if (sentinelInView && window.scrollY > 8) fire('scroll_depth');
    };
    const io = new IntersectionObserver((entries) => {
      sentinelInView = entries[entries.length - 1].isIntersecting;
      evaluateScrollDepth();
    });
    io.observe(sentinel);
    cleanups.push(() => io.disconnect());

    window.addEventListener('scroll', evaluateScrollDepth, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', evaluateScrollDepth));

    const ro = new ResizeObserver(reposition);
    ro.observe(document.body);
    cleanups.push(() => ro.disconnect());

    return cleanup;
  }, [caseId]);
};
