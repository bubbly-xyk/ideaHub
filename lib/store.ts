import { ideas as initialIdeas, comments as initialComments } from "./data";
import type { Idea, Comment } from "./data";

// In-memory mutable store (demo only — resets on server restart)
let ideasStore: Idea[] = JSON.parse(JSON.stringify(initialIdeas));
let commentsStore: Comment[] = JSON.parse(JSON.stringify(initialComments));

// ── Ideas ──────────────────────────────────────────────────────────────────
export function getIdeas(): Idea[] {
  return ideasStore;
}

export function getIdeaById(id: string): Idea | undefined {
  return ideasStore.find((i) => i.id === id);
}

export function addIdea(idea: Idea): void {
  ideasStore = [idea, ...ideasStore];
}

export function voteIdea(id: string, delta: 1 | -1): Idea | null {
  const idea = ideasStore.find((i) => i.id === id);
  if (!idea) return null;
  idea.votes = Math.max(0, idea.votes + delta);
  return idea;
}

export function claimIdea(id: string, claimedBy: string): Idea | null {
  const idea = ideasStore.find((i) => i.id === id);
  if (!idea || idea.status !== "open") return null;
  idea.status = "in_progress";
  idea.claimedBy = claimedBy;
  return idea;
}

// ── Comments ───────────────────────────────────────────────────────────────
export function getCommentsByIdea(ideaId: string): Comment[] {
  return commentsStore.filter((c) => c.ideaId === ideaId);
}

export function addComment(comment: Comment): void {
  commentsStore = [...commentsStore, comment];
  // increment comment count on idea
  const idea = ideasStore.find((i) => i.id === comment.ideaId);
  if (idea) idea.comments += 1;
}
