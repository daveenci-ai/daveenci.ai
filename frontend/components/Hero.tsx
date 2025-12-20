
import React from 'react';
import { Cpu, Activity } from 'lucide-react';
import { Section, ScrollReveal, Button, VitruvianBackground } from './Shared';

const HeroDiagram: React.FC = () => (
  <div className="relative w-full max-w-lg lg:max-w-xl mx-auto aspect-square bg-white shadow-2xl shadow-ink/20 rounded-sm border border-ink/10 p-6 md:p-10 rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
    <div className="flex justify-between items-center mb-8 border-b border-ink/10 pb-4">
       <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-ink/10"></div>
          <div className="w-3 h-3 rounded-full bg-ink/10"></div>
       </div>
       <div className="font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">System Architecture v2.0</div>
    </div>

    <div className="relative h-full w-full">
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 250" fill="none">
           <path d="M 30 125 C 60 125, 100 50, 150 50 C 200 50, 220 30, 240 30" stroke="#C4B59D" strokeWidth="1.5" fill="none" />
           <path d="M 30 125 C 60 125, 100 200, 150 200 C 200 200, 240 230, 270 230" stroke="#C4B59D" strokeWidth="1.5" fill="none" />
           <path d="M 30 125 L 270 125" stroke="#3f84c8" strokeWidth="1.5" className="animate-pulse" />

           <line x1="150" y1="50" x2="150" y2="200" stroke="#C4B59D" strokeWidth="1.5" strokeDasharray="4 4" />

           <circle cx="30" cy="125" r="6" fill="#222" />
           <text x="30" y="155" textAnchor="middle" fontSize="10" fill="#5A4A3A" fontFamily="monospace" letterSpacing="0.05em">INPUT</text>

           <circle cx="150" cy="125" r="30" fill="#3f84c8" fillOpacity="0.1" stroke="#3f84c8" strokeWidth="1" className="animate-spin-slow origin-[150px_125px]" strokeDasharray="4 2" />
           <circle cx="150" cy="125" r="4" fill="#3f84c8" />
           <text x="150" y="175" textAnchor="middle" fontSize="10" fontWeight="500" fill="#3f84c8" fontFamily="monospace" letterSpacing="0.05em">PROCESSING</text>

           <circle cx="150" cy="50" r="5" fill="white" stroke="#222" strokeWidth="1.5" />
           <circle cx="150" cy="200" r="5" fill="white" stroke="#222" strokeWidth="1.5" />

           <rect x="260" y="115" width="20" height="20" rx="2" fill="#3f84c8" />
           <text x="270" y="160" textAnchor="middle" fontSize="10" fill="#5A4A3A" fontFamily="monospace" letterSpacing="0.05em">OUTPUT</text>
           <rect x="265" y="220" width="16" height="16" rx="2" fill="#222" />
        </svg>

        <div className="absolute top-4 right-0 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float">
           <Activity className="w-4 h-4 text-ink-muted" />
           <span className="text-xs font-medium text-ink">Efficiency +40%</span>
        </div>

        <div className="absolute bottom-12 left-8 bg-base shadow-lg border border-ink/10 px-4 py-2 rounded flex items-center gap-3 animate-float-delayed">
           <Cpu className="w-4 h-4 text-accent" />
           <span className="text-xs font-medium text-ink">Automated</span>
        </div>
    </div>
  </div>
);

const Hero: React.FC = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section className="pt-44 pb-24 md:pt-52 md:pb-32 min-h-screen flex items-center">
      <VitruvianBackground className="opacity-[0.12] -right-1/4 scale-125" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-6 relative z-20">
          <ScrollReveal delay={200}>
            <span className="block mb-4 font-script text-2xl text-accent -rotate-2 origin-bottom-left">
              Folio I — The Thesis
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.1] mb-8">
              Clarity on AI.<br />
              <span className="italic text-ink-muted/80">Automation that Ships.</span>
            </h1>
            <p className="font-sans text-xl md:text-2xl text-ink-muted max-w-2xl leading-relaxed mb-10">
              DaVeenci helps founders, investors, and operators turn AI from slideware into shipped workflows—so teams can scale revenue and margin without scaling headcount.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="primary" onClick={scrollToBooking} className="text-base px-8 py-4">Book a Strategy Session</Button>
              <Button variant="secondary" className="text-base px-8 py-4">See How We Work</Button>
            </div>
            <p className="text-xs md:text-sm text-ink-muted/60 font-medium tracking-wide">
              Built for early-stage to growth companies in B2B SaaS, services, and tech-enabled businesses.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center">
          <ScrollReveal delay={500} direction="left" className="w-full flex justify-center">
            <HeroDiagram />
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
