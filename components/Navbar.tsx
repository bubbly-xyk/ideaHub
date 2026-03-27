"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Lightbulb, Menu, X, Trophy, Plus,
  Search, LogIn, LogOut, User, Star, ChevronDown,
} from "lucide-react";

const navLinks = [
  { href: "/ideas", label: "探索点子", icon: Search },
  { href: "/leaderboard", label: "排行榜", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (pathname === "/login") return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isLoading = status === "loading";
  const user = session?.user;

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-xl font-extrabold text-gray-900 block">IdeaHub</span>
            </div>
            <span className="hidden sm:inline text-[10px] text-indigo-500 font-bold tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">× OpenClaw</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href) ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="w-32 h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : user ? (
              <>
                {/* Points */}
                <Link href="/profile" className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                  <Star className="w-3.5 h-3.5" />
                  我的积分
                </Link>

                {/* Submit button */}
                <Link href="/submit"
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm shadow-indigo-200">
                  <Plus className="w-4 h-4" />提交点子
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user.image ? (
                      <img src={user.image} alt={user.name ?? ""} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        {initials}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-20">
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4" />我的主页
                        </Link>
                        <div className="h-px bg-gray-100 my-1" />
                        <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                          <LogOut className="w-4 h-4" />退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-gray-50 transition-colors">
                  <LogIn className="w-4 h-4" />登录
                </Link>
                <Link href="/login"
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm shadow-indigo-200">
                  <Plus className="w-4 h-4" />免费注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${isActive(href) ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-700"}`}
              onClick={() => setMobileOpen(false)}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                <User className="w-4 h-4" />我的主页
              </Link>
              <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 w-full text-left">
                <LogOut className="w-4 h-4" />退出登录
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
              <LogIn className="w-4 h-4" />登录 / 注册
            </Link>
          )}
          <div className="pt-2">
            <Link href={user ? "/submit" : "/login"}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold w-full"
              onClick={() => setMobileOpen(false)}>
              <Plus className="w-4 h-4" />{user ? "提交点子" : "注册后提交"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
