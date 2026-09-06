import React, { useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import type { Page } from './types';
import { BOOKING_HOSTS } from './bookingHosts';

interface BookPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const CARDS: { page: Page; path: string; host: 'anton' | 'astrid'; summary: string }[] = [
  {
    page: 'book-anton',
    path: '/book/anton',
    host: 'anton',
    summary: 'You have seen a module and its price, and want to check it fits how you actually work.',
  },
  {
    page: 'book-astrid',
    path: '/book/astrid',
    host: 'astrid',
    summary: 'You have a recurring workflow and want to talk through whether it belongs in a blueprint.',
  },
];

const BookPage: React.FC<BookPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="book" />

      <Section className="pt-36 md:pt-44 pb-12" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Book a call</div>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-7">
            Which conversation?
          </h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">
            Two different calls. Pick whichever matches where you are.
          </p>
        </div>
      </Section>

      <Section className="py-12 md:py-20 bg-white/35">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((card) => {
            const host = BOOKING_HOSTS[card.host];
            return (
              <a
                key={card.host}
                href={card.path}
                onClick={(e) => { e.preventDefault(); onNavigate(card.page); }}
                className="group flex flex-col border border-ink/10 bg-white/70 rounded-sm p-8 transition-all hover:border-accent/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-sm overflow-hidden border border-ink/10 shrink-0">
                    <img src={host.portrait} alt={host.name} decoding="async" className="w-full h-full object-cover object-top scale-125" />
                  </div>
                  <div>
                    <div className="font-serif text-xl text-ink leading-none mb-1.5">{host.name}</div>
                    <div className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">{host.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-serif italic text-sm text-ink-muted mb-4">
                  <Clock className="w-4 h-4" aria-hidden="true" /> {host.durationLabel}
                </div>

                <p className="font-sans text-ink-muted leading-relaxed mb-6 flex-1">{card.summary}</p>

                <span className="inline-flex items-center gap-2 font-serif italic text-sm text-accent group-hover:gap-3 transition-all">
                  Choose a time <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default BookPage;
