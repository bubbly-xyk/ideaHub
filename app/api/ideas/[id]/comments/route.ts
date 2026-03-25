import { NextResponse } from "next/server";
import { getCommentsByIdea, addComment } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await getCommentsByIdea(id);
  return NextResponse.json({ comments });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
  }

  const initials = (body.author ?? "匿名用户")
    .split(/[_ ]/)
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  const comment = await addComment({
    ideaId: id,
    author: body.author ?? "匿名用户",
    avatar: initials || "AN",
    content: body.content.trim(),
    createdAt: new Date().toISOString().split("T")[0],
    likes: 0,
  });

  return NextResponse.json({ comment, pointsEarned: 1 }, { status: 201 });
}
