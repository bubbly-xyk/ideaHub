import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  Users,
  Zap,
  Trophy,
  DollarSign,
  ThumbsUp,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { ideas, pointsRules, categories } from "@/lib/data";

const categoryIcons: Record<string, string> = {
  SaaS: "☁️",
  Mobile: "📱",
  "AI/ML": "🤖",
  "Developer Tools": "🛠️",
  "E-commerce": "🛒",
  Education: "📚",
  Health: "💊",
  Finance: "💳",
  Social: "🌐",
  Productivity: "⚡",
};

const statusConfig = {
  open: { label: "开放中", className: "bg-green-100 text-green-700" },
  in_progress: { label: "实现中", className: "bg-blue-100 text-blue-700" },
  implemented: { label: "已实现", className: "bg-purple-100 text-purple-700" },
  validated: { label: "已验证", className: "bg-yellow-100 text-yellow-700" },
};

export default function HomePage() {
  const hotIdeas = ideas.sort((a, b) => b.votes - a.votes).slice(0, 4);
  const bountyIdeas = ideas.filter((i) => i.bounty).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5" />
            已有 2,800+ 个点子在这里找到了 Builder
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            好点子，
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              值得被实现
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            连接有想法但不会做的人，和会做但缺方向的人。
            <br />
            不是产品展示平台，而是点子本身的市场。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg"
            >
              <Lightbulb className="w-5 h-5" />
              提交你的点子
              <span className="bg-indigo-500 text-xs px-2 py-0.5 rounded-full">
                +50积分
              </span>
            </Link>
            <Link
              href="/ideas"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors text-lg"
            >
              浏览待实现点子
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-12 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2,847</div>
              <div>个点子</div>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">423</div>
              <div>已实现</div>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$68K</div>
              <div>总悬赏金额</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              运作方式
            </h2>
            <p className="text-gray-500">简单四步，让创意变现实</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200" />

            {[
              {
                step: "01",
                icon: <Lightbulb className="w-6 h-6" />,
                title: "提交点子",
                desc: "描述你的想法，市场规模，以及为什么这个点子值得被做",
                color: "bg-indigo-600",
                reward: "+50积分",
              },
              {
                step: "02",
                icon: <Users className="w-6 h-6" />,
                title: "社区投票",
                desc: "其他用户为好点子投票，高票点子更容易吸引 Builder",
                color: "bg-violet-600",
                reward: "+2积分/票",
              },
              {
                step: "03",
                icon: <Zap className="w-6 h-6" />,
                title: "Builder 认领",
                desc: "有能力的 Builder 认领点子，开始把想法变成产品",
                color: "bg-purple-600",
                reward: "认领即锁定",
              },
              {
                step: "04",
                icon: <Trophy className="w-6 h-6" />,
                title: "完成获奖励",
                desc: "Builder 完成后获得积分或悬赏，提交者同样获得奖励",
                color: "bg-pink-600",
                reward: "+500积分",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div
                  className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 relative z-10`}
                >
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-gray-400 mb-1">
                  STEP {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">
                  {item.desc}
                </p>
                <span className="inline-block text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  {item.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Ideas */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                热门点子
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                本周最受关注的点子
              </p>
            </div>
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-700"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotIdeas.map((idea) => {
              const status = statusConfig[idea.status];
              return (
                <Link href={`/ideas/${idea.id}`} key={idea.id}>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {idea.category}
                      </span>
                      {idea.bounty && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />${idea.bounty}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 line-clamp-1">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {idea.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {idea.votes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {idea.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {idea.estimatedDuration}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bounty Tasks */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-yellow-500" />
                悬赏任务
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                有真实 USD 悬赏的点子，Builder 优先实现
              </p>
            </div>
            <Link
              href="/ideas?filter=bounty"
              className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-700"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bountyIdeas.map((idea) => (
              <Link href={`/ideas/${idea.id}`} key={idea.id}>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5 hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-yellow-600">
                      ${idea.bounty}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      {idea.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {idea.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {idea.votes} 票
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {idea.estimatedDuration}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              按领域浏览
            </h2>
            <p className="text-gray-500 text-sm">找到你擅长或感兴趣的领域</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const count = ideas.filter((i) => i.category === cat).length;
              return (
                <Link href={`/ideas?category=${encodeURIComponent(cat)}`} key={cat}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group">
                    <div className="text-2xl mb-2">{categoryIcons[cat]}</div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {cat}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {count} 个点子
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Points Incentive */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-3">积分激励体系</h2>
          <p className="text-indigo-200 mb-12">
            参与越多，获得越多。积分可以兑换实物奖励或提现。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {pointsRules.slice(0, 4).map((rule) => (
              <div
                key={rule.action}
                className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20"
              >
                <div className="text-3xl mb-2">{rule.icon}</div>
                <div className="text-2xl font-bold text-yellow-300 mb-1">
                  +{rule.points}
                </div>
                <div className="text-sm font-medium mb-1">{rule.action}</div>
                <div className="text-xs text-indigo-200">{rule.description}</div>
              </div>
            ))}
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            查看完整积分规则与排行榜
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            你的下一个大点子，就在脑海里
          </h2>
          <p className="text-gray-500 mb-8">
            不要让好想法消失在脑海中。分享出来，让社区帮你验证，让 Builder
            帮你实现。
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg"
          >
            <Lightbulb className="w-5 h-5" />
            立即提交点子，获得 50 积分
          </Link>
        </div>
      </section>
    </div>
  );
}
