
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { Logo, Button } from './Shared';
import type { Page, NavLink } from './types';

interface HeaderProps {
  onNavigate?: (page: Page, hash?: string) => void;
  currentPage?: Page;
  activeSection?: string | null;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage = 'landing', activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { label: "Who We Are", href: "/who-we-are" },
    { label: "Where Teams Get Stuck", href: "#problems" },
    { label: "What We Automate", href: "#automation" },
    { label: "Briefings & How-Tos", href: "/briefings" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (link: NavLink) => {
    if (link.href === '/briefings' && (currentPage === 'briefings' || currentPage === 'briefing-detail')) return true;
    if (link.href === '/who-we-are' && currentPage === 'who-we-are') return true;
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

    if (link.href === '/briefings') {
      onNavigate?.('briefings');
      window.scrollTo(0, 0);
      return;
    }

    // Anchor links
    if (link.href.startsWith('#')) {
      // Always route through onNavigate to ensure App state (activeSection) updates correctly
      // and scrolling is handled centrally, even if we are already on the landing page.
      onNavigate?.('landing', link.href);
    }
  };

  const handleLogoClick = () => {
    if (currentPage !== 'landing') {
      onNavigate?.('landing');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBooking = () => {
    closeMenu();
    onNavigate?.('landing', '#booking');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-md shadow-sm py-3 border-b border-ink/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo or Back Button */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={handleLogoClick}>
          {currentPage === 'briefing-detail' ? (
            <div onClick={(e) => { e.stopPropagation(); onNavigate?.('briefings'); }} className="flex items-center gap-2 text-ink-muted hover:text-accent transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-sans font-medium text-base hidden md:block">Back to Briefings & How-Tos</span>
            </div>
          ) : (
            <>
              <Logo className="w-10 h-10 md:w-12 md:h-12 text-ink group-hover:text-accent transition-colors duration-500" />
              <div className="flex flex-col justify-center">
                <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink leading-none">DaVeenci</span>
                <span className="text-[0.6rem] md:text-[0.65rem] tracking-[0.25em] text-accent font-semibold uppercase mt-1 md:mt-1.5 ml-0.5">The Art of Automation</span>
              </div>
            </>
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
                className={`text-base transition-colors relative group whitespace-nowrap px-2 py-1 ${active ? 'font-bold' : 'text-ink-muted hover:text-accent font-medium'
                  }`}
                style={active ? { color: '#3f84c8' } : {}}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </a>
            );
          })}
          <Button variant="primary" className="py-2 px-5 text-base shadow-md hover:shadow-lg whitespace-nowrap ml-2" onClick={scrollToBooking}>Book a Call</Button>
        </nav>

        {/* Mobile Menu Button - Visible on screens smaller than LG */}
        <button onClick={toggleMenu} className="lg:hidden p-2 text-ink hover:text-accent transform transition-transform active:scale-95">
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base border-b border-ink/10 shadow-xl p-8 flex flex-col space-y-6 animate-in slide-in-from-top-4 duration-300 h-screen overflow-y-auto pb-32">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-xl font-serif border-b border-ink/5 pb-3 transition-colors ${active ? 'font-bold' : 'text-ink hover:text-accent'
                  }`}
                style={active ? { color: '#3f84c8' } : {}}
              >
                {link.label}
              </a>
            );
          })}
          <Button variant="primary" className="w-full mt-4 py-4 text-base" onClick={scrollToBooking}>Book a Call</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
