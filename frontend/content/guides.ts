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
    updatedAt: '2026-10-10',
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
          'Concierge Order Intake, our module for exactly this job, stops and labels the held orders when the form changes. There is no subscription: a repair is quoted before it is done, and you decide.',
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
    updatedAt: '2026-10-10',
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
    updatedAt: '2026-10-10',
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
        a: 'Aryeo’s public API documents a create-order call and appointment scheduling, but not the order form’s own rules for each office, so using it means rebuilding those in code. We have not found a published order API for Spiro. Our module drives the order form with a team-member login.',
      },
      {
        q: 'How long does it take to set up?',
        a: 'Concierge Order Intake is live within a week: access and a few past order emails on day one, real orders watched during days two to five, on its own by day seven. Two weeks in, you keep it or get a full refund.',
      },
      {
        q: 'What does it cost?',
        a: 'Concierge Order Intake is $2,500, fixed. It runs in your own Google and GitHub accounts and you keep the code. There is no subscription; if a platform change breaks it later, the repair is quoted before any work.',
      },
    ],
    publishedAt: '2026-09-16',
    updatedAt: '2026-10-10',
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
  {
    slug: 'automated-order-entry-wrong-order-vs-unplaced-order',
    question: 'When automated order entry fails, is that a wrong order or an order that never got placed?',
    seoTitle: 'Automated order entry: a wrong order vs an order that never got placed | DaVeenci',
    description:
      'The one question to ask about any order-entry automation: when it misses, does a wrong order go out, or does the order land with your team as an exception?',
    answer:
      'It should only ever be the second. A wrong order reaches a photographer and an agent before anyone notices; an unplaced order sits in front of your team with a reason attached. A safe setup checks every field before it submits, confirms the order exists afterwards, and kicks anything it is not sure about out as an exception — so the orders it cannot do land with a person, not in the field.',
    sections: [
      {
        heading: 'Why the difference matters more than the success rate',
        paragraphs: [
          'Owners ask the right question about any automation pitched to them: when it does nine out of ten, is the tenth a wrong order or an incomplete one? The two cost completely different amounts.',
          'An unplaced order costs a few minutes: someone opens the email, sees why it was kicked out, and enters it by hand. A wrong order costs a drive to the wrong address, the wrong package on the invoice, a photographer who could not get in, and an agent who finds the mistake before you do.',
        ],
      },
      {
        heading: 'Where wrong orders come from in automation',
        paragraphs: [
          'Almost every wrong order an automation places comes from one of five shortcuts. Each one is the automation filling a gap instead of admitting it.',
        ],
        bullets: [
          'Guessing a field it could not read — the square footage, the time, the package.',
          'Landing on the default order form instead of the one for that office and region.',
          'Picking the agent by name, when two agents share a name or one agent has two accounts.',
          'Booking the requested time in the wrong time zone — the email is in the agent’s zone, the calendar in yours.',
          'Submitting twice after a slow page or a timeout, so the same listing gets two orders.',
        ],
      },
      {
        heading: 'How a safe setup is built not to guess',
        paragraphs: [
          'Every technical choice below serves one rule: a value is either proven or it is missing, never invented. Our Concierge Order Intake module follows it — agent by email, the right form for the office, no payment step, the order number read back, unsure orders kicked out, never the same order twice.',
        ],
        bullets: [
          'Reading the email: a parser or a language model turns the email into a fixed set of fields — address, square footage, package, selections, requested window, agent email, access, notes. Each value has to appear in the email itself; if it is not there, the field stays empty.',
          'Rules before any click: the agent is found by exact email address; the order form comes from a table of offices and regions; products come from a mapping per office; the requested time is converted from the agent’s time zone.',
          'Placing it: the order form is filled through a team-member login, field by field, the way a person on your team would, with no payment step.',
          'Checking it: after submit it reads the order number back from the system. No number, no “placed”.',
          'One attempt per email: each email carries its own key, so a retry after a timeout cannot create a second order.',
          'Everything else is an exception: the email gets a label, and your team gets a note naming the exact reason — agent not found, no slot in the window, new client, a field it could not read.',
        ],
      },
      {
        heading: 'What to ask before you trust any of them',
        paragraphs: [
          'Whoever builds it, these four answers tell you whether the misses are safe ones.',
        ],
        bullets: [
          'When it misses, does it place a wrong order or kick the order out?',
          'Where exactly is a kicked-out order marked — a label, a ticket, an email — and who sees it?',
          'How does it know an order really exists after it submits?',
          'What stops it from placing the same order twice?',
        ],
      },
      {
        heading: 'What the first two weeks should look like',
        paragraphs: [
          'Run it alongside your team at first. Every order it places is compared with what a person would have entered, and every exception is read for its reason. Exceptions are expected early — a new office, a product nobody mapped, an agent who is not in the system yet. Each one is a mapping to add, and the count drops as the table fills in. Wrong orders are not expected at all; one wrong order in the first two weeks means a rule is missing.',
        ],
      },
    ],
    faq: [
      {
        q: 'What happens to an order that gets kicked out?',
        a: 'The email is labelled and your team gets a note with the reason. Someone enters that order by hand, exactly as they would have without the module. Nothing is lost, and nothing is guessed.',
      },
      {
        q: 'Can it place the same order twice?',
        a: 'It should not, and ours does not. The safe pattern is one attempt key per email, and a check for an existing order before anything is submitted again after a timeout.',
      },
      {
        q: 'What if the order is placed but something on it is still off?',
        a: 'That is a different check. A separate review can look at every new order within minutes — notes, square footage against public records, missing lockbox codes — and raise one ticket listing what it found.',
      },
      {
        q: 'Is the AI deciding what to order?',
        a: 'It should not be. If a model is used, its job is only to read the email into fields. Which form, which agent, which products and which slot should come from fixed rules and tables your team can see, not from a model’s judgement.',
      },
    ],
    publishedAt: '2026-07-16',
    updatedAt: '2026-10-10',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'The order-entry module described above, with what it does when it is not sure, and a 15-minute call to check fit.',
    },
    related: [
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
      { label: 'How to stop copy-pasting order emails into Aryeo or Spiro', path: '/guides/stop-copy-pasting-order-emails-into-aryeo-or-spiro' },
      { label: 'Shoot Ops — modules for real-estate media companies', path: '/shootos' },
    ],
  },
  {
    slug: 'concierge-order-email-missing-square-footage-or-access-details',
    question: 'What do you do when a concierge order email is missing the square footage or the access details?',
    seoTitle: 'Concierge order email missing square footage or access details? What to do | DaVeenci',
    description:
      'Blank square footage, no lockbox code, no word on occupancy. How shops handle a thin concierge order email, and how to automate it without guessing.',
    answer:
      'Look it up or ask, never guess. Square footage and bed and bath counts can come from public records for the address, with the source noted on the order. Access needs a yes or no on the lockbox and the code, and if the email does not say, the agent has to. An automated setup should fill what it can prove and flag the order when a field that drives price or access is still blank.',
    sections: [
      {
        heading: 'What is usually missing',
        paragraphs: [
          'The concierge email is generated from what the agent typed into the brokerage’s system, so it is only as complete as the agent was in a hurry to be. The same gaps come up again and again.',
        ],
        bullets: [
          'Square footage — the field everything is priced on, often blank.',
          'Occupancy — vacant or occupied is rarely stated, so teams default to occupied.',
          'Access — lockbox yes or no, the code, a gate code, or “agent will meet”.',
          'Beds and baths — not asked for at all, and the reason most revisits happen.',
          'Timing — an order placed at 3 a.m. for the same day, with no one to ask.',
        ],
      },
      {
        heading: 'What teams do by hand',
        paragraphs: [
          'Owners describe the same routine: the square footage is blank, so someone Googles the address. Occupancy is unknown, so it goes in as occupied. The lockbox answer decides the entry method, and the code gets pasted into the access field. If something cannot be found, someone calls or emails the agent.',
          'None of that is wrong. The problem is that it lives in people’s heads, so the order looks different depending on who entered it.',
        ],
      },
      {
        heading: 'Why guessing is the expensive option',
        paragraphs: [
          'A wrong square footage puts the order in the wrong pricing and duration tier, and picks the wrong floor-plan variant. A wrong access method leaves a photographer at a locked door. A default that is wrong in a way nobody sees — occupied when the house is vacant — changes how the shoot is scheduled. Each of these is cheap to check before the order goes in and expensive after.',
        ],
      },
      {
        heading: 'How to automate it without guessing',
        paragraphs: [
          'This is the pattern, and most of it is what our Order Review module does on every new order. It is a little technical; the principle is that every value on the order either came from the email or has a named source.',
        ],
        bullets: [
          'Whatever reads the email, a parser or a language model, must leave a field empty when the email does not contain it, never fill a blank with a plausible number.',
          'Square footage and bed and bath counts are looked up in public property records for the address, and written into the order notes with the source, so the photographer and your team can see where the number came from.',
          'If the email gives a square footage and public records disagree by a wide margin, the order is flagged rather than corrected.',
          'A lockbox marked yes with no code is flagged as a missing access detail before the shoot day, not discovered at the door.',
          'The free-text notes are read for changes and constraints — “owner home until 10”, “skip the basement” — and moved into the appointment notes.',
          'When a field that changes price or access is still blank, the order is kicked out as an exception with that reason, and a person decides.',
        ],
      },
      {
        heading: 'Which gaps should stop an order, and which should not',
        paragraphs: [
          'Not every blank deserves a phone call. A sensible split:',
        ],
        bullets: [
          'Stop and ask: no address, no agent email, no package, a lockbox with no code, a time outside your service hours.',
          'Fill with a source and continue: square footage, beds and baths from public records.',
          'Continue with a note: occupancy unknown, free-text requests the form has no field for.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is public-record square footage accurate enough to price on?',
        a: 'Usually close, not exact — records often hold finished area and miss recent additions. Use it to fill a blank, note the source on the order, and flag it when it disagrees sharply with what the agent entered.',
      },
      {
        q: 'Should automation contact the agent directly?',
        a: 'Not on its own. It should tell your team what is missing and why; whether to call or email the agent stays your call, in your voice.',
      },
      {
        q: 'What if the agent is not in the system yet?',
        a: 'That is an exception too. Adding a new customer is a decision about a new client, so the order is held and your team is told, rather than a new account being created automatically.',
      },
      {
        q: 'Does this need a separate tool for each check?',
        a: 'No. The checks run as rules over every new order, every few minutes, and anything they find becomes one ticket per order listing everything at once.',
      },
    ],
    publishedAt: '2026-08-06',
    updatedAt: '2026-08-06',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Shoot Ops modules',
      path: '/shootos',
      note: 'Order entry, order review and the morning delivery report, each running on its own and raising one ticket only when something is wrong.',
    },
    related: [
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
      { label: 'Wrong order vs an order that never got placed', path: '/guides/automated-order-entry-wrong-order-vs-unplaced-order' },
      { label: 'Concierge Order Intake', path: '/shootos/concierge-order-intake' },
    ],
  },
  {
    slug: 'why-photographers-revisit-missed-bedrooms-and-bathrooms',
    question: 'Why do photographers have to go back to a property, and how do you stop the revisits?',
    seoTitle: 'Why photographers revisit listings — and how to stop missed rooms | DaVeenci',
    description:
      'The most common revisit is a missed bedroom or bathroom. Put the counts in the appointment notes, check the order before the shoot and the delivery after.',
    answer:
      'In the shops we work with, the most frequent reason is a missed room — a bedroom or bathroom nobody told the photographer about. Put the bed and bath count, square footage and access details in the appointment notes before the shoot, checked against public records, and compare what was delivered with what was ordered before it goes out. Most revisits are decided at order entry, not on site.',
    sections: [
      {
        heading: 'The usual reasons for a second trip',
        paragraphs: [
          'A revisit costs a photographer’s afternoon and an agent’s patience. The causes are few and repeat.',
        ],
        bullets: [
          'A missed bedroom or bathroom — the photographer did not know it existed.',
          'A missing ordered item — the aerials, the twilight, the floor plan.',
          'Access that did not work — wrong code, lockbox not there, owner not home.',
          'The wrong package or floor-plan size for the house.',
        ],
      },
      {
        heading: 'Fix it in the appointment notes',
        paragraphs: [
          'The photographer works from the appointment notes. If the notes say “4 bed, 3 bath, 2,240 sq ft, lockbox 4120, owner home until 10”, rooms get counted on site and the shoot is planned around the owner. If the notes say nothing, the photographer shoots what they see.',
          'Concierge emails rarely include bed and bath counts, so somebody has to add them. That is exactly the kind of step that gets skipped on a busy morning.',
        ],
      },
      {
        heading: 'Check the order before the shoot',
        paragraphs: [
          'Our Order Review module runs over every new order every ten minutes. This is the part that prevents revisits, in plain terms:',
        ],
        bullets: [
          'It looks the address up in public property records and writes a dated note with the bed and bath count, so it is on the appointment before the photographer leaves.',
          'It compares the ordered square footage with the record and flags big differences.',
          'It checks that the floor-plan size matches the house.',
          'It flags a lockbox marked yes with no code.',
          'A language model reads the agent’s free-text notes for changes and constraints, and anything that changes the shoot becomes part of one ticket for the order.',
          'Safe fixes, such as adding the note, are applied and read back; anything else waits for a person.',
        ],
      },
      {
        heading: 'Check the delivery before it goes out',
        paragraphs: [
          'The second chance to avoid a revisit is before the agent sees the photos. A morning sweep compares each listing due for delivery with what was ordered — photos, video, 3D, floor plans — and a vision model confirms the image types that are easy to forget, such as aerials and twilights. A missing item found at 8 a.m. is a quick reshoot scheduled by you, not a complaint from the agent.',
        ],
      },
      {
        heading: 'What automation cannot know',
        paragraphs: [
          'A coverage check can tell you that three bedrooms were ordered and two were delivered. It cannot know about a room that is in no record and no note. That is why the notes matter: the checks are only as good as the counts they are checking against.',
        ],
      },
    ],
    faq: [
      {
        q: 'Where do the bed and bath counts come from if the agent does not give them?',
        a: 'Public property records for the address. They are written into the order notes with the date and source, so everyone can see where the number came from.',
      },
      {
        q: 'Can AI tell from the photos that a room is missing?',
        a: 'It can compare the rooms it sees with the counts on the order and flag a gap. Without a count to compare against, it cannot know a room is missing.',
      },
      {
        q: 'Does this need access to our photos?',
        a: 'For the delivery check, yes. On Aryeo, listing images can be read through the platform’s API, so this check does not need anyone to log in and click through listings.',
      },
    ],
    publishedAt: '2026-08-27',
    updatedAt: '2026-08-27',
    author: 'Anton Osipov',
    cta: {
      label: 'See Order Review and the other Shoot Ops modules',
      path: '/shootos',
      note: 'Order Review checks every new order while it is still fixable; the Daily Report checks every delivery before 9 a.m.',
    },
    related: [
      { label: 'Concierge order email missing square footage or access details', path: '/guides/concierge-order-email-missing-square-footage-or-access-details' },
      { label: 'Why concierge orders land on the wrong order form, agent or time', path: '/guides/why-concierge-orders-land-on-the-wrong-order-form' },
      { label: 'Concierge Order Intake', path: '/shootos/concierge-order-intake' },
    ],
  },
  {
    slug: 'what-access-should-order-automation-get-in-aryeo',
    question: 'What access should you give an automation that places orders in Aryeo?',
    seoTitle: 'What access to give an order-entry automation in Aryeo | DaVeenci',
    description:
      'A team-member login, never the owner login, and read access to one mailbox. What order-entry automation needs, what it should never have, and how to revoke it.',
    answer:
      'The least that does the job: a team-member login on Aryeo — never the owner login — and read access to the one mailbox the order emails land in, with permission to label messages. It should run in your own Google and GitHub accounts, so you can see what it does, switch it off in minutes, and keep the code if the person who built it is unavailable.',
    sections: [
      {
        heading: 'What it actually needs',
        paragraphs: [
          'Order entry touches two things: the email that holds the order and the form that creates it. The access should match that and stop there.',
        ],
        bullets: [
          'Aryeo: a team-member account with permission to create orders and see the schedule. It enters orders the way your admin does.',
          'Email: read access to the mailbox the concierge or order emails arrive in, plus permission to add labels, so a placed or kicked-out order is marked where your team already looks.',
          'Nothing else: no owner settings, no payment methods, no access to other mailboxes.',
        ],
      },
      {
        heading: 'What it should never have',
        paragraphs: [
          'Owners are right to notice every login. These are the lines worth holding.',
        ],
        bullets: [
          'The owner login. If it is shared, it cannot be told apart from you, and it cannot be revoked without changing your own password.',
          'The ability to charge a customer. Concierge orders are invoiced later; the order should be submitted with no payment step at all.',
          'Credentials sent by email or pasted into code. Logins belong in a secrets store in your own cloud account.',
          'Access to everything “just in case”. Every extra permission is something to audit later.',
        ],
      },
      {
        heading: 'Where it runs and who holds the keys',
        paragraphs: [
          'This is the technical part, and the part that answers the question owners ask about key-person risk. Our modules run in the client’s own Google and GitHub accounts, and the client keeps the code. Whoever builds yours, ask for the same:',
        ],
        bullets: [
          'The code in a GitHub repository in your organisation, yours whether or not you keep working with the builder.',
          'The scheduled job in your own Google account, so the bill, the logs and the off switch are yours.',
          'Mailbox access granted through Google’s own consent screen, where your Google Workspace admin can see it and remove it.',
          'The Aryeo login kept as a secret in your cloud account, not in the code and not in anyone’s inbox.',
          'Every order logged as placed, verified or kicked out, so you can see what it did on any given day.',
        ],
      },
      {
        heading: 'How to switch it off in five minutes',
        paragraphs: [
          'Being able to revoke access quickly is what makes it safe to grant. Remove the team member in Aryeo, remove the app’s mailbox access in your Google admin, and pause the scheduled job in your cloud project. Orders then arrive by email exactly as before, and your team enters them by hand until you switch it back on.',
        ],
      },
    ],
    faq: [
      {
        q: 'Does it see customers’ payment details?',
        a: 'It should not need to. Order entry for concierge orders has no payment step, so the team-member role can be one without access to payments.',
      },
      {
        q: 'Why not use an API key instead of a login?',
        a: 'Aryeo does document an API that can create orders. Our modules use the order form today because the form carries each office’s rules; the API route is covered in its own guide.',
      },
      {
        q: 'What happens if the person who built it is unavailable?',
        a: 'It keeps running in your accounts, and the code and logs are yours. Any developer you choose can read the repository and take over.',
      },
      {
        q: 'Can I see what it did yesterday?',
        a: 'Yes. Every order it handled is logged with its outcome — placed, verified or kicked out with a reason — and each email carries a label showing the same.',
      },
    ],
    publishedAt: '2026-09-24',
    updatedAt: '2026-09-24',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'What access it needs, how the first two weeks go, and a 15-minute call to check fit.',
    },
    related: [
      { label: 'Does Aryeo have an API to create orders?', path: '/guides/does-aryeo-have-an-api-to-create-orders' },
      { label: 'Aryeo changed the order form — what to check', path: '/guides/aryeo-changed-the-order-form-what-to-check' },
      { label: 'Wrong order vs an order that never got placed', path: '/guides/automated-order-entry-wrong-order-vs-unplaced-order' },
    ],
  },
  {
    slug: 'does-aryeo-have-an-api-to-create-orders',
    question: 'Does Aryeo have an API to create orders?',
    seoTitle: 'Does Aryeo have an API to create orders? What it covers and what it doesn’t | DaVeenci',
    description:
      'Yes: Aryeo’s public API documents a create-order call and appointment scheduling. What it carries, what an order form adds, and when the API route makes sense.',
    answer:
      'Yes. Aryeo’s public API (version 1) documents a create-order call that links an address, a customer and product variants, and separate calls to create, schedule and reschedule appointments. What it does not do for you is the work your order form does — choosing the office’s form and asking its questions — so an API route means rebuilding those rules in code. That is why many shops still enter orders through the form.',
    sections: [
      {
        heading: 'What the API documents',
        paragraphs: [
          'As read from Aryeo’s public API reference in October 2026, the API is a REST API at version 1, authenticated with a bearer token. For order entry, the relevant parts are:',
        ],
        bullets: [
          'Create order: links an address, a customer (or a customer team membership) and a list of product variants with quantities, with optional private notes, a fulfilment status and a switch for whether Aryeo notifies the customer.',
          'Appointments: create an appointment or a draft, read available dates and time slots, reschedule, cancel and postpone.',
          'Customers: list and create customers, which is how an agent would be found by email before an order is created.',
          'Orders: list and read orders, including the order number once it exists.',
        ],
      },
      {
        heading: 'What an order form adds that the call does not',
        paragraphs: [
          'A concierge order carries more than an address, an agent and a package. Your order forms hold the rules for each office and region: which products are offered, which questions are asked, how access is recorded. Those are not fields on the create-order call.',
        ],
        bullets: [
          'Which form: the call has no notion of the office or region form, so the mapping from office to products has to live in your code.',
          'The form’s questions: occupancy, lockbox or agent access, gate codes — on the API they become notes or separate updates, not the form’s own fields.',
          'IDs first: the address, the customer and each product variant have to be found or created before the order call, so a new agent or an unmapped product has to be handled explicitly.',
          'Scheduling is separate: the slot is booked with its own appointment call, after checking available time slots.',
        ],
      },
      {
        heading: 'Form route or API route',
        paragraphs: [
          'The form route drives Aryeo’s order form through a team-member login, the way your admin does. The form’s own rules stay in Aryeo, so nothing is rebuilt. The cost is that a redesigned screen can stop it — which is why it has to detect a change and stop rather than guess.',
          'The API route talks to a published contract, so a screen redesign does not affect it. The cost is that the form’s logic is rebuilt in code and maintained when your forms change, and API access has to be set up for your account.',
          'Our order-entry module uses the form route today. We have not yet proven the API route end to end on a live account; until we have, we would rather tell you that than promise it.',
        ],
      },
      {
        heading: 'What an API-based order entry would look like',
        paragraphs: [
          'For the technically curious, the flow is short. The hard part is the mapping, not the calls.',
        ],
        bullets: [
          'Read the concierge email into fixed fields with a language model; leave anything missing empty.',
          'Find the customer by the agent’s email; if there is no match, kick the order out as an exception.',
          'Find or create the address, and map the package and selections to product variant IDs from a table per office.',
          'Create the order with notifications off, and put access details and free-text requests into the notes.',
          'Pick a slot from the available time slots nearest the request, converted from the agent’s time zone, and create the appointment.',
          'Read the order number back from the response and log the order as placed.',
        ],
      },
    ],
    faq: [
      {
        q: 'Isn’t Aryeo’s API one-way?',
        a: 'Many owners describe it that way, and older integrations mostly read data out. The current public reference lists calls to create orders, customers and appointments.',
      },
      {
        q: 'Does Aryeo charge for API access?',
        a: 'The public reference we read does not say which plans include API access. Ask Aryeo before planning around it.',
      },
      {
        q: 'Will an API integration break when Aryeo redesigns its screens?',
        a: 'A screen redesign should not affect it. A change to the API itself can, so whoever maintains it should watch Aryeo’s changelog.',
      },
      {
        q: 'Does Spiro have an API to create orders?',
        a: 'We have not found a published one. Check with Spiro for your account.',
      },
    ],
    publishedAt: '2026-10-07',
    updatedAt: '2026-10-10',
    author: 'Anton Osipov',
    cta: {
      label: 'See the Concierge Order Intake module',
      path: '/shootos/concierge-order-intake',
      note: 'Order entry from the concierge email into Aryeo, with the order number read back — and a 15-minute call to talk through form or API for your shop.',
    },
    related: [
      { label: 'What access to give an order-entry automation in Aryeo', path: '/guides/what-access-should-order-automation-get-in-aryeo' },
      { label: 'Aryeo changed the order form — what to check', path: '/guides/aryeo-changed-the-order-form-what-to-check' },
      { label: 'How to place Listing Concierge orders in Aryeo automatically', path: '/guides/coldwell-banker-listing-concierge-orders-into-aryeo' },
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
