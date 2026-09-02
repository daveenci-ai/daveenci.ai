import React from 'react';
import { Callout } from '../components/Shared';
import type { BriefingData } from '../components/BriefingDetailPage';

/**
 * Codex No. 046 — How we run our own agents.
 *
 * Public write-up of the workshop's own autonomous-agent operating model
 * (architecture v9, verified 1 Sep 2026). The internal codename is not used
 * here. Status language is deliberate: this describes an architecture and a
 * release gate, not a system that is already proven in production.
 */

const Rule: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-t border-ink/10 pt-4">
    <h4 className="font-bold text-ink text-sm mb-1">{title}</h4>
    <p className="text-sm text-ink-muted leading-relaxed">{children}</p>
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <li className="p-3 bg-white/50 border-l-2 border-ink/20">
    <strong className="block text-ink text-sm">{label}</strong>
    <span className="text-xs text-ink-muted leading-relaxed">{children}</span>
  </li>
);

export const governedAgentOperations: BriefingData = {
  id: 'governed-agent-operations',
  title: 'How We Run Our Own Agents: An Operating Model With an Enforceable Control Plane',
  metaDescription:
    'The operating model DaVeenci uses for its own autonomous agents: an untrusted planner, isolated workers, and a separate control plane — approval ledger, deterministic policy engine, action broker — that decides what is permitted. Architecture v9, Phase 0 in build.',
  publishDate: '2026-09-02',
  author: 'Anton Osipov',
  category: 'Operations',
  readTime: '9 min read',
  issueNo: '046',
  quickAnswerTitle: 'What does "governed agent operations" mean in practice?',
  quickAnswer:
    'An autonomous agent can <strong>propose</strong> work. It cannot approve it, hold a credential, or take a consequential external action by itself.<br/><br/>At DaVeenci the planner and its workers run on a host that carries no production secrets. A separate <strong>control plane</strong> — an approval ledger, a deterministic policy engine, and an action broker — decides what is permitted and performs the narrow operation itself. A person approves an <strong>exact, hashed artifact</strong>; that approval is single-use, expires, and cannot be replayed.<br/><br/>Status: architecture v9, verified 1 September 2026. Phase 0 (the control plane) is in build. Nothing below is a claim that the controls already exist in production.',
  toc: ['Operating model', 'Six rules', 'Two hosts', 'One action', 'Phase 0', 'Phases', 'Measurement', 'Status', 'FAQ'],
  sections: [
    {
      id: 'operating-model',
      title: 'The operating model',
      content: (
        <>
          <p>Every decision that reaches a client, a prospect, a public channel, or a cloud account is owned by a person — in our case, Anton. The orchestrator holds business context, tracks jobs, selects workflows, and <em>proposes</em> actions. Isolated workers compute and draft. The control plane decides what is permitted.</p>
          <p>The framing that matters: the orchestrator is treated as an <strong>untrusted planner, not a security boundary</strong>. Whichever agent runtime sits underneath, the control plane enforces approval, credential isolation, and policy the same way. Deployment pins a reviewed version and dependency lockfile, disables sandboxing bypasses, and the runtime is re-evaluated quarterly by policy. We chose our runtime because it fits a VPS-first, tool-driven, multi-agent workflow — not because we trust it to enforce anything.</p>
          <Callout variant="alt" className="mt-6">
            <p className="text-sm text-ink leading-relaxed"><strong>Deployment assumption.</strong> Two small VPSs, separated from every other DaVeenci product. The <em>control-plane host</em> runs the ledger, policy engine, broker, and audit log — no model, no untrusted content. The <em>worker host</em> runs the planner, the workers, and a browser, with egress limited to the broker and the model gateway. A root compromise of the worker host yields worker data; a root compromise of the control-plane host is a full-system incident, and is treated as one.</p>
          </Callout>
        </>
      ),
    },
    {
      id: 'six-rules',
      title: 'Six rules we do not negotiate',
      content: (
        <div className="space-y-4 mt-2">
          <Rule title="The model never grants permission.">Deterministic code and an explicit human decision control every side effect. Model output cannot edit policy.</Rule>
          <Rule title="Approval binds an exact action.">Content, recipients, attachments, account, job ID, and expiry are hashed and single-use. Change one byte and it is a new job needing a new approval.</Rule>
          <Rule title="Credentials never enter prompts.">The broker is designed to expose narrow operations — <code>createDraft</code>, <code>sendApprovedMessage</code>, <code>createApprovedEvent</code> — and to perform them itself. It never returns a secret to a planner or worker.</Rule>
          <Rule title="External content is untrusted data.">Email and web content cannot expand tools, permissions, or workflow scope. It is labeled, read-only, and cannot trigger new tools.</Rule>
          <Rule title="Uncertain state fails closed.">Crashes, quota exhaustion, duplicate callbacks, and missing acknowledgements pause or reconcile jobs. A lost provider response triggers reconciliation, not a blind retry.</Rule>
          <Rule title="Every important action is recoverable.">Audit, backup, restore, kill, rotation, and spend controls exist before autonomous sends — not after.</Rule>
        </div>
      ),
    },
    {
      id: 'two-hosts',
      title: 'Two hosts, one trust boundary',
      content: (
        <>
          <p>The split exists so that credentials and untrusted content never share a machine with a model.</p>
          <ul className="list-none space-y-3 mt-4">
            <Row label="Control-plane host — credentials live here; runs no model; reads no untrusted content">Approval ledger and audit (Postgres, hash-chained log, off-host copy) · policy engine (versioned rules, signed changes) · action broker and secret store (encrypted at rest, unlocked by hand after a reboot).</Row>
            <Row label="Worker host — computation zone; no production secrets; egress to broker and model gateway only">Planner (its memory and skill writes are reviewed) · confidential-context workers (draft, code, validate — no web egress) · a context-free fetcher (reads web, mail, calendar — no client data, no broker) · versioned artifact store.</Row>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 border border-ink/10 rounded-sm bg-white/50">
              <h5 className="font-bold text-ink text-sm mb-2">Protected against</h5>
              <p className="text-xs text-ink-muted leading-relaxed">Prompt-injected email or web content · a compromised planner or restricted worker · changed, expired, replayed, or duplicate approvals · lost responses and at-least-once delivery · a leaked bot token without the approver's identity · accidental destructive commands and runaway spend · exfiltration from a confidential-context worker.</p>
            </div>
            <div className="p-4 border border-ink/10 rounded-sm bg-white/50">
              <h5 className="font-bold text-ink text-sm mb-2">Not protected against by this design alone</h5>
              <p className="text-xs text-ink-muted leading-relaxed">Root compromise of the control-plane host · the approver approving a malicious or mistaken action that passes the presentation checks · provider account takeover outside the VPS · chat, mail, model-provider, or cloud-provider compromise · platform enforcement or suspension for prohibited automation.</p>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-ink-muted">Writing the second list down is the point. A design that claims to protect against everything is describing a wish, not a boundary.</p>
        </>
      ),
    },
    {
      id: 'one-action',
      title: 'One action from draft to the outside world',
      content: (
        <>
          <p>A specialist creates a versioned artifact. A lead reviews quality and scope. The orchestrator proposes an immutable job. A person approves or rejects <em>that exact job</em> from the chat interface. The broker independently reloads the approved object from the ledger, re-computes the hash, runs the policy check, consumes the authorization atomically, performs the operation, and records the result.</p>
          <p>Reject or edit → new artifact hash → new approval. There is no "approve this conversation" and no reusable approval. Approvals are risk-tiered and presented in plain text that is never truncated, with look-alike-domain flags; a daily cap on the <em>count</em> of approved external actions exists independently of spend.</p>
          <Callout variant="muted" className="mt-6">
            <p className="text-sm text-ink leading-relaxed"><strong>Retry rules.</strong> Authentication, lockout, verification, and policy errors get zero automatic retries. Transient failures get exponential backoff, jitter, idempotency, and a small per-action budget — default maximum two, platform-specific policy may be stricter. A circuit breaker pauses repeated failures and notifies the approver. This reduces lockout risk; it cannot guarantee an account never locks.</p>
          </Callout>
        </>
      ),
    },
    {
      id: 'phase-zero',
      title: 'Phase 0: the control plane exists before any workflow',
      content: (
        <>
          <p>These are deployment requirements, not optional enhancements. Each needs implementation evidence, tests, an owner, a runbook, and deployment configuration before the system is called production-ready.</p>
          <ul className="list-none space-y-3 mt-4">
            <Row label="Approval ledger and adapter">Canonical job, artifact hash, recipients, policy version, nonce, expiry, and state. The chat bot validates the approver's user and chat ID server-side and rejects forwarded, edited, expired, duplicate, or replayed input.</Row>
            <Row label="Policy engine and action broker">Versioned deterministic rules map job type, phase, data class, destination, and risk tier to allow, deny, or approval-required. The broker holds credentials as a separate service user in its own network namespace.</Row>
            <Row label="Audit log, backup, restore">Append-only, hash-chained, redacted, replicated off-host. Encrypted nightly backup, quarterly restore drill; target RPO 24 hours, RTO 4 hours. A snapshot that has never been restored does not count.</Row>
            <Row label="Spend controller and kill switch">Daily and monthly limits, auto-top-up disabled unless separately approved. A chat pause plus an out-of-band provider path revokes leases, disables broker writes, terminates workers, and stays paused across restart.</Row>
            <Row label="Egress policy and secret store">Confidential-context workers reach only the broker socket and the model gateway. Broker secrets are encrypted at rest; after a reboot the system stays paused until unlocked by hand.</Row>
            <Row label="Memory and skill governance">Agent-authored skills and long-term memory writes are diffed, provenance-tagged, and approved before use; auto-generation is off in early phases; memory is versioned with rollback.</Row>
            <Row label="Security detection and staging">Canary credentials planted in worker environments alert on any use. A sandbox mailbox, a second bot, and a dry-run broker that records instead of sends host the acceptance suite before real recipients exist.</Row>
          </ul>
        </>
      ),
    },
    {
      id: 'phases',
      title: 'Phases, and the gate between them',
      content: (
        <>
          <p>Each phase becomes available only after its exit criteria pass. Later capabilities do not weaken the earlier rules.</p>
          <div className="space-y-4 mt-4">
            {[
              ['Phase 0', 'Control plane before workflows', 'Both hosts, spend controller, kill switch, backup and restore, supervisor, observability, security detection, staging — demonstrated, not described.'],
              ['Phase 1', 'Research and drafting', 'Read-only research, structured qualification, proposals, mail drafts, calendar reading. No client-facing or public action is executable by the agent; a person sends and publishes.'],
              ['Phase 2', 'Exact-artifact approval and controlled actions', 'Approved sends and calendar writes become executable only through broker operations tied to a single immutable approval. Opens only when the acceptance evidence is attached to a release record and signed off.'],
              ['Phase 3', 'Formal engineering handoff', 'Authenticated versioned requests, idempotency, scoped project identity, status callbacks, artifact manifests. Engineering stays an external security domain.'],
              ['Phase 4', 'Growth and social', 'Official platform APIs or manual publishing first. Browser automation ships only after written acceptance of account-suspension and terms-of-service risk.'],
              ['Phase 5', 'Creative, client success, compliance, full sentinel', 'Media generation, onboarding workflows, support triage, case-study drafting, compliance research, and the richer cost dashboard. The Phase 0 hard spend cap stays independent.'],
            ].map(([phase, title, body]) => (
              <div key={phase} className="flex gap-4">
                <div className="w-20 flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-accent pt-1">{phase}</div>
                <div>
                  <h4 className="font-bold text-ink text-sm">{title}</h4>
                  <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <Callout variant="warning" className="mt-6">
            <p className="text-sm text-ink leading-relaxed"><strong>Gate rule.</strong> Phase 2 does not open on a design review or a successful demo. Among the acceptance tests: changing one byte, recipient, account, action, or attachment invalidates approval; a compromised planner and worker cannot read mail, calendar, cloud, or broker credentials; both kill-switch paths stop new work within 30 seconds; a full clean-environment restore completes within the RTO; a planted canary credential raises an alert within five minutes; an approved update whose target changed since approval is refused and re-queued.</p>
          </Callout>
        </>
      ),
    },
    {
      id: 'measurement',
      title: 'What we measure',
      content: (
        <>
          <p>Service objectives for the minimum viable system are boring on purpose: backup RPO 24 hours, restore RTO 4 hours, kill latency 30 seconds, and zero tolerated for changed-or-replayed approvals, duplicate external sends, and silent stalls.</p>
          <ul className="list-none space-y-3 mt-4">
            <Row label="Approval rejection rate — review trigger above 25% over 20 jobs">Detects low-quality or poorly scoped drafts.</Row>
            <Row label="Post-approval correction — any consequential case">Signals approval presentation or review failure.</Row>
            <Row label="Task success by workflow — review below 80% for a mature flow">Prevents strong aggregate numbers from hiding weak agents.</Row>
            <Row label="Cost per accepted artifact — review at 2× monthly baseline">Connects model spend to useful output.</Row>
            <Row label="Human review time — review if no improvement after 30 days">Shows whether automation reduces or merely shifts work.</Row>
            <Row label="Policy denial rate — review on a sudden 2× increase">Finds prompt drift, misuse, and overly broad workflows.</Row>
          </ul>
        </>
      ),
    },
    {
      id: 'status',
      title: 'Status, cost, and what this is not',
      content: (
        <>
          <p>This is an architecture and release-gate specification at version 9, verified against vendor documentation on 1 September 2026 and reviewed against the 2026 OWASP Top 10 for agentic applications. It is not proof that the controls exist. Phase 0 is in build; nothing autonomous reaches a client until the acceptance evidence is signed.</p>
          <p>Running cost for phases 0–1 is planned in the low hundreds of dollars a month — two small VPSs, model capacity, an off-host backup — with local per-job budgets and provider spending caps as the actual control. The planning range is not the control.</p>
          <p>The reason to publish this: every build we ship for a client carries the same shape — narrow roles, explicit gates, append-only records, a person accountable for release. Running our own operations under the same rules is the honest way to find out where they bend.</p>
        </>
      ),
    },
  ],
  faqs: [
    {
      question: 'Why not rely on the agent framework’s own permission system?',
      answer: 'Because the framework is an untrusted planner in this design. Deployment pins a reviewed version and lockfile, disables sandbox bypasses, and re-evaluates the runtime quarterly; the control plane enforces approval, credential isolation, and policy regardless of which runtime sits underneath.',
    },
    {
      question: 'What happens if the chat bot token leaks?',
      answer: 'A stolen token impersonates the bot, not the approver. Approvals are validated server-side against the approver’s user and chat ID with callback nonces and replay rejection, so the token alone cannot approve anything. Rotation is a documented runbook.',
    },
    {
      question: 'Does this slow the work down?',
      answer: 'Yes, by design. Human review is a throughput bottleneck, and human review time is one of the six measurements — if automation does not reduce it within 30 days, the workflow is reviewed, not the gate.',
    },
    {
      question: 'Can a client get the same thing?',
      answer: 'The same shape shows up in every DaVeenci build — specialist roles, explicit human gates, append-only records, and an accountable release. The full two-host control plane is what the Operate and Improve tier grows into for systems that take external actions. Bring the action you do not dare fully automate.',
    },
  ],
};
