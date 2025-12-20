-- Create consultation_request table
CREATE TABLE IF NOT EXISTS consultation_request (
  id              SERIAL PRIMARY KEY,
  full_name       VARCHAR(255)        NOT NULL,
  email           VARCHAR(255)        NOT NULL,
  phone           VARCHAR(50),
  company         VARCHAR(255),
  reason          TEXT                NOT NULL,
  other           TEXT,
  scheduled_with  VARCHAR(255)        NOT NULL,
  schedule_utc    TIMESTAMPTZ(3)      NOT NULL,
  created_utc     TIMESTAMPTZ(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email, schedule_utc)
);

-- Create newsletter_request table
CREATE TABLE IF NOT EXISTS newsletter_request (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255)        NOT NULL UNIQUE,
  created_utc     TIMESTAMPTZ(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create event_request table
CREATE TABLE IF NOT EXISTS event_request (
  id              SERIAL PRIMARY KEY,
  full_name       VARCHAR(255)        NOT NULL,
  email           VARCHAR(255)        NOT NULL,
  event_name      VARCHAR(255)        NOT NULL,
  event_description TEXT,
  event_dt_utc    TIMESTAMPTZ(3)      NOT NULL,
  created_utc     TIMESTAMPTZ(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (email, event_name, event_dt_utc)
);
