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

-- tagsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS TAGS (
  id VARCHAR(36) NOT NULL,
  tag VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

-- post_tagsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS POST_TAGS (
  post_id VARCHAR(36) NOT NULL,
  tag_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES TAGS(id) ON DELETE CASCADE
);

-- question_tagsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS QUESTION_TAGS (
  question_id VARCHAR(36) NOT NULL,
  tag_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (question_id, tag_id),
  FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES TAGS(id) ON DELETE CASCADE
);

-- profile_tagsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS PROFILE_TAGS (
  profile_id VARCHAR(36) NOT NULL,
  tag_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (profile_id, tag_id),
  FOREIGN KEY (profile_id) REFERENCES PROFILES(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES TAGS(id) ON DELETE CASCADE
);

-- post_scoreテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS POST_SCORE (
    post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES POSTS(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
        ON DELETE CASCADE
);