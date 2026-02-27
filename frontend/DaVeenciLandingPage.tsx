
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Solutions from './components/Solutions';
import Events from './components/Events';
import Booking from './components/Booking';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { Section, ScrollReveal, Logo } from './components/Shared';
import type { Page } from './components/types';

interface DaVeenciLandingPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  activeSection?: string | null;
}

const DaVeenciLandingPage: React.FC<DaVeenciLandingPageProps> = ({ onNavigate, activeSection }) => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Header onNavigate={onNavigate} currentPage="landing" activeSection={activeSection} />

      <Hero />

      <Problems />

      <Solutions />

      {/* Brand Analyzer Promo */}
      <Section pattern="grid" className="bg-ink text-base">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1">
              <span className="block font-script text-2xl text-accent mb-2 -rotate-1 origin-bottom-left">
                Free Tool
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-base mb-4 leading-tight">
                Is Your Brand Name<br />
                <span className="italic text-base/70">Working For You?</span>
              </h2>
              <p className="font-sans text-lg text-base/70 max-w-xl leading-relaxed mb-8">
                Score any brand name across 10 AI-powered dimensions — clarity, trust, memorability, industry fit, and more. Tailored to your business stage.
              </p>
              <button
                onClick={() => onNavigate('brand-analyzer')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-sans text-sm font-medium transition-all duration-300 rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 group"
              >
                <Search className="w-4 h-4" />
                Try the Brand Analyzer
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur border border-white/10 rounded-sm p-6 md:p-8 max-w-sm mx-auto lg:mx-0">
                <div className="space-y-4">
                  {[
                    { label: 'Clarity', score: 92 },
                    { label: 'Industry Fit', score: 78 },
                    { label: 'Memorability', score: 85 },
                    { label: 'Uniqueness', score: 64 },
                  ].map(({ label, score }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-base/60 w-24 shrink-0">{label}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${score >= 75 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-8 text-right ${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{score}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <span className="text-xs text-base/40 uppercase tracking-wider">Sample Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      <Events />

      <Section id="about" pattern="circles">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <Logo className="w-16 h-16 text-ink mx-auto mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-8 leading-tight">
              "Simplicity is the ultimate sophistication."
            </h2>
            <p className="text-ink-muted text-lg md:text-xl leading-relaxed mb-8">
              DaVeenci isn't about using the flashiest new model. It's about the engineering of elegance. We believe that the best automation is the one you don't notice—it just works, silently compounding your leverage every single day.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto opacity-50"></div>
          </div>
        </ScrollReveal>
      </Section>

      <Booking />

      <Newsletter onNavigate={onNavigate} />

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default DaVeenciLandingPage;
