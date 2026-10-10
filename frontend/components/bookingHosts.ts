import AstridSketch from '../images/Astrid_Sketch.webp';
import AntonSketch from '../images/Anton_Sketch.webp';

export type BookingHostKey = 'anton' | 'astrid';

export interface BookingHostCopy {
  key: BookingHostKey;
  name: string;
  role: string;
  portrait: string;
  /** Small caps label above the heading. */
  eyebrow: string;
  /** Rendered as "{lead} <em>{leadEmphasis}</em>". */
  lead: string;
  leadEmphasis: string;
  durationLabel: string;
  blurb: string;
  /** Heading above the numbered list. */
  agendaTitle: string;
  agenda: string[];
  reasonLabel: string;
  reasonOptions: string[];
  defaultReason: string;
  /** Confirmation-screen and .ics title. */
  eventTitle: string;
  /** One line under the confirmation heading. */
  confirmation: string;
}

export const BOOKING_HOSTS: Record<BookingHostKey, BookingHostCopy> = {
  anton: {
    key: 'anton',
    name: 'Anton Osipov',
    role: 'Founder',
    portrait: AntonSketch,
    eyebrow: 'Module Call',
    lead: '15 minutes with',
    leadEmphasis: 'Anton.',
    durationLabel: '15 min',
    blurb:
      "You've seen the price and the video. This call is to check that the module fits how your orders actually come in — which email, which platform, how many service types — and to pick a start date.",
    agendaTitle: 'What to have handy',
    agenda: [
      'One real concierge order email — forward it after the call',
      'The name of your Aryeo login person',
      'How many orders a week you get by email',
    ],
    reasonLabel: 'What brings you here?',
    reasonOptions: ['Order Intake module', 'Another module', 'Something custom', 'Just curious'],
    defaultReason: 'Order Intake module',
    eventTitle: '15 minutes with Anton',
    confirmation: 'A calendar invitation is on its way to your inbox.',
  },
  astrid: {
    key: 'astrid',
    name: 'Astrid Abrahamyan',
    role: 'Co-Founder',
    portrait: AstridSketch,
    eyebrow: 'Discovery Call',
    lead: 'Talk',
    leadEmphasis: 'to us.',
    durationLabel: '30 min',
    blurb:
      'Thirty minutes with Astrid. No slide deck. Bring one recurring workflow, the systems it crosses, and the consequence of getting it wrong.',
    agendaTitle: 'What we cover',
    agenda: [
      'The recurring input, handoffs, and finished output',
      'Where integrations, specialist roles, and human gates belong',
      'Whether a fixed-scope Workflow Blueprint is worth doing',
    ],
    reasonLabel: 'What brings you here?',
    reasonOptions: [
      'I have a specific workflow I want a team for',
      "I'm exploring — want to see if specialist AI teams fit my work",
      'I read the thesis and want to discuss it',
      "Something else — I'll explain on the call",
    ],
    defaultReason: 'Multiple areas (we will prioritize together)',
    eventTitle: 'Discovery call with DaVeenci',
    confirmation: 'A calendar invitation is on its way to your inbox. Looking forward to the conversation.',
  },
};
