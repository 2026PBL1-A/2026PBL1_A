-- Optional bootstrap SQL for local development.
-- This file runs only when the MySQL container initializes an empty data directory.
-- Keep it idempotent and lightweight.

CREATE TABLE IF NOT EXISTS user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NULL,
  PRIMARY KEY (id)
);
