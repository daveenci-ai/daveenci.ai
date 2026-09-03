/**
 * Scrub existing SMIL and CSS keyframe timelines with scroll.
 *
 * The Method scene's choreography (18.5 s of SMIL inside three plates, plus
 * two CSS keyframe systems bound to the same clock) is reused rather than
 * rebuilt: SVGSVGElement.setCurrentTime() and Animation.currentTime let scroll
 * progress drive the exact same timeline. Transitions are left alone so hover
 * states keep working.
 */

const isKeyframeAnimation = (animation: Animation): boolean =>
  typeof CSSAnimation !== 'undefined' && animation instanceof CSSAnimation;

export function scrubTimeline(root: HTMLElement, seconds: number): void {
  root.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
    if (typeof svg.pauseAnimations !== 'function') return;
    svg.pauseAnimations();
    svg.setCurrentTime(seconds);
  });

  if (typeof root.getAnimations !== 'function') return;
  root.getAnimations({ subtree: true }).forEach((animation) => {
    if (!isKeyframeAnimation(animation)) return;
    animation.pause();
    animation.currentTime = seconds * 1000;
  });
}

/** Hand the timelines back to the clock (used when leaving scrub mode). */
export function releaseTimeline(root: HTMLElement): void {
  root.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => svg.unpauseAnimations?.());
  if (typeof root.getAnimations !== 'function') return;
  root.getAnimations({ subtree: true }).forEach((animation) => {
    if (isKeyframeAnimation(animation)) animation.play();
  });
}
