import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, ScrollReveal, VitruvianBackground, NodeNetworkBackground, Button, PageHero, Quote, Surface, Plate } from './Shared';
import type { Page } from './types';
import AntonSketch from '../images/Anton_Sketch.webp';
import AstridSketch from '../images/Astrid_Sketch.webp';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileWhoWeArePage } from './mobile/MobileWhoWeArePage';

interface WhoWeArePageProps {
   onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const WhoWeArePage: React.FC<WhoWeArePageProps> = (props) => {
   const isMobile = useIsMobile();
   if (isMobile) return <MobileWhoWeArePage {...props} />;
   return <WhoWeArePageDesktop {...props} />;
};

const WhoWeArePageDesktop: React.FC<WhoWeArePageProps> = ({ onNavigate }) => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   return (
      <div className="flex flex-col w-full min-h-screen">
         <Header onNavigate={onNavigate} currentPage="who-we-are" />

         {/* Intro */}
         <Section className="pt-40 pb-12 md:pt-48 md:pb-16">
            <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-[1.15]" />
            <ScrollReveal className="max-w-4xl mx-auto relative z-10">
               <PageHero
                  eyebrow="Folio 0 — The Mission"
                  title={<>We build the team. <br /><span className="italic text-ink-muted">You own the output.</span></>}
                  description={<>DaVeenci is two people and a workshop. We design specialist AI teams for founders whose work is stuck between a chat window and a team they can't afford to hire.</>}
                  size="md"
                  centered
               />
               <div className="w-24 h-px bg-accent/40 mx-auto mt-2"></div>
            </ScrollReveal>
         </Section>

         {/* Anton — founder story (cinematic dark) */}
         <Section className="bg-ink text-base relative">
            <NodeNetworkBackground colorVar="--color-base" />
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
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         {/* Astrid — the partner */}
         <Section className="bg-white/40 relative" pattern="nodes">
            <div className="max-w-5xl mx-auto">
               <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                     <div className="md:col-span-4">
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
                              className="relative w-full rounded-sm shadow-xl shadow-ink/10 border border-ink/10 filter sepia-[0.15] contrast-105"
                           />
                           <div className="mt-6 text-center">
                              <div className="font-serif text-2xl text-ink">Astrid Abrahamyan</div>
                              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-1">Partner</div>
                           </div>
                        </div>
                     </div>
                     <div className="md:col-span-8 space-y-8">
                        <Quote>
                           Every team we build starts the same way — a founder showing me the workflow that's eating their week.
                        </Quote>
                        <div className="space-y-5 font-sans text-ink-muted text-lg leading-relaxed">
                           <p>
                              I own the conversations. Every founder who talks to us arrives with a story about work that's stuck — a bottleneck, a handoff, a tool that almost gets there. My job is to listen carefully enough to translate that into a team design we can actually build.
                           </p>
                           <p>
                              It's not a discovery questionnaire. It's a working session. By the end I can usually tell you which specialists you'd need, where the human gates should sit, and how we'd scope the first cut. Sometimes the honest answer is that we're not the right workshop for this — and I'll tell you that, too.
                           </p>
                           <p>
                              If you have a workflow you want specialists for, the first step is thirty minutes with me. No slide deck. Bring the thing that's stuck.
                           </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                           <Button variant="primary" onClick={() => onNavigate('calendar')}>
                              Book a call with Astrid
                           </Button>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         {/* The Distinction — three Folio III-style plates + a fun CTA widget */}
         <Section>
            <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-[1.15]" />
            <div className="max-w-7xl mx-auto relative z-10">
               <ScrollReveal className="mb-12 text-center max-w-2xl mx-auto">
                  <p className="font-serif italic text-sm tracking-[0.15em] uppercase text-ink-muted mb-3">The Distinction</p>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink leading-tight">
                     Why DaVeenci.
                  </h2>
               </ScrollReveal>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-20">
                  <ScrollReveal delay={100}>
                     <Plate fig="a" title="Teams" tilt={false}>
                        <div className="relative h-full flex flex-col items-center pt-2 pb-6">
                           <svg viewBox="0 40 240 130" className="w-full max-w-[320px] mx-auto">
                              {/* Left — single tool */}
                              <g transform="translate(54, 90)">
                                 <rect x="-20" y="-18" width="40" height="36" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
                                 <line x1="-20" y1="-9" x2="20" y2="-9" stroke="rgb(var(--color-ink))" strokeWidth="0.5" opacity="0.3" />
                                 <circle cx="-14" cy="-13.5" r="1.2" fill="rgb(var(--color-ink-muted))" opacity="0.55" />
                                 <circle cx="-10" cy="-13.5" r="1.2" fill="rgb(var(--color-ink-muted))" opacity="0.55" />
                                 <circle cx="-6" cy="-13.5" r="1.2" fill="rgb(var(--color-ink-muted))" opacity="0.55" />
                                 <text x="0" y="2" textAnchor="middle" fontSize="10" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))">?</text>
                                 <text x="0" y="13" textAnchor="middle" fontSize="10" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))">?</text>
                              </g>
                              <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">TOOL</text>

                              {/* Connector mote */}
                              <line x1="80" y1="90" x2="155" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
                              <circle cy="90" r="2.4" opacity="0" fill="rgb(var(--color-accent))">
                                 <animate attributeName="cx" values="80;155" dur="2.2s" repeatCount="indefinite" />
                                 <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>

                              {/* Right — team cluster */}
                              <g transform="translate(186, 90)">
                                 <circle cx="0" cy="0" r="8" fill="rgb(var(--color-accent))" fillOpacity="0.15" stroke="rgb(var(--color-accent))" strokeWidth="1.3" />
                                 <circle cx="0" cy="0" r="2" fill="rgb(var(--color-accent))" />
                                 <circle cx="-18" cy="-14" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                 <circle cx="18" cy="-14" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                 <circle cx="0" cy="18" r="5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                 <line x1="-14" y1="-11" x2="-6" y2="-3" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                 <line x1="14" y1="-11" x2="6" y2="-3" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                 <line x1="0" y1="13" x2="0" y2="6" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                              </g>
                              <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">TEAM</text>
                           </svg>

                           <div className="text-center px-3 mt-auto">
                              <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">one tool · many specialists</p>
                              <p className="text-sm text-ink-muted leading-relaxed">
                                 The industry ships one more generalist chatbox every quarter. We ship specialist teams.
                              </p>
                           </div>
                        </div>
                     </Plate>
                  </ScrollReveal>

                  <ScrollReveal delay={250}>
                     <Plate fig="b" title="Builders" tilt={false}>
                        <div className="relative h-full flex flex-col items-center pt-2 pb-6">
                           <svg viewBox="0 40 240 130" className="w-full max-w-[320px] mx-auto">
                              {/* Left — stack of slides */}
                              <g transform="translate(54, 90)">
                                 <rect x="-20" y="-18" width="32" height="22" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1" opacity="0.5" />
                                 <rect x="-17" y="-15" width="32" height="22" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1" opacity="0.75" />
                                 <rect x="-14" y="-12" width="32" height="22" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />
                                 <line x1="-9" y1="-7" x2="13" y2="-7" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.5" />
                                 <line x1="-9" y1="-3" x2="13" y2="-3" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.5" />
                                 <line x1="-9" y1="1" x2="6" y2="1" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.5" />
                                 <line x1="-9" y1="5" x2="13" y2="5" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.5" />
                              </g>
                              <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">DECK</text>

                              {/* Connector mote */}
                              <line x1="80" y1="90" x2="155" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
                              <circle cy="90" r="2.4" opacity="0" fill="rgb(var(--color-accent))">
                                 <animate attributeName="cx" values="80;155" dur="2.2s" repeatCount="indefinite" />
                                 <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>

                              {/* Right — shipping stack: repo / pipeline / dashboard */}
                              <g transform="translate(186, 90)">
                                 {/* Repo brackets */}
                                 <g transform="translate(0, -18)">
                                    <path d="M -14,-4 L -18,-4 L -18,4 L -14,4" stroke="rgb(var(--color-ink))" strokeWidth="1.3" fill="none" />
                                    <path d="M 14,-4 L 18,-4 L 18,4 L 14,4" stroke="rgb(var(--color-ink))" strokeWidth="1.3" fill="none" />
                                    <text x="0" y="2" textAnchor="middle" fontSize="7" fill="rgb(var(--color-ink-muted))" fontFamily="monospace">repo</text>
                                 </g>
                                 {/* Pipeline */}
                                 <g>
                                    <line x1="-14" y1="0" x2="14" y2="0" stroke="rgb(var(--color-accent))" strokeWidth="0.8" opacity="0.4" />
                                    <circle cx="-14" cy="0" r="2" fill="rgb(var(--color-accent))" fillOpacity="0.3" stroke="rgb(var(--color-accent))" strokeWidth="0.8" />
                                    <circle cx="0" cy="0" r="2" fill="rgb(var(--color-accent))">
                                       <animate attributeName="r" values="2;2.8;2" dur="1.6s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="14" cy="0" r="2" fill="rgb(var(--color-accent))" fillOpacity="0.3" stroke="rgb(var(--color-accent))" strokeWidth="0.8" />
                                 </g>
                                 {/* Dashboard bars */}
                                 <g transform="translate(-11, 10)">
                                    <rect x="0" y="8" width="3" height="6" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
                                    <rect x="5" y="3" width="3" height="11" fill="rgb(var(--color-ink-muted))" opacity="0.6" />
                                    <rect x="10" y="6" width="3" height="8" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
                                    <rect x="15" y="0" width="3" height="14" fill="rgb(var(--color-accent))" />
                                    <rect x="20" y="5" width="3" height="9" fill="rgb(var(--color-ink-muted))" opacity="0.5" />
                                 </g>
                              </g>
                              <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">STACK</text>
                           </svg>

                           <div className="text-center px-3 mt-auto">
                              <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">slides off · outputs on</p>
                              <p className="text-sm text-ink-muted leading-relaxed">
                                 Consultants hand you a deck. We hand you a repo, a pipeline, a dashboard, an output.
                              </p>
                           </div>
                        </div>
                     </Plate>
                  </ScrollReveal>

                  <ScrollReveal delay={400}>
                     <Plate fig="c" title="Governance" tilt={false}>
                        <div className="relative h-full flex flex-col items-center pt-2 pb-6">
                           <svg viewBox="0 40 240 130" className="w-full max-w-[320px] mx-auto">
                              {/* Left — AGENT (chip) */}
                              <g transform="translate(54, 90)">
                                 <rect x="-16" y="-16" width="32" height="32" rx="3" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.5" />
                                 {/* Chip pins */}
                                 <line x1="-18" y1="-8" x2="-16" y2="-8" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 <line x1="-18" y1="0" x2="-16" y2="0" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 <line x1="-18" y1="8" x2="-16" y2="8" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 <line x1="16" y1="-8" x2="18" y2="-8" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 <line x1="16" y1="0" x2="18" y2="0" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 <line x1="16" y1="8" x2="18" y2="8" stroke="rgb(var(--color-ink))" strokeWidth="1" />
                                 {/* Inner die */}
                                 <rect x="-8" y="-8" width="16" height="16" rx="1" fill="none" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.8" />
                                 <circle cx="0" cy="0" r="2" fill="rgb(var(--color-ink-muted))" />
                              </g>
                              <text x="54" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">AGENT</text>

                              {/* Connector mote */}
                              <line x1="80" y1="90" x2="155" y2="90" stroke="rgb(var(--color-accent))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.55" />
                              <circle cy="90" r="2.4" opacity="0" fill="rgb(var(--color-accent))">
                                 <animate attributeName="cx" values="80;155" dur="2.2s" repeatCount="indefinite" />
                                 <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.2s" repeatCount="indefinite" />
                              </circle>

                              {/* Right — GATED (human + output with pulsing approval) */}
                              <g transform="translate(186, 90)">
                                 {/* Human silhouette / gate */}
                                 <g transform="translate(-14, 0)">
                                    <rect x="-9" y="-16" width="18" height="32" rx="1.5" fill="white" stroke="#16a34a" strokeWidth="1.6">
                                       <animate attributeName="stroke-width" values="1.4;2.1;1.4" dur="1.8s" repeatCount="indefinite" />
                                    </rect>
                                    <circle cx="0" cy="-7" r="3" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="1" />
                                    <path d="M -4 7 Q -4 -1 0 -1 Q 4 -1 4 7" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="1" />
                                 </g>
                                 {/* Output document */}
                                 <g transform="translate(10, 0)">
                                    <rect x="0" y="-16" width="18" height="32" rx="1" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" />
                                    <line x1="3" y1="-10" x2="15" y2="-10" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                    <line x1="3" y1="-5" x2="15" y2="-5" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                    <line x1="3" y1="0" x2="11" y2="0" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                    <line x1="3" y1="5" x2="15" y2="5" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                 </g>
                                 {/* Approval seal — pulsing on top of document */}
                                 <circle cx="16" cy="14" r="4.5" fill="#16a34a">
                                    <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" repeatCount="indefinite" />
                                 </circle>
                                 <path d="M 13.5 14 L 15.2 15.8 L 18.5 12" stroke="white" strokeWidth="1.3" fill="none" />
                              </g>
                              <text x="186" y="140" textAnchor="middle" fontSize="10" fill="rgb(var(--color-ink-muted))" fontFamily="serif" fontStyle="italic" letterSpacing="0.2em">GATED</text>
                           </svg>

                           <div className="text-center px-3 mt-auto">
                              <p className="font-serif italic tracking-[0.2em] text-xs font-semibold uppercase text-accent mb-2">human in the loop</p>
                              <p className="text-sm text-ink-muted leading-relaxed">
                                 Human gates at the critical points. You own the output — not the liability.
                              </p>
                           </div>
                        </div>
                     </Plate>
                  </ScrollReveal>
               </div>

               {/* CTA widget — Fig. d */}
               <ScrollReveal delay={300}>
                  <div className="max-w-5xl mx-auto">
                     <Surface kind="document" raised className="relative bg-white/60 backdrop-blur-[2px] border border-ink/10 p-8 md:p-12 rounded-sm">
                        <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
                           <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-ink/15" />
                              <div className="w-3 h-3 rounded-full bg-ink/15" />
                              <div className="w-3 h-3 rounded-full bg-ink/15" />
                           </div>
                           <div className="font-serif italic text-xs tracking-[0.2em] text-ink-muted uppercase">
                              Fig. d · Start Here
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                           <div className="md:col-span-7">
                              <h3 className="font-serif text-3xl md:text-4xl text-ink mb-4 leading-tight">
                                 Want a team for <em className="italic text-accent">your domain?</em>
                              </h3>
                              <p className="font-sans text-ink-muted leading-relaxed mb-6 max-w-md">
                                 Thirty minutes with us. No slide deck. Bring the workflow you want a team for and we'll tell you honestly whether we're the right shop to build it.
                              </p>
                              <div className="flex flex-col sm:flex-row gap-3">
                                 <Button variant="primary" onClick={() => onNavigate('calendar')}>
                                    Talk to us
                                 </Button>
                                 <Button variant="secondary" onClick={() => onNavigate('work')}>
                                    See the work
                                 </Button>
                              </div>
                           </div>
                           <div className="md:col-span-5 flex justify-center">
                              <svg viewBox="0 0 220 150" className="w-full max-w-[260px]">
                                 {/* Your domain — dashed box */}
                                 <g transform="translate(44, 75)">
                                    <rect x="-24" y="-22" width="48" height="44" rx="2" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.3" strokeDasharray="3 2" />
                                    <text x="0" y="-4" textAnchor="middle" fontSize="8" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))" letterSpacing="0.15em">YOUR</text>
                                    <text x="0" y="8" textAnchor="middle" fontSize="8" fontFamily="serif" fontStyle="italic" fill="rgb(var(--color-ink-muted))" letterSpacing="0.15em">DOMAIN</text>
                                 </g>

                                 {/* Connector mote */}
                                 <line x1="72" y1="75" x2="148" y2="75" stroke="rgb(var(--color-accent))" strokeWidth="1" strokeDasharray="3 2" opacity="0.55" />
                                 <circle cy="75" r="2.6" opacity="0" fill="rgb(var(--color-accent))">
                                    <animate attributeName="cx" values="72;148" dur="2.2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="2.2s" repeatCount="indefinite" />
                                 </circle>

                                 {/* Specialist team */}
                                 <g transform="translate(176, 75)">
                                    <circle cx="0" cy="0" r="10" fill="rgb(var(--color-accent))" fillOpacity="0.15" stroke="rgb(var(--color-accent))" strokeWidth="1.3">
                                       <animate attributeName="r" values="10;11.5;10" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="0" cy="0" r="2.5" fill="rgb(var(--color-accent))" />
                                    <circle cx="-20" cy="-16" r="5.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                    <circle cx="20" cy="-16" r="5.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                    <circle cx="0" cy="22" r="5.5" fill="white" stroke="rgb(var(--color-ink))" strokeWidth="1.2" />
                                    <line x1="-15" y1="-13" x2="-6" y2="-4" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                    <line x1="15" y1="-13" x2="6" y2="-4" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                    <line x1="0" y1="17" x2="0" y2="6" stroke="rgb(var(--color-ink-muted))" strokeWidth="0.6" />
                                 </g>
                              </svg>
                           </div>
                        </div>
                     </Surface>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         <Footer onNavigate={onNavigate} />
      </div>
   );
};

export default WhoWeArePage;
