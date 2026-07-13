import React, { useEffect, useState } from 'react';
import { MobileButton } from './MobileButton';
import { MobileTopBar } from './MobileTopBar';
import { MobileErrorBoundary } from './MobileErrorBoundary';
import type { Page } from '../types';

interface MobileThesisPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PLAYBOOK = [
  { label: 'Controller', body: 'The orchestrator. Routes work between specialists, manages handoffs, owns the retry logic when something fails.' },
  { label: 'Specialists', body: "Each one tuned to one job — its own prompts, tools, and memory. A specialist doesn't know how to do other specialists' jobs, and that's the point." },
  { label: 'Human gates', body: 'Review checkpoints at the decision points that matter. Not "approve everything" — "approve the things that can\'t be un-approved once they ship."' },
  { label: 'Observability', body: 'Every step logged, inspectable, replayable. Teams that ship need debuggability; this layer is non-negotiable.' },
  { label: 'Memory', body: "Shared knowledge store so specialists build on each other's work across runs. Without it, the team starts every job from scratch." },
];

export const MobileThesisPage: React.FC<MobileThesisPageProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const y = window.scrollY ?? h.scrollTop ?? document.body.scrollTop ?? 0;
      setProgress(total > 0 ? Math.min(100, (y / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col text-ink" data-mobile>
      <MobileTopBar onNavigate={onNavigate} progress={progress} />

      <main className="flex-1 pt-14">
      <MobileErrorBoundary>
        {/* Hero */}
        <section className="px-6 pt-12 pb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-ink-muted/40" />
            <span className="font-serif italic text-[11px] tracking-[0.3em] uppercase text-ink-muted">
              An Essay · Manifesto
            </span>
            <span className="h-px w-8 bg-ink-muted/40" />
          </div>
          <h1 className="font-serif text-[2.75rem] leading-[1.05] text-ink mb-6 text-center">
            The case against
            <br />
            <span className="italic text-accent">generalist AI.</span>
          </h1>
          <p className="font-serif text-[17px] text-ink-muted leading-[1.6] text-center mb-8">
            The next era of knowledge work won't be won by bigger models. It'll be won by better teams. Here's the case — in six parts.
          </p>
          <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted/70">
            <span>Anton Osipov</span>
            <span className="text-ink-muted/30">·</span>
            <span>8 min read</span>
          </div>
        </section>

        {/* Opening */}
        <section className="px-6 py-6 max-w-prose mx-auto">
          <p className="font-serif italic text-xl text-ink-muted leading-[1.55] mb-4">
            Short version: the industry is selling one generalist AI tool to do every knowledge-work job. That's a bad answer. A team of specialists is a better answer. We build the team.
          </p>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed">Long version below.</p>
        </section>

        <Chapter num="I" title="The Generalist Tax" heading="One model, every job.">
          <p>The default AI product in 2026 is a single model with a chat window. Ask it to write code. Ask it to read a contract. Ask it to plan a quarter. Same box, different prompts.</p>
          <p>It's the consulting equivalent of hiring one person to be your salesperson, your copywriter, your accountant, and your lawyer. They can answer any question. None of the answers are as good as a specialist's would be.</p>
          <p>The problem isn't that the model is bad at any one job. It's that being a generalist means never being accountable to a specialty. A coder who also writes contracts ships <em>survivable</em> versions of both. That's the tax.</p>
        </Chapter>

        <PullQuote attribution="Anton Osipov · Founder">
          A coder who also writes contracts ships survivable versions of both. That's the tax.
        </PullQuote>

        <Chapter num="II" title="Specialization Compounds" heading="A specialist gets better at one thing.">
          <p>Over a year, the specialist–generalist gap isn't linear — it compounds. The specialist iterates on one job. Every iteration sharpens judgment, widens the edge cases, deepens the pattern library. The generalist stretches thinner.</p>
          <p>Human teams figured this out long ago. We don't ask marketing to write the API docs. When you build AI the same way — specialist agents with specific prompts, tools, memory, review — you inherit what humans have learned over centuries of running workshops, studios, and newsrooms.</p>
        </Chapter>

        {/* Section III — cinematic dark */}
        <section className="bg-ink text-base px-6 py-14">
          <div className="max-w-prose mx-auto">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">III · Governance Is the Product</div>
            <h2 className="font-serif text-3xl text-base mb-6 leading-tight">
              The industry worships autonomy. For most work, that's an antifeature.
            </h2>
            <div className="space-y-4 font-sans text-[15px] text-base/85 leading-relaxed">
              <p>The AI industry has a religion problem. It worships autonomy. <em className="text-base/70">"Fully agentic." "No human in the loop." "Autonomous."</em> These are marketed as virtues. For the work most teams care about, they're antifeatures.</p>
              <p>What teams need isn't more autonomy. It's more coordination and accountability. Humans at the right points, with the right authority, reviewing the right things. We call these <strong className="text-base">human gates.</strong></p>
              <p>Governance isn't a feature bolted on top of an autonomous system. It IS the product. Remove the gates and you've removed the thing clients are paying for: a team that ships work they can stand behind.</p>
            </div>
          </div>
        </section>

        <Chapter num="IV" title="Orchestration Is the Moat" heading="Models commoditize. Orchestration doesn't.">
          <p>This week's best model will be matched in three months and beaten in six. Anyone betting their moat on model supremacy is betting the wrong race.</p>
          <p>The work that doesn't commoditize is orchestration — the controller layer that decides which specialist takes which input, where the gates are, what the memory looks like, how failures cascade. That layer is where compounding knowledge lives.</p>
        </Chapter>

        <PullQuote>Models are plentiful and commoditizing. Orchestration is scarce and compounding.</PullQuote>

        {/* Section V — Playbook */}
        <section className="px-6 py-10 max-w-prose mx-auto">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">V · The DaVeenci Playbook</div>
          <h2 className="font-serif text-3xl text-ink mb-5 leading-tight">
            Every team we build follows the same shape.
          </h2>
          <div className="space-y-4 font-sans text-[15px] text-ink leading-relaxed mb-6">
            <p>The architecture isn't bespoke per domain. It's a pattern we apply to whatever knowledge-work lives in front of us. Five pieces:</p>
          </div>

          <div className="space-y-3">
            {PLAYBOOK.map((piece) => (
              <div key={piece.label} className="bg-white/60 border border-ink/10 rounded-sm p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-1.5">{piece.label}</div>
                <p className="font-sans text-[14px] text-ink leading-relaxed">{piece.body}</p>
              </div>
            ))}
          </div>

          <p className="font-sans text-[15px] text-ink leading-relaxed mt-6">
            This structure scales from one team to many. We built it first for code. We built it for real estate media. The pattern holds because the pattern is what matters — the domain is what varies.
          </p>
        </section>

        <Chapter num="VI" title="What This Unlocks" heading="One team per knowledge-work domain.">
          <p>That's the destination. Not one product. Not one model. A team for code. A team for media. A team for research. A team for creative. A team for strategy. Each one orchestrated, human-gated, accountable to its output.</p>
          <p>This isn't a product roadmap. It's a pattern we apply to whatever domain comes next. If you have a specialized workflow that produces finished work — and you care about the finished work being right — there's a DaVeenci team design for it.</p>
          <p><strong>We build the team. You own the output. That's the whole pitch.</strong></p>
        </Chapter>

        {/* End CTA */}
        <section className="px-6 py-14 max-w-prose mx-auto">
          <h2 className="font-serif text-3xl text-ink mb-5 text-center leading-tight">
            Want a team for your domain?
          </h2>
          <p className="font-sans text-[15px] text-ink-muted leading-relaxed mb-8 text-center">
            Thirty minutes. No slide deck. Bring the workflow you want a team for and we'll tell you honestly whether we're the right shop to build it.
          </p>
          <div className="flex flex-col gap-3">
            <MobileButton onClick={() => onNavigate('calendar')}>Talk to us</MobileButton>
            <MobileButton variant="secondary" onClick={() => onNavigate('work')}>
              See the work
            </MobileButton>
          </div>
        </section>

        <div className="h-16" />
      </MobileErrorBoundary>
      </main>
    </div>
  );
};

// --- Local presentational helpers ---

const Chapter: React.FC<{ num: string; title: string; heading: string; children: React.ReactNode }> = ({
  num,
  title,
  heading,
  children,
}) => (
  <section className="px-6 py-10 max-w-prose mx-auto">
    <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
      {num} · {title}
    </div>
    <h2 className="font-serif text-3xl text-ink mb-5 leading-tight">{heading}</h2>
    <div className="space-y-4 font-sans text-[15px] text-ink leading-relaxed">{children}</div>
  </section>
);

const PullQuote: React.FC<{ children: React.ReactNode; attribution?: string }> = ({ children, attribution }) => (
  <section className="px-6 py-6">
    <blockquote className="max-w-prose mx-auto border-l-2 border-accent/40 pl-5">
      <p className="font-serif italic text-xl text-ink leading-[1.4]">{children}</p>
      {attribution && (
        <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
          — {attribution}
        </footer>
      )}
    </blockquote>
  </section>
);
