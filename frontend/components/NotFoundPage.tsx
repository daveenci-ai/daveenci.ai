import React from 'react';
import { Button, Eyebrow } from './Shared';
import Header from './Header';
import Footer from './Footer';
import type { Page } from './types';

interface NotFoundPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={onNavigate} currentPage="not-found" />
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-xl text-center">
          <Eyebrow className="mb-4">Lost in the archive</Eyebrow>
          <h1 className="font-serif text-6xl md:text-7xl text-ink leading-none mb-6">404</h1>
          <p className="font-sans text-lg text-ink-muted mb-8">
            We couldn't find the page you were looking for. It may have moved, or it may never have existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => onNavigate('landing')}>Return home</Button>
            <Button variant="secondary" onClick={() => onNavigate('briefings')}>Read briefings</Button>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default NotFoundPage;
