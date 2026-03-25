import { NextResponse } from "next/server";
import { getIdeas, addIdea } from "@/lib/store";
import type { Idea } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const difficulty = searchParams.get("difficulty");
  const bountyOnly = searchParams.get("bounty") === "true";
  const sort = searchParams.get("sort") ?? "votes";
  const q = searchParams.get("q");

  let ideas = getIdeas();

  if (q) {
    const lower = q.toLowerCase();
    ideas = ideas.filter(
      (i) =>
        i.title.toLowerCase().includes(lower) ||
        i.description.toLowerCase().includes(lower) ||
        i.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }
  if (category) ideas = ideas.filter((i) => i.category === category);
  if (status) ideas = ideas.filter((i) => i.status === status);
  if (difficulty) ideas = ideas.filter((i) => i.difficulty === difficulty);
  if (bountyOnly) ideas = ideas.filter((i) => !!i.bounty);

  const sorted = [...ideas];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      break;
    case "bounty":
      sorted.sort((a, b) => (b.bounty ?? 0) - (a.bounty ?? 0));
      break;
    case "comments":
      sorted.sort((a, b) => b.comments - a.comments);
      break;
    default:
      sorted.sort((a, b) => b.votes - a.votes);
  }

  return NextResponse.json({ ideas: sorted, total: sorted.length });
}

export async function POST(request: Request) {
  const body = await request.json();

  const required = ["title", "description", "category"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const newIdea: Idea = {
    id: Date.now().toString(),
    title: body.title,
    description: body.description,
    longDescription: body.longDescription ?? "",
    category: body.category,
    difficulty: body.difficulty ?? "medium",
    status: "open",
    votes: 0,
    comments: 0,
    bounty: body.bounty ? Number(body.bounty) : undefined,
    submittedBy: body.submittedBy ?? "anonymous",
    submittedAt: new Date().toISOString().split("T")[0],
    marketSize: body.marketSize ?? "未知",
    techStack: body.techStack ?? [],
    estimatedDuration: body.estimatedDuration ?? "未定",
    tags: body.tags ?? [],
  };

  addIdea(newIdea);

  return NextResponse.json({ idea: newIdea, pointsEarned: 50 }, { status: 201 });
}
