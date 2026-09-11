/**
 * Guides — answer pages for the exact questions real-estate media owners type into Google, ChatGPT or Gemini.
 *
 * Shape matters more than length (11 Sep 2026, AEO plan): the title is the question, `answer` is the two-or-three-
 * sentence direct answer that sits first on the page and in the structured data, sections carry the how, and `faq`
 * becomes FAQPage schema. Every guide is prerendered to static HTML at build time (scripts/prerender-routes.mjs) so
 * crawlers that do not run JavaScript still read the whole page. Never name a client here — proof stays anonymous.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  /** The question, as an owner would type it. Rendered as the H1. */
  question: string;
  seoTitle: string;
  description: string;
  /** The direct answer: first thing on the page, two or three sentences. */
  answer: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  /** Where the page sends the reader. */
  cta: { label: string; path: string; note: string };
  related: { label: string; path: string }[];
}

export const guides: Guide[] = [
  {
    slug: 'coldwell-banker-listing-concierge-orders-into-aryeo',
    question: 'How do you place Coldwell Banker Listing Concierge orders in Aryeo automatically?',
    seoTitle: 'Place Coldwell Banker Listing Concierge orders in Aryeo automatically | DaVeenci',
    description:
      'A Listing Concierge order email can be read and placed in Aryeo without retyping — right form, agent by email, nearest slot, order number read back.',
    answer:
      'A small module reads each Listing Concierge order email as it arrives, opens the right Aryeo order form for that office and region, fills the address, square footage, access notes and lockbox code, finds the agent by email, adds the package and selections, books the nearest open slot to the requested time and submits. It then reads the order number back from Aryeo — an order only counts as placed once it exists there — and holds anything it is not sure about for a person.',
    sections: [
      {
        heading: 'What a Listing Concierge order email contains',
        paragraphs: [
          'Coldwell Banker’s Listing Concierge programme sends the media vendor one email per listing. The layout varies by office, but the same facts are always in it somewhere: the property address, the square footage, the package or services ordered, the requested date and time window, the listing agent’s name and email, access instructions with the lockbox code, and free-text notes.',
          'Everything Aryeo needs to create the order is in that email. The work is moving it across correctly, every time, within a couple of hours.',
        ],
      },
      {
        heading: 'Why retyping it goes wrong',
        paragraphs: [
          'Keying an order in takes about five minutes when nothing is unusual. The cost is not the five minutes; it is the small share of orders that land on the wrong order page, in the wrong region, or under the wrong agent because two agents share a name. Those are the mistakes the customer finds first.',
        ],
        bullets: [
          'Wrong order form — Aryeo shops with several offices or regions have several forms, and the email does not say which one.',
          'Wrong agent — picking by name instead of email address.',
          'Wrong package or add-ons — the selections differ by state and by office.',
          'Wrong slot or time zone — the requested window is in the email; the calendar is in Aryeo.',
        ],
      },
      {
        heading: 'Three ways to get the order into Aryeo',
        paragraphs: [
          'By hand: someone reads the email and fills the form. It works until volume or staffing changes, and every mistake is silent until a customer calls.',
          'An email parser plus a generic automation tool: fine for the fields that are always in the same place, but concierge emails differ from office to office, the office- and region-specific selections in Aryeo’s order form are hard to reach that way, and the parser cannot tell you whether the order actually landed.',
          'A module that drives Aryeo’s own order form the way a person would, then verifies: it fills the form field by field, submits, and reads the order number back. This is the approach that survives odd emails, because anything it cannot read is held and shown to a person rather than guessed.',
        ],
      },
      {
        heading: 'What “automatic” has to include to be safe',
        paragraphs: [
          'Placing orders without a person watching is only acceptable if the module refuses to guess. The checks below are the difference between an assistant and a liability.',
        ],
        bullets: [
          'Find the agent by email address, never by name.',
          'Open the order form for that office and region, not a default one.',
          'Book the nearest open slot inside the requested window, in the right time zone.',
          'Submit with no payment step — concierge orders are invoiced later.',
          'Read the order number back from Aryeo before counting the order as placed.',
          'Hold and notify when unsure: agent not in the system, no availability in the window, a new client, an unreadable field.',
          'Log every order as placed, verified or held, so the day is visible at a glance.',
        ],
      },
      {
        heading: 'What happens when Aryeo changes its order form',
        paragraphs: [
          'Aryeo changes its forms without notice — the order form layout changed on 1 September 2026. Anything that drives the form has to notice the change and stop, rather than place wrong orders against a page it no longer understands. A module built this way holds the orders, tells the team, and is repaired; the orders are keyed in by hand for a day, not lost.',
        ],
      },
      {
        heading: 'How long it takes to set up',
        paragraphs: [
          'About a week. Day one: a team-member login on Aryeo (not the owner login), read access to the mailbox the concierge emails land in, and a few past order emails to map the offices, regions and service types. Days two to five: the first real orders go through while someone watches, and anything held is tuned. By day seven it runs on its own. Two weeks in, either it is landing orders correctly or it is not; that is the moment to keep it or stop.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does this work with Spiro as well as Aryeo?',
        a: 'Yes. The same module is built for Aryeo and Spiro; other ordering platforms on request. One module handles one email source and one destination platform.',
      },
      {
        q: 'Does it need Aryeo API access?',
        a: 'No. It uses a team-member login and drives Aryeo’s own order form the way a person does, then reads the order number back to confirm. The login can be revoked at any time.',
      },
      {
        q: 'What if the concierge programme is not Coldwell Banker’s?',
        a: 'Any programme that sends a structured order email works the same way — the module is mapped to that email source. Orders that arrive by web form or phone are a different intake and are not covered.',
      },
      {
        q: 'Does it place orders without someone approving each one?',
        a: 'Yes — that is the job. It places the order, verifies it exists, and stops only when it is not sure. Those it holds and tells you about. Nothing is placed blindly.',
      },
      {
        q: 'What does it cost?',
        a: 'Concierge Order Intake is $2,500, fixed, live within a week, with a full refund if orders are not landing correctly after two weeks. It runs in your own Google and GitHub accounts and you keep the code.',
      },
    ],
    publishedAt: '2026-09-11',
    updatedAt: '2026-09-11',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'The module described above, with the price, what is included, and a 15-minute call to check fit.',
    },
    related: [
      { label: 'ShootOS — modules for real-estate media companies', path: '/shootos' },
    ],
  },
];

export const getGuide = (slug?: string | null): Guide | undefined =>
  slug ? guides.find((g) => g.slug === slug) : undefined;

/** Schema.org graph for a guide: the Article and its FAQPage, as JSON-LD-ready objects. */
export const guideStructuredData = (guide: Guide, url: string, image: string, siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: guide.question,
      description: guide.description,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      mainEntityOfPage: url,
      image,
      author: { '@type': 'Person', name: guide.author, url: `${siteUrl}/who-we-are` },
      publisher: {
        '@type': 'Organization',
        name: 'DaVeenci',
        url: siteUrl,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/daveenci-logo.png` },
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: guide.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
});
