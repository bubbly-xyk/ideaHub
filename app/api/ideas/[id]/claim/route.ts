import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { claimIdea } from "@/lib/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录才能认领点子" }, { status: 401 });
  }

  const { id } = await params;
  const claimedBy = session.user.name ?? session.user.email ?? "Builder";

  const updated = await claimIdea(id, claimedBy);
  if (!updated) {
    return NextResponse.json(
      { error: "Idea not found or already claimed" },
      { status: 409 }
    );
  }

  return NextResponse.json({ idea: updated, message: "认领成功！开始实现吧 🚀" });
}
