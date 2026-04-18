import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Logo, Button } from './Shared';
import type { Page } from './types';
import { API_ENDPOINTS } from '../config';

interface FooterProps {
  onNavigate?: (page: Page, hash?: string, id?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(API_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
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
    <footer className="bg-ink text-base pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter bar */}
        <div className="mb-16 pb-12 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl mb-2">Subscribe to the Codex</h3>
            <p className="font-sans text-base/70 leading-relaxed">
              One high-leverage automation play every Tuesday. Build-in-public. No fluff.
            </p>
          </div>
          {status === 'success' ? (
            <p className="font-serif italic text-lg text-base/90">
              Welcome to the Codex. Check your inbox on Tuesday.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                placeholder="you@company.com"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-base placeholder:text-base/40 focus:outline-none focus:border-accent rounded-sm"
                disabled={status === 'loading'}
              />
              <Button variant="primary" onClick={handleSubscribe} className="px-6">
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          )}
        </div>

        {/* 4-column hub */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-base/50 mb-4">Work</h4>
            <ul className="space-y-2">
              <li><a href="/work" onClick={go('work')} className="text-sm text-base/80 hover:text-white transition-colors">All work</a></li>
              <li><a href="/purecode" onClick={go('purecode')} className="text-sm text-base/80 hover:text-white transition-colors">PureCode</a></li>
              <li><a href="/shootos" onClick={go('shootos')} className="text-sm text-base/80 hover:text-white transition-colors">ShootOS</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-base/50 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/who-we-are" onClick={go('who-we-are')} className="text-sm text-base/80 hover:text-white transition-colors">About</a></li>
              <li><a href="/thesis" onClick={go('thesis')} className="text-sm text-base/80 hover:text-white transition-colors">Thesis</a></li>
              <li><a href="/calendar" onClick={go('calendar')} className="text-sm text-base/80 hover:text-white transition-colors">Talk to us</a></li>
              <li><a href="/events" onClick={go('events')} className="text-sm text-base/80 hover:text-white transition-colors">Events</a></li>
              <li><a href="/brand-analyzer" onClick={go('brand-analyzer')} className="text-sm text-base/80 hover:text-white transition-colors">Brand Analyzer</a></li>
              <li><a href="/book-demo" onClick={go('book-demo')} className="text-sm text-base/80 hover:text-white transition-colors">Pulse Note</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-base/50 mb-4">Codex</h4>
            <ul className="space-y-2">
              <li><a href="/codex" onClick={go('briefings')} className="text-sm text-base/80 hover:text-white transition-colors">Latest briefings</a></li>
              <li><a href="/codex" onClick={go('briefings')} className="text-sm text-base/80 hover:text-white transition-colors">Archive</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-base/50 mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" aria-label="LinkedIn" className="inline-flex items-center gap-2 text-sm text-base/80 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="#" aria-label="X" className="inline-flex items-center gap-2 text-sm text-base/80 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" /> X
                </a>
              </li>
              <li>
                <a href="#" aria-label="Instagram" className="inline-flex items-center gap-2 text-sm text-base/80 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a href="#" aria-label="Facebook" className="inline-flex items-center gap-2 text-sm text-base/80 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 opacity-90">
            <Logo className="w-6 h-6" />
            <span className="font-serif text-lg font-bold">DaVeenci</span>
          </div>
          <div className="flex gap-6 text-xs text-base/40">
            <span>© {new Date().getFullYear()} DaVeenci</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
