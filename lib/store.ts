import pool from "./db";
import type { Idea, Comment, User } from "./data";

// ── Helpers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToIdea(row: any): Idea {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    category: row.category,
    difficulty: row.difficulty,
    status: row.status,
    votes: row.votes,
    comments: row.comments_count,
    bounty: row.bounty ?? undefined,
    submittedBy: row.submitted_by,
    submittedAt: row.submitted_at instanceof Date
      ? row.submitted_at.toISOString().split("T")[0]
      : String(row.submitted_at),
    claimedBy: row.claimed_by ?? undefined,
    marketSize: row.market_size,
    techStack: row.tech_stack ?? [],
    estimatedDuration: row.estimated_duration,
    tags: row.tags ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToComment(row: any): Comment {
  return {
    id: String(row.id),
    ideaId: String(row.idea_id),
    author: row.author,
    avatar: row.avatar,
    content: row.content,
    createdAt: row.created_at instanceof Date
      ? row.created_at.toISOString().split("T")[0]
      : String(row.created_at),
    likes: row.likes,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToUser(row: any): User {
  return {
    id: String(row.id),
    name: row.name,
    avatar: row.avatar,
    points: row.points,
    ideasSubmitted: row.ideas_submitted,
    ideasBuilt: row.ideas_built,
    joinedAt: row.joined_at instanceof Date
      ? row.joined_at.toISOString().split("T")[0]
      : String(row.joined_at),
    badges: row.badges ?? [],
  };
}

// ── Ideas ──────────────────────────────────────────────────────────────────

export async function getIdeas(): Promise<Idea[]> {
  const { rows } = await pool.query("SELECT * FROM ideas ORDER BY votes DESC");
  return rows.map(rowToIdea);
}

export async function getIdeaById(id: string): Promise<Idea | undefined> {
  const { rows } = await pool.query("SELECT * FROM ideas WHERE id = $1", [id]);
  return rows[0] ? rowToIdea(rows[0]) : undefined;
}

export async function addIdea(idea: Omit<Idea, "id">): Promise<Idea> {
  const { rows } = await pool.query(
    `INSERT INTO ideas
      (title, description, long_description, category, difficulty, status,
       votes, comments_count, bounty, submitted_by, submitted_at, claimed_by,
       market_size, tech_stack, estimated_duration, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      idea.title,
      idea.description,
      idea.longDescription,
      idea.category,
      idea.difficulty,
      idea.status,
      idea.votes,
      idea.comments,
      idea.bounty ?? null,
      idea.submittedBy,
      idea.submittedAt,
      idea.claimedBy ?? null,
      idea.marketSize,
      idea.techStack,
      idea.estimatedDuration,
      idea.tags,
    ]
  );
  return rowToIdea(rows[0]);
}

export async function voteIdea(id: string, delta: 1 | -1): Promise<Idea | null> {
  const { rows } = await pool.query(
    `UPDATE ideas
     SET votes = GREATEST(0, votes + $1)
     WHERE id = $2
     RETURNING *`,
    [delta, id]
  );
  return rows[0] ? rowToIdea(rows[0]) : null;
}

export async function claimIdea(id: string, claimedBy: string): Promise<Idea | null> {
  const { rows } = await pool.query(
    `UPDATE ideas
     SET status = 'in_progress', claimed_by = $1
     WHERE id = $2 AND status = 'open'
     RETURNING *`,
    [claimedBy, id]
  );
  return rows[0] ? rowToIdea(rows[0]) : null;
}

// ── Comments ───────────────────────────────────────────────────────────────

export async function getCommentsByIdea(ideaId: string): Promise<Comment[]> {
  const { rows } = await pool.query(
    "SELECT * FROM comments WHERE idea_id = $1 ORDER BY created_at ASC",
    [ideaId]
  );
  return rows.map(rowToComment);
}

export async function addComment(comment: Omit<Comment, "id">): Promise<Comment> {
  const { rows } = await pool.query(
    `INSERT INTO comments (idea_id, author, avatar, content, created_at, likes)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [comment.ideaId, comment.author, comment.avatar, comment.content, comment.createdAt, comment.likes]
  );
  await pool.query(
    "UPDATE ideas SET comments_count = comments_count + 1 WHERE id = $1",
    [comment.ideaId]
  );
  return rowToComment(rows[0]);
}

// ── Users / Leaderboard ────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<User[]> {
  const { rows } = await pool.query("SELECT * FROM users ORDER BY points DESC");
  return rows.map(rowToUser);
}
