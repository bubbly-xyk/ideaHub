import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import pool from "@/lib/db";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save code to DB (invalidate old ones)
  await pool.query("UPDATE verification_codes SET used = TRUE WHERE email = $1", [email]);
  await pool.query(
    "INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, $3)",
    [email, code, expiresAt]
  );

  // Try to send via SMTP; fall back to console log in dev
  const smtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes("your_");

  if (smtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "IdeaHub 验证码",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
            <span style="font-size:20px">💡</span>
            <span style="font-size:20px;font-weight:700;color:#111">IdeaHub</span>
          </div>
          <h2 style="font-size:24px;font-weight:700;color:#111;margin:0 0 8px">你的验证码</h2>
          <p style="color:#666;margin:0 0 24px">请在 10 分钟内使用以下验证码完成注册：</p>
          <div style="background:#f5f3ff;border:2px solid #c4b5fd;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:40px;font-weight:800;color:#6d28d9;letter-spacing:8px">${code}</span>
          </div>
          <p style="color:#999;font-size:13px">如果这不是你的操作，请忽略此邮件。验证码 10 分钟后失效。</p>
        </div>
      `,
    });
  } else {
    // Dev mode: print to console
    console.log(`\n📧 [DEV] 验证码发送到 ${email}: ${code}\n`);
  }

  return NextResponse.json({
    success: true,
    dev: !smtpConfigured,
    message: smtpConfigured ? "验证码已发送" : `[DEV] 验证码: ${code}`,
  });
}
