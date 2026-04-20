import React, { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MobileShell } from './MobileShell';
import { MobileButton } from './MobileButton';
import type { Page } from '../types';

interface MobileShootOSPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ASSETS = ['Stills', 'Video', '3D', 'Staging'];

export const MobileShootOSPage: React.FC<MobileShootOSPageProps> = ({ onNavigate }) => {
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
      <section className="px-6 pt-10 pb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8 bg-ink-muted/30" />
          <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
            A DaVeenci team · Real estate media
          </span>
        </div>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-5 tracking-tight">
          ShootOS.
          <br />
          <span className="italic text-ink-muted/70">The real estate media team.</span>
        </h1>
        <p className="font-serif text-[17px] text-ink-muted leading-[1.6]">
          Stills, video, 3D tours, AI virtual staging. One property in. One listing-ready media package out. Built for volume real estate teams, not one-off shoots.
        </p>
      </section>

      {/* Problem */}
      <section className="px-6 pb-8">
        <div className="bg-alt/10 border-l-2 border-alt p-5 rounded-sm">
          <h3 className="font-serif text-xl text-ink mb-2">The problem</h3>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">
            Real estate teams need listing-ready media — stills, video, 3D tours, staging — fast and at volume. Traditional production is a human-intensive multi-vendor coordination problem. The outcome: slow turnaround, inconsistent quality, and costs that don't scale with listing velocity.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-6 pb-10">
        <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-4 tracking-tight">
          The pipeline.
        </h3>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6">
          A single pipeline ingests raw capture, routes each asset to the specialist that handles it best (stills → color + crop; video → cut + grade; 3D → stitch; staging → AI virtual dressing), and outputs a packaged listing kit ready to hand to the agent.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ASSETS.map((asset) => (
            <div key={asset} className="p-4 border border-ink/10 bg-white/60 rounded-sm text-center">
              <div className="font-serif text-[15px] text-ink">{asset}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ships */}
      <section className="px-6 pb-10">
        <h3 className="font-serif text-[1.75rem] leading-[1.15] text-ink mb-4 tracking-tight">
          What it ships.
        </h3>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-4">
          A complete listing media package, agent-ready, branded, and consistent across an entire brokerage's inventory. Turnaround measured in hours, not days.
        </p>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-5">
          The product has its own domain and dedicated site for the full pitch, sample outputs, and onboarding.
        </p>
        <MobileButton
          variant="secondary"
          fullWidth={false}
          onClick={() => window.open('https://shootos.ai', '_blank')}
          className="inline-flex items-center gap-2"
        >
          Visit shootos.ai
          <ArrowUpRight className="w-4 h-4" />
        </MobileButton>
      </section>

      {/* End CTA */}
      <section className="px-6 py-10 bg-white/40 border-t border-ink/5">
        <h2 className="font-serif text-[2rem] leading-[1.1] text-ink mb-4 tracking-tight text-center">
          Want a team like this for <br />
          <span className="italic text-accent">your domain?</span>
        </h2>
        <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-6 text-center">
          ShootOS is one example of a DaVeenci team. We design specialist teams for industries where the workflow is complex, multi-stage, and the output needs to be production-ready.
        </p>
        <div className="flex flex-col gap-3">
          <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
          <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
            See all work
          </MobileButton>
        </div>
      </section>
    </MobileShell>
  );
};
