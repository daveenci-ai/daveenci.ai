import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Camera, Video, Box, Sparkles, Home, TrendingUp, Users, Building2, Plus, Minus } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import { MobileScenePlate } from './MobileScenePlate';
import type { Page } from '../types';

interface MobileShootOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ASSETS = [
  { icon: Camera, label: 'Stills', body: 'HDR merge, color correction, crop, branded watermarks — consistent across every listing.' },
  { icon: Video, label: 'Video', body: 'Walk-through cut, color grade, music, end-card — agent-ready in hours.' },
  { icon: Box, label: '3D tours', body: 'Stitch 360° capture into an interactive tour. Click-to-explore, embed-ready.' },
  { icon: Sparkles, label: 'Staging', body: 'AI virtual staging — empty room in, fully-staged scene out. No movers, no rental furniture.' },
];

const USE_CASES = [
  { icon: Home, title: 'Brokerages', body: 'Unify media production across your entire listing inventory. Consistent quality, one vendor.' },
  { icon: TrendingUp, title: 'High-volume teams', body: 'Turnaround in hours, not days. Listings go live faster than competing inventory.' },
  { icon: Users, title: 'Photographers', body: 'Hand over capture, get listing-ready deliverables. Spend time shooting, not editing.' },
  { icon: Building2, title: 'Property managers', body: 'Stand up media for every new unit on a predictable pipeline. Scale without scaling vendors.' },
];

const FAQS = [
  { q: 'How is this different from a photo editing service?', a: 'A traditional service is one specialist (retoucher, editor, or 3D stitcher). ShootOS is a coordinated team of all of them, gated by a human approver, with a shared brand profile so every listing looks consistent.' },
  { q: 'What capture equipment works with it?', a: "DSLRs, mirrorless, 360° cameras (Insta360, Matterport), smartphone footage. ShootOS accepts raw capture and routes each asset type to the right specialist." },
  { q: 'Can I customize output to match our brand?', a: "Yes. Set your watermark, color treatment, video end-card, and staging style once. ShootOS applies them across every listing. Consistency is the whole point." },
  { q: 'How fast is turnaround?', a: "Typical listing package (20 stills + walk-through video + 3D tour + staged hero images) in 4-8 hours from capture — vs 2-5 days through traditional multi-vendor coordination." },
  { q: 'What about review?', a: "The team drafts the package, then a human gate-reviews before it lands in your delivery system. You approve what agents see — nothing auto-publishes." },
  { q: 'Where does the product live?', a: "ShootOS has its own domain at shootos.ai with the full pitch, sample outputs, and onboarding. This page is a case study of the team behind it." },
];

