
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import type { Page } from './components/types';
import { MobileErrorBoundary } from './components/mobile/MobileErrorBoundary';

// Route-level code splitting — each page becomes its own lazy chunk.
// Only the landing chunk downloads on initial load; other pages are
// fetched on first navigation.
const DaVeenciLandingPage = lazy(() => import('./DaVeenciLandingPage'));
const BriefingsPage = lazy(() => import('./components/BriefingsPage'));
const BriefingDetailPage = lazy(() => import('./components/BriefingDetailPage'));
const WhoWeArePage = lazy(() => import('./components/WhoWeArePage'));
const Calendar = lazy(() => import('./components/Calendar'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const PulseLandingPage = lazy(() => import('./components/PulseLandingPage'));
const BrandAnalyzerPage = lazy(() => import('./components/BrandAnalyzerPage'));
const WorkPage = lazy(() => import('./components/WorkPage'));
const PureCodePage = lazy(() => import('./components/PureCodePage'));
const ShootOSPage = lazy(() => import('./components/ShootOSPage'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const ThesisPage = lazy(() => import('./components/ThesisPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

const RouteLoading: React.FC = () => (
  <div className="min-h-[100dvh] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

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
      // Legacy /briefings URL redirects to canonical /codex
      if (path === '/briefings') {
        window.history.replaceState({}, '', '/codex');
        setPage('briefings');
        setSelectedBriefingId(null);
        return;
      }
      if (path === '/' || path === '') {
        setPage('landing');
        setSelectedBriefingId(null);
      } else if (path === '/codex') {
        setPage('briefings');
        setSelectedBriefingId(null);
      } else if (path.startsWith('/briefings/') || path.startsWith('/codex/')) {
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
      } else if (path === '/brand-analyzer') {
        setPage('brand-analyzer');
      } else if (path === '/work') {
        setPage('work');
      } else if (path === '/purecode') {
        setPage('purecode');
      } else if (path === '/shootos') {
        setPage('shootos');
      } else if (path === '/events') {
        setPage('events');
      } else if (path === '/thesis') {
        setPage('thesis');
      } else {
        setPage('not-found');
        setSelectedBriefingId(null);
      }
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
    if (targetPage === 'briefings') path = '/codex';
    if (targetPage === 'briefing-detail') path = `/codex/${id}`;
    if (targetPage === 'who-we-are') path = '/who-we-are';
    if (targetPage === 'calendar') path = '/calendar';
    if (targetPage === 'admin') path = '/admin';
    if (targetPage === 'book-demo') path = '/book-demo';
    if (targetPage === 'brand-analyzer') path = '/brand-analyzer';
    if (targetPage === 'work') path = '/work';
    if (targetPage === 'purecode') path = '/purecode';
    if (targetPage === 'shootos') path = '/shootos';
    if (targetPage === 'events') path = '/events';
    if (targetPage === 'thesis') path = '/thesis';
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
    <main className="antialiased font-sans text-ink min-h-screen selection:bg-accent/20">
      <MobileErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        {page === 'landing' && (
          <DaVeenciLandingPage onNavigate={handleNavigate} activeSection={activeSection} />
        )}
        {page === 'briefings' && <BriefingsPage onNavigate={handleNavigate} />}
        {page === 'briefing-detail' && (
          <BriefingDetailPage onNavigate={handleNavigate} id={selectedBriefingId} />
        )}
        {page === 'who-we-are' && <WhoWeArePage onNavigate={handleNavigate} />}
        {page === 'calendar' && <Calendar onNavigate={handleNavigate} />}
        {page === 'admin' && <AdminPage onNavigate={handleNavigate} />}
        {page === 'book-demo' && <PulseLandingPage onNavigate={handleNavigate} />}
        {page === 'brand-analyzer' && <BrandAnalyzerPage onNavigate={handleNavigate} />}
        {page === 'work' && <WorkPage onNavigate={handleNavigate} />}
        {page === 'purecode' && <PureCodePage onNavigate={handleNavigate} />}
        {page === 'shootos' && <ShootOSPage onNavigate={handleNavigate} />}
        {page === 'events' && <EventsPage onNavigate={handleNavigate} />}
        {page === 'thesis' && <ThesisPage onNavigate={handleNavigate} />}
        {page === 'not-found' && <NotFoundPage onNavigate={handleNavigate} />}
      </Suspense>
      </MobileErrorBoundary>
    </main>
  );
};

export default App;
