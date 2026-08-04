import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CheckCircle2,
  Clapperboard,
  FileText,
  Flag,
  Layers3,
  Megaphone,
  PenTool,
  Send,
  ShieldCheck,
  Target,
} from 'lucide-react';

export interface CreativeDeliverable {
  eyebrow: string;
  title: string;
  body: string;
  examples: string[];
  Icon: LucideIcon;
}

export interface CreativeWorkflowStage {
  number: string;
  label: string;
  title: string;
  body: string;
  evidence: string;
  gate?: boolean;
  Icon: LucideIcon;
}

export const CREATIVE_CONVERSION_PHRASE = 'Bring us the next campaign';

export const creativeDeliverables: CreativeDeliverable[] = [
  {
    eyebrow: 'Direction',
    title: 'Marketing strategy',
    body: 'Turn the business context, audience, offer, and constraints into one usable campaign direction.',
    examples: ['Campaign brief', 'Channel roles', 'Content priorities'],
    Icon: Target,
  },
  {
    eyebrow: 'Distribution',
    title: 'Campaign management',
    body: 'Coordinate paid campaigns across the selected channels, with explicit budget and release approvals.',
    examples: ['Campaign setup', 'Channel coordination', 'Review cadence'],
    Icon: Megaphone,
  },
  {
    eyebrow: 'Production',
    title: 'Content development',
    body: 'Develop the ads and supporting content required by the campaign rather than treating each asset as an isolated request.',
    examples: ['Campaign content', 'Ad variations', 'Review-ready copy'],
    Icon: PenTool,
  },
  {
    eyebrow: 'Motion',
    title: 'YouTube video',
    body: 'Carry a video from brief through production and review, with the release decision kept in human hands.',
    examples: ['Video brief', 'Production workflow', 'Approved release'],
    Icon: Clapperboard,
  },
];

export const creativeChannels = ['Facebook', 'LinkedIn', 'Google', 'TikTok', 'ChatGPT'];

export const creativeWorkflow: CreativeWorkflowStage[] = [
  {
    number: '01',
    label: 'Intake',
    title: 'Make the commercial context explicit.',
    body: 'Capture the audience, offer, constraints, channel history, available source material, and the decision the work needs to support.',
    evidence: 'Approved working brief',
    Icon: FileText,
  },
  {
    number: '02',
    label: 'Strategy',
    title: 'Set one direction before production branches.',
    body: 'Define the campaign idea, channel roles, content requirements, approval owners, and what the next review will examine.',
    evidence: 'Campaign plan + production map',
    Icon: Flag,
  },
  {
    number: '03',
    label: 'Production',
    title: 'Develop the connected body of work.',
    body: 'Produce the ads, campaign content, and YouTube video materials against the same brief, with version history kept visible.',
    evidence: 'Review-ready asset set',
    Icon: Layers3,
  },
  {
    number: '04',
    label: 'Human gate',
    title: 'Approve claims, voice, budget, and release.',
    body: 'A person reviews the work and the decision around it. Nothing publishes because a system considered itself finished.',
    evidence: 'Named approval or a focused revision request',
    gate: true,
    Icon: ShieldCheck,
  },
  {
    number: '05',
    label: 'Publish',
    title: 'Release only the approved version.',
    body: 'Move the signed-off campaign and content into the selected channels while keeping the released version traceable.',
    evidence: 'Published asset register',
    Icon: Send,
  },
  {
    number: '06',
    label: 'Measure',
    title: 'Return evidence to the next cycle.',
    body: 'Review channel evidence against the campaign question, document what changed, and carry the learning into the next brief.',
    evidence: 'Decision note for the next cycle',
    Icon: BarChart3,
  },
];

export const creativeSectors = ['Law', 'Health', 'Non-profit', 'Ecommerce', 'Beverages'];

export const creativeAudiences = [
  {
    title: 'Founder-led teams',
    body: 'The strategy exists in conversations, but campaign and content production still depends on the founder carrying every handoff.',
  },
  {
    title: 'Small marketing teams',
    body: 'The team knows what it wants to say but needs one governed production rhythm across channels and formats.',
  },
  {
    title: 'Organizations with scattered output',
    body: 'Ads, content, video, approvals, and channel decisions live in separate queues with no shared finish line.',
  },
];

export const creativeFaqs = [
  {
    question: 'What can the Creative Production practice own?',
    answer: 'Marketing strategy, paid campaign management, content development, ads, and YouTube video. The exact operating boundary is set in the brief so ownership and approvals stay clear.',
  },
  {
    question: 'Which channels do you work across?',
    answer: 'Facebook, LinkedIn, Google, TikTok, and ChatGPT. A project does not need to use every channel; the strategy determines which ones have a real job to do.',
  },
  {
    question: 'Where do human approvals sit?',
    answer: 'Before publication and anywhere the work changes a claim, voice, budget, or release decision. A human can approve, request a focused revision, or stop the workflow.',
  },
  {
    question: 'Is every step produced with AI?',
    answer: 'No. The practice uses the right production method for the job. The governing principle is not how much AI is used; it is whether the work is traceable, reviewable, and released by a person.',
  },
  {
    question: 'Can this work with an existing marketing team?',
    answer: 'Yes. The workflow can assign strategy, production, review, and release responsibilities across your team and ours, as long as each handoff and approval owner is explicit.',
  },
  {
    question: 'Why are there no client names or campaign results here?',
    answer: 'Current client work is not cleared for public attribution. DaVeenci does not publish a name, result, or testimonial without permission; the first conversation can establish what evidence is available and what must remain confidential.',
  },
];

export const creativeWorkflowPrinciples = [
  { title: 'One brief', body: 'Strategy and production work from the same commercial question.', Icon: Target },
  { title: 'Visible versions', body: 'Reviewers can identify which work changed and which version was approved.', Icon: Layers3 },
  { title: 'Human release', body: 'Publication is an explicit decision, never an automatic assumption.', Icon: CheckCircle2 },
];
