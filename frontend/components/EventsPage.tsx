import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Events from './Events';
import { Section, ScrollReveal, GridPattern, PageHero } from './Shared';
import type { Page } from './types';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileEventsPage } from './mobile/MobileEventsPage';

interface EventsPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const EventsPage: React.FC<EventsPageProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileEventsPage {...props} />;
  return <EventsPageDesktop {...props} />;
};

const EventsPageDesktop: React.FC<EventsPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="events" />

      <Section className="pt-44 pb-4 md:pt-52 md:pb-8">
        <GridPattern />
        <ScrollReveal immediate>
          <PageHero
            eyebrow="Workshop Events"
            title={<>From the <br /><span className="italic text-ink-muted">workshop.</span></>}
            description="Occasional in-person and online sessions — on specialist AI teams, orchestration, and what we're learning as we build."
            size="md"
            className="max-w-3xl"
          />
        </ScrollReveal>
      </Section>

      <Events />

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default EventsPage;
