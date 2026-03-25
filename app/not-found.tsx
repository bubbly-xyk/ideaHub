import Link from "next/link";
import { Lightbulb, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-10 h-10 text-indigo-300" />
        </div>
        <div className="text-7xl font-bold text-gray-100 mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">找不到这个页面</h1>
        <p className="text-gray-500 mb-8">
          这个页面可能已经不存在了，或者链接有误。不过，也许你可以在这里找到更好的点子。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            回到首页
          </Link>
          <Link
            href="/ideas"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            探索点子
          </Link>
        </div>
        <Link
          href="javascript:history.back()"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mt-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回上一页
        </Link>
      </div>
    </div>
  );
}
