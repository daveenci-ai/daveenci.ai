
import React from 'react';
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

      <Footer />
    </div>
  );
};

export default DaVeenciLandingPage;
