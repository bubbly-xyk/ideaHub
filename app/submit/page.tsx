"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Plus,
  X,
  DollarSign,
} from "lucide-react";
import { categories } from "@/lib/data";

type Difficulty = "easy" | "medium" | "hard";

interface FormData {
  // Step 1
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  // Step 2
  marketSize: string;
  targetUser: string;
  existingSolutions: string;
  whyNow: string;
  // Step 3
  techStack: string[];
  difficulty: Difficulty;
  estimatedDuration: string;
  bounty: string;
  hasBounty: boolean;
}

const steps = [
  { id: 1, label: "点子描述", desc: "告诉我们你的想法" },
  { id: 2, label: "市场分析", desc: "验证点子的价值" },
  { id: 3, label: "技术信息", desc: "帮助 Builder 评估" },
];

const difficultyOptions: { value: Difficulty; label: string; desc: string }[] = [
  { value: "easy", label: "简单", desc: "1-2人，1-2个月" },
  { value: "medium", label: "中等", desc: "2-4人，2-4个月" },
  { value: "hard", label: "困难", desc: "4+人，4个月+" },
];

const durationOptions = [
  "1-2 周",
  "2-4 周",
  "1-2 个月",
  "2-3 个月",
  "3-6 个月",
  "6-12 个月",
];

const commonTechStack = [
  "React",
  "Next.js",
  "Vue",
  "Node.js",
  "Python",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "TypeScript",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "Stripe",
  "OpenAI API",
];

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    tags: [],
    marketSize: "",
    targetUser: "",
    existingSolutions: "",
    whyNow: "",
    techStack: [],
    difficulty: "medium",
    estimatedDuration: "",
    bounty: "",
    hasBounty: false,
  });

  const update = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 6) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    update("tags", form.tags.filter((t) => t !== tag));
  };

  const toggleTech = (tech: string) => {
    if (form.techStack.includes(tech)) {
      update("techStack", form.techStack.filter((t) => t !== tech));
    } else {
      update("techStack", [...form.techStack, tech]);
    }
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !form.techStack.includes(tech)) {
      update("techStack", [...form.techStack, tech]);
      setTechInput("");
    }
  };

  const canGoNext = () => {
    if (step === 1) return form.title.trim() && form.description.trim() && form.category;
    if (step === 2) return form.marketSize.trim() && form.targetUser.trim();
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">点子提交成功！</h1>
        <p className="text-gray-500 mb-2">
          你的点子已经提交，正在等待社区审核和投票。
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8 inline-block">
          <div className="text-3xl font-bold text-indigo-600">+50</div>
          <div className="text-sm text-indigo-700">积分已到账</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm({
                title: "",
                description: "",
                longDescription: "",
                category: "",
                tags: [],
                marketSize: "",
                targetUser: "",
                existingSolutions: "",
                whyNow: "",
                techStack: [],
                difficulty: "medium",
                estimatedDuration: "",
                bounty: "",
                hasBounty: false,
              });
            }}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-indigo-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            再提交一个
          </button>
          <button
            onClick={() => router.push("/ideas")}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            查看所有点子
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">提交你的点子</h1>
        <p className="text-gray-500 text-sm mt-1">
          提交即获得 <strong className="text-indigo-600">50积分</strong>
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > s.id
                    ? "bg-indigo-600 text-white"
                    : step === s.id
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
              </div>
              <div className="text-xs font-medium text-gray-600 mt-1 whitespace-nowrap hidden sm:block">
                {s.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step > s.id ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-1 text-sm text-gray-500">步骤 {step}/3</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {steps[step - 1].desc}
        </h2>

        {/* Step 1: Idea Description */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                点子标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="一句话描述你的点子，要吸引人"
                maxLength={80}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {form.title.length}/80
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                简短描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="用2-3句话解释这个点子解决什么问题..."
                rows={3}
                maxLength={200}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {form.description.length}/200
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                详细描述（可选）
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) => update("longDescription", e.target.value)}
                placeholder="详细描述功能、场景、你的思考过程..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                所属领域 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => update("category", cat)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-colors text-center ${
                      form.category === cat
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                标签（最多6个）
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded"
                  >
                    #{tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="输入标签，按回车添加"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Market Analysis */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                目标市场规模 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.marketSize}
                onChange={(e) => update("marketSize", e.target.value)}
                placeholder="例如：$2B（全球 SaaS 工具市场）"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                目标用户 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.targetUser}
                onChange={(e) => update("targetUser", e.target.value)}
                placeholder="谁会用这个产品？他们有什么痛点？"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                现有解决方案（可选）
              </label>
              <textarea
                value={form.existingSolutions}
                onChange={(e) => update("existingSolutions", e.target.value)}
                placeholder="目前有哪些替代品？你的点子有什么差异化优势？"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                为什么是现在（可选）
              </label>
              <textarea
                value={form.whyNow}
                onChange={(e) => update("whyNow", e.target.value)}
                placeholder="是什么新技术或市场趋势让这个点子现在可行？"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Technical Info */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                实现难度
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficultyOptions.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => update("difficulty", d.value)}
                    className={`border rounded-xl p-3 text-center transition-colors ${
                      form.difficulty === d.value
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{d.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                预估工期
              </label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update("estimatedDuration", d)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-colors ${
                      form.estimatedDuration === d
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                推荐技术栈（可选）
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonTechStack.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                      form.techStack.includes(tech)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 bg-white"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                  placeholder="添加其他技术..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                >
                  添加
                </button>
              </div>
            </div>

            {/* Bounty */}
            <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => update("hasBounty", !form.hasBounty)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    form.hasBounty ? "bg-yellow-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      form.hasBounty ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-800 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-yellow-600" />
                  设置 USD 悬赏
                </span>
              </div>
              {form.hasBounty && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    悬赏金额会吸引更多 Builder 优先实现你的点子
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      value={form.bounty}
                      onChange={(e) => update("bounty", e.target.value)}
                      placeholder="100"
                      min="10"
                      className="w-full border border-yellow-300 rounded-lg pl-7 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-400 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              上一步
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors"
            >
              下一步
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              提交点子，获得50积分
            </button>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h4 className="text-sm font-medium text-indigo-800 mb-2">💡 提交技巧</h4>
        <ul className="text-xs text-indigo-700 space-y-1">
          <li>• 标题越具体，越能吸引对口的 Builder</li>
          <li>• 说清楚痛点比描述功能更重要</li>
          <li>• 有悬赏的点子实现速度平均快 3 倍</li>
          <li>• 你的点子每获一票，你获得 +2 积分</li>
        </ul>
      </div>
    </div>
  );
}
