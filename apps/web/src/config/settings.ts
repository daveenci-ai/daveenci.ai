/**
 * Application Settings & Configuration
 * 
 * This file contains configuration constants used across the admin interface.
 * All AI prompts and generation logic have been moved to the backend for security.
 */

/**
 * Generation frequency options for article scheduling
 */
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

/**
 * Default topics for article generation
 */
export const DEFAULT_TOPICS = [
  'Startup Strategy',
  'Product Development',
  'Fundraising',
  'Market Analysis',
  'Growth Tactics',
  'Founder Mindset',
  'Team Building',
  'Customer Discovery',
  'Competitive Analysis',
  'Pricing Strategy',
] as const;

/**
 * Article categories
 */
export const CATEGORIES = [
  'Strategy',
  'Product',
  'Capital',
  'Growth',
  'Founder Mindset',
  'Market Analysis',
] as const;

/**
 * Default author name
 */
export const DEFAULT_AUTHOR = 'DaVeenci Team';

/**
 * Words per minute for read time calculation
 */
export const WORDS_PER_MINUTE = 200;

