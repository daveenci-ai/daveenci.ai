import type { Page } from '../components/types';

// The Shoot Ops module catalogue — one source for /shoot-ops (desktop + mobile) and /modules.
// Four modules, four repositories, one shared state store. Status is the operating truth, not a roadmap:
// 'live' means running on a schedule at a client today; 'built' means deployed but not yet switched on.
export type ModuleStatus = 'live' | 'built';

export interface ShootOpsModule {
  number: string;
  id: 'order-intake' | 'order-review' | 'daily-review' | 'photo-review';
  title: string;
  status: ModuleStatus;
  statusNote: string;
  question: string;
  summary: string;
  detail: string;
  price?: string;
  page?: Page;
  path?: string;
}

export const shootOpsModules: ShootOpsModule[] = [
  {
    number: '01',
    id: 'order-intake',
    title: 'Concierge Order Intake',
    status: 'live',
    statusNote: 'Live · Spiro since Dec 2025, Aryeo since Apr 2026',
    question: 'Did the order email become an order?',
    summary: 'Reads the concierge order email and places the order on the ordering platform, then confirms it exists.',
    detail: 'Right order form for the office and region; address, square footage, access notes, lockbox code; agent found by email, never by name; package and state-specific selections; nearest open slot to the requested time; submitted with no payment step. The order number is read back before the order counts as placed. Agent not found, no slot in the window, new client — the email is labelled and held for a person. Retries on transient failures; never places the same order twice.',
    price: '$2,500 fixed · live within a week',
    page: 'order-intake',
    path: '/shoot-ops/concierge-order-intake',
  },
  {
    number: '02',
    id: 'order-review',
    title: 'Order Review',
    status: 'live',
    statusNote: 'Live · since Jul 2026, every 10 minutes',
    question: 'Is the order right while it is still fixable?',
    summary: 'Checks every new order against nine rules and repairs what is safe to repair.',
    price: '$2,500 fixed · live within a week',
    page: 'order-review',
    path: '/shoot-ops/order-review',
    detail: 'Profile notes, skip-to-add-on items, exteriors-only, square-footage anomalies against public records, missing lockbox combos, appointment-note anomalies, floor-plan variant vs. square footage, an AI read of the notes for order changes and constraints, and same-day orders, flagged the moment they land. Safe fixes are applied with read-back verification — dated note lines, cancelling a stray add-on, the agent on-camera email, a public-record note with beds and baths, the stand-alone floor-plan payout tier. Anything with an issue becomes one ticket listing everything found; clean orders are tagged reviewed. A field that cannot be read is inconclusive, never a pass.',
  },
  {
    number: '03',
    id: 'daily-review',
    title: 'Daily Report',
    status: 'live',
    statusNote: 'Live · since Jul 2026, every morning before 9 AM',
    question: 'What is about to go out, and what needs a person first?',
    summary: 'Every morning, checks that everything ordered was delivered — and sends one report before the delivery window: missing, could not verify, complete.',
    // Corrected 15 Oct 2026 against the module's code: image sub-types are read from the delivered files' names
    // (no vision call since 19 Sep 2026), and the report has no "urgent" section.
    detail: 'Resumable sweeps from six o\'clock over the listings due for delivery. Each listing is checked against your product matrix — photos, video, 3D, floor plans, files, a custom property website — and ordered aerial, twilight, virtual twilight and virtual staging images are confirmed from the delivered files\' names. One report before the delivery window lists what is missing, what it could not verify and what is complete, with a direct link to every listing. A run that cannot vouch for its list sends nothing.',
    price: '$2,500 fixed · live within a week',
    page: 'daily-report',
    path: '/shoot-ops/daily-report',
  },
  {
    number: '04',
    id: 'photo-review',
    title: 'Real-time Photo Review',
    status: 'built',
    statusNote: 'Built · switched on per client after tuning',
    question: 'Is each photo right before it goes out?',
    summary: 'Checks every photo as it is uploaded — focus, duplicates, verticals, framing, glare, signs and branding, the ordered photo types — and raises one ticket per order, only when something is wrong.',
    // Rewritten 15 Oct 2026 from the module's code (job-review-advanced): twelve checks on; exposure and room coverage
    // are built but switched off after tuning. Real time (checking as photos are uploaded) is the offer; the code today
    // reviews each order once from the morning list (Anton, 15 Oct 2026: describe real time, no minute figure).
    detail: 'Each photo is checked as it lands on the listing: focus measured against the listing\'s own photos with an AI second look, near-duplicates by image fingerprint, and one AI pass for verticals, framing, camera angle, sun and glare, reflections, noise, colour cast, HDR artifacts, signs and branding, and the photo types the order asked for. Findings name the frame by number and file name, so the editor fixes the right picture. One ticket per order, only when something is wrong; a photo it could not check is never counted as good. Each check is tuned from the examples your team sends back and can be switched off on its own.',
    price: '$2,500 fixed + AI usage at cost',
    page: 'photo-review',
    path: '/shoot-ops/photo-review',
  },
];

