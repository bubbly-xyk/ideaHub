import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

const MIN_POINTS = 1000;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "用户信息缺失" }, { status: 400 });
  }

  const body = await request.json();
  const { points, method, account, realName } = body;

  if (!points || !method || !account || !realName) {
    return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
  }

  const pointsNum = Number(points);
  if (isNaN(pointsNum) || pointsNum < MIN_POINTS) {
    return NextResponse.json({ error: `最低兑换 ${MIN_POINTS} 积分` }, { status: 400 });
  }

  if (!["alipay", "wechat"].includes(method)) {
    return NextResponse.json({ error: "不支持的提现方式" }, { status: 400 });
  }

  // Check user's points
  const { rows: userRows } = await pool.query(
    "SELECT id, name, points FROM users WHERE id = $1",
    [userId]
  );
  if (!userRows[0]) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  const user = userRows[0];

  if (user.points < pointsNum) {
    return NextResponse.json({ error: "积分不足" }, { status: 400 });
  }

  // Deduct points and create withdrawal record in a transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE users SET points = points - $1 WHERE id = $2",
      [pointsNum, userId]
    );

    const { rows: wRows } = await client.query(
      `INSERT INTO withdrawals (user_id, user_name, points, method, account, real_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id`,
      [userId, user.name, pointsNum, method, account, realName]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      withdrawalId: wRows[0].id,
      message: `提现申请已提交，${pointsNum} 积分（约 $${(pointsNum / 1000).toFixed(2)} USD）将在 3-5 个工作日内到账`,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Withdraw error:", e);
    return NextResponse.json({ error: "提现失败，请重试" }, { status: 500 });
  } finally {
    client.release();
  }
}
