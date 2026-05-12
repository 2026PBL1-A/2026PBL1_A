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
  tag VARCHAR(255) ,
  -- image_url VARCHAR(255) ,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- 質問テーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS QUESTIONS (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tag VARCHAR(255) ,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- profilesテーブル作成(テーブル大文字)
-- 1ユーザーに対して1プロフィール（user_id に UNIQUE 制約）
CREATE TABLE IF NOT EXISTS PROFILES (
  id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  bio TEXT,
  tag VARCHAR(255),
  -- avatar_url VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- commentsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS COMMENTS (
  id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- answersテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS ANSWERS (
  id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  comment TEXT NOT NULL,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ANSWER_SCORE (
  answer_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (answer_id, user_id)
)