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
  work_url VARCHAR(1000),
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
  avatar_url VARCHAR(1000),
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
CREATE TABLE IF NOT EXISTS POST_SCORES (
    post_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE
);

-- answer_scoreテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS ANSWER_SCORES (
  answer_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (answer_id, user_id)
);

-- post_imaegsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS POST_IMAGES (
  id VARCHAR(36) NOT NULL,
  post_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE (post_id, sort_order),
  FOREIGN KEY (post_id) REFERENCES POSTS(id) ON DELETE CASCADE
);

-- question_imagesテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS QUESTION_IMAGES (
  id VARCHAR(36) NOT NULL,
  question_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE (question_id, sort_order),
  FOREIGN KEY (question_id) REFERENCES QUESTIONS(id) ON DELETE CASCADE
);

-- followsテーブル作成(テーブル大文字)
CREATE TABLE IF NOT EXISTS FOLLOWS (
  follower_id VARCHAR(36) NOT NULL,
  following_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES USERS(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES USERS(id) ON DELETE CASCADE
);