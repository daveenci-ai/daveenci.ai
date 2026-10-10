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
    summary: 'Checks every new order against eight rules and repairs what is safe to repair.',
    detail: 'Profile notes, skip-to-add-on items, exteriors-only, square-footage anomalies against public records, missing lockbox combos, appointment-note anomalies, floor-plan variant vs. square footage, and an AI read of the notes for order changes and constraints. Safe fixes are applied with read-back verification — dated note lines, cancelling a stray add-on, the agent on-camera email, a public-record note with beds and baths, the stand-alone floor-plan payout tier. Anything with an issue becomes one ticket listing everything found; clean orders are tagged reviewed. A field that cannot be read is inconclusive, never a pass.',
  },
  {
    number: '03',
    id: 'daily-review',
    title: 'Daily Report',
    status: 'live',
    statusNote: 'Live · since Jul 2026, every morning before 9 AM',
    question: 'What is about to go out, and what needs a person first?',
    summary: 'Runs every morning over everything due for delivery and gives the whole picture in one report: complete, missing, urgent.',
    detail: 'Resumable sweeps from six o\'clock over the delivery queue. Each listing is checked against the product matrix — photos, video, 3D, floor plans, files, URLs — and required image sub-types (aerial, twilight, virtual twilight, virtual staging) are confirmed by a vision model. The report before the 9 AM window lists what is complete, what is missing, what could not be verified and what needs urgent attention, with a direct link to every job. A sweep that cannot vouch for its scope sends nothing.',
  },
  {
    number: '04',
    id: 'photo-review',
    title: 'Real-time Photo Review',
    status: 'built',
    statusNote: 'Built · switched on per client after tuning',
    question: 'Is each delivered photo right?',
    summary: 'Judges every photo — focus, exposure, duplicates, coverage, ordered photo types — and raises one ticket per order, only when something is wrong.',
    detail: 'Every image is fetched and checked: self-calibrating blur and exposure outliers with a vision veto, perceptual-hash duplicates, room coverage, and the photo types the order asked for. Findings name the specific frames, so an editor fixes the right picture rather than re-opening the job. Each order is reviewed once; the ticket is the handoff. Checks are tuned per client from before-and-after examples and can be muted individually without a deploy.',
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
export const platformTermsNote =
  "DaVeenci builds and maintains software. We're not a law firm and don't give legal advice. Your Aryeo or Spiro account and its terms stay yours, and you decide how it's used.";