// The ordering platforms Shoot Ops automates — shown as their own marks (official logo files, used to indicate
// compatibility). Built and running on Aryeo and Spiro; the others are a mapping, not a rebuild.
export const shootOpsPlatforms: { name: string; logo: string; width: number; height: number }[] = [
  { name: 'Aryeo', logo: '/platforms/aryeo.png', width: 500, height: 137 },
  { name: 'Spiro', logo: '/platforms/spiro.png', width: 874, height: 387 },
  { name: 'HDPhotoHub', logo: '/platforms/hdphotohub.svg', width: 371, height: 102 },
  { name: 'Full Frame', logo: '/platforms/fullframe.svg', width: 300, height: 78 },
  { name: 'ViewShoot', logo: '/platforms/viewshoot.png', width: 273, height: 55 },
];

/**
 * Shown on /shoot-ops and in the module FAQ (Anton, 10 Oct 2026). Deliberately general: the site never
 * discusses any platform's terms; the client owns the accounts and accepts those terms themselves.
 */
export const termsNoteFor = (platforms: string): string =>
  `DaVeenci builds and maintains software. We're not a law firm and don't give legal advice. Your ${platforms} account and its terms stay yours, and you decide how it's used.`;
export const platformTermsNote = termsNoteFor('Aryeo or Spiro');

/**
 * The fixed-price modules promote each other (Anton, 13 Oct 2026 for two; 15 Oct 2026 for three, then four): each module
 * page carries a "Pairs with" band showing two others, between the offer and the first two weeks. With four modules the
 * pairs rotate (Anton, 15 Oct 2026): Intake → Order Review + Daily Report, Order Review → Daily Report + Photo Review,
 * Daily Report → Photo Review + Intake, Photo Review → Intake + Order Review. Same $2,500 and terms on all four; Photo
 * Review adds its AI usage at cost. Only Intake names Spiro; the other three are Aryeo only.
 */
export type StarterModuleId = 'order-intake' | 'order-review' | 'daily-review' | 'photo-review';

export const STARTER_MODULES: StarterModuleId[] = ['order-intake', 'order-review', 'daily-review', 'photo-review'];

export const modulePairings: Record<StarterModuleId, { with: StarterModuleId[]; eyebrow: string; title: string; body: string }> = {
  'order-intake': {
    with: ['order-review', 'daily-review'],
    eyebrow: 'Pairs with · Modules 02 and 03',
    title: 'Placed without retyping. Then checked, then audited.',
    body: 'Concierge Order Intake gets the order in. Order Review opens every new Aryeo order within ten minutes and catches the missing lockbox code or the odd square footage before the shoot. The Daily Report checks the finished listing the next morning, before it goes to the agent.',
  },
  'order-review': {
    with: ['daily-review', 'photo-review'],
    eyebrow: 'Pairs with · Modules 03 and 04',
    title: 'Checked here. Then the delivery, then every photo.',
    body: 'Order Review makes sure the shoot starts from a correct order. The two modules after it check what comes back: Real-time Photo Review looks at every photo as it is uploaded and names the frame that needs fixing, and the Daily Report checks that everything ordered is on the listing before it goes to the agent.',
  },
  'daily-review': {
    with: ['photo-review', 'order-intake'],
    eyebrow: 'Pairs with · Modules 04 and 01',
    title: 'Audited here. Each photo checked, each order placed.',
    body: 'The Daily Report checks that everything ordered is there. Real-time Photo Review checks that each photo is right, as it is uploaded, so the editor fixes it before the morning. At the start of the job, Concierge Order Intake places orders from the concierge email without retyping.',
  },
  'photo-review': {
    with: ['order-intake', 'order-review'],
    eyebrow: 'Pairs with · Modules 01 and 02',
    title: 'Photos checked here. The order got right first.',
    body: 'Many bad photos start as a bad order: the wrong package, a missing access note, a floor plan nobody booked. Concierge Order Intake places orders from the concierge email without retyping, and Order Review checks every new order within ten minutes, while a mistake is still a note.',
  },
};

/** Shared by the four fixed-price modules, so the pairing band can say "same terms" without restating them per page. */
export const starterModuleTerms = 'Same terms as this module: full refund if it isn’t working after two weeks, no subscription, and you keep the code.';

/** The module page for a module title, if it has one — Fig. i links its rows here. */
export const modulePageFor = (title: string): { page: Page; path: string } | null => {
  const m = shootOpsModules.find((x) => x.title === title && x.page && x.path);
  return m ? { page: m.page as Page, path: m.path as string } : null;
};
