import { query } from './db';

const createTableQuery = `
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
    created_utc     TIMESTAMPTZ(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  DO $$ 
  BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'consultation_request_unique_booking') THEN 
      ALTER TABLE consultation_request 
      ADD CONSTRAINT consultation_request_unique_booking 
      UNIQUE (email, schedule_utc); 
    END IF; 
  END $$;
`;

const initDb = async () => {
  try {
    console.log('Creating consultation_request table...');
    await query(createTableQuery);
    console.log('Table created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating table:', err);
    process.exit(1);
  }
};

initDb();
