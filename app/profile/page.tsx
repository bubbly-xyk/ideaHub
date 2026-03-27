"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Lightbulb, Hammer, Trophy, Star, TrendingUp,
  Calendar, ThumbsUp, MessageCircle,
  Clock, ChevronRight, Flame, Loader2,
} from "lucide-react";
import { useToast } from "@/lib/toast";

const statusConfig: Record<string, { label: string; className: string }> = {
  open:        { label: "开放中", className: "bg-green-100 text-green-700" },
  building:    { label: "实现中", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "实现中", className: "bg-blue-100 text-blue-700" },
  implemented: { label: "已实现", className: "bg-purple-100 text-purple-700" },
  validated:   { label: "已验证", className: "bg-yellow-100 text-yellow-700" },
};
const defaultStatus = { label: "开放中", className: "bg-gray-100 text-gray-600" };

type Tab = "submitted" | "claimed" | "points";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToIdea(row: any) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    votes: row.votes,
    comments: row.comments_count,
    bounty: row.bounty,
    submittedBy: row.submitted_by,
    estimatedDuration: row.estimated_duration,
    claimedBy: row.claimed_by,
    tags: row.tags ?? [],
    submittedAt: row.submitted_at,
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("submitted");
  const [withdrawForm, setWithdrawForm] = useState({ method: "alipay", account: "", realName: "", points: "" });
  const [withdrawing, setWithdrawing] = useState(false);
  const [profileData, setProfileData] = useState<{
    user: { name: string; avatar: string; email: string; points: number; ideasSubmitted: number; ideasBuilt: number; joinedAt: string; badges: string[] };
    rank: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submittedIdeas: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    claimedIdeas: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setProfileData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!session || !profileData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">无法加载个人资料</p>
        <Link href="/login" className="text-indigo-600 mt-2 inline-block">重新登录</Link>
      </div>
    );
  }

  const handleWithdraw = async () => {
    const pts = Number(withdrawForm.points);
    if (!pts || pts < 1000) { toast("最低兑换 1000 积分", "error"); return; }
    if (!withdrawForm.account.trim()) { toast("请填写收款账号", "error"); return; }
    if (!withdrawForm.realName.trim()) { toast("请填写真实姓名", "error"); return; }
    setWithdrawing(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          points: pts,
          method: withdrawForm.method,
          account: withdrawForm.account,
          realName: withdrawForm.realName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message ?? "提现申请已提交 ✅");
        setWithdrawForm((f) => ({ ...f, points: "", account: "", realName: "" }));
        // Refresh profile data
        fetch("/api/profile").then(r => r.json()).then(d => { if (d.user) setProfileData(d); });
      } else {
        toast(data.error ?? "提现失败", "error");
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setWithdrawing(false);
    }
  };

  const { user, rank, submittedIdeas, claimedIdeas } = profileData;
  const submitted = submittedIdeas.map(rowToIdea);
  const claimed = claimedIdeas.map(rowToIdea);

  const isUrl = (s: string) => s?.startsWith("http");
  const initials = user.name?.slice(0, 2).toUpperCase() ?? "??";
  const joinedDate = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : "";

  const tabs: { value: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { value: "submitted", label: "提交的点子", icon: <Lightbulb className="w-4 h-4" />, count: submitted.length },
    { value: "claimed",   label: "认领的任务", icon: <Hammer className="w-4 h-4" />,    count: claimed.length },
    { value: "points",    label: "积分记录",   icon: <Star className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            {isUrl(user.avatar) ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-1 text-yellow-500">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">排名 #{rank}</span>
              </div>
            </div>
            {user.email && <p className="text-gray-400 text-xs mb-1">{user.email}</p>}
            <p className="text-gray-500 text-sm mb-3">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              加入于 {joinedDate}
            </p>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span key={badge} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-medium">
                  {badge}
                </span>
              ))}
              {user.badges.length === 0 && (
                <span className="text-xs text-gray-400">暂无徽章，多参与获得徽章 🏅</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-indigo-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{user.points.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">总积分</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-600">{submitted.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">提交点子</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-emerald-600">{user.ideasBuilt}</div>
              <div className="text-xs text-gray-500 mt-0.5">已实现</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 mb-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="font-semibold">距离下一段位</span>
          </div>
          <span className="text-indigo-200 text-sm">{user.points} / 4000 积分</span>
        </div>
        <div className="bg-white/20 rounded-full h-2.5 mb-3">
          <div className="bg-white rounded-full h-2.5 transition-all" style={{ width: `${Math.min(100, (user.points / 4000) * 100)}%` }} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-200">当前：{user.points >= 1000 ? "Gold Builder" : "新人"}</span>
          <span className="text-white font-medium">下一级：Platinum Founder → 4000分</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.value ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}{tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Submitted */}
          {activeTab === "submitted" && (
            <div className="space-y-3">
              {submitted.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>还没有提交过点子</p>
                  <Link href="/submit" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">提交第一个点子 →</Link>
                </div>
              ) : submitted.map((idea) => {
                const st = statusConfig[idea.status] ?? defaultStatus;
                return (
                  <Link href={`/ideas/${idea.id}`} key={idea.id}>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>{st.label}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{idea.category}</span>
                            {idea.bounty && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">${idea.bounty}</span>}
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 text-sm mb-2">{idea.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{idea.votes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{idea.comments}</span>
                            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{idea.votes * 2 + 50} 积分</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Claimed */}
          {activeTab === "claimed" && (
            <div className="space-y-3">
              {claimed.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Hammer className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>还没有认领过点子</p>
                  <Link href="/ideas" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">浏览待认领点子 →</Link>
                </div>
              ) : claimed.map((idea) => {
                const st = statusConfig[idea.status] ?? defaultStatus;
                return (
                  <Link href={`/ideas/${idea.id}`} key={idea.id}>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>{st.label}</span>
                            {idea.bounty && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1"><Star className="w-3 h-3" />{idea.bounty * 1000} 积分奖励</span>}
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 text-sm mb-2">{idea.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{idea.estimatedDuration}</span>
                            <span>提交者：{idea.submittedBy}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Points */}
          {activeTab === "points" && (
            <div className="space-y-2">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">当前总积分</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">{user.points}</span>
              </div>
              <div className="text-center py-10 text-gray-400">
                <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">提交点子、投票、评论等操作将自动累积积分</p>
                <p className="text-xs mt-1">详细积分记录功能即将上线</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">快捷操作</h3>
            <div className="space-y-2">
              <Link href="/submit" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><Lightbulb className="w-4 h-4" /></div>
                <div><div className="text-sm font-medium text-gray-800">提交新点子</div><div className="text-xs text-gray-400">获得 +50 积分</div></div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link href="/ideas?status=open" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 group transition-colors">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center"><Hammer className="w-4 h-4" /></div>
                <div><div className="text-sm font-medium text-gray-800">认领点子</div><div className="text-xs text-gray-400">完成获 +500 积分</div></div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 group transition-colors">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center"><Trophy className="w-4 h-4" /></div>
                <div><div className="text-sm font-medium text-gray-800">查看排行榜</div><div className="text-xs text-gray-400">当前排名 #{rank}</div></div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-1">积分提现</h3>
            <p className="text-xs text-gray-500 mb-3">1000积分 = $1 USD，最低1000积分起提</p>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-yellow-600">{user.points}</div>
              <div className="text-xs text-gray-500">可用积分（≈ ${(user.points / 1000).toFixed(2)} USD）</div>
            </div>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">提现方式</label>
                <div className="flex gap-2">
                  {[{ v: "alipay", l: "支付宝" }, { v: "wechat", l: "微信" }].map(({ v, l }) => (
                    <button key={v} type="button"
                      onClick={() => setWithdrawForm(f => ({ ...f, method: v }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${withdrawForm.method === v ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-200 text-gray-600 bg-white"}`}
                    >{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  {withdrawForm.method === "alipay" ? "支付宝账号" : "微信号"}
                </label>
                <input
                  type="text"
                  value={withdrawForm.account}
                  onChange={e => setWithdrawForm(f => ({ ...f, account: e.target.value }))}
                  placeholder={withdrawForm.method === "alipay" ? "手机号或邮箱" : "微信号"}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">真实姓名</label>
                <input
                  type="text"
                  value={withdrawForm.realName}
                  onChange={e => setWithdrawForm(f => ({ ...f, realName: e.target.value }))}
                  placeholder="与账号实名一致"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">提现积分</label>
                <input
                  type="number"
                  value={withdrawForm.points}
                  onChange={e => setWithdrawForm(f => ({ ...f, points: e.target.value }))}
                  placeholder="最低 1000"
                  min="1000"
                  step="100"
                  max={user.points}
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing || user.points < 1000}
                className="w-full bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {withdrawing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                申请提现
              </button>
              <p className="text-xs text-center text-gray-400">3-5个工作日内到账</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
