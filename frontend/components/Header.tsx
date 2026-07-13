
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { Logo, Button } from './Shared';
import { useIsMobile } from './mobile/useIsMobile';
import { MobileTopBar } from './mobile/MobileTopBar';
import type { Page, NavLink } from './types';

interface HeaderProps {
  onNavigate?: (page: Page, hash?: string) => void;
  currentPage?: Page;
  activeSection?: string | null;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage = 'landing', activeSection }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Below md: render the shared mobile chrome so every page that uses
  // Header gets a consistent header / menu on phones. Desktop tree
  // continues to use the rich editorial header below.
  if (isMobile && onNavigate) {
    return <MobileTopBar onNavigate={onNavigate} />;
  }

  const navLinks: NavLink[] = [
    { label: "About", href: "/who-we-are" },
    { label: "Thesis", href: "/thesis" },
    { label: "Work", href: "/work" },
    { label: "Codex", href: "/codex" },
    { label: "Events", href: "/events" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (link: NavLink) => {
    if (link.href === '/codex' && (currentPage === 'briefings' || currentPage === 'briefing-detail')) return true;
    if (link.href === '/who-we-are' && currentPage === 'who-we-are') return true;
    if (link.href === '/work' && (currentPage === 'work' || currentPage === 'purecode' || currentPage === 'autopilot' || currentPage === 'compoundiq')) return true;
    if (link.href === '/thesis' && currentPage === 'thesis') return true;
    if (link.href === '/events' && currentPage === 'events') return true;
    if (link.href.startsWith('#') && currentPage === 'landing' && activeSection === link.href) return true;
    return false;
  };

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    e.preventDefault();
    closeMenu();

    if (link.href === '/who-we-are') {
      onNavigate?.('who-we-are');
      window.scrollTo(0, 0);
      return;
    }

    if (link.href === '/codex') {
      onNavigate?.('briefings');
      window.scrollTo(0, 0);
      return;
    }

    if (link.href === '/work') {
      onNavigate?.('work');
      window.scrollTo(0, 0);
      return;
    }

    if (link.href === '/thesis') {
      onNavigate?.('thesis');
      window.scrollTo(0, 0);
      return;
    }

    if (link.href === '/events') {
      onNavigate?.('events');
      window.scrollTo(0, 0);
      return;
    }

    if (link.href.startsWith('#')) {
      onNavigate?.('landing', link.href);
    }
  };

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (currentPage !== 'landing') {
      onNavigate?.('landing');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToCalendar = () => {
    closeMenu();
    onNavigate?.('calendar');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm py-3 border-b border-ink/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo or Back Button */}
        <div className="flex items-center gap-4">
          {currentPage === 'briefing-detail' ? (
            <a
              href="/codex"
              onClick={(event) => { event.preventDefault(); onNavigate?.('briefings'); }}
              className="flex items-center gap-2 text-ink-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-sans font-medium text-base hidden md:block">Back to the Codex</span>
            </a>
          ) : (
            <a
              href="/"
              onClick={handleLogoClick}
              aria-label="DaVeenci home"
              className="group flex items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              <Logo className="w-12 h-12 md:w-14 md:h-14 text-ink group-hover:text-accent transition-colors duration-500" />
              <span className="hidden md:flex items-center gap-4">
                <span aria-hidden="true" className="h-4 w-px bg-ink/15"></span>
                <span className="relative text-xs tracking-[0.2em] text-ink-muted font-medium uppercase transition-colors duration-500 group-hover:text-ink">
                  A studio of specialist AI teams
                  <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 w-0 group-hover:w-full"></span>
                </span>
              </span>
            </a>
          )}
        </div>

        {/* Desktop Nav - Visible on LG screens and up */}
        <nav className="hidden lg:flex items-center space-x-4">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-xs uppercase tracking-[0.18em] font-medium transition-colors relative group whitespace-nowrap px-2 py-1 ${active ? 'text-accent' : 'text-ink-muted hover:text-ink'
                  }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </a>
            );
          })}
          <Button variant="primary" analytics={{ cta_id: 'talk_to_us', surface: 'header', from_page: currentPage, destination: '/calendar' }} className="py-2 px-5 text-xs uppercase tracking-[0.15em] shadow-md hover:shadow-lg whitespace-nowrap ml-2" onClick={goToCalendar}>Talk to us</Button>
        </nav>

        {/* Mobile Menu Button - Visible on screens smaller than LG */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation-menu"
          className="lg:hidden p-2 text-ink hover:text-accent transform transition-transform active:scale-95"
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div id="site-navigation-menu" className="lg:hidden absolute top-full left-0 w-full bg-canvas border-b border-ink/10 shadow-xl p-8 flex flex-col space-y-6 animate-in slide-in-from-top-4 duration-300 h-screen overflow-y-auto pb-32">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-xl font-serif border-b border-ink/5 pb-3 transition-colors ${active ? 'font-bold text-accent' : 'text-ink hover:text-accent'
                  }`}
              >
                {link.label}
              </a>
            );
          })}
          <Button variant="primary" analytics={{ cta_id: 'talk_to_us', surface: 'header_menu', from_page: currentPage, destination: '/calendar' }} className="w-full mt-4 py-4 text-base" onClick={goToCalendar}>Talk to us</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
