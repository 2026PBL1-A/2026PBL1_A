-- Optional bootstrap SQL for local development.
-- This file runs only when the MySQL container initializes an empty data directory.
-- Keep it idempotent and lightweight.

CREATE TABLE IF NOT EXISTS USERS (
  id VARCHAR(36) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  PRIMARY KEY (id)
);

-- postsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS POSTS (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  tag VARCHAR(255) ,
  -- image_url VARCHAR(255) ,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- profilesテーブル作成(テーブル大文字)
-- 1ユーザーに対して1プロフィール（user_id に UNIQUE 制約）
CREATE TABLE IF NOT EXISTS PROFILES (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);
