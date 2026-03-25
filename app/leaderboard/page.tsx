"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Lightbulb, Hammer, Crown, Medal } from "lucide-react";
import { pointsRules } from "@/lib/data";
import type { User } from "@/lib/data";

type BoardTab = "points" | "creator" | "builder";

const tabs: { value: BoardTab; label: string; icon: React.ReactNode }[] = [
  { value: "points", label: "积分榜", icon: <Trophy className="w-4 h-4" /> },
  { value: "creator", label: "创意者榜", icon: <Lightbulb className="w-4 h-4" /> },
  { value: "builder", label: "Builder榜", icon: <Hammer className="w-4 h-4" /> },
];

const rankIcons = [
  <Crown key="1" className="w-5 h-5 text-yellow-500" />,
  <Medal key="2" className="w-5 h-5 text-gray-400" />,
  <Medal key="3" className="w-5 h-5 text-amber-600" />,
];

const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-yellow-50 border-yellow-200";
  if (rank === 2) return "bg-gray-50 border-gray-200";
  if (rank === 3) return "bg-amber-50 border-amber-200";
  return "bg-white border-gray-100";
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<BoardTab>("points");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []));
  }, []);

  const getSortedUsers = () => {
    switch (activeTab) {
      case "points":
        return [...users].sort((a, b) => b.points - a.points);
      case "creator":
        return [...users].sort((a, b) => b.ideasSubmitted - a.ideasSubmitted);
      case "builder":
        return [...users].sort((a, b) => b.ideasBuilt - a.ideasBuilt);
    }
  };

  const getMetric = (user: User) => {
    switch (activeTab) {
      case "points":
        return { value: user.points.toLocaleString(), label: "积分" };
      case "creator":
        return { value: user.ideasSubmitted, label: "个点子" };
      case "builder":
        return { value: user.ideasBuilt, label: "个实现" };
    }
  };

  const sortedUsers = getSortedUsers();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">排行榜</h1>
        <p className="text-gray-500">本月最活跃的创意者与 Builder</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main leaderboard */}
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
              </button>
            ))}
          </div>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[sortedUsers[1], sortedUsers[0], sortedUsers[2]].map(
              (user, podiumIndex) => {
                if (!user) return <div key={podiumIndex} />;
                const rankOrder = [2, 1, 3];
                const rank = rankOrder[podiumIndex];
                const metric = getMetric(user);
                const heights = ["h-24", "h-32", "h-20"];
                return (
                  <div key={user.id} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center mx-auto mb-2">
                      {user.avatar}
                    </div>
                    <div className="text-xs font-medium text-gray-700 mb-1 truncate">
                      {user.name}
                    </div>
                    <div
                      className={`${heights[podiumIndex]} rounded-t-xl flex flex-col items-center justify-center ${
                        rank === 1
                          ? "bg-yellow-400"
                          : rank === 2
                          ? "bg-gray-300"
                          : "bg-amber-400"
                      }`}
                    >
                      <div className="text-white font-bold text-lg">
                        {rank}
                      </div>
                      <div className="text-white/80 text-xs">
                        {metric.value} {metric.label}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Full list */}
          <div className="space-y-2">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const metric = getMetric(user);
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${getRankStyle(rank)}`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {rank <= 3 ? rankIcons[rank - 1] : (
                      <span className="text-sm font-bold text-gray-400">{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {user.avatar}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.badges.slice(0, 2).map((badge) => (
                        <span
                          key={badge}
                          className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-900">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </div>

                  {/* Secondary stats */}
                  <div className="text-right text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {user.ideasSubmitted} 点子
                    </div>
                    <div className="flex items-center gap-1">
                      <Hammer className="w-3 h-3" />
                      {user.ideasBuilt} 实现
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points Rules Sidebar */}
        <div className="space-y-4">
          {/* Points rules */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              积分规则
            </h3>
            <div className="space-y-3">
              {pointsRules.map((rule) => (
                <div
                  key={rule.action}
                  className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{rule.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {rule.action}
                      </div>
                      <div className="text-xs text-gray-400">
                        {rule.description}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-indigo-600 text-sm whitespace-nowrap flex-shrink-0">
                    +{rule.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How to redeem */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-3">如何使用积分</h3>
            <ul className="space-y-2 text-sm text-indigo-100">
              <li>• 兑换平台礼品卡</li>
              <li>• PayPal/微信提现</li>
              <li>• 解锁高级功能</li>
              <li>• 优先展示你的点子</li>
            </ul>
            <div className="mt-4 bg-white/10 rounded-lg p-3 text-xs">
              <div className="font-medium mb-1">当前汇率</div>
              <div className="text-indigo-200">1000积分 = $1 USD</div>
            </div>
          </div>

          {/* Monthly reset notice */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
            <div className="font-medium text-gray-700 mb-1">排行榜说明</div>
            每月重置，历史积分不清零。
            当月表现突出者有机会获得平台特别奖励。
          </div>
        </div>
      </div>
    </div>
  );
}
