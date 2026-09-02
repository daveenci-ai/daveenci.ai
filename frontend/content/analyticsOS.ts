import { AlertTriangle, Database, FlaskConical, Gauge, PackageCheck, ShieldCheck, Split, Workflow } from 'lucide-react';
import type { CaseEvidenceItem } from '../components/CaseEvidence';

/**
 * Marketing Analytics OS — case content. Describes the system, not the
 * client: the client is named only once they consent. Figures are the
 * engagement's stated design targets, not measured results.
 */

export const analyticsOSEvidence: CaseEvidenceItem[] = [
  {
    label: 'Recurring input',
    value: 'An ad click that becomes a site visit',
    detail: 'Pages, clicks, quiz steps, photo upload, and checkout, plus the campaign that brought the visitor — recorded first-party, only after opt-in consent.',
    icon: Workflow,
  },
  {
    label: 'Original manual workflow',
    value: 'Three spreadsheets, judged by eye',
    detail: 'Ad spend, the CRM export, and a working sheet that never quite reconciled. Whether a campaign was working was a judgment call made weekly.',
    icon: AlertTriangle,
  },
  {
    label: 'Systems integrated',
    value: 'Meta Marketing API, CRM, sheets, site events',
    detail: 'To be pulled into one client-owned Postgres warehouse every day. Customers appear as pseudonymous IDs; names and emails never enter the analytics store.',
    icon: Database,
  },
  {
    label: 'Human approval gates',
    value: 'Every ad-platform change is a ticket',
    detail: 'The rules produce a queue of actions — raise or cut a budget to a stated amount, turn a campaign off or on. A person executes each one in the ad platform and marks it done. Nothing changes automatically.',
    icon: ShieldCheck,
  },
  {
    label: 'Finished output',
    value: 'A Monday brief with verdicts and a decision log',
    detail: 'What changed, which tests concluded, what to do next — reviewed by a person. Every change to a campaign or page is logged with its reason.',
    icon: PackageCheck,
  },
  {
    label: 'Exceptions handled',
    value: 'Broken tags and runaway spend must alert within the hour',
    detail: 'The acceptance test: a deliberately broken tag raises an alert in under an hour, and spend running ahead of plan or a funnel step dropping does the same — instead of surfacing at month-end.',
    icon: Gauge,
  },
  {
    label: 'Experiments',
    value: 'Registered before they run',
    detail: 'Each landing-page test states its metric, duration, and stopping rule up front, with approval rate and plan mix as guardrails. Results pool by element type — headline, image, offer, price framing — so the client learns what moves conversion.',
    icon: FlaskConical,
  },
  {
    label: 'Operating status',
    value: 'Scoped; measurement plan signs off first',
    detail: 'Package one — the measurement plan and data boundary — is the gate for everything after it. Status flips to "in delivery" when the client kicks off, and the client is named here only with consent.',
    icon: Split,
  },
];

export const analyticsOSDecisions = [
  {
    question: 'Is this campaign earning its spend?',
    method: 'A probability model of cost per approved customer, seeded from the client’s own history and updated daily; the rule of three (3× allowable cost with no customers) is the floor before any kill.',
    verdict: 'Keep · Kill · Spend $X more to decide',
    sees: 'with a probability, never a bare average.',
  },
  {
    question: 'Which landing page wins?',
    method: 'Visitors are split at random and stay on their variant; each test is registered up front with its metric, duration, and stopping rule; approval rate and plan mix must not fall.',
    verdict: 'Adopt · Drop · Keep running',
    sees: 'with the confidence level and the cost of being wrong.',
  },
  {
    question: 'Which ads produce customers?',
    method: 'Only the ad platform’s own split tests are fair comparisons; ads are judged on first-party cost per approved customer, not clicks.',
    verdict: 'Creative ranked by customers produced',
    sees: 'with a range.',
  },
  {
    question: 'How far can a winner scale?',
    method: 'Budget rises in steps held for two weeks; the cost of the extra customers is read separately from the average.',
    verdict: 'Marginal cost per customer',
    sees: 'before the next step.',
  },
  {
    question: 'What have we learned?',
    method: 'Every test’s effect is pooled by element type — headline, image, offer, price framing — across tests.',
    verdict: 'A running list of what moves this audience',
    sees: 'and by how much.',
  },
];

export const analyticsOSTiers = [
  {
    name: 'Measure',
    price: '$6,500',
    weeks: '≈ 5 weeks',
    promise: 'One trustworthy view of the funnel and a keep / kill rule the client can calculate.',
    firstPackage: 1,
    packages: [
      'Measurement plan and data boundary',
      'First-party event tracking on the site',
      'Data hub — ad spend, CRM, and spreadsheets in one warehouse',
      'Funnel and spend dashboard with the keep / kill rule',
      'Handoff and runbook',
    ],
  },
  {
    name: '+ Learn',
    price: '+ $6,000',
    weeks: '≈ 9 weeks total',
    promise: 'Learn faster: experiments, creative-level attribution, alerts, and a weekly decision brief.',
    firstPackage: 6,
    packages: [
      'Experimentation framework — landing-page A/B tests',
      'Creative-level attribution and tracking alerts',
      'Weekly decision brief and decision log',
    ],
  },
  {
    name: '+ Automate',
    price: '+ $5,600',
    weeks: '≈ 12 weeks total',
    promise: 'Keep the pipeline fed and every platform change deliberate, explained, and traceable.',
    firstPackage: 9,
    packages: [
      'AI variant generator, queued for approval',
      'Ad-platform action queue — rules to tickets',
      'Consent and tag governance',
      'Multi-brand configuration',
    ],
  },
];

export const analyticsOSConstraints = [
  {
    title: 'No names, no health data in the analytics store',
    detail: 'Customers appear as pseudonymous IDs. Quiz answers, photos, and diagnoses are on the list of things never recorded, written down before package one is accepted.',
  },
  {
    title: 'No tag before opt-in consent',
    detail: 'The ad pixel and tag manager load only after consent; every tag is held to an enforced allowlist of what it may send, audited quarterly against what actually fires.',
  },
  {
    title: 'Every event classified before it ships',
    detail: 'Public, internal, or sensitive — decided per event, with the privacy policy reconciled to the real tag behaviour.',
  },
  {
    title: 'Append-only tables, client-owned accounts',
    detail: 'Outcomes and decisions are never overwritten; corrections are new rows. Code, documentation, and accounts belong to the client from day one.',
  },
];
