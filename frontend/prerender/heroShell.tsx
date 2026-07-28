import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Hero from '../components/Hero';
import { MobileHero } from '../components/mobile/MobileHero';

/**
 * Static above-the-fold shell, injected into dist/index.html at build time.
 *
 * Why only the hero: the Lighthouse breakdown put 28ms on time-to-first-byte
 * and 623ms on "element render delay" for the hero <h1>, which is the LCP
 * element. That delay is React booting. Everything a full-page prerender would
 * additionally put in the HTML sits below the fold and cannot move LCP.
 *
 * Why both variants: 15 pages branch on useIsMobile and swap component trees
 * at first render, so a single prerendered tree would be discarded on the
 * other device. Rendering both and choosing with a media query keeps the win
 * on phones without user-agent sniffing at the edge.
 *
 * The markup is generated from the real components, so hero copy cannot drift
 * out of sync with what React renders a moment later. The wrappers reproduce
 * the layout context each hero normally sits in — the desktop Header and the
 * mobile top bar are both `fixed`, so only their spacing needs mirroring.
 */

const noop = () => {};

export function renderHeroShell(): string {
  const desktop = renderToStaticMarkup(<Hero onNavigate={noop} />);
  const mobile = renderToStaticMarkup(<MobileHero onNavigate={noop} />);

  return [
    // aria-hidden + inert: this is a paint placeholder, not interactive UI.
    // React replaces it on mount; until then it must not take focus or be
    // announced twice to a screen reader.
    '<div data-hero-shell aria-hidden="true" inert>',
    `<div class="hidden md:flex md:flex-col w-full overflow-x-hidden">${desktop}</div>`,
    `<div class="md:hidden relative" data-mobile><main class="pt-14">${mobile}</main></div>`,
    '</div>',
  ].join('');
}
