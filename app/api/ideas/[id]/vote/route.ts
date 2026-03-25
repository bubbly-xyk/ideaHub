import { NextResponse } from "next/server";
import { voteIdea } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const delta = body.action === "unvote" ? -1 : 1;

  const updated = await voteIdea(id, delta as 1 | -1);
  if (!updated) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  return NextResponse.json({ votes: updated.votes, pointsEarned: delta === 1 ? 2 : 0 });
}
