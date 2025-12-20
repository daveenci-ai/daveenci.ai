
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section, SectionHeader, ScrollReveal, VitruvianBackground, Button } from './Shared';
import type { Page } from './types';
import { Target, Users, Zap, Award, BarChart3, Clock } from 'lucide-react';
import AntonSketch from '../images/Anton_Sketch.jpg';
import AstridSketch from '../images/Astrid_Sketch.jpg';

interface WhoWeArePageProps {
   onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const WhoWeArePage: React.FC<WhoWeArePageProps> = ({ onNavigate }) => {
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
   };

   return (
      <div className="flex flex-col w-full min-h-screen bg-base">
         <Header onNavigate={onNavigate} currentPage="who-we-are" />

         {/* Intro Section with Team integrated in Hero */}
         <Section className="pt-40 pb-20 md:pt-48 md:pb-28" pattern="grid">
            <VitruvianBackground className="opacity-[0.1]" />
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
               {/* Hero Text */}
               <ScrollReveal className="text-center max-w-4xl mx-auto mb-20">
                  <span className="font-script text-2xl text-accent mb-4 block rotate-[-2deg]">Folio 0 — The Origin</span>
                  <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink mb-8 leading-tight">
                     Engineers of <br /><span className="italic text-ink-muted">Elegant Efficiency.</span>
                  </h1>
                  <p className="font-sans text-xl md:text-2xl text-ink-muted leading-relaxed mb-8 max-w-2xl mx-auto">
                     DaVeenci is an AI & Automation consultancy built for the builders. Founded by ex-unicorn operators to bridge the gap between "cool AI demos" and "shipped revenue systems."
                  </p>
                  <div className="w-32 h-1 bg-accent/20 mx-auto"></div>
               </ScrollReveal>

               {/* Team Images - Frameless & Integrated */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 w-full max-w-5xl px-4">
                  {/* Anton Osipov */}
                  <ScrollReveal delay={200} className="flex flex-col items-center group">
                     <div className="w-full max-w-sm aspect-square relative mb-6 overflow-hidden rounded-sm shadow-sm">
                        <img
                           src={AntonSketch}
                           onError={handleImageError}
                           alt="Anton Osipov"
                           className="w-full h-full object-cover object-top"
                        />
                     </div>
                     <div className="text-center">
                        <h3 className="font-serif text-3xl text-ink mb-2">Anton Osipov</h3>
                        <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest">AI Implementation Engineer</p>
                     </div>
                  </ScrollReveal>

                  {/* Astrid Abrahamyan */}
                  <ScrollReveal delay={400} className="flex flex-col items-center group">
                     <div className="w-full max-w-sm aspect-square relative mb-6 overflow-hidden rounded-sm shadow-sm">
                        <img
                           src={AstridSketch}
                           alt="Astrid Abrahamyan"
                           className="w-full h-full object-cover object-top"
                        />
                     </div>
                     <div className="text-center">
                        <h3 className="font-serif text-3xl text-ink mb-2">Astrid Abrahamyan</h3>
                        <button
                           onClick={() => onNavigate('calendar')}
                           className="font-mono text-xs font-bold text-accent uppercase tracking-widest cursor-default"
                        >
                           Strategic Automation Consultant
                        </button>
                     </div>
                  </ScrollReveal>
               </div>
            </div>
         </Section>

         {/* Mission Section */}
         <Section className="bg-white/40 backdrop-blur-sm border-y border-ink/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
               <ScrollReveal>
                  <div className="bg-ink text-base p-10 md:p-12 rounded-sm shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                     <Target className="w-12 h-12 text-accent mb-6" />
                     <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Our Mission</h2>
                     <p className="font-sans text-lg md:text-xl text-white/80 leading-relaxed font-medium mb-8">
                        We exist to unlock human potential by automating the robotic work that consumes 40% of the modern workday.
                     </p>
                     <ul className="space-y-4 text-white/60">
                        <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent" /> Reduce operational drag</li>
                        <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent" /> Unlock proprietary data</li>
                        <li className="flex items-center gap-3"><Zap className="w-4 h-4 text-accent" /> Move metrics, not just tickets</li>
                     </ul>
                  </div>
               </ScrollReveal>

               <ScrollReveal delay={200}>
                  <h3 className="font-serif text-4xl text-ink mb-8">Who We Serve</h3>
                  <p className="text-lg text-ink-muted mb-8 leading-relaxed">
                     We are not a generalist agency. We specialize in high-velocity environments where speed and precision matter.
                  </p>

                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-sm flex-shrink-0">
                           <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                           <h4 className="font-bold text-ink text-lg">Growth-Stage B2B SaaS</h4>
                           <p className="text-ink-muted">Series A to C companies needing to scale GTM without scaling headcount linearly.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-sm flex-shrink-0">
                           <Award className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                           <h4 className="font-bold text-ink text-lg">Tech-Enabled Services</h4>
                           <p className="text-ink-muted">Agencies and firms looking to productize their service delivery via AI agents.</p>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
         </Section>

         {/* How We're Different */}
         <Section pattern="nodes">
            <div className="max-w-7xl mx-auto">
               <SectionHeader
                  eyebrow="The Distinction"
                  title="Why DaVeenci?"
                  subtitle="We don't sell hours. We sell shipped systems."
                  className="text-center mx-auto"
               />

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <ScrollReveal delay={100}>
                     <div className="bg-white/60 p-8 border border-ink/10 h-full hover:border-accent/50 transition-colors duration-300">
                        <span className="text-6xl font-serif text-ink/5 absolute top-4 right-6 font-bold">01</span>
                        <h3 className="text-xl font-bold text-ink mb-4 relative z-10">Bottlenecks, Not Features</h3>
                        <p className="text-ink-muted leading-relaxed relative z-10">
                           We don't start with "What AI tool should we use?" We start with "Where is the P&L bleeding?" We reverse-engineer automation from business pain.
                        </p>
                     </div>
                  </ScrollReveal>
                  <ScrollReveal delay={200}>
                     <div className="bg-white/60 p-8 border border-ink/10 h-full hover:border-accent/50 transition-colors duration-300">
                        <span className="text-6xl font-serif text-ink/5 absolute top-4 right-6 font-bold">02</span>
                        <h3 className="text-xl font-bold text-ink mb-4 relative z-10">Builders, Not Advisors</h3>
                        <p className="text-ink-muted leading-relaxed relative z-10">
                           Consultants give you a slide deck and walk away. We give you a GitHub repo, a deployed agent swarm, and a dashboard that works.
                        </p>
                     </div>
                  </ScrollReveal>
                  <ScrollReveal delay={300}>
                     <div className="bg-white/60 p-8 border border-ink/10 h-full hover:border-accent/50 transition-colors duration-300">
                        <span className="text-6xl font-serif text-ink/5 absolute top-4 right-6 font-bold">03</span>
                        <h3 className="text-xl font-bold text-ink mb-4 relative z-10">Weeks, Not Quarters</h3>
                        <p className="text-ink-muted leading-relaxed relative z-10">
                           The AI landscape changes weekly. Long implementation cycles are dead. We sprint in 2-week cycles to ship value immediately.
                        </p>
                     </div>
                  </ScrollReveal>
               </div>
            </div>
         </Section>

         {/* Proof / Outcomes */}
         <Section className="bg-ink text-white py-24">
            <div className="max-w-6xl mx-auto text-center">
               <h2 className="font-serif text-3xl md:text-4xl mb-16">The Output</h2>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
                  <div className="px-4 py-6">
                     <BarChart3 className="w-8 h-8 text-accent mx-auto mb-4" />
                     <div className="text-4xl md:text-5xl font-bold text-white mb-2">43%</div>
                     <div className="text-white/60 font-medium uppercase tracking-wider text-sm">Reduction in Manual Handoffs</div>
                  </div>
                  <div className="px-4 py-6">
                     <Clock className="w-8 h-8 text-accent mx-auto mb-4" />
                     <div className="text-4xl md:text-5xl font-bold text-white mb-2">120+</div>
                     <div className="text-white/60 font-medium uppercase tracking-wider text-sm">Hours Saved Per Month</div>
                  </div>
                  <div className="px-4 py-6">
                     <Zap className="w-8 h-8 text-accent mx-auto mb-4" />
                     <div className="text-4xl md:text-5xl font-bold text-white mb-2">14 Days</div>
                     <div className="text-white/60 font-medium uppercase tracking-wider text-sm">Avg. Time to First Ship</div>
                  </div>
               </div>

               <div className="mt-20 pt-12 border-t border-white/10">
                  <Button variant="primary" onClick={() => onNavigate('landing', '#booking')} className="text-lg px-8 py-4">
                     Start Your Transformation
                  </Button>
               </div>
            </div>
         </Section>

         <Footer />
      </div>
   );
};

export default WhoWeArePage;
