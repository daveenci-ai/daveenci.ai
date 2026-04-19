import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, VitruvianBackground, Button, PageHero, Quote, Surface } from './Shared';
import type { Page } from './types';
import { Target, Zap } from 'lucide-react';
import AntonSketch from '../images/Anton_Sketch.jpg';
import AstridSketch from '../images/Astrid_Sketch.jpg';

interface WhoWeArePageProps {
   onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const WhoWeArePage: React.FC<WhoWeArePageProps> = ({ onNavigate }) => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="flex flex-col w-full min-h-screen bg-base">
         <Header onNavigate={onNavigate} currentPage="who-we-are" />

         {/* Intro */}
         <Section className="pt-40 pb-12 md:pt-48 md:pb-16" pattern="grid">
            <VitruvianBackground className="opacity-[0.1]" />
            <ScrollReveal className="max-w-4xl mx-auto relative z-10">
               <PageHero
                  eyebrow="Folio 0 — The Origin"
                  title={<>A workshop of <br /><span className="italic text-ink-muted">specialist teams.</span></>}
                  description={<>DaVeenci builds specialist AI teams — one team per knowledge-work domain. Code, media, and the ones we're designing next. The workshop is two people: a founder and a partner. The teams we ship are many.</>}
                  size="md"
                  centered
               />
               <div className="w-24 h-px bg-accent/40 mx-auto mt-2"></div>
            </ScrollReveal>
         </Section>

         {/* Anton — founder story (cinematic dark) */}
         <Section className="bg-ink text-base relative">
            <VitruvianBackground className="opacity-[0.04] text-base" />
            <div className="max-w-5xl mx-auto relative z-10">
               <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                     <div className="md:col-span-4">
                        <div className="relative w-full max-w-xs mx-auto">
                           <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full border border-base/10 scale-[1.08] pointer-events-none"
                           />
                           <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full border border-base/5 scale-[1.18] pointer-events-none"
                           />
                           <img
                              src={AntonSketch}
                              alt="Anton Osipov"
                              className="relative w-full rounded-sm shadow-2xl shadow-black/30 border border-base/10 filter sepia-[0.15] contrast-105"
                           />
                           <div className="mt-6 text-center">
                              <div className="font-serif text-2xl text-base">Anton Osipov</div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-base/50 mt-1">Founder</div>
                           </div>
                        </div>
                     </div>
                     <div className="md:col-span-8 space-y-8">
                        <Quote tone="dark">
                           I spent a decade shipping software with mediocre AI help — watching every new model promise to replace my tools and deliver another wrapper around chat.
                        </Quote>
                        <div className="space-y-5 font-sans text-base/80 text-lg leading-relaxed">
                           <p>
                              For years I thought the answer was a better model. A bigger context window. A cleverer prompt. Every wave of "this one changes everything" left me with the same workflow and the same bottlenecks. Generalist tools flatten the work. They don't finish it.
                           </p>
                           <p>
                              Then I stopped trying to hire a generalist tool, and started building a team of specialists. DaVeenci is that bet — one workshop, many teams, each one good at one thing. Code. Media. Research. Whatever domain the work actually lives in.
                           </p>
                           <p>
                              A good team beats a good tool. Not because specialists are smarter — they're not. Because coordination, governance, and accountability are what ship finished work. We build the team. You own the output. That's the whole pitch.
                           </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                           <Button variant="ghost" onClick={() => onNavigate('calendar')} className="text-base/90 hover:text-base">
                              Book a founder call
                           </Button>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         {/* Astrid — the partner */}
         <Section className="bg-base">
            <div className="max-w-5xl mx-auto">
               <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start md:flex-row-reverse">
                     <div className="md:col-span-4 md:order-2">
                        <div className="relative w-full max-w-xs mx-auto">
                           <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full border border-ink/10 scale-[1.08] pointer-events-none"
                           />
                           <div
                              aria-hidden="true"
                              className="absolute inset-0 rounded-full border border-ink/5 scale-[1.18] pointer-events-none"
                           />
                           <img
                              src={AstridSketch}
                              alt="Astrid Abrahamyan"
                              className="relative w-full rounded-sm shadow-lg border border-ink/10 filter sepia-[0.15] contrast-105"
                           />
                           <div className="mt-6 text-center">
                              <div className="font-serif text-2xl text-ink">Astrid Abrahamyan</div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-1">Partner &amp; Solution Architect</div>
                           </div>
                        </div>
                     </div>
                     <div className="md:col-span-8 md:order-1 space-y-5 font-sans text-ink-muted text-lg leading-relaxed">
                        <p>
                           I own the conversations. Every team DaVeenci builds starts with a founder telling me how their work is stuck — the bottlenecks, the handoffs, the places their current AI tools fall short. My job is to translate that into a team design we can actually ship.
                        </p>
                        <p>
                           If you want to build a specialist team for your domain, the first step is a 30-minute call with me. No slide decks. Bring the workflow you'd like us to fix, or the strategic gap you want to close. I'll tell you honestly whether we're the right team to build it.
                        </p>
                        <div className="pt-2">
                           <Button variant="secondary" onClick={() => onNavigate('calendar')}>
                              Schedule a call with Astrid
                           </Button>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         {/* How we're different — kept, retuned copy */}
         <Section pattern="nodes" className="bg-white/40 border-y border-ink/5">
            <div className="max-w-7xl mx-auto">
               <ScrollReveal className="mb-12 text-center max-w-2xl mx-auto">
                  <p className="font-serif italic text-sm tracking-[0.15em] uppercase text-ink-muted mb-3">The Distinction</p>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
                     Why DaVeenci.
                  </h2>
               </ScrollReveal>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     {
                        n: '01',
                        title: 'Teams, not tools',
                        body: 'The industry ships one more generalist chatbox every quarter. We ship specialist teams — multiple agents, one controller, human gates, finished work.',
                     },
                     {
                        n: '02',
                        title: 'Builders, not advisors',
                        body: "Consultants give you a slide deck and walk away. We give you a team that's already shipping — a repo, a pipeline, a dashboard, an output.",
                     },
                     {
                        n: '03',
                        title: 'Governance, not autonomy',
                        body: 'Every team we build has human gates at the critical points. You own the output, not the liability. We never remove the human — we move them to the right place.',
                     },
                  ].map((card, i) => (
                     <ScrollReveal key={card.n} delay={100 + i * 150}>
                        <Surface kind="document" className="relative p-8 md:p-10 bg-white/60 border border-ink/10 h-full overflow-hidden">
                           <span aria-hidden="true" className="text-7xl font-serif text-ink/5 absolute top-4 right-6 font-bold leading-none select-none">
                              {card.n}
                           </span>
                           <h3 className="relative font-serif text-xl md:text-2xl text-ink mb-4 z-10">{card.title}</h3>
                           <p className="relative font-sans text-ink-muted leading-relaxed z-10">{card.body}</p>
                        </Surface>
                     </ScrollReveal>
                  ))}
               </div>
            </div>
         </Section>

         {/* Mission — moved to end, tightened */}
         <Section>
            <ScrollReveal className="max-w-3xl mx-auto">
               <Surface kind="document" className="p-10 md:p-14 bg-ink text-base relative overflow-hidden">
                  <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <Target className="relative w-10 h-10 text-accent mb-6" />
                  <h2 className="relative font-serif text-3xl md:text-4xl text-base mb-4">The mission.</h2>
                  <p className="relative font-sans text-lg md:text-xl text-base/80 leading-relaxed mb-6 font-medium">
                     One team per knowledge-work domain. Each one shipping finished work that humans own, governed at the right points by humans who care.
                  </p>
                  <ul className="relative space-y-3 text-base/60 font-sans">
                     <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent shrink-0" /> Coordination over generation</li>
                     <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent shrink-0" /> Governance over autonomy</li>
                     <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent shrink-0" /> Finished work over fast work</li>
                  </ul>
               </Surface>
            </ScrollReveal>
         </Section>

         {/* CTA */}
         <Section className="py-16 md:py-20" pattern="circles">
            <div className="max-w-3xl mx-auto text-center">
               <ScrollReveal>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink mb-6">
                     Want a team for your domain?
                  </h2>
                  <p className="font-sans text-lg text-ink-muted leading-relaxed mb-8">
                     Thirty minutes with us, no slide deck. Bring the workflow you want a team for.
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

         <Footer onNavigate={onNavigate} />
      </div>
   );
};

export default WhoWeArePage;
