import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Contrast from './components/Contrast';
import WorkPreview from './components/WorkPreview';
import Newsletter from './components/Newsletter';
import FounderBlock from './components/FounderBlock';
import CTAStack from './components/CTAStack';
import Events from './components/Events';
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
      <WorkPreview onNavigate={onNavigate} />
      <FounderBlock onNavigate={onNavigate} />
      <Newsletter onNavigate={onNavigate} />
      <CTAStack onNavigate={onNavigate} />
      <Events />

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default DaVeenciLandingPage;
