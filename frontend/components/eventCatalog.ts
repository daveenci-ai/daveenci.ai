import { formatInTimeZone } from 'date-fns-tz';
import NetworkingImage from '../images/01 - Networking Session.jpg';
import AEOvsSEOImage from '../images/02 - Battle Between AEO and SEO.jpg';
import OwnYourStackImage from '../images/03 - Own Your Stack.jpg';

export interface ScheduledEvent {
  id: string;
  image: string;
  title: string;
  description: string;
  /** A fixed ISO-8601 instant, including an explicit UTC offset. */
  startsAt: string;
  /** IANA timezone used for the public date label. */
  timeZone: string;
  timeZoneLabel: string;
  location: string;
}

export interface WorkshopTopic {
  image: string;
  title: string;
  description: string;
}

/**
 * Publish only confirmed events here. Never derive dates from the visitor's
 * clock: the ISO instant is the registration source of truth and timeZone is
 * used only for the human-readable label.
 */
export const scheduledEvents: ScheduledEvent[] = [];

export const workshopTopics: WorkshopTopic[] = [
  {
    image: NetworkingImage,
    title: 'AI × Ops: The Networking Session',
    description: 'How founders, builders, and operators are applying AI and automation to the work between systems.',
  },
  {
    image: AEOvsSEOImage,
    title: 'The Battle Between AEO and SEO',
    description: 'How discovery changes when answer engines become a primary interface to the web.',
  },
  {
    image: OwnYourStackImage,
    title: 'AI Foundations: Own Your Stack',
    description: 'The practical foundations of running AI applications on infrastructure you can understand and control.',
  },
];

export const formatEventDate = (event: ScheduledEvent, compact = false): string => {
  const pattern = compact ? 'EEE, MMM d · h:mm a' : 'EEE, MMM d, yyyy @ h:mm a';
  return `${formatInTimeZone(event.startsAt, event.timeZone, pattern)} ${event.timeZoneLabel}`;
};
