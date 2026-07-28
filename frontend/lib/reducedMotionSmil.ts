/**
 * CSS `prefers-reduced-motion` overrides animation-duration and
 * transition-duration, but it has no effect on SVG SMIL (`<animate>`), which
 * several decorative diagrams use. Those kept looping indefinitely for people
 * who had explicitly asked for less motion.
 *
 * SVGSVGElement exposes pauseAnimations() / unpauseAnimations(), which freeze
 * that element's SMIL timeline. This walks the document, pauses every SVG when
 * the preference is set, and watches for SVGs added later by route changes or
 * lazy-loaded components. Doing it centrally beats gating every <animate>
 * element by hand across seven files and forgetting the eighth.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

function applyTo(root: ParentNode, paused: boolean) {
  const svgs = root.querySelectorAll<SVGSVGElement>('svg');
  svgs.forEach((svg) => {
    // pauseAnimations is missing in some non-browser/test environments.
    if (paused) svg.pauseAnimations?.();
    else svg.unpauseAnimations?.();
  });
}

export function installReducedMotionSmil(): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const media = window.matchMedia(QUERY);
  let observer: MutationObserver | null = null;
  // Nothing was ever paused, so there is nothing to unpause. Skipping the
  // walk keeps the common case (preference not set) at zero DOM work.
  let hasPaused = false;

  const sync = () => {
    if (media.matches || hasPaused) {
      applyTo(document, media.matches);
      hasPaused = media.matches;
    }

    if (media.matches && !observer) {
      observer = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node instanceof SVGSVGElement) node.pauseAnimations?.();
            applyTo(node, true);
          });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (!media.matches && observer) {
      observer.disconnect();
      observer = null;
    }
  };

  sync();
  media.addEventListener('change', sync);

  return () => {
    media.removeEventListener('change', sync);
    observer?.disconnect();
    observer = null;
  };
}
