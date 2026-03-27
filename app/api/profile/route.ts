import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "用户信息缺失" }, { status: 400 });
  }

  const { rows: userRows } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
  );
  if (!userRows[0]) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  const user = userRows[0];

  const { rows: submittedIdeas } = await pool.query(
    "SELECT * FROM ideas WHERE submitted_by = $1 ORDER BY submitted_at DESC",
    [user.name]
  );

  const { rows: claimedIdeas } = await pool.query(
    "SELECT * FROM ideas WHERE claimed_by = $1 ORDER BY submitted_at DESC",
    [user.name]
  );

  const { rows: rankRow } = await pool.query(
    "SELECT COUNT(*) FROM users WHERE points > $1",
    [user.points]
  );
  const rank = parseInt(rankRow[0].count) + 1;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      points: user.points,
      ideasSubmitted: user.ideas_submitted,
      ideasBuilt: user.ideas_built,
      joinedAt: user.joined_at,
      badges: user.badges ?? [],
    },
    rank,
    submittedIdeas,
    claimedIdeas,
  });
}
