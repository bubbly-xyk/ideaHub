"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Lightbulb, Eye, EyeOff, ArrowRight,
  Github, Loader2, Mail, CheckCircle,
  Sparkles, TrendingUp, DollarSign, Users, AlertCircle,
} from "lucide-react";

const features = [
  { icon: Sparkles, text: "提交点子，立获 50 积分" },
  { icon: TrendingUp, text: "发现下一个 side project" },
  { icon: DollarSign, text: "认领悬赏，赚取真实 USD" },
  { icon: Users, text: "加入 OpenClaw Builder 社区" },
];

type Tab = "login" | "register";
type Step = "form" | "code";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/ideas";
  const errorParam = searchParams.get("error");

  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("form");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCode, setRegCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devCode, setDevCode] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (errorParam === "CredentialsSignin") setError("邮箱或密码错误");
    else if (errorParam === "OAuthSignin") setError("第三方登录失败，请重试");
    else if (errorParam === "OAuthCallback") setError("授权回调失败，请重试");
  }, [errorParam]);

  const handleGithubLogin = () => {
    setLoading(true);
    signIn("github", { callbackUrl });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail || !loginPassword) { setError("请填写邮箱和密码"); return; }
    setLoading(true);
    const res = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push(callbackUrl);
    } else if (res?.error === "EMAIL_NOT_VERIFIED") {
      setError("邮箱尚未验证，请先注册并完成验证");
    } else {
      setError("邮箱或密码错误");
    }
  };

  const handleSendCode = async () => {
    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setError("请填写正确的邮箱地址"); return;
    }
    setError("");
    setCodeLoading(true);
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail }),
    });
    const data = await res.json();
    setCodeLoading(false);
    if (res.ok) {
      setCodeSent(true);
      setStep("code");
      setCountdown(60);
      if (data.dev && data.message) {
        setDevCode(data.message);
        setSuccess(`[开发模式] ${data.message}`);
      } else {
        setSuccess("验证码已发送到你的邮箱，请查收");
      }
    } else {
      setError(data.error ?? "发送失败，请重试");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPassword || !regCode) {
      setError("请填写所有字段"); return;
    }
    if (regPassword.length < 6) { setError("密码至少 6 位"); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, code: regCode }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("注册成功！正在登录...");
      const loginRes = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });
      if (loginRes?.ok) {
        router.push("/ideas");
      } else {
        setTab("login");
        setLoginEmail(regEmail);
        setStep("form");
      }
    } else {
      setError(data.error ?? "注册失败，请重试");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">IdeaHub</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">
          {tab === "login" ? "欢迎回来 👋" : "创建账号 🚀"}
        </h1>
        <p className="text-gray-500 text-sm">
          {tab === "login" ? "登录继续探索和提交点子" : "加入社区，开始你的创意之旅"}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["login", "register"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); setSuccess(""); setStep("form"); setCodeSent(false); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t === "login" ? "登录" : "注册"}
          </button>
        ))}
      </div>

      {/* OAuth buttons */}
      <div className="space-y-2.5 mb-5">
        <button
          onClick={handleGithubLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-gray-950 hover:bg-gray-800 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <Github className="w-4 h-4" />
          Continue with GitHub
        </button>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">或使用邮箱</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Error / Success */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="break-all">{success}</span>
        </div>
      )}

      {/* LOGIN FORM */}
      {tab === "login" && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">邮箱</label>
            <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">密码</label>
              <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700">忘记密码？</Link>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4" />邮箱登录</>}
          </button>
        </form>
      )}

      {/* REGISTER FORM */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">用户名</label>
            <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
              placeholder="你的昵称"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">邮箱</label>
            <div className="flex gap-2">
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              <button type="button" onClick={handleSendCode}
                disabled={codeLoading || countdown > 0}
                className="flex-shrink-0 bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-100 disabled:opacity-50 transition-colors whitespace-nowrap">
                {codeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : countdown > 0 ? `${countdown}s` : codeSent ? "重发" : "发验证码"}
              </button>
            </div>
          </div>
          {step === "code" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">验证码</label>
              <input type="text" value={regCode} onChange={e => setRegCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                placeholder="6 位数字"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all tracking-[0.3em] font-mono text-center text-xl" />
              {devCode && <p className="text-xs text-amber-600 mt-1 text-center">开发模式：验证码已打印在服务器终端</p>}
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">密码</label>
              <span className="text-xs text-gray-400">至少 6 位</span>
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={regPassword}
                onChange={e => setRegPassword(e.target.value)} placeholder="设置登录密码"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading || step !== "code"}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" />创建账号</>}
          </button>
          <p className="text-xs text-gray-400 text-center">
            注册即代表同意
            <Link href="#" className="text-indigo-600 hover:underline mx-1">服务条款</Link>和
            <Link href="#" className="text-indigo-600 hover:underline mx-1">隐私政策</Link>
          </p>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        {tab === "login" ? "还没有账号？" : "已有账号？"}
        <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); setSuccess(""); setStep("form"); setCodeSent(false); }}
          className="text-indigo-600 font-bold hover:text-indigo-700 ml-1">
          {tab === "login" ? "立即注册" : "直接登录"}
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] bg-gray-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-900/40 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dp" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#818cf8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dp)" />
          </svg>
        </div>

        <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:bg-indigo-500 transition-colors">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white leading-none">IdeaHub</div>
            <div className="text-[10px] text-indigo-400 font-medium tracking-widest">× OpenClaw</div>
          </div>
        </Link>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              好点子，<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                在这里相遇
              </span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              创意者提交想法，OpenClaw Builder 认领实现。<br />
              不是展示台，而是点子的交易市场。
            </p>
          </div>
          <div className="space-y-3">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/60 rounded-xl px-4 py-2.5">
            <span className="text-xl">🦞</span>
            <div>
              <p className="text-white text-sm font-semibold">OpenClaw 平台直连</p>
              <p className="text-indigo-400 text-xs">Builder 社区接单，快速实现</p>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-900/70 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="flex -space-x-2">
            {["TA","BM","IS","DS","KC"].map(a => (
              <div key={a} className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-gray-900 flex items-center justify-center text-white text-[10px] font-bold">{a}</div>
            ))}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">已有 2,800+ 创意者加入</p>
            <p className="text-gray-500 text-xs">本周新增 143 名用户</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <Suspense fallback={<div className="w-full max-w-sm text-center text-gray-400">加载中...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
