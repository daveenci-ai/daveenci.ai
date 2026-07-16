import type { CaseEvidenceItem } from '../components/CaseEvidence';

export const shootosEvidence: CaseEvidenceItem[] = [
  {
    label: 'Recurring input',
    value: 'A structured listing-order email',
    detail: 'Customer, property, package, requested services, scheduling window, and delivery commitments enter through one repeatable intake.',
  },
  {
    label: 'Original manual workflow',
    value: 'Re-key, cross-check, chase, and spot-check',
    detail: 'Operators moved between the inbox, Aryeo, schedules, and media records while carrying exceptions and follow-up rules in their heads.',
  },
  {
    label: 'Systems integrated',
    value: 'Gmail, Aryeo, scheduling, and media delivery',
    detail: 'AutoPilot coordinates reads, verified write-backs, shared state, retry budgets, tags, and direct links for operator review.',
  },
  {
    label: 'Human approval gates',
    value: 'Ambiguity and consequence stop the system',
    detail: 'Unreadable fields, uncertain matches, pricing conflicts, media-quality findings, and reschedules route to a person instead of being silently passed.',
  },
  {
    label: 'Finished output',
    value: 'A scheduled, reviewed, delivery-ready job',
    detail: 'The system leaves behind an inspectable job, completion tags, verified deliverables, an explainable quality grade, and an actionable morning report.',
  },
  {
    label: 'Exceptions handled',
    value: 'Known issues repaired; unknowns isolated',
    detail: 'Mechanical problems can be corrected with read-back verification. Ambiguous or high-consequence cases become focused human tickets.',
  },
  {
    label: 'Operating status',
    value: 'Production where proven; shadow-gated elsewhere',
    detail: 'Order Review and Job Review are live. Delivery rescheduling remains isolated until its final production controls are confirmed.',
  },
  {
    label: 'Evidence currently exposed',
    value: '3 services · 8 checks · 75 mappings · 50 vision rules',
    detail: 'The operating cadence is ten minutes, with persisted state and explicit evidence for every action and hold.',
  },
];
