import Link from "next/link";
import { Lightbulb, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">IdeaHub</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              连接有想法的人和会做产品的人。让每一个好点子都有机会变成现实。
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">产品</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ideas" className="hover:text-white transition-colors">
                  探索点子
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-white transition-colors">
                  提交点子
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  排行榜
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">关于</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  积分规则
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  隐私政策
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  用户协议
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © 2024 IdeaHub. 让想法连接世界。
        </div>
      </div>
    </footer>
  );
}
