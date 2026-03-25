"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Lightbulb, Menu, X, Trophy, Plus, Search, User, Star } from "lucide-react";

const navLinks = [
  { href: "/ideas", label: "探索点子", icon: Search },
  { href: "/leaderboard", label: "排行榜", icon: Trophy },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

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
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Points badge */}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-xs font-medium bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition-colors"
            >
              <Star className="w-3.5 h-3.5" />
              3,420 积分
            </Link>
            {/* Profile avatar */}
            <Link
              href="/profile"
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors ${
                isActive("/profile")
                  ? "bg-indigo-700 ring-2 ring-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              TA
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
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                isActive(href)
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700"
            onClick={() => setMobileOpen(false)}
          >
            <User className="w-4 h-4" />
            我的主页
          </Link>
          <div className="pt-2">
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium w-full"
              onClick={() => setMobileOpen(false)}
            >
              <Plus className="w-4 h-4" />
              提交点子
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
