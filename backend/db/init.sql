
SET FOREIGN_KEY_CHECKS = 0;


CREATE DATABASE IF NOT EXISTS myapp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE myapp;

CREATE USER IF NOT EXISTS 'devuser'@'%' IDENTIFIED BY 'devpass';
GRANT ALL PRIVILEGES ON myapp.* TO 'devuser'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 스키마

-- users 테이블
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(255) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  name          VARCHAR(255),
  nickname      VARCHAR(255),
  profile_image VARCHAR(500),
  is_public     BOOLEAN      DEFAULT FALSE,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- friends 테이블
CREATE TABLE IF NOT EXISTS friends (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT  NOT NULL,
  friend_id  INT  NOT NULL,
  status     VARCHAR(20) NOT NULL,
  created_at DATETIME    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id)  ON DELETE CASCADE,
  UNIQUE KEY uniq_friend (user_id, friend_id)   -- 중복 친구 방지
) ENGINE=InnoDB;

-- calc 테이블 (일정)
CREATE TABLE IF NOT EXISTS calc (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  source      VARCHAR(20)  NOT NULL,
  start_date  DATETIME     NOT NULL,
  end_date    DATETIME     NOT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- contests 테이블 (공모전 / 코딩테스트 일정)
CREATE TABLE IF NOT EXISTS contests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        VARCHAR(20)  NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  start_date  DATETIME     NOT NULL,
  end_date    DATETIME     NOT NULL,
  tags        TEXT,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- bookmarks 테이블
CREATE TABLE IF NOT EXISTS bookmarks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  contest_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_bookmark (user_id, contest_id)   -- 중복 북마크 방지
) ENGINE=InnoDB;


SET FOREIGN_KEY_CHECKS = 1;
