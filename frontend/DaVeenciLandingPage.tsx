import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Contrast from './components/Contrast';
import Method from './components/Method';
import Advantage from './components/Advantage';
import Controls from './components/Controls';
import WorkPreview from './components/WorkPreview';
import Principals from './components/Principals';
import BookingPreview from './components/BookingPreview';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import MobileLanding from './components/mobile/MobileLanding';
import { useIsMobile } from './components/mobile/useIsMobile';
import type { Page } from './components/types';
import { ProofRail } from './components/ProofRail';
import CommercialOffers from './components/CommercialOffers';

interface DaVeenciLandingPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  activeSection?: string | null;
}

const DaVeenciLandingPage: React.FC<DaVeenciLandingPageProps> = ({ onNavigate, activeSection }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLanding onNavigate={onNavigate} />;
  }

  return (
    <div className="flex flex-col w-full overflow-x-clip">
      <Header onNavigate={onNavigate} currentPage="landing" activeSection={activeSection} />

      {/* Opaque page canvas above the footer: the page lifts to reveal it. */}
      <div className="page-canvas">
        <Hero onNavigate={onNavigate} />
        <ProofRail onNavigate={onNavigate} />
        <WorkPreview onNavigate={onNavigate} />
        <Contrast />
        <Method />
        {/* One spread for both founders replaces two identical dark bands. */}
        <Principals onNavigate={onNavigate} />
        <Advantage />
        <Controls />
        {/* Pricing sits after the problem (Contrast), the method, and the people
            — not third, where it quoted $5,000 before saying what it buys. */}
        <CommercialOffers onNavigate={onNavigate} />
        <BookingPreview onNavigate={onNavigate} />
        <Newsletter onNavigate={onNavigate} />
      </div>

      <div className="footer-reveal">
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default DaVeenciLandingPage;
