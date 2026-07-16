# Commercial positioning

## Brand architecture

- **DaVeenci** is the governed AI systems workshop. It maps, builds, and improves difficult recurring workflows across domains.
- **ShootOS** is DaVeenci's specialist real-estate-media operating practice.
- **AutoPilot** is the governed operations system inside ShootOS. It is not the customer-facing practice name.
- PureCode, CompoundIQ, PulseNote, and BrandOS remain named systems or case studies under DaVeenci.

The canonical public route is `/shootos`. `/autopilot` is a legacy URL and redirects permanently to `/shootos`. The internal React page key and GA4 `case_id` remain `autopilot` so historical funnel reporting does not split.

## Offer ladder

1. **Workflow Blueprint — $5,000 / one week.** Workflow map, failure points, system design, human gates, expected value, implementation scope, and fixed build proposal. Credited toward a build started within 30 days.
2. **Specialist Team Build — from $14,000 / three to six weeks.** A clearly scoped production implementation with integrations, state, observability, safeguards, deployment, and documentation. Larger or higher-consequence systems are quoted from the Blueprint.
3. **Operate and Improve — from $2,500/month.** Monitoring, failure review, model and prompt improvements, workflow expansion, and a monthly operating report. Infrastructure, model usage, and response-time commitments are scoped separately.

## Messaging guardrails

- Lead with difficult recurring work, operating trust, and accountable finished outputs.
- Explain specialist roles and human gates as the operating method, not the product being sold.
- Treat useful AI tools fairly: the gap is ownership of handoffs, integrations, state, controls, and release—not that every tool is bad.
- Show operating status explicitly: production, operating practice, demonstration, prototype, or research.
- Do not publish performance, cost, or throughput claims unless the underlying evidence can be shown or cited.

## Case-study evidence standard

Every case should expose the recurring input, original manual workflow, specialist roles, systems integrated, human gates, finished output, handled exceptions, measurable improvement when verified, and current operating status. ShootOS is the first case using the reusable evidence-led structure in `frontend/components/CaseEvidence.tsx`.
