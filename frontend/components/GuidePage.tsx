import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { Section, Button } from './Shared';
import type { Page } from './types';
import { getGuide } from '../content/guides';
import NotFoundPage from './NotFoundPage';

interface GuidePageProps {
  onNavigate: (page: Page, hash?: string, id?: string) => void;
  slug?: string | null;
  /** Prerender: skip browser-only effects. */
  isStatic?: boolean;
}

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/**
 * One answer page. Plain structure on purpose: the question as the H1, the direct answer first, then the how, then
 * the FAQ — the shape answer engines lift from. No animations, no reveal-on-scroll: the static prerender and the
 * hydrated page must read the same.
 */
const GuidePage: React.FC<GuidePageProps> = ({ onNavigate, slug, isStatic = false }) => {
  useEffect(() => {
    if (!isStatic) window.scrollTo(0, 0);
  }, [isStatic]);

  const guide = getGuide(slug);
  if (!guide) return <NotFoundPage onNavigate={onNavigate} />;

  const go = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (path === '/shootos') onNavigate('autopilot');
    else if (path === '/shootos/concierge-order-intake') onNavigate('order-intake');
    else if (path === '/guides') onNavigate('guides');
    else if (path.startsWith('/guides/')) onNavigate('guide', undefined, path.split('/')[2]);
    else onNavigate('landing');
  };

  return (
    <div className="flex flex-col w-full overflow-x-hidden min-h-screen">
      <Header onNavigate={onNavigate} currentPage="guide" />

      <Section className="pt-36 md:pt-44 pb-10" pattern="grid">
        <article className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-5">
            <a href="/guides" onClick={go('/guides')} className="hover:text-ink transition-colors">Guides</a>
            <span className="mx-2 text-ink-muted/50">·</span>
            Real-estate media
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">{guide.question}</h1>
          <p className="font-sans text-lg md:text-xl text-ink leading-relaxed" data-answer>
            {guide.answer}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted mt-6">
            {guide.author} · Updated {fmtDate(guide.updatedAt)}
          </p>
        </article>
      </Section>

      <Section className="py-4 md:py-6 bg-white/35">
        <div className="max-w-3xl space-y-12 md:space-y-14 py-6">
          {guide.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="font-sans text-ink-muted leading-relaxed mb-4">{p}</p>
              ))}
              {s.bullets && (
                <ul className="list-disc pl-5 space-y-2 font-sans text-ink-muted leading-relaxed">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Section>

      <Section className="py-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-8">Questions people ask</h2>
          <div className="space-y-8">
            {guide.faq.map((f) => (
              <section key={f.q}>
                <h3 className="font-serif text-xl md:text-2xl text-ink mb-2">{f.q}</h3>
                <p className="font-sans text-ink-muted leading-relaxed">{f.a}</p>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-12 md:py-16 bg-white/35">
        <div className="max-w-3xl">
          <div className="border border-ink/15 bg-white/70 rounded-sm p-8 md:p-10">
            <p className="font-sans text-ink-muted leading-relaxed mb-6">{guide.cta.note}</p>
            <a href={guide.cta.path} onClick={go(guide.cta.path)} className="inline-block">
              <Button variant="primary">{guide.cta.label} <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" /></Button>
            </a>
          </div>
          {guide.related.length > 0 && (
            <ul className="mt-8 space-y-2">
              {guide.related.map((r) => (
                <li key={r.path}>
                  <a href={r.path} onClick={go(r.path)} className="font-sans text-sm text-accent-strong underline decoration-accent/40 underline-offset-4 hover:text-accent-hover">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default GuidePage;
