import Link from "next/link";
import {
  ThumbsUp,
  MessageCircle,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Idea } from "@/lib/data";

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "开放中", className: "bg-green-100 text-green-700" },
  building: { label: "实现中", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "实现中", className: "bg-blue-100 text-blue-700" },
  implemented: { label: "已实现", className: "bg-purple-100 text-purple-700" },
  validated: { label: "已验证", className: "bg-yellow-100 text-yellow-700" },
};
const defaultStatus = { label: "开放中", className: "bg-gray-100 text-gray-600" };

const difficultyConfig: Record<string, { label: string; className: string }> = {
  easy: { label: "简单", className: "bg-emerald-50 text-emerald-600" },
  medium: { label: "中等", className: "bg-orange-50 text-orange-600" },
  hard: { label: "困难", className: "bg-red-50 text-red-600" },
};
const defaultDifficulty = { label: "中等", className: "bg-gray-50 text-gray-500" };

interface IdeaCardProps {
  idea: Idea;
  compact?: boolean;
}

export default function IdeaCard({ idea, compact = false }: IdeaCardProps) {
  const status = statusConfig[idea.status] ?? defaultStatus;
  const difficulty = difficultyConfig[idea.difficulty] ?? defaultDifficulty;

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}
              >
                {status.label}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${difficulty.className}`}
              >
                {difficulty.label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {idea.category}
              </span>
              {idea.bounty && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {idea.bounty * 1000} 积分奖励
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
              {idea.title}
            </h3>

            {/* Description */}
            {!compact && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {idea.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
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
              <span className="text-gray-400 text-xs ml-auto">
                by {idea.submittedBy}
              </span>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors mt-1 flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
