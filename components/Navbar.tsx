"use client";

import Link from "next/link";
import { useState } from "react";
import { Lightbulb, Menu, X, Trophy, Plus, Search } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">IdeaHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/ideas"
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              探索点子
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
            >
              <Trophy className="w-4 h-4" />
              排行榜
            </Link>
            <Link
              href="/submit"
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              提交点子
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            href="/ideas"
            className="flex items-center gap-2 text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            <Search className="w-4 h-4" />
            探索点子
          </Link>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 text-gray-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            <Trophy className="w-4 h-4" />
            排行榜
          </Link>
          <Link
            href="/submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            <Plus className="w-4 h-4" />
            提交点子
          </Link>
        </div>
      )}
    </nav>
  );
}
