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
      { label: 'Shoot Ops — modules for real-estate media companies', path: '/shootos' },
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
      { label: 'Aryeo changed the order form — what to check', path: '/guides/aryeo-changed-the-order-form-what-to-check' },
    ],
  },
  {
    slug: 'aryeo-changed-the-order-form-what-to-check',
    question: 'Aryeo changed the order form — what should a media shop check before orders go wrong?',
    seoTitle: 'Aryeo changed the order form: what to check before orders go wrong | DaVeenci',
    description:
      'Aryeo moves fields and pages without much notice. What to check the same morning — forms, fields, catalog, saved views, automation — before a wrong order ships.',
    answer:
      'Check four things the morning you notice a change: that your team still lands on the right order form for each office and region, that the fields you copy from the concierge email still exist and mean the same thing, that your saved views and filters still show what they used to, and that anything automated against the form has stopped rather than guessed. Aryeo usually announces big changes with an opt-in window; smaller ones simply appear.',
    sections: [
      {
        heading: 'What changed in 2026, and how it arrived',
        paragraphs: [
          'Over the summer of 2026 Aryeo merged most of the orders page into the listings page and moved several controls behind panels you have to click open. Shops got a heads-up of about a day, then a month-long opt-in period before the switch became permanent. Around the start of September the order form changed again. None of it was announced in a way that reached the person keying orders at 7 a.m.',
          'Owners describe it the same way every time: nothing changed on their end, and they still had to fix it. The point of this page is to make that fix a checklist rather than a surprise.',
        ],
      },
      {
        heading: 'The same-morning checklist',
        paragraphs: [
          'Do this before the first order of the day goes in, not after the first complaint.',
        ],
        bullets: [
          'Order forms: open each one you use (the concierge form for each office or region, the general form). Confirm the dropdown that picks the form still defaults the way your team expects — the wrong default is how concierge orders end up on the retail form.',
          'Fields: address, square footage, access instructions, lockbox code, gate code, appointment notes, the agent lookup. If a field moved behind a panel, the person copying from the email will miss it.',
          'Products: packages and add-ons in the catalog, especially anything you retired or renamed at the same time. A retired product still referenced by a habit — or an automation — is a silent wrong order.',
          'Scheduling: the slot picker, the time zone it shows, and whether same-day booking still behaves the same.',
          'Saved views: any filter your team uses to review the day (orders to check, deliveries due) — merged pages often drop them.',
          'Automation: anything that fills the form for you must have stopped and told you, not placed orders against a page it no longer understands.',
        ],
      },
      {
        heading: 'If something automated is placing your orders',
        paragraphs: [
          'The test is simple: after a change, did it hold the orders and say why, or did it keep going? An order-entry automation should be built to refuse when the form no longer looks the way it expects. The orders wait in the inbox, your team keys them by hand for a day, and the automation is repaired — nothing is lost and nothing wrong is placed.',
          'If instead it kept submitting, check the last day of orders against the emails one by one. Look for the four common misses: wrong order form, wrong agent (matched by name instead of email), wrong add-on for that office, wrong time. Fix those in Aryeo before the photographer is dispatched.',
          'Ask whoever built it two questions: how do we know it stopped, and who fixes it, by when. If the answers are “you’ll notice” and “when they have time”, the automation is a liability during every Aryeo release.',
        ],
      },
      {
        heading: 'Making the next change boring',
        paragraphs: [
          'Keep the concierge order form as untouched as you can — it is the one your automation and your habits depend on. Make catalog changes on a known date, tell whoever maintains your order entry a week ahead, and watch the first morning. Shops that do this treat an Aryeo release as an afternoon, not a week.',
          'Concierge Order Intake, our module for exactly this job, stops and labels the held orders when the form changes; the optional monthly plan covers watching Aryeo and Spiro for changes and repairing what they break. Without the plan, the repair is quoted before it is done.',
        ],
      },
    ],
    faq: [
      {
        q: 'How do I know Aryeo changed something?',
        a: 'Usually because a field is not where it was. Aryeo emails about larger changes with an opt-in window; smaller layout changes just appear. A saved view that suddenly shows nothing, or an automation that suddenly holds every order, is the tell.',
      },
      {
        q: 'Will an Aryeo change create wrong orders on its own?',
        a: 'Not by itself. Wrong orders come from a person or an automation continuing to fill the form by habit after it changed — the wrong default form, a moved field, a retired product. The checklist above catches all four.',
      },
      {
        q: 'Should order-entry automation keep running through a change?',
        a: 'No. It should stop when the form no longer matches what it expects, hold the orders and tell you why. Keying by hand for a day is cheaper than a day of wrong orders.',
      },
      {
        q: 'Does this apply to Spiro too?',
        a: 'Yes. Spiro changes less often, but the same checklist applies: order pages per region, the fields you copy, the products, the slot picker, and whether anything automated stopped.',
      },
    ],
    publishedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'The module that places concierge orders in Aryeo or Spiro and stops, rather than guesses, when the form changes.',
    },
    related: [
      { label: 'How do you place Coldwell Banker Listing Concierge orders in Aryeo automatically?', path: '/guides/coldwell-banker-listing-concierge-orders-into-aryeo' },
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
    ],
  },
  {
    slug: 'why-concierge-orders-land-on-the-wrong-order-form',
    question: 'Why do concierge orders end up on the wrong order form, wrong agent or wrong time?',
    seoTitle: 'Why concierge orders land on the wrong order form, agent or time | DaVeenci',
    description:
      'Four ways a hand-keyed concierge order goes wrong in Aryeo or Spiro — default form, agent matched by name, add-ons by market, time zone — and the fix for each.',
    answer:
      'Because the email and the order form do not line up, and a person bridges the gap from memory. The four misses that come up at every shop: the agent’s default order page is the retail one, not the concierge one; the agent is found by name and two agents share it; the add-on differs by office or region; and the requested time is in the agent’s time zone, not yours. Each has a fix, and none of them is “be more careful”.',
    sections: [
      {
        heading: 'Where the order actually comes from',
        paragraphs: [
          'A concierge programme sends one email per listing when an agent picks your shop: address, square footage (often blank), package ordered, photography selections, requested date and time, the listing agent’s name and email, access instructions with the lockbox code, and notes. Someone copies that into Aryeo or Spiro. Most orders take about five minutes and go fine. The ones that do not are the ones the customer finds first.',
        ],
      },
      {
        heading: 'Miss one: the default order form',
        paragraphs: [
          'Shops with several offices or regions have several order forms, and the concierge form is rarely the default. Search the agent, click Place Order, and the page that opens is whichever form is set as their default — often the retail one, with packages the agent is not supposed to buy directly. Under time pressure the order goes in there.',
          'Fix: pick the form deliberately every time, from the dropdown, and never trust the default. If something places orders for you, it should open the form for that office and region by rule, not by whatever loaded.',
        ],
      },
      {
        heading: 'Miss two: the agent found by name',
        paragraphs: [
          'Two agents with the same name, or one agent with two accounts, and the order lands under the wrong person. The photographer emails the wrong inbox, the delivery goes to the wrong team, and nobody knows until the agent calls.',
          'Fix: find the agent by email address, never by name. The concierge email carries it. If the email is not in your system, that is a new agent — add them first, and treat the order as one that needs a person.',
        ],
      },
      {
        heading: 'Miss three: the add-on that differs by office',
        paragraphs: [
          'The same programme buys different add-ons in different regions — one office gets two aerial photos, another five, one includes a floor plan in its 3D tour, another does not. The email names the selection; the catalog has three similar products; habit picks the familiar one. The wrong one shows up on the bill to the programme, or as a photographer who did not bring the drone.',
          'Fix: map each office’s selections to its catalog products once, in writing, and keep quantities in the notes to the photographer rather than in the product count.',
        ],
      },
      {
        heading: 'Miss four: the time zone',
        paragraphs: [
          'The concierge email is written in the agent’s time zone. The shop books in its own. A 2 p.m. request becomes 1 p.m. in the calendar, and the photographer is an hour early or late. Same-day orders make it worse: people order at three in the morning for that afternoon.',
          'Fix: convert before booking, book the nearest open slot inside the requested window, and when nothing fits, do not guess — call the agent and ask what other time works.',
        ],
      },
      {
        heading: 'What stops all four',
        paragraphs: [
          'Each miss has the same shape: a rule the person has to remember. Rules are what software is for. Concierge Order Intake places the order using the form for that office and region, finds the agent by email, applies the mapped selections for that office, books inside the requested window in the right time zone, then reads the order number back from Aryeo or Spiro. Anything it is unsure about — new agent, no slot, unreadable field — it holds and tells you, rather than placing it wrong.',
        ],
      },
    ],
    faq: [
      {
        q: 'Which of the four misses is most common?',
        a: 'The default order form, because it is invisible: the page opens, it looks like an order form, and it is the wrong one. Agent matching by name is the most expensive, because the order reaches the wrong person.',
      },
      {
        q: 'Can I fix these with a checklist for my team?',
        a: 'Partly. A written mapping of offices to forms and selections helps, and “find by email” is a habit worth enforcing. But checklists fade under volume, and the misses return in the busy season.',
      },
      {
        q: 'Does an automation make these mistakes too?',
        a: 'A badly built one makes them faster. The test is whether it applies rules — form by office, agent by email, selections by market, time by zone — and whether it reads the order back to confirm it exists before counting it as placed.',
      },
      {
        q: 'What should happen when the agent is not in the system?',
        a: 'Nothing automatic. New agents need a profile, sometimes a licence number and a photo, and a decision about which team they belong to. Hold the order, tell a person, and let them add the agent.',
      },
    ],
    publishedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'Form by office, agent by email, selections by market, time by zone — then the order number read back. $2,500 fixed.',
    },
    related: [
      { label: 'How do you place Coldwell Banker Listing Concierge orders in Aryeo automatically?', path: '/guides/coldwell-banker-listing-concierge-orders-into-aryeo' },
      { label: 'How do you stop copy-pasting order emails into Aryeo or Spiro?', path: '/guides/stop-copy-pasting-order-emails-into-aryeo-or-spiro' },
    ],
  },
  {
    slug: 'stop-copy-pasting-order-emails-into-aryeo-or-spiro',
    question: 'How do you stop copy-pasting order emails into Aryeo or Spiro?',
    seoTitle: 'How to stop copy-pasting order emails into Aryeo or Spiro | DaVeenci',
    description:
      'Three ways to stop keying order emails into Aryeo or Spiro by hand — a parser, a generic automation tool, or a module that drives the order form and verifies.',
    answer:
      'There are three ways, and only one of them survives odd emails. An email parser feeding a form works until the layout changes. A generic automation tool can fill fields but cannot pick the right order form for the office or tell you the order actually landed. A module that drives the platform’s own order form the way a person does — form by office, agent by email, nearest slot, then reads the order number back — handles the emails a parser cannot, and holds the rest for a person.',
    sections: [
      {
        heading: 'Why the emails are still being copied by hand',
        paragraphs: [
          'Most shops did not choose to key orders by hand. They had an email import tool on an older system and lost it when they moved to Aryeo or Spiro; or they tried the platform’s own import for months and gave up; or they tried an AI tool that filled the form nine times out of ten and could not say which time was the tenth. So someone sits with the inbox open and copies: address, square footage, access notes, agent, package, time, submit.',
          'It is about five minutes an order when nothing is unusual. The cost is not the minutes. It is that the person doing it is the same person answering the phone, and that the misses — wrong form, wrong agent, wrong time — surface as customer calls.',
        ],
      },
      {
        heading: 'Option one: an email parser',
        paragraphs: [
          'A parser lines the email’s fields up with the form’s fields. When the email is always the same shape it works like clockwork. Concierge emails are not always the same shape: the square footage is blank, the lockbox code is in a sentence, the notes ask for things. And when the platform changes the form, the parser does not know. If you go this way, plan for the person who checks its output every morning.',
        ],
      },
      {
        heading: 'Option two: a generic automation tool',
        paragraphs: [
          'Tools that read an email and click through a website can fill an order form. Two things they do badly: choosing the right order form for the office and region, which on Aryeo is a dropdown that defaults to the wrong one, and confirming the order exists afterwards. They also tend to guess when a field is missing, which is exactly when you want them to stop.',
        ],
      },
      {
        heading: 'Option three: a module that drives the form and verifies',
        paragraphs: [
          'The approach that holds up is to do what a good admin does, by rule, every time: open the concierge form for that office and region; fill address, square footage, access notes and lockbox code; find the agent by email, never by name; add the package and the selections mapped for that office; book the nearest open slot inside the requested window, in the right time zone; submit with no payment step; then read the order number back from Aryeo or Spiro. An order counts as placed only once it exists there.',
          'Everything it cannot do by rule — new agent, no slot in the window, an unreadable field, a form that changed — it holds, labels the email, and tells the team why. The person handles the exception, not the whole day.',
        ],
      },
      {
        heading: 'What to ask before you buy any of them',
        paragraphs: [
          'Whichever route, ask the same four questions. When it is not sure, does it stop or guess? Where does a held order show up, and who is told? What happens the morning Aryeo or Spiro changes the form? And what access does it need — a team-member login you can revoke, or your owner login?',
        ],
        bullets: [
          'Stops or guesses: the only acceptable answer is stops.',
          'Where it is marked: a label on the email, a ticket, or an email to the team — you should be able to say which.',
          'Platform changes: it should hold orders and tell you; the fix should have a named owner.',
          'Access: a team-member login on the platform and read access to the order mailbox, nothing more.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does this only work for Coldwell Banker Listing Concierge emails?',
        a: 'No. Any programme or portal that sends a structured order email works the same way. Orders that arrive by web form or phone are a different job and are not covered.',
      },
      {
        q: 'Does Aryeo or Spiro have an API for creating orders?',
        a: 'Aryeo’s public API has been one-way — data out, not orders in — and Spiro has not offered one. That is why the reliable route drives the order form itself, with a team-member login.',
      },
      {
        q: 'How long does it take to set up?',
        a: 'Concierge Order Intake is live within a week: access and a few past order emails on day one, real orders watched during days two to five, on its own by day seven. Two weeks in, you keep it or get a full refund.',
      },
      {
        q: 'What does it cost?',
        a: 'Concierge Order Intake is $2,500, fixed. It runs in your own Google and GitHub accounts and you keep the code. An optional monthly plan covers repairs when the platform changes; it is priced on the call and never required.',
      },
    ],
    publishedAt: '2026-09-16',
    updatedAt: '2026-09-16',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'The module described in option three, with the price, what is included, and a 15-minute call to check fit.',
    },
    related: [
      { label: 'How do you place Coldwell Banker Listing Concierge orders in Aryeo automatically?', path: '/guides/coldwell-banker-listing-concierge-orders-into-aryeo' },
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
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
