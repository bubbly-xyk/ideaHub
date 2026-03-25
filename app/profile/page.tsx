"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lightbulb,
  Hammer,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  ThumbsUp,
  MessageCircle,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";
import { ideas, leaderboard } from "@/lib/data";

// Simulate the current logged-in user (first leaderboard user)
const ME = leaderboard[0];

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "开放中", className: "bg-green-100 text-green-700" },
  in_progress: { label: "实现中", className: "bg-blue-100 text-blue-700" },
  implemented: { label: "已实现", className: "bg-purple-100 text-purple-700" },
  validated: { label: "已验证", className: "bg-yellow-100 text-yellow-700" },
};

const mySubmitted = ideas.filter((i) => i.submittedBy === "techfounder_alex");
const myClaimed = ideas.filter((i) => i.claimedBy === "techfounder_alex");

const pointsHistory = [
  { icon: "💡", action: "提交点子「AI Code Review Bot」", points: 50, date: "2024-01-15" },
  { icon: "👍", action: "点子获得 20 票", points: 40, date: "2024-01-18" },
  { icon: "💬", action: "发表评论获赞", points: 1, date: "2024-01-20" },
  { icon: "💡", action: "提交点子「Open-Source Notion」", points: 50, date: "2024-02-10" },
  { icon: "👍", action: "点子获得 50 票", points: 100, date: "2024-02-15" },
  { icon: "📅", action: "连续登录 7 天", points: 35, date: "2024-02-20" },
  { icon: "🎉", action: "你的点子被 Builder 认领", points: 200, date: "2024-02-25" },
  { icon: "💡", action: "提交点子「Sleep Optimizer」", points: 50, date: "2024-03-01" },
];

type Tab = "submitted" | "claimed" | "points";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("submitted");

  const totalPoints = pointsHistory.reduce((sum, h) => sum + h.points, 0);

  const tabs: { value: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { value: "submitted", label: "提交的点子", icon: <Lightbulb className="w-4 h-4" />, count: mySubmitted.length },
    { value: "claimed", label: "认领的任务", icon: <Hammer className="w-4 h-4" />, count: myClaimed.length },
    { value: "points", label: "积分记录", icon: <Star className="w-4 h-4" /> },
  ];

  const rank = leaderboard.findIndex((u) => u.id === ME.id) + 1;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {ME.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{ME.name}</h1>
              <div className="flex items-center gap-1 text-yellow-500">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">排名 #{rank}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              加入于 {ME.joinedAt}
            </p>
            <div className="flex flex-wrap gap-2">
              {ME.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-indigo-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-indigo-600">{ME.points.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">总积分</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-purple-600">{ME.ideasSubmitted}</div>
              <div className="text-xs text-gray-500 mt-0.5">提交点子</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-emerald-600">{ME.ideasBuilt}</div>
              <div className="text-xs text-gray-500 mt-0.5">已实现</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress to next milestone */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 mb-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-300" />
            <span className="font-semibold">距离下一段位</span>
          </div>
          <span className="text-indigo-200 text-sm">{ME.points} / 4000 积分</span>
        </div>
        <div className="bg-white/20 rounded-full h-2.5 mb-3">
          <div
            className="bg-white rounded-full h-2.5 transition-all"
            style={{ width: `${Math.min(100, (ME.points / 4000) * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-indigo-200">当前：Gold Builder</span>
          <span className="text-white font-medium">下一级：Platinum Founder → 4000分</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Submitted ideas */}
          {activeTab === "submitted" && (
            <div className="space-y-3">
              {mySubmitted.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>还没有提交过点子</p>
                  <Link href="/submit" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
                    提交第一个点子 →
                  </Link>
                </div>
              ) : (
                mySubmitted.map((idea) => {
                  const st = statusConfig[idea.status];
                  return (
                    <Link href={`/ideas/${idea.id}`} key={idea.id}>
                      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                                {st.label}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                {idea.category}
                              </span>
                              {idea.bounty && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                                  ${idea.bounty}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm mb-2">
                              {idea.title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />{idea.votes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />{idea.comments}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +{idea.votes * 2 + 50} 积分
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* Claimed ideas */}
          {activeTab === "claimed" && (
            <div className="space-y-3">
              {myClaimed.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Hammer className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>还没有认领过点子</p>
                  <Link href="/ideas" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
                    浏览待认领点子 →
                  </Link>
                </div>
              ) : (
                myClaimed.map((idea) => {
                  const st = statusConfig[idea.status];
                  return (
                    <Link href={`/ideas/${idea.id}`} key={idea.id}>
                      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-1.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>
                                {st.label}
                              </span>
                              {idea.bounty && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />${idea.bounty} 悬赏
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-sm mb-2">
                              {idea.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{idea.estimatedDuration}
                              </span>
                              <span>提交者：{idea.submittedBy}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}

          {/* Points history */}
          {activeTab === "points" && (
            <div className="space-y-2">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">本月累计</span>
                </div>
                <span className="text-2xl font-bold text-indigo-600">+{totalPoints}</span>
              </div>
              {pointsHistory.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4">
                  <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800">{item.action}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.date}</div>
                  </div>
                  <span className="font-bold text-green-600 text-sm flex-shrink-0">+{item.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">快捷操作</h3>
            <div className="space-y-2">
              <Link href="/submit" className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">提交新点子</div>
                  <div className="text-xs text-gray-400">获得 +50 积分</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link href="/ideas?status=open" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 group transition-colors">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">认领点子</div>
                  <div className="text-xs text-gray-400">完成获 +500 积分</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 group transition-colors">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">查看排行榜</div>
                  <div className="text-xs text-gray-400">当前排名 #{rank}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Activity summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              活动统计
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "提交点子", value: ME.ideasSubmitted, color: "text-indigo-600" },
                { label: "已认领", value: myClaimed.length, color: "text-blue-600" },
                { label: "已完成", value: ME.ideasBuilt, color: "text-green-600" },
                { label: "获得的总票数", value: mySubmitted.reduce((s, i) => s + i.votes, 0), color: "text-purple-600" },
                { label: "总评论数", value: mySubmitted.reduce((s, i) => s + i.comments, 0), color: "text-orange-600" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-gray-500">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points redeem */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-2">兑换积分</h3>
            <p className="text-xs text-gray-500 mb-3">1000积分 = $1 USD</p>
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-yellow-600">{ME.points}</div>
              <div className="text-xs text-gray-500">可用积分</div>
            </div>
            <button className="w-full bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors">
              申请兑换
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              最低 1000 积分起兑
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