export const MobileShootOSPage: React.FC<MobileShootOSPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'ShootOS — DaVeenci';
    window.scrollTo(0, 0);
    return () => {
      document.title = 'DaVeenci | AI & Automation Consultancy';
    };
  }, []);

  return (
    <MobileShell onNavigate={onNavigate}>
      {/* Hero */}
      <section className="px-6 pt-10 pb-10">
        <div className="inline-block mb-5 font-mono text-[10px] tracking-[0.25em] uppercase text-accent bg-accent/5 border border-accent/10 rounded-sm px-2.5 py-1">
          A DaVeenci team · Real estate media
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          One property in.
          <br />
          <span className="italic text-ink-muted/70">One listing-ready package out.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6] mb-6">
          Stills, video, 3D tours, AI virtual staging. ShootOS is the specialist media team for volume real estate — every listing produced on a consistent pipeline, turnaround measured in hours.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => window.open('https://shootos.ai', '_blank')}>
            <span className="inline-flex items-center justify-center gap-2">
              Visit shootos.ai
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
        </div>

        {/* Fig — Pipeline mini-plate */}
        <div className="mt-8">
          <MobileScenePlate figLabel="Fig. i · Pipeline">
            <svg viewBox="0 0 200 200" className="w-full h-auto max-w-[280px] mx-auto block">
              {/* Raw capture at top */}
              <g transform="translate(100, 30)">
                <rect x="-38" y="-14" width="76" height="28" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.1" strokeDasharray="3 3" />
                <text x="0" y="-2" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))" letterSpacing="0.1em">RAW CAPTURE</text>
                <text x="0" y="8" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">stills · video · 360°</text>
              </g>
              {/* 4 specialists */}
              {ASSETS.map((asset, i) => {
                const x = 30 + i * 47;
                const y = 110;
                return (
                  <g key={asset.label}>
                    <line x1="100" y1="44" x2={x} y2={y - 14} stroke="rgb(var(--color-accent))" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />
                    <rect x={x - 14} y={y - 14} width="28" height="28" rx="1.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.1" />
                    <text x={x} y={y - 1} textAnchor="middle" fontSize="6" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink))">{asset.label}</text>
                    <text x={x} y={y + 8} textAnchor="middle" fontSize="4" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">0{i + 1}</text>
                  </g>
                );
              })}
              {/* Converge to output */}
              {ASSETS.map((_, i) => {
                const fromX = 30 + i * 47;
                return <line key={i} x1={fromX} y1="128" x2="100" y2="160" stroke="rgb(var(--color-accent))" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5" />;
              })}
              <g transform="translate(100, 175)">
                <rect x="-42" y="-12" width="84" height="24" rx="2" fill="rgb(var(--color-accent))" fillOpacity="0.12" stroke="rgb(var(--color-accent))" strokeWidth="1.3" />
                <text x="0" y="-1" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-accent))" letterSpacing="0.1em">LISTING KIT</text>
                <text x="0" y="8" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="rgb(var(--color-ink-muted))">agent-ready, branded</text>
              </g>
            </svg>
          </MobileScenePlate>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 pb-8">
        <div className="bg-alt/10 border-l-2 border-alt p-5 rounded-sm">
          <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
            Real estate teams need listing-ready media — stills, video, 3D tours, staging — fast and at volume. Traditional production is a human-intensive multi-vendor coordination problem. Slow turnaround, inconsistent quality, costs that don't scale.
          </p>
        </div>
      </section>

      {/* Specialists */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Specialists</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Four asset types. <br />
          <span className="italic text-ink-muted/70">Four specialists.</span>
        </h2>
        <div className="space-y-3">
          {ASSETS.map((asset) => {
            const Icon = asset.icon;
            return (
              <div key={asset.label} className="bg-pulse-surface border border-ink/10 rounded-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-sm border border-accent/20 bg-accent/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg text-ink">{asset.label}</h3>
                </div>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{asset.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">Use Cases</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Who ShootOS is <span className="italic text-ink-muted/70">for.</span>
        </h2>
        <div className="space-y-3">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <div key={uc.title} className="bg-white border border-ink/10 rounded-sm p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <h3 className="font-serif text-lg text-ink">{uc.title}</h3>
                </div>
                <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{uc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10 bg-white/40">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">FAQ</span>
        </div>
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-6 tracking-tight">
          Common <span className="italic text-ink-muted/70">questions.</span>
        </h2>
        <ol className="border-t border-ink/10">
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <li key={i} className="border-b border-ink/10">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-baseline gap-3 py-4 text-left active:opacity-60 transition-opacity"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 font-serif text-base text-ink leading-snug">{item.q}</span>
                  <span className="flex-shrink-0 pt-1 text-ink-muted/60">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-4 pr-8 -mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="font-sans text-[14px] text-ink-muted leading-relaxed">{item.a}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-10 border-t border-ink/5">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Want a team like this <br />
          <span className="italic text-accent">for your domain?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          ShootOS is one example of a DaVeenci team. We design specialist teams for industries where the workflow is complex, multi-stage, and the output needs to be production-ready.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>See all work</MobileButton>
        </div>
      </section>
    </MobileShell>
  );
};
