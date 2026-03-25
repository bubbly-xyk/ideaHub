-- IdeaHub PostgreSQL Schema
-- Run: psql $DATABASE_URL -f scripts/schema.sql

-- ── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Drop existing tables (safe for fresh re-runs) ──────────────────────────
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE ideas (
  id               SERIAL PRIMARY KEY,
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  long_description TEXT        NOT NULL DEFAULT '',
  category         TEXT        NOT NULL,
  difficulty       TEXT        NOT NULL DEFAULT 'medium',
  status           TEXT        NOT NULL DEFAULT 'open',
  votes            INTEGER     NOT NULL DEFAULT 0,
  comments_count   INTEGER     NOT NULL DEFAULT 0,
  bounty           INTEGER,
  submitted_by     TEXT        NOT NULL DEFAULT 'anonymous',
  submitted_at     DATE        NOT NULL DEFAULT CURRENT_DATE,
  claimed_by       TEXT,
  market_size      TEXT        NOT NULL DEFAULT '',
  tech_stack       TEXT[]      NOT NULL DEFAULT '{}',
  estimated_duration TEXT      NOT NULL DEFAULT '',
  tags             TEXT[]      NOT NULL DEFAULT '{}'
);

CREATE TABLE comments (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  idea_id    INTEGER     NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author     TEXT        NOT NULL,
  avatar     TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  created_at DATE        NOT NULL DEFAULT CURRENT_DATE,
  likes      INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE users (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name             TEXT        NOT NULL,
  avatar           TEXT        NOT NULL,
  points           INTEGER     NOT NULL DEFAULT 0,
  ideas_submitted  INTEGER     NOT NULL DEFAULT 0,
  ideas_built      INTEGER     NOT NULL DEFAULT 0,
  joined_at        DATE        NOT NULL DEFAULT CURRENT_DATE,
  badges           TEXT[]      NOT NULL DEFAULT '{}'
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_ideas_status    ON ideas(status);
CREATE INDEX idx_ideas_category  ON ideas(category);
CREATE INDEX idx_ideas_votes     ON ideas(votes DESC);
CREATE INDEX idx_comments_idea   ON comments(idea_id);
CREATE INDEX idx_users_points    ON users(points DESC);
