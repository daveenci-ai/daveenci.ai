import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Contrast from './components/Contrast';
import Method from './components/Method';
import Advantage from './components/Advantage';
import Controls from './components/Controls';
import PartnerBlock from './components/PartnerBlock';
import BookingPreview from './components/BookingPreview';
import Newsletter from './components/Newsletter';
import FounderBlock from './components/FounderBlock';
import Footer from './components/Footer';
import type { Page } from './components/types';

interface DaVeenciLandingPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  activeSection?: string | null;
}

const DaVeenciLandingPage: React.FC<DaVeenciLandingPageProps> = ({ onNavigate, activeSection }) => {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Header onNavigate={onNavigate} currentPage="landing" activeSection={activeSection} />

      <Hero onNavigate={onNavigate} />
      <Contrast />
      <Method />
      <FounderBlock onNavigate={onNavigate} />
      <Advantage />
      <Controls />
      <PartnerBlock />
      <BookingPreview onNavigate={onNavigate} />
      <Newsletter onNavigate={onNavigate} />

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default DaVeenciLandingPage;
