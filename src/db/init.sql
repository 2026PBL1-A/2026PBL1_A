-- Optional bootstrap SQL for local development.
-- This file runs only when the MySQL container initializes an empty data directory.
-- Keep it idempotent and lightweight.

CREATE TABLE IF NOT EXISTS user (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NULL,
  PRIMARY KEY (id)
);
