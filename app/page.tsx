import Link from "next/link";
import {
  ArrowRight, Lightbulb, Zap, Trophy, DollarSign,
  ThumbsUp, MessageCircle, Clock, Star, TrendingUp,
  CheckCircle, Sparkles, Code2, Users,
} from "lucide-react";
import { getIdeas } from "@/lib/store";
import { pointsRules, categories } from "@/lib/data";
import LightbulbHero from "@/components/LightbulbHero";

const categoryIcons: Record<string, string> = {
  SaaS: "☁️", Mobile: "📱", "AI/ML": "🤖",
  "Developer Tools": "🛠️", "E-commerce": "🛒",
  Education: "📚", Health: "💊", Finance: "💳",
  Social: "🌐", Productivity: "⚡",
};

const statusConfig = {
  open: { label: "开放中", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  in_progress: { label: "实现中", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  implemented: { label: "已实现", cls: "bg-purple-50 text-purple-700 ring-1 ring-purple-200" },
  validated: { label: "已验证", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
};

export default async function HomePage() {
  const allIdeas = await getIdeas();
  const hotIdeas = [...allIdeas].sort((a, b) => b.votes - a.votes).slice(0, 4);
  const bountyIdeas = allIdeas
    .filter((i) => i.bounty)
    .sort((a, b) => (b.bounty ?? 0) - (a.bounty ?? 0))
    .slice(0, 3);
  const totalBounty = allIdeas.reduce((s, i) => s + (i.bounty ?? 0), 0);
  const implemented = allIdeas.filter(i => i.status === "implemented" || i.status === "validated").length;

  return (
    <div className="bg-white">

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden min-h-[92vh] flex items-center px-6 lg:px-12">
        {/* Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-indigo-50 blur-3xl opacity-80" />
          <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-violet-50 blur-3xl opacity-60" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-yellow-50/50 blur-3xl" />
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 shadow-sm text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                IdeaHub × OpenClaw 联合平台
              </div>

              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-gray-950 tracking-tight leading-[1.06] mb-6">
                有想法，
                <br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                    就来这里
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8 C80 2, 200 2, 298 8" stroke="url(#underline)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="100%" stopColor="#a855f7"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-500 mb-4 leading-relaxed max-w-lg">
                <span className="font-semibold text-gray-700">OpenClaw</span> 上的 Builder 正在等待你的好点子。
                <br />提交、投票、认领，点子变产品。
              </p>

              <p className="text-sm text-gray-400 mb-10 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                不是产品展示台，而是<span className="text-indigo-500 font-medium">点子本身的交易市场</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 text-base"
                >
                  <Lightbulb className="w-5 h-5" />
                  提交我的点子
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+50积分</span>
                </Link>
                <Link
                  href="/ideas"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all text-base"
                >
                  OpenClaw Builder 看这里
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 text-sm">
                {[
                  { v: allIdeas.length, l: "个点子", c: "text-indigo-600" },
                  { v: implemented, l: "已实现", c: "text-emerald-600" },
                  { v: `$${totalBounty.toLocaleString()}`, l: "总悬赏", c: "text-amber-600" },
                  { v: allIdeas.filter(i=>i.bounty).length, l: "悬赏任务", c: "text-purple-600" },
                ].map(({ v, l, c }) => (
                  <div key={l} className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-extrabold ${c}`}>{v}</span>
                    <span className="text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Lightbulb mascot */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-200 animate-spin-slow" style={{ margin: "-30px" }} />
                <div className="absolute inset-0 rounded-full border border-indigo-100" style={{ margin: "-55px" }} />
                <LightbulbHero />
                {/* Floating labels */}
                <div className="absolute -right-4 top-8 bg-white border border-emerald-200 shadow-md rounded-xl px-3 py-2 text-xs font-medium text-emerald-700 flex items-center gap-1.5 animate-bounce-slow">
                  <CheckCircle className="w-3.5 h-3.5" />点子已认领！
                </div>
                <div className="absolute -left-8 bottom-20 bg-white border border-amber-200 shadow-md rounded-xl px-3 py-2 text-xs font-medium text-amber-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />$2,000 悬赏
                </div>
                <div className="absolute -right-6 bottom-16 bg-white border border-indigo-200 shadow-md rounded-xl px-3 py-2 text-xs font-medium text-indigo-700 flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />324 票
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300">
          <span className="text-xs">向下探索</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>
      </section>

      {/* ═══ OpenClaw Partnership Banner ════════════════════════ */}
      <section className="bg-gray-950 border-y border-gray-800 py-5 overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="flex items-center gap-16 flex-shrink-0">
              {["🦞 OpenClaw Builder", "💡 IdeaHub 点子市场", "🚀 从想法到产品", "💰 真实 USD 悬赏", "⚡ 社区驱动实现", "🎯 精准需求匹配"].map(t => (
                <span key={t} className="text-gray-400 text-sm font-medium">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">HOW IT WORKS</p>
            <h2 className="text-4xl font-extrabold text-white mb-4">简单四步，点子变现实</h2>
            <p className="text-gray-400 max-w-md mx-auto">创意者提交，OpenClaw Builder 接单，社区见证产品诞生</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n:"01", icon: Lightbulb, color:"from-yellow-500 to-amber-500", title:"提交点子", desc:"描述你的想法、目标用户和市场机会，提交即获 50 积分", tag:"+50积分" },
              { n:"02", icon: ThumbsUp, color:"from-indigo-500 to-violet-500", title:"社区投票", desc:"点子获得社区投票验证，热度高的更容易被 Builder 发现", tag:"+2积分/票" },
              { n:"03", icon: Users, color:"from-violet-500 to-purple-500", title:"Builder 认领", desc:"OpenClaw 上的开发者认领点子并开始实现", tag:"独家认领" },
              { n:"04", icon: Trophy, color:"from-emerald-500 to-teal-500", title:"产品上线", desc:"Builder 完成产品，双方共享积分和悬赏奖励", tag:"+500积分" },
            ].map(item => (
              <div key={item.n} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-[10px] text-gray-600 font-mono tracking-widest mb-2">STEP {item.n}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                <span className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOT IDEAS ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-indigo-500 text-xs font-bold tracking-widest uppercase mb-2">HOT THIS WEEK</p>
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-indigo-500" />本周最热点子
              </h2>
            </div>
            <Link href="/ideas" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group">
              查看全部 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotIdeas.map(idea => {
              const s = statusConfig[idea.status];
              return (
                <Link href={`/ideas/${idea.id}`} key={idea.id} className="group block">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-200 h-full">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{idea.category}</span>
                      {idea.bounty && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />${idea.bounty}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg mb-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{idea.description}</p>
                    <div className="flex items-center gap-5 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{idea.votes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{idea.comments}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{idea.estimatedDuration || "未定"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ BOUNTY ═════════════════════════════════════════════ */}
      {bountyIdeas.length > 0 && (
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-amber-600 text-xs font-bold tracking-widest uppercase mb-2">BOUNTIES</p>
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-7 h-7 text-amber-500" />真实 USD 悬赏
                </h2>
                <p className="text-sm text-gray-500 mt-1">OpenClaw Builder 优先认领，完成即领取报酬</p>
              </div>
              <Link href="/ideas?filter=bounty" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 group">
                查看全部 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bountyIdeas.map(idea => (
                <Link href={`/ideas/${idea.id}`} key={idea.id} className="group block">
                  <div className="bg-white border border-amber-200 rounded-2xl p-6 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-50 transition-all h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl font-extrabold text-amber-500">${idea.bounty}</span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full ring-1 ring-amber-200">{idea.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">{idea.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{idea.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{idea.votes} 票</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{idea.estimatedDuration || "未定"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CATEGORIES ═════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">按领域浏览</h2>
            <p className="text-gray-500">OpenClaw Builder 找到你最擅长的方向</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(cat => {
              const count = allIdeas.filter(i => i.category === cat).length;
              return (
                <Link href={`/ideas?category=${encodeURIComponent(cat)}`} key={cat} className="group">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all">
                    <div className="text-3xl mb-3">{categoryIcons[cat]}</div>
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{cat}</div>
                    <div className="text-xs text-gray-400 mt-1">{count} 个</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ POINTS ═════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">REWARDS</p>
            <h2 className="text-4xl font-extrabold text-white mb-4">积分激励体系</h2>
            <p className="text-gray-400 max-w-md mx-auto">参与越多，回报越多。积分可兑换实物或现金</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {pointsRules.slice(0, 4).map(r => (
              <div key={r.action} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center hover:border-yellow-900/50 transition-colors">
                <div className="text-3xl mb-3">{r.icon}</div>
                <div className="text-3xl font-extrabold text-yellow-400 mb-1">+{r.points}</div>
                <div className="text-sm font-semibold text-white mb-1">{r.action}</div>
                <div className="text-xs text-gray-500">{r.description}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/leaderboard" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              <Trophy className="w-5 h-5 text-amber-500" />查看排行榜<ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ════════════════════════════════════════ */}
      <section className="py-16 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: CheckCircle, t: "完全免费加入", s: "无需付费，立即开始" },
            { icon: Star, t: "积分奖励体系", s: "参与即可获得积分" },
            { icon: Zap, t: "OpenClaw 直连", s: "专业 Builder 快速响应" },
          ].map(item => (
            <div key={item.t} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.t}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">💡</div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            你脑海里的那个好想法，<br />值得被实现
          </h2>
          <p className="text-indigo-200 text-lg mb-10">
            提交点子，让 OpenClaw 上的专业 Builder 看到它、实现它。
            <br />不要让好点子只停留在脑海里。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/submit" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-extrabold hover:bg-indigo-50 transition-colors text-base">
              <Lightbulb className="w-5 h-5" />立即提交点子
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors text-base">
              创建账号 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee { animation: marquee 20s linear infinite; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
