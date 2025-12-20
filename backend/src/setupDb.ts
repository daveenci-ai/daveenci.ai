import { query } from './db';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS event_request (
	id serial4 NOT NULL,
	full_name varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	event_name varchar(255) NULL,
	event_description TEXT NULL,
	event_dt_utc timestamptz(3) NOT NULL,
	created_utc timestamptz(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT event_request_pkey PRIMARY KEY (id),
	CONSTRAINT event_request_unique_email UNIQUE (email, event_dt_utc)
);
`;

const setupDb = async () => {
    try {
        console.log('Creating event_request table...');
        await query(createTableQuery);
        console.log('Table created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
};

setupDb();
