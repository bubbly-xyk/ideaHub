"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  ThumbsUp,
  DollarSign,
  X,
} from "lucide-react";
import IdeaCard from "@/components/IdeaCard";
import { ideas, categories, IdeaCategory, IdeaDifficulty, IdeaStatus } from "@/lib/data";

type SortOption = "votes" | "newest" | "bounty" | "comments";

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "votes", label: "最多投票", icon: <ThumbsUp className="w-3.5 h-3.5" /> },
  { value: "newest", label: "最新", icon: <Clock className="w-3.5 h-3.5" /> },
  { value: "bounty", label: "悬赏最高", icon: <DollarSign className="w-3.5 h-3.5" /> },
  { value: "comments", label: "最多讨论", icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

const difficulties: { value: IdeaDifficulty; label: string }[] = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "困难" },
];

const statuses: { value: IdeaStatus; label: string }[] = [
  { value: "open", label: "开放中" },
  { value: "in_progress", label: "实现中" },
  { value: "implemented", label: "已实现" },
  { value: "validated", label: "已验证" },
];

function IdeasContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as IdeaCategory | null;

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | null>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<IdeaDifficulty | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IdeaStatus | null>(null);
  const [bountyOnly, setBountyOnly] = useState(searchParams.get("filter") === "bounty");
  const [sortBy, setSortBy] = useState<SortOption>("votes");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...ideas];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) result = result.filter((i) => i.category === selectedCategory);
    if (selectedDifficulty) result = result.filter((i) => i.difficulty === selectedDifficulty);
    if (selectedStatus) result = result.filter((i) => i.status === selectedStatus);
    if (bountyOnly) result = result.filter((i) => !!i.bounty);

    switch (sortBy) {
      case "votes":
        result.sort((a, b) => b.votes - a.votes);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case "bounty":
        result.sort((a, b) => (b.bounty ?? 0) - (a.bounty ?? 0));
        break;
      case "comments":
        result.sort((a, b) => b.comments - a.comments);
        break;
    }

    return result;
  }, [query, selectedCategory, selectedDifficulty, selectedStatus, bountyOnly, sortBy]);

  const activeFiltersCount = [selectedCategory, selectedDifficulty, selectedStatus, bountyOnly].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedStatus(null);
    setBountyOnly(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">探索点子</h1>
        <p className="text-gray-500">
          发现等待实现的好点子，或者找到你的下一个 side project
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索点子、标签、描述..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || activeFiltersCount > 0
              ? "border-indigo-400 text-indigo-600 bg-indigo-50"
              : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 text-sm">筛选条件</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                清除全部
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">领域</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">难度</div>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === d.value ? null : d.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedDifficulty === d.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 bg-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="text-xs font-medium text-gray-500 mb-2">状态</div>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStatus(selectedStatus === s.value ? null : s.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    selectedStatus === s.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 bg-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bounty toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBountyOnly(!bountyOnly)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                bountyOnly ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  bountyOnly ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">只看有悬赏的点子</span>
          </div>
        </div>
      )}

      {/* Sort options */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500 mr-1">排序：</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              sortBy === opt.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-white"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        找到 <span className="font-semibold text-gray-900">{filtered.length}</span> 个点子
        {query && <span>（搜索：&ldquo;{query}&rdquo;）</span>}
      </div>

      {/* Ideas List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">没有找到匹配的点子</p>
          <p className="text-sm mt-1">试试调整筛选条件，或者提交这个点子！</p>
        </div>
      )}
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-10 text-gray-400">加载中...</div>}>
      <IdeasContent />
    </Suspense>
  );
}
