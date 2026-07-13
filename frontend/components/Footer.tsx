import React, { useState } from 'react';
import { Logo, Button } from './Shared';
import type { Page } from './types';
import { API_ENDPOINTS } from '../config';
import { track } from '../lib/analytics';

interface FooterProps {
  onNavigate?: (page: Page, hash?: string, id?: string) => void;
  /** Contextual framing for the newsletter bar; falls back to the Codex default. */
  newsletterHeading?: string;
  newsletterBody?: string;
  /** Attribution recorded with the subscription and the analytics event. */
  newsletterSource?: string;
}

const Footer: React.FC<FooterProps> = ({
  onNavigate,
  newsletterHeading = 'Subscribe to the Codex',
  newsletterBody = 'Field notes from active builds, sent when the work earns it. Build-in-public. No fluff.',
  newsletterSource = 'footer',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch(API_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: newsletterSource }),
      });
      if (res.ok) {
        track('newsletter_subscribe', { source: newsletterSource });
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const go = (page: Page, hash?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page, hash);
  };

  return (
    <footer className="bg-ink text-canvas pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter bar */}
        <div className="mb-16 pb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl mb-2">{newsletterHeading}</h3>
            <p className="font-sans text-canvas/70 leading-relaxed">{newsletterBody}</p>
          </div>
          {status === 'success' ? (
            <p className="font-serif italic text-lg text-canvas/90">
              You’re in. The next field note will arrive when it’s ready.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor={`newsletter-email-${newsletterSource}`} className="sr-only">Email address</label>
              <input
                id={`newsletter-email-${newsletterSource}`}
                name="email"
                autoComplete="email"
                aria-label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="you@company.com"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-base text-canvas placeholder:text-canvas/40 focus:outline-none focus:border-accent rounded-sm"
                disabled={status === 'loading'}
              />
              <Button type="button" variant="primary" onClick={handleSubscribe} className="px-6">
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {status === 'error' && <p role="alert" className="self-center text-sm text-red-300">Please check your email and try again.</p>}
            </div>
          )}
        </div>

        {/* Navigation hub */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50 mb-4">Work</h4>
            <ul className="space-y-2">
              <li><a href="/work" onClick={go('work')} className="text-sm text-canvas/80 hover:text-white transition-colors">All work</a></li>
              <li><a href="/purecode" onClick={go('purecode')} className="text-sm text-canvas/80 hover:text-white transition-colors">PureCode</a></li>
              <li><a href="/autopilot" onClick={go('autopilot')} className="text-sm text-canvas/80 hover:text-white transition-colors">AutoPilot</a></li>
              <li><a href="/compoundiq" onClick={go('compoundiq')} className="text-sm text-canvas/80 hover:text-white transition-colors">CompoundIQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/who-we-are" onClick={go('who-we-are')} className="text-sm text-canvas/80 hover:text-white transition-colors">About</a></li>
              <li><a href="/thesis" onClick={go('thesis')} className="text-sm text-canvas/80 hover:text-white transition-colors">Thesis</a></li>
              <li><a href="/calendar" onClick={go('calendar')} className="text-sm text-canvas/80 hover:text-white transition-colors">Talk to us</a></li>
              <li><a href="/events" onClick={go('events')} className="text-sm text-canvas/80 hover:text-white transition-colors">Events</a></li>
              <li><a href="/brandos" onClick={go('brandos')} className="text-sm text-canvas/80 hover:text-white transition-colors">BrandOS</a></li>
              <li><a href="/pulsenote" onClick={go('pulsenote')} className="text-sm text-canvas/80 hover:text-white transition-colors">PulseNote</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50 mb-4">Codex</h4>
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
          <div className="text-xs text-canvas/40">
            <span>© {new Date().getFullYear()} DaVeenci</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <a href="/privacy" onClick={go('privacy')} className="hover:text-canvas transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
