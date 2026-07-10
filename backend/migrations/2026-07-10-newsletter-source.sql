-- Additive: records which page/form a newsletter subscription came from.
-- Safe to run on a live database; existing rows keep NULL.
ALTER TABLE newsletter_request ADD COLUMN IF NOT EXISTS source TEXT;
