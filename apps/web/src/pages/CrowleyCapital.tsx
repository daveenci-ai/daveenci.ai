
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CCVNavbar from '@/components/CCV/CCVNavbar';
import CCVHero from '@/components/CCV/CCVHero';
import CCVPainPoints from '@/components/CCV/CCVPainPoints';
import CCVWhatWeOffer from '@/components/CCV/CCVWhatWeOffer';
import CCVAbout from '@/components/CCV/CCVAbout';
import CCVOfferings from '@/components/CCV/CCVOfferings';
import CCVBookingNew from '@/components/CCV/CCVBookingNew';
import CCVNewsletter from '@/components/CCV/CCVNewsletter';
import CCVEvents from '@/components/CCV/CCVEvents';
import CCVFooter from '@/components/CCV/CCVFooter';

const CrowleyCapital = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from other pages
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <CCVNavbar />
      <main>
        <CCVHero />
        <CCVPainPoints />
        <CCVWhatWeOffer />
        <CCVAbout />
        <CCVOfferings />
        <CCVBookingNew />
        <CCVNewsletter />
        <CCVEvents />
      </main>
      <CCVFooter />
    </div>
  );
};

export default CrowleyCapital;
