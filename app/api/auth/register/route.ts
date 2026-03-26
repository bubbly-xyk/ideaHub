import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, password, code } = await req.json();

  if (!name || !email || !password || !code) {
    return NextResponse.json({ error: "请填写所有字段" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "密码至少 6 位" }, { status: 400 });
  }

  // Verify code
  const { rows: codeRows } = await pool.query(
    `SELECT * FROM verification_codes
     WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [email, code]
  );
  if (!codeRows[0]) {
    return NextResponse.json({ error: "验证码无效或已过期" }, { status: 400 });
  }

  // Check if email already registered
  const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing[0]) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
  }

  // Create user
  const hash = await bcrypt.hash(password, 10);
  const avatar = name.slice(0, 2).toUpperCase();

  const { rows } = await pool.query(
    `INSERT INTO users (id, name, avatar, email, password_hash, provider, email_verified, points, joined_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, 'email', TRUE, 0, NOW())
     RETURNING id, name, email`,
    [name, avatar, email, hash]
  );

  // Mark code as used
  await pool.query("UPDATE verification_codes SET used = TRUE WHERE id = $1", [codeRows[0].id]);

  return NextResponse.json({ success: true, user: rows[0] });
}
