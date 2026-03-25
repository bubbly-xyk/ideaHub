import { NextResponse } from "next/server";
import { getIdeaById } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idea = await getIdeaById(id);
  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }
  return NextResponse.json({ idea });
}
