
import React, { useState, useEffect, useCallback } from 'react';
import DaVeenciLandingPage from './DaVeenciLandingPage';
import BriefingsPage from './components/BriefingsPage';
import BriefingDetailPage from './components/BriefingDetailPage';
import WhoWeArePage from './components/WhoWeArePage';
import Calendar from './components/Calendar';
import AdminPage from './components/AdminPage';
import PulseLandingPage from './components/PulseLandingPage';
import type { Page } from './components/types';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [selectedBriefingId, setSelectedBriefingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [targetSection, setTargetSection] = useState<string | null>(null);

  // Handle Initial Load and Back/Forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      // Normalize path: Remove trailing slash if it's not the root
      const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
      if (path === '/' || path === '') {
        setPage('landing');
        setSelectedBriefingId(null);
      } else if (path === '/briefings') {
        setPage('briefings');
        setSelectedBriefingId(null);
      } else if (path.startsWith('/briefings/')) {
        const id = path.split('/')[2];
        if (id) {
          setPage('briefing-detail');
          setSelectedBriefingId(id);
        }
      } else if (path === '/who-we-are') {
        setPage('who-we-are');
      } else if (path === '/calendar') {
        setPage('calendar');
      } else if (path === '/admin') {
        setPage('admin');
      } else if (path === '/book-demo') {
        setPage('book-demo');
      }
      // Note: We intentionally don't handle 'unknown' routes here to allow fallback to landing
    };

    // Hydrate state from URL on mount
    handleLocationChange();

    // Listen for popstate events
    window.onpopstate = (e) => {
      if (e.state?.page) {
        setPage(e.state.page);
        if (e.state.briefingId) setSelectedBriefingId(e.state.briefingId);
        setActiveSection(null);
      } else {
        // Fallback if state is missing (e.g. external navigation to subpage then back)
        handleLocationChange();
      }
    };
  }, []);

  // Helper to scroll to a specific hash with polling
  const scrollToHash = useCallback((hash: string) => {
    const elementId = hash.replace('#', '');
    let attempts = 0;
    const maxAttempts = 50; // Try for ~2.5 seconds (50 * 50ms)

    const checkAndScroll = () => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 100; // Height of fixed header + visual breathing room
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Clear target once found and scrolled
        setTargetSection(null);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAndScroll, 50);
      } else {
        // Timeout - clear target
        setTargetSection(null);
      }
    };

    // Slight delay to allow any immediate reflows
    setTimeout(checkAndScroll, 10);
  }, []);

  // Watch for page transitions to landing that have a target section pending
  useEffect(() => {
    if (page === 'landing' && targetSection) {
      scrollToHash(targetSection);
    }
  }, [page, targetSection, scrollToHash]);

  const handleNavigate = (targetPage: Page, hash?: string, id?: string) => {
    // Update basic routing state
    setPage(targetPage);
    if (id) setSelectedBriefingId(id);

    // Handle Active Section State (Visual)
    if (hash) {
      setActiveSection(hash);
    } else if (targetPage !== 'landing') {
      setActiveSection(null);
    }

    // Set Target Section for Scrolling (Functional)
    if (targetPage === 'landing' && hash) {
      setTargetSection(hash);
    }

    // Push History State (Maintain consistency)
    let path = '/';
    if (targetPage === 'briefings') path = '/briefings';
    if (targetPage === 'briefing-detail') path = `/briefings/${id}`;
    if (targetPage === 'who-we-are') path = '/who-we-are';
    if (targetPage === 'calendar') path = '/calendar';
    if (targetPage === 'admin') path = '/admin';
    if (targetPage === 'book-demo') path = '/book-demo';
    window.history.pushState({ page: targetPage, briefingId: id }, '', path);

    // Immediate Scroll Logic (if not waiting for landing page mount)
    if (targetPage !== 'landing') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (targetPage === 'landing' && !hash) {
      // Navigate to landing top
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (targetPage === 'landing' && hash && page === 'landing') {
      // Already on landing, scroll immediately
      scrollToHash(hash);
    }
  };

  return (
    <main className="antialiased font-sans text-ink bg-base min-h-screen selection:bg-accent/20">
      {page === 'landing' && (
        <DaVeenciLandingPage onNavigate={handleNavigate} activeSection={activeSection} />
      )}
      {page === 'briefings' && (
        <BriefingsPage onNavigate={handleNavigate} />
      )}
      {page === 'briefing-detail' && (
        <BriefingDetailPage onNavigate={handleNavigate} id={selectedBriefingId} />
      )}
      {page === 'who-we-are' && (
        <WhoWeArePage onNavigate={handleNavigate} />
      )}
      {page === 'calendar' && (
        <Calendar onNavigate={handleNavigate} />
      )}
      {page === 'admin' && (
        <AdminPage onNavigate={handleNavigate} />
      )}
      {page === 'book-demo' && (
        <PulseLandingPage onNavigate={handleNavigate} />
      )}
    </main>
  );
};

export default App;
