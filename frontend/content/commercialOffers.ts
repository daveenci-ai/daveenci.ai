export interface CommercialOffer {
  id: 'blueprint' | 'build' | 'operate' | 'analytics-os';
  /** Productized system rather than a step on the ladder. */
  productized?: boolean;
  number: string;
  title: string;
  price: string;
  /** Lowest price in USD, for the structured data on the homepage. */
  minPrice: number;
  timeline: string;
  description: string;
  deliverables: string[];
  note: string;
  /** Example phases with their own page (Blueprint only, 15 Oct 2026). */
  examples?: { label: string; path: string; page: 'order-intake' | 'order-review' }[];
}

export const commercialOffers: CommercialOffer[] = [
  {
    id: 'blueprint',
    number: '01',
    title: 'Workflow Blueprint',
    price: '$2,500',
    minPrice: 2500,
    timeline: 'One week',
    description: 'Turn one difficult recurring workflow into a buildable, economically grounded system plan.',
    deliverables: [
      'Workflow map, handoffs, and failure points',
      'Specialist roles, integrations, and human gates',
      'Expected value, implementation scope, and fixed build proposal',
    ],
    // Anton, 15 Oct 2026: $2,500, with Intake and Order Review shown as example phases.
    examples: [
      { label: 'Concierge Order Intake', path: '/shoot-ops/concierge-order-intake', page: 'order-intake' },
      { label: 'Order Review', path: '/shoot-ops/order-review', page: 'order-review' },
    ],
    note: 'Credited toward a build started within 30 days.',
  },
  {
    id: 'build',
    number: '02',
    title: 'Specialist Team Build',
    price: 'From $14,000',
    minPrice: 14000,
    timeline: 'Three to six weeks',
    description: 'Implement a clearly scoped production workflow with the controls required to operate it responsibly.',
    deliverables: [
      'Integrations, shared state, and specialist orchestration',
      'Observability, safeguards, and explicit approval gates',
      'Deployment, operating documentation, and handover',
    ],
    note: 'Larger or higher-consequence systems are quoted from the Blueprint.',
  },
  {
    id: 'operate',
    number: '03',
    title: 'Operate and Improve',
    price: 'From $4,000/mo',
    minPrice: 4000,
    timeline: 'Ongoing',
    description: 'Keep the system observable, useful, and aligned as the workflow and underlying models change.',
    deliverables: [
      'Monitoring, failure review, and operating support',
      'Model, prompt, rule, and workflow improvements',
      'Monthly operating report and expansion roadmap',
    ],
    note: 'Infrastructure, model usage, and response-time commitments are scoped separately.',
  },
  {
    id: 'analytics-os',
    number: '04',
    title: 'Marketing Analytics OS',
    price: 'From $6,500',
    minPrice: 6500,
    timeline: 'Five weeks to the first verdict',
    description: 'A productized measurement system: site events, ad spend, and CRM outcomes reconciled in a warehouse you own, with keep / kill verdicts you can calculate.',
    deliverables: [
      'Measurement plan and data boundary — pseudonymous IDs, nothing sensitive',
      'First-party event tracking and a client-owned warehouse',
      'Funnel and spend dashboard with a keep / kill rule per campaign',
    ],
    note: 'Learn (experiments, attribution, alerts) and Automate (AI variants, action queue, multi-brand) tiers extend it.',
    productized: true,
  },
];
