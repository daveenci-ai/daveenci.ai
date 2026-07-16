export interface CommercialOffer {
  id: 'blueprint' | 'build' | 'operate';
  number: string;
  title: string;
  price: string;
  timeline: string;
  description: string;
  deliverables: string[];
  note: string;
}

export const commercialOffers: CommercialOffer[] = [
  {
    id: 'blueprint',
    number: '01',
    title: 'Workflow Blueprint',
    price: '$5,000',
    timeline: 'One week',
    description: 'Turn one difficult recurring workflow into a buildable, economically grounded system plan.',
    deliverables: [
      'Workflow map, handoffs, and failure points',
      'Specialist roles, integrations, and human gates',
      'Expected value, implementation scope, and fixed build proposal',
    ],
    note: 'Credited toward a build started within 30 days.',
  },
  {
    id: 'build',
    number: '02',
    title: 'Specialist Team Build',
    price: 'From $14,000',
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
    price: 'From $2,500/mo',
    timeline: 'Ongoing',
    description: 'Keep the system observable, useful, and aligned as the workflow and underlying models change.',
    deliverables: [
      'Monitoring, failure review, and operating support',
      'Model, prompt, rule, and workflow improvements',
      'Monthly operating report and expansion roadmap',
    ],
    note: 'Infrastructure, model usage, and response-time commitments are scoped separately.',
  },
];
