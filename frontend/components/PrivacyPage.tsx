import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Section } from './Shared';
import type { Page } from './types';

interface PrivacyPageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="privacy" />
      <Section className="pt-36 md:pt-44 pb-16" pattern="grid">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">Data use</div>
          <h1 className="font-serif text-5xl md:text-6xl text-ink leading-tight mb-7">Privacy, in plain language.</h1>
          <p className="font-serif text-xl text-ink-muted leading-relaxed">We collect only the information needed to respond, schedule a conversation, register interest, improve this site, and operate the services you ask us to use.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted mt-6">Last updated · 13 July 2026</p>
        </div>
      </Section>

      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl space-y-10 font-sans text-ink-muted leading-relaxed">
          <section>
            <h2 className="font-serif text-3xl text-ink mb-4">What we collect</h2>
            <p>Newsletter signup stores your email address and the page or case study where you subscribed. Booking forms may store your name, email, phone number, company, reason for the call, notes, and the time you select. A confirmed event registration may store your name, email, event details, and the event timestamp.</p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink mb-4">How we use it</h2>
            <p>We use this information to deliver the requested communication, coordinate meetings, prevent duplicate registrations, understand which parts of the site are useful, and improve our services. We do not sell personal information.</p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink mb-4">Analytics and service providers</h2>
            <p>When analytics is enabled, the site sends page and interaction events to Google Analytics. Booking and notification workflows use Google Calendar and Gmail. Hosting and database providers process data on our behalf as needed to operate the site. Those providers handle information under their own terms and security practices.</p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink mb-4">Retention and choices</h2>
            <p>We keep contact and booking records only as long as they remain useful for the purpose you requested, our operating records, or applicable obligations. You can block analytics through browser privacy controls. To request access, correction, deletion, or removal from the Codex, use the Talk to us page and identify the request as a privacy request.</p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-ink mb-4">Security and changes</h2>
            <p>We use reasonable technical and organizational safeguards, but no online service can promise absolute security. If our data practices materially change, we will update this page and its revision date.</p>
          </section>

          <a
            href="/calendar"
            onClick={(event) => { event.preventDefault(); onNavigate('calendar'); }}
            className="inline-flex text-accent font-medium hover:text-accent-hover underline underline-offset-4"
          >Contact us about your data</a>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PrivacyPage;
