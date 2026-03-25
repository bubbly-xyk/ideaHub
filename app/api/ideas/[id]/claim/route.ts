import { NextResponse } from "next/server";
import { claimIdea } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const claimedBy = body.claimedBy ?? "anonymous_builder";

  const updated = claimIdea(id, claimedBy);
  if (!updated) {
    return NextResponse.json(
      { error: "Idea not found or already claimed" },
      { status: 409 }
    );
  }

  return NextResponse.json({ idea: updated, message: "认领成功！开始实现吧 🚀" });
}
