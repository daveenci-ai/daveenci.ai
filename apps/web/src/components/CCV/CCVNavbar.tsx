
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import CCVLogo from './CCVLogo';

const CCVNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If not on homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleBookCall = () => {
    // If not on homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'booking' } });
    } else {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={handleLogoClick}>
              <CCVLogo size="sm" variant="dark" />
              <span className="text-lg font-semibold tracking-tight hidden sm:block text-black">
                DaVeenci
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('about')}
                className="font-medium text-lg transition-all duration-300 hover:scale-105 text-slate-700 hover:text-black"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('offerings')}
                className="font-medium text-lg transition-all duration-300 hover:scale-105 text-slate-700 hover:text-black"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('newsletter')}
                className="font-medium text-lg transition-all duration-300 hover:scale-105 text-slate-700 hover:text-black"
              >
                Newsletter
              </button>
              <Link 
                to="/articles"
                className="font-medium text-lg transition-all duration-300 hover:scale-105 text-slate-700 hover:text-black"
              >
                Articles
              </Link>
              <Button 
                onClick={handleBookCall}
                className="bg-black text-white hover:bg-slate-800 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Book a Session
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl animate-slide-up">
            <nav className="px-6 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-lg font-medium text-slate-800 hover:text-black transition-colors py-3 px-2 rounded-lg hover:bg-slate-50"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('offerings')}
                className="block w-full text-left text-lg font-medium text-slate-800 hover:text-black transition-colors py-3 px-2 rounded-lg hover:bg-slate-50"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('newsletter')}
                className="block w-full text-left text-lg font-medium text-slate-800 hover:text-black transition-colors py-3 px-2 rounded-lg hover:bg-slate-50"
              >
                Newsletter
              </button>
              <Link 
                to="/articles"
                className="block w-full text-left text-lg font-medium text-slate-800 hover:text-black transition-colors py-3 px-2 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Button 
                onClick={handleBookCall}
                className="w-full bg-black text-white hover:bg-slate-800 px-8 py-4 text-lg font-semibold mt-4 rounded-lg"
              >
                Book a Session
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default CCVNavbar;
