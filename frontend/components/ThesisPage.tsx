import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, GridPattern, VitruvianBackground, Quote, Button, Surface } from './Shared';
import type { Page } from './types';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileThesisPage } from './mobile/MobileThesisPage';

interface ThesisPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const ThesisPage: React.FC<ThesisPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileThesisPage {...props} />;
  return <ThesisPageDesktop {...props} />;
};

const ThesisPageDesktop: React.FC<ThesisPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="thesis" />

      {/* Hero — essay-style, distinct from the marketing Folio I on the home page */}
      <Section className="pt-44 pb-16 md:pt-52 md:pb-24">
        <GridPattern />
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal immediate>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-10 bg-ink-muted/40" />
              <span className="font-serif italic text-xs tracking-[0.3em] uppercase text-ink-muted">An Essay · Manifesto</span>
              <span className="h-px w-10 bg-ink-muted/40" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.05] mb-8">
              The case against <br /><span className="italic text-accent">generalist AI.</span>
            </h1>
            <p className="font-serif text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto mb-8">
              The next era of knowledge work won't be won by bigger models. It'll be won by better teams. Here's the case — in six parts.
            </p>
            <div className="flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted/70">
              <span>Anton Osipov</span>
              <span className="text-ink-muted/30">·</span>
              <span>April 2026</span>
              <span className="text-ink-muted/30">·</span>
              <span>8 min read</span>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* The essay */}
      <article className="relative">
        <VitruvianBackground className="opacity-[0.04]" />

        {/* Opening */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="font-serif italic text-xl md:text-2xl text-ink-muted leading-relaxed mb-4">
                Short version: the industry is selling one generalist AI tool to do every knowledge-work job. That's a bad answer. A team of specialists is a better answer. We build the team.
              </p>
              <p className="font-sans text-ink-muted text-lg leading-relaxed">
                Long version below.
              </p>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 1: The Generalist Tax */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">I · The Generalist Tax</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                One model, every job.
              </h2>
              <div className="space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  The default AI product in 2026 is a single model with a chat window. Ask it to write code. Ask it to read a contract. Ask it to plan a quarter. Same box, different prompts.
                </p>
                <p>
                  It's the consulting equivalent of hiring one person to be your salesperson, your copywriter, your accountant, and your lawyer. They can answer any question. None of the answers are as good as a specialist's would be.
                </p>
                <p>
                  The problem isn't that the model is bad at any one job. The problem is that being a generalist means never being accountable to a specialty. A coder who also writes contracts doesn't ship great code or great contracts. They ship <em>survivable</em> versions of both. That's the tax you pay for a generalist.
                </p>
                <p>
                  The industry sells generalists because generalists are a simpler product. One model, one price, one pitch. A team is harder to sell, harder to build, harder to govern. But a team is the better answer. And the gap widens every quarter.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Pull quote 1 */}
        <Section className="py-6 md:py-10">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <Quote attribution="Anton Osipov · Founder">
                A coder who also writes contracts ships survivable versions of both. That's the tax.
              </Quote>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 2: Specialization Compounds */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">II · Specialization Compounds</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                A specialist gets better at one thing. A generalist gets mediocre at many.
              </h2>
              <div className="space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  Over a year, the specialist-generalist gap isn't linear — it compounds. The specialist iterates on one job. Every iteration sharpens judgment, widens the edge cases they handle, deepens the pattern library they draw from. The generalist stretches thinner across the same time.
                </p>
                <p>
                  Human teams figured this out a long time ago. We don't ask marketing to write the API documentation. We don't ask engineering to run the customer call. Specialization is how professional work actually scales — how any serious output has ever been shipped at volume.
                </p>
                <p>
                  When you build an AI system the same way — specialist agents with specific prompts, specific tools, specific memory, specific review — you inherit the benefits humans have figured out over centuries of running workshops, studios, newsrooms, factories. Coordination overhead is real. The specialization win dwarfs it.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 3: Governance Is the Product (cinematic dark) */}
        <Section className="py-14 md:py-20 bg-ink text-base relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-accent/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">III · Governance Is the Product</div>
              <h2 className="font-serif text-3xl md:text-4xl text-base mb-6 leading-tight">
                The industry worships autonomy. For most work, that's an antifeature.
              </h2>
              <div className="space-y-5 font-sans text-base/85 text-lg leading-relaxed">
                <p>
                  The AI industry has a religion problem. It worships autonomy. <em className="text-base/70">"Fully agentic." "No human in the loop." "Autonomous."</em> These phrases are marketed as virtues. For the work most teams care about, they're antifeatures.
                </p>
                <p>
                  What teams actually need isn't more autonomy. It's more coordination and more accountability. That means humans — at the right points, with the right authority, reviewing the right things. We call these <strong className="text-base">human gates.</strong>
                </p>
                <p>
                  PureCode has three gates: <em>scope</em> (before anything is built), <em>design</em> (before implementation), <em>ship</em> (before merge). AutoPilot routes unreadable, ambiguous, and high-consequence decisions to operators instead of silently passing them. Every DaVeenci team has gates. Not because automation can't go further without them — it can — but because the output needs to be accountable to someone, and that someone needs to be a human making a real decision.
                </p>
                <p>
                  Governance isn't a feature bolted on top of an autonomous system. It IS the product. Remove the gates and you've removed the thing clients are paying for: a team that ships work they can stand behind.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 4: Orchestration Is the Moat */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">IV · Orchestration Is the Moat</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                Models commoditize. Orchestration doesn't.
              </h2>
              <div className="space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  This week's best model will be matched in three months and beaten in six. Anyone betting their moat on model supremacy is betting the wrong race.
                </p>
                <p>
                  The work that doesn't commoditize is orchestration — the controller layer that decides which specialist takes which input, where the gates are, what the memory looks like, how failures cascade and where rescue loops kick in. That layer is where compounding knowledge lives. It's where "we built this team before and learned how it breaks" turns into institutional skill.
                </p>
                <p>
                  We're building toward a world where models are plentiful and orchestration is scarce. DaVeenci's moat is not any one model we use — we'll swap them as they improve. It's the playbook for building teams that ship.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Pull quote 2 */}
        <Section className="py-6 md:py-10">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <Quote>
                Models are plentiful and commoditizing. Orchestration is scarce and compounding.
              </Quote>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 5: The Playbook */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">V · The DaVeenci Playbook</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                Every team we build follows the same shape.
              </h2>
              <div className="space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  The architecture isn't bespoke per domain. It's a pattern we apply to whatever knowledge-work lives in front of us. Five pieces:
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    label: 'Controller',
                    body: 'The orchestrator. Routes work between specialists, manages handoffs, owns the retry logic when something fails.',
                  },
                  {
                    label: 'Specialists',
                    body: 'Each one tuned to one job — its own prompts, its own tools, its own memory. A specialist doesn\'t know how to do other specialists\' jobs, and that\'s the point.',
                  },
                  {
                    label: 'Human gates',
                    body: 'Review checkpoints at the decision points that matter. Not "approve everything" — "approve the things that can\'t be un-approved once they ship."',
                  },
                  {
                    label: 'Observability',
                    body: 'Every step logged, inspectable, replayable. Teams that ship need debuggability; this layer is non-negotiable.',
                  },
                  {
                    label: 'Memory',
                    body: 'Shared knowledge store so specialists build on each other\'s work across runs. Without it, the team starts every job from scratch.',
                  },
                ].map((piece) => (
                  <Surface key={piece.label} kind="document" className="p-6 bg-white/60 border border-ink/10">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">{piece.label}</div>
                    <p className="font-sans text-ink leading-relaxed">{piece.body}</p>
                  </Surface>
                ))}
              </div>

              <div className="mt-8 space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  This structure scales from one team to many. We built it first for code. We built it for real estate media. The pattern holds because the pattern is what matters — the domain is what varies.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* Section 6: What This Unlocks */}
        <Section className="py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">VI · What This Unlocks</div>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                One team per knowledge-work domain.
              </h2>
              <div className="space-y-5 font-sans text-ink text-lg leading-relaxed">
                <p>
                  That's the destination. Not one product. Not one model. A team for code. A team for media. A team for research. A team for creative. A team for strategy. Each one orchestrated, human-gated, accountable to its output.
                </p>
                <p>
                  This isn't a product roadmap. It's a pattern we apply to whatever domain comes next. If you have a specialized workflow that produces finished work — and you care about the finished work being right — there's a DaVeenci team design for it.
                </p>
                <p>
                  We build the team. You own the output. That's the whole pitch.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Section>

        {/* CTA */}
        <Section className="py-16 md:py-20" pattern="circles">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
                Want a team for your domain?
              </h2>
              <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
                Thirty minutes. No slide deck. Bring the workflow you want a team for and we'll tell you honestly whether we're the right shop to build it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" onClick={() => onNavigate('calendar')} className="text-base px-8 py-4">
                  Talk to us
                </Button>
                <Button variant="secondary" onClick={() => onNavigate('work')} className="text-base px-8 py-4">
                  See the work
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Section>
      </article>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default ThesisPage;
