import React, { useState } from 'react';
import { MobileButton } from './MobileButton';
import { API_ENDPOINTS } from '../../config';
import { track } from '../../lib/analytics';

interface MobileSubscribeProps {
  heading: string;
  body: string;
  source: string;
}

/**
 * Mobile newsletter capture — the mobile tree has no Footer, so case pages
 * end with this block. One email field, mirrors Footer's subscribe flow.
 */
export const MobileSubscribe: React.FC<MobileSubscribeProps> = ({ heading, body, source }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch(API_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        track('newsletter_subscribe', { source });
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="px-6 py-12 bg-ink text-base">
      <h2 className="font-serif text-2xl mb-2">{heading}</h2>
      <p className="font-sans text-[14px] text-base/70 leading-relaxed mb-6">{body}</p>
      {status === 'success' ? (
        <p className="font-serif italic text-lg text-base/90">
          Welcome to the Codex. Check your inbox on Tuesday.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            placeholder="you@company.com"
            disabled={status === 'loading'}
            className="bg-white/10 border border-white/20 px-4 py-3 text-base placeholder:text-base/40 focus:outline-none focus:border-accent rounded-sm"
          />
          <MobileButton onClick={handleSubscribe}>
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </MobileButton>
          {status === 'error' && (
            <p className="font-sans text-[13px] text-red-300">
              Something went wrong — try again in a moment.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
