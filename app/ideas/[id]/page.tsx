"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  DollarSign,
  Clock,
  BarChart2,
  Code,
  Users,
  CheckCircle,
  Send,
  Share2,
  Bookmark,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ideas, comments as allComments, type Comment } from "@/lib/data";
import { useToast } from "@/lib/toast";

const statusConfig = {
  open: {
    label: "开放中",
    className: "bg-green-100 text-green-700",
    desc: "这个点子正在等待 Builder 认领",
  },
  in_progress: {
    label: "实现中",
    className: "bg-blue-100 text-blue-700",
    desc: "已有 Builder 正在实现这个点子",
  },
  implemented: {
    label: "已实现",
    className: "bg-purple-100 text-purple-700",
    desc: "这个点子已经被实现为产品",
  },
  validated: {
    label: "已验证",
    className: "bg-yellow-100 text-yellow-700",
    desc: "这个产品已经经过用户验证",
  },
};

const difficultyConfig = {
  easy: { label: "简单", className: "text-emerald-600 bg-emerald-50" },
  medium: { label: "中等", className: "text-orange-600 bg-orange-50" },
  hard: { label: "困难", className: "text-red-600 bg-red-50" },
};

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const idea = ideas.find((i) => i.id === params.id);
  if (!idea) notFound();

  const { toast } = useToast();

  const [localComments, setLocalComments] = useState<Comment[]>(
    allComments.filter((c) => c.ideaId === idea.id)
  );
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(idea.votes);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [claimed, setClaimed] = useState(idea.status !== "open");
  const [claimedBy, setClaimedBy] = useState(idea.claimedBy ?? "");
  const [currentStatus, setCurrentStatus] = useState(idea.status);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const status = statusConfig[currentStatus];
  const difficulty = difficultyConfig[idea.difficulty];

  const handleVote = async () => {
    const action = voted ? "unvote" : "vote";
    setVoted(!voted);
    setVotes((v) => v + (voted ? -1 : 1));
    try {
      const res = await fetch(`/api/ideas/${idea.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        if (!voted) toast("投票成功！创作者获得 +2 积分 ✨");
      }
    } catch {
      // optimistic UI — keep local state even if API fails
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast(bookmarked ? "已取消收藏" : "收藏成功！", "info");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("链接已复制到剪贴板 🔗", "info");
    } catch {
      toast("分享链接：" + window.location.href, "info");
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/ideas/${idea.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment, author: "TechFounder Alex" }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocalComments((prev) => [...prev, data.comment]);
        setComment("");
        toast("评论发布成功！+1 积分 💬");
      }
    } catch {
      toast("发布失败，请重试", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClaim = async () => {
    setClaimLoading(true);
    try {
      const res = await fetch(`/api/ideas/${idea.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimedBy: "TechFounder Alex" }),
      });
      if (res.ok) {
        setClaimed(true);
        setClaimedBy("TechFounder Alex");
        setCurrentStatus("in_progress");
        setShowClaimModal(false);
        toast("认领成功！加油实现它吧 🚀");
      } else {
        const err = await res.json();
        toast(err.error ?? "认领失败", "error");
        setShowClaimModal(false);
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/ideas"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回点子列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.className}`}>
                {status.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${difficulty.className}`}>
                {difficulty.label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {idea.category}
              </span>
              {idea.bounty && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />${idea.bounty} 悬赏
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{idea.title}</h1>
            <p className="text-gray-500 text-sm mb-4">
              by{" "}
              <span className="font-medium text-gray-700">{idea.submittedBy}</span>
              {" · "}
              {idea.submittedAt}
              {claimedBy && (
                <>
                  {" · "}
                  认领者：
                  <span className="font-medium text-blue-600">{claimedBy}</span>
                </>
              )}
            </p>

            {/* Status banner */}
            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm mb-4 ${status.className}`}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{status.desc}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleVote}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                  voted
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {voted ? "已投票" : "投票"} ({votes})
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                  bookmarked
                    ? "bg-yellow-50 text-yellow-600 border-yellow-300"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {bookmarked ? "已收藏" : "收藏"}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 text-sm"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
            </div>
          </div>

          {/* Long Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">详细描述</h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {idea.longDescription}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              讨论 ({localComments.length})
            </h2>

            <div className="space-y-5 mb-6">
              {localComments.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">
                  还没有评论，来发表第一条吧 ✨
                </p>
              )}
              {localComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{c.author}</span>
                      <span className="text-xs text-gray-400">{c.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 mt-2 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      {c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                TA
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="分享你的看法、可行性分析、或表示有意愿参与..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmitComment();
                  }}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Ctrl+Enter 快捷发送</span>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!comment.trim() || submittingComment}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors"
                  >
                    {submittingComment ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    发表评论
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Claim */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">你能实现它吗？</h3>
            <p className="text-sm text-gray-500 mb-4">
              认领这个点子并把它变成现实。
              {idea.bounty && (
                <span className="text-yellow-600 font-medium">
                  {" "}完成可获得 ${idea.bounty} 悬赏。
                </span>
              )}
            </p>
            {!claimed ? (
              <button
                onClick={() => setShowClaimModal(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                认领这个点子
              </button>
            ) : (
              <div className="bg-blue-50 text-blue-700 py-3 px-4 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                已被认领，实现中
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">项目信息</h3>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                市场规模
              </div>
              <div className="text-sm font-medium text-gray-800">{idea.marketSize}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                预估工期
              </div>
              <div className="text-sm font-medium text-gray-800">{idea.estimatedDuration}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
                <Code className="w-3.5 h-3.5" />
                推荐技术栈
              </div>
              <div className="flex flex-wrap gap-1.5">
                {idea.techStack.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
                <Users className="w-3.5 h-3.5" />
                参与人数
              </div>
              <div className="text-sm font-medium text-gray-800">
                {votes} 人投票 · {localComments.length} 条评论
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">完成奖励</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Builder 完成</span>
                <span className="font-bold text-indigo-600">+500积分</span>
              </div>
              {idea.bounty && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">悬赏金额</span>
                  <span className="font-bold text-yellow-600">${idea.bounty}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">点子提交者</span>
                <span className="font-bold text-purple-600">+200积分</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">确认认领</h3>
            <p className="text-gray-500 text-sm mb-4">
              认领后，该点子状态变为「实现中」，其他 Builder 将看到有人正在做了。
              请确保你有能力在合理时间内完成。
            </p>
            <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700 mb-5">
              完成后可获得 <strong>500积分</strong>
              {idea.bounty && (
                <>
                  {" "}+ <strong>${idea.bounty} USD 悬赏</strong>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClaimModal(false)}
                disabled={claimLoading}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                取消
              </button>
              <button
                onClick={handleClaim}
                disabled={claimLoading}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {claimLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                确认认领
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
