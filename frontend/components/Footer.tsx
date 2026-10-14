import React from 'react';
import { Logo } from './Shared';
import type { Page } from './types';

interface FooterProps {
  onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (page: Page, hash?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page, hash);
  };

  return (
    <footer className="bg-ink text-canvas pt-16 pb-10 border-t border-white/10 focus-visible:[&_a]:outline-hidden focus-visible:[&_a]:ring-2 focus-visible:[&_a]:ring-accent focus-visible:[&_a]:ring-offset-2 focus-visible:[&_a]:ring-offset-ink">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation hub */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/60 mb-4">Work</h4>
            <ul className="space-y-2">
              <li><a href="/work" onClick={go('work')} className="text-sm text-canvas/80 hover:text-white transition-colors">All work</a></li>
              <li><a href="/modules" onClick={go('modules')} className="text-sm text-canvas/80 hover:text-white transition-colors">Modules</a></li>
              <li><a href="/purecode" onClick={go('purecode')} className="text-sm text-canvas/80 hover:text-white transition-colors">PureCode</a></li>
              <li><a href="/shoot-ops" onClick={go('autopilot')} className="text-sm text-canvas/80 hover:text-white transition-colors">Shoot Ops</a></li>
              <li><a href="/compoundiq" onClick={go('compoundiq')} className="text-sm text-canvas/80 hover:text-white transition-colors">CompoundIQ</a></li>
              <li><a href="/analytics-os" onClick={go('analytics-os')} className="text-sm text-canvas/80 hover:text-white transition-colors">Marketing Analytics OS</a></li>
              <li><a href="/creative-production" onClick={go('creative-production')} className="text-sm text-canvas/80 hover:text-white transition-colors">Creative Production</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/60 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/who-we-are" onClick={go('who-we-are')} className="text-sm text-canvas/80 hover:text-white transition-colors">About</a></li>
              <li><a href="/#services" onClick={go('landing', '#services')} className="text-sm text-canvas/80 hover:text-white transition-colors">Services</a></li>
              <li><a href="/thesis" onClick={go('thesis')} className="text-sm text-canvas/80 hover:text-white transition-colors">Thesis</a></li>
              <li><a href="/book" onClick={go('book')} className="text-sm text-canvas/80 hover:text-white transition-colors">Talk to us</a></li>
              <li><a href="/guides" onClick={go('guides')} className="text-sm text-canvas/80 hover:text-white transition-colors">Guides</a></li>
              <li><a href="/brandos" onClick={go('brandos')} className="text-sm text-canvas/80 hover:text-white transition-colors">BrandOS</a></li>
              <li><a href="/pulsenote" onClick={go('pulsenote')} className="text-sm text-canvas/80 hover:text-white transition-colors">PulseNote</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/60 mb-4">Codex</h4>
            <ul className="space-y-2">
              <li><a href="/codex" onClick={go('briefings')} className="text-sm text-canvas/80 hover:text-white transition-colors">Latest briefings</a></li>
              <li><a href="/codex" onClick={go('briefings')} className="text-sm text-canvas/80 hover:text-white transition-colors">Archive</a></li>
            </ul>
          </div>

        </div>

        {/* Legal row */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-90">
            <Logo className="w-8 h-8" />
          </div>
          <div className="text-xs text-canvas/60 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <a
              href="mailto:anton@daveenci.ai"
              className="hover:text-canvas transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
            >anton@daveenci.ai</a>
            <span aria-hidden="true">·</span>
            <span>DaVeenci LLC · 2900 W Anderson Ln, Ste C-200, PMB 1049, Austin, TX 78757</span>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} DaVeenci. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <a href="/privacy" onClick={go('privacy')} className="hover:text-canvas transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xs">Privacy</a>
          </div>
        </div>
        <div className="mt-4 text-xs text-canvas/60 text-center md:text-right">Last updated: October 2026</div>
      </div>
    </footer>
  );
};

export default Footer;
