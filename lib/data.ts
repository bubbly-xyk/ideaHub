export type IdeaStatus = "open" | "in_progress" | "implemented" | "validated";
export type IdeaDifficulty = "easy" | "medium" | "hard";
export type IdeaCategory =
  | "SaaS"
  | "Mobile"
  | "AI/ML"
  | "Developer Tools"
  | "E-commerce"
  | "Education"
  | "Health"
  | "Finance"
  | "Social"
  | "Productivity";

export interface Idea {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: IdeaCategory;
  difficulty: IdeaDifficulty;
  status: IdeaStatus;
  votes: number;
  comments: number;
  bounty?: number;
  submittedBy: string;
  submittedAt: string;
  claimedBy?: string;
  marketSize: string;
  techStack: string[];
  estimatedDuration: string;
  tags: string[];
}

export interface Comment {
  id: string;
  ideaId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  ideasSubmitted: number;
  ideasBuilt: number;
  joinedAt: string;
  badges: string[];
}

export const ideas: Idea[] = [
  {
    id: "1",
    title: "AI-Powered Code Review Bot for Startups",
    description:
      "A GitHub bot that does intelligent code review focused on startup-specific concerns: scalability bottlenecks, security vulnerabilities, and technical debt.",
    longDescription: `Most code review tools are too generic. Startups need a bot that understands their constraints — limited resources, need to move fast, but can't accumulate too much tech debt.

This bot would:
- Identify scalability issues before they become problems at 10x traffic
- Flag security vulnerabilities common in fast-moving codebases
- Suggest startup-appropriate refactoring priorities
- Learn from your codebase over time to give more relevant suggestions
- Integrate with GitHub Actions for seamless workflow

The key differentiator is context-awareness. It would understand if you're in "move fast" mode vs "stabilize" mode based on your git activity patterns.`,
    category: "Developer Tools",
    difficulty: "hard",
    status: "open",
    votes: 234,
    comments: 47,
    bounty: 500,
    submittedBy: "techfounder_alex",
    submittedAt: "2024-01-15",
    marketSize: "$4.2B (DevTools market)",
    techStack: ["Python", "GitHub API", "OpenAI API", "Redis"],
    estimatedDuration: "3-4 months",
    tags: ["AI", "GitHub", "Code Review", "Startups"],
  },
  {
    id: "2",
    title: "Micro-SaaS Revenue Tracker Dashboard",
    description:
      "A simple dashboard aggregating revenue from Stripe, Paddle, Gumroad and other platforms with MRR/ARR analytics tailored for indie hackers.",
    longDescription: `Indie hackers often run multiple micro-SaaS products across different payment platforms. Keeping track of overall MRR/ARR requires manually checking each platform.

This dashboard would:
- Connect to Stripe, Paddle, Gumroad, LemonSqueezy, and Shopify
- Show unified MRR, ARR, churn rate, and LTV
- Alert on revenue anomalies
- Show product-by-product breakdown
- Export reports for tax purposes

Target market: indie hackers with 2+ revenue streams who want a single source of truth.`,
    category: "SaaS",
    difficulty: "medium",
    status: "in_progress",
    votes: 189,
    comments: 32,
    bounty: 200,
    submittedBy: "indiehacker_sarah",
    submittedAt: "2024-01-20",
    claimedBy: "builder_mike",
    marketSize: "$850M (Indie Hacker tools)",
    techStack: ["Next.js", "Stripe API", "Paddle API", "PostgreSQL"],
    estimatedDuration: "6-8 weeks",
    tags: ["Revenue", "Analytics", "Indie Hacker", "Dashboard"],
  },
  {
    id: "3",
    title: "LinkedIn Post Scheduler with AI Tone Optimizer",
    description:
      "Schedule LinkedIn posts with AI that automatically adjusts tone based on your audience and previous post performance.",
    longDescription: `LinkedIn content is highly tone-sensitive. What works in one industry might flop in another. Most scheduling tools just post at the right time — they don't help optimize the content itself.

Features:
- AI analyzes your previous posts' performance
- Suggests tone adjustments (more authoritative, more approachable, etc.)
- A/B testing for different versions of the same post
- Best time to post based on your specific audience
- Batch create a week's content from bullet points

This would be especially valuable for founders and B2B sales professionals.`,
    category: "Social",
    difficulty: "medium",
    status: "open",
    votes: 156,
    comments: 28,
    submittedBy: "growth_guru_jen",
    submittedAt: "2024-02-01",
    marketSize: "$1.2B (Social Media Management)",
    techStack: ["React", "Node.js", "LinkedIn API", "OpenAI"],
    estimatedDuration: "2-3 months",
    tags: ["LinkedIn", "AI", "Content", "Social Media"],
  },
  {
    id: "4",
    title: "Sleep Quality Optimizer for Remote Workers",
    description:
      "App that analyzes sleep patterns of remote workers and correlates them with productivity metrics to suggest optimal sleep schedules.",
    longDescription: `Remote workers struggle with work-life boundaries which directly impacts sleep quality. This app would bridge sleep tracking with productivity data.

Core features:
- Integrates with Apple Health, Google Fit, Oura Ring
- Tracks screen time and meeting schedules
- Correlates sleep quality with next-day productivity
- Suggests sleep windows based on your actual schedule
- Weekly reports with actionable insights

The unique angle: most sleep apps tell you to sleep better but don't account for your actual work schedule and deadlines.`,
    category: "Health",
    difficulty: "hard",
    status: "open",
    votes: 143,
    comments: 19,
    bounty: 300,
    submittedBy: "wellness_dev",
    submittedAt: "2024-02-05",
    marketSize: "$80B (Digital Health)",
    techStack: ["Swift", "Kotlin", "HealthKit", "Google Fit API"],
    estimatedDuration: "4-6 months",
    tags: ["Health", "Sleep", "Remote Work", "Productivity"],
  },
  {
    id: "5",
    title: "B2B Invoice Automation for Freelancers",
    description:
      "AI that reads your email/Slack conversations with clients and automatically drafts invoices based on work discussed.",
    longDescription: `Freelancers hate invoicing. They do the work, then spend time reconstructing what they did into invoice line items. This tool reads their communications and does it automatically.

How it works:
- Connect Gmail/Outlook + Slack
- AI reads project conversations and identifies deliverables
- Auto-generates invoice drafts for review
- Learns your hourly rate and project patterns
- Sends reminders for unpaid invoices
- Integrates with QuickBooks/FreshBooks for accounting

The magic: you review and approve, not create from scratch.`,
    category: "Finance",
    difficulty: "hard",
    status: "implemented",
    votes: 201,
    comments: 56,
    submittedBy: "freelance_life_pro",
    submittedAt: "2024-01-10",
    claimedBy: "builder_team_alpha",
    marketSize: "$15B (Freelance Management Software)",
    techStack: ["Python", "Gmail API", "Slack API", "GPT-4", "Stripe"],
    estimatedDuration: "3-5 months",
    tags: ["Freelance", "Invoice", "AI", "Automation"],
  },
  {
    id: "6",
    title: "Learn to Code via Real Startup Codebases",
    description:
      "Educational platform where beginners learn coding by working on anonymized, real startup codebases with guided tasks.",
    longDescription: `Most coding education uses toy examples. Real codebases are messy, interconnected, and have real constraints — which is exactly what you need to learn.

Platform features:
- Anonymized real startup codebases with consent
- Progressive difficulty: from bug fixes to feature additions
- Mentorship from the actual engineers who wrote the code
- Portfolio-worthy contributions you can show employers
- Gamified progress with real skills demonstrated

The value prop for startups: get free help with small improvements while giving back to developer education.`,
    category: "Education",
    difficulty: "hard",
    status: "open",
    votes: 178,
    comments: 41,
    bounty: 1000,
    submittedBy: "edu_tech_founder",
    submittedAt: "2024-02-10",
    marketSize: "$50B (EdTech)",
    techStack: ["Next.js", "GitHub API", "Docker", "PostgreSQL"],
    estimatedDuration: "6-12 months",
    tags: ["Education", "Coding", "Startups", "Learning"],
  },
  {
    id: "7",
    title: "No-Code CRM for Local Service Businesses",
    description:
      "A dead-simple CRM designed specifically for plumbers, electricians, and local service providers who hate complex software.",
    longDescription: `Local service businesses are underserved by existing CRMs which are too complex and too expensive. These businesses need something they can set up in 10 minutes.

Core features:
- Customer contacts with service history
- Job scheduling on a simple calendar
- Auto-send reminders to customers via SMS
- Invoice and payment tracking
- Customer ratings to prioritize loyal clients

Design principle: if grandma can't use it in 5 minutes, it's too complex.`,
    category: "SaaS",
    difficulty: "easy",
    status: "open",
    votes: 122,
    comments: 15,
    submittedBy: "local_biz_advocate",
    submittedAt: "2024-02-15",
    marketSize: "$23B (CRM Software)",
    techStack: ["Next.js", "Twilio", "Stripe", "SQLite"],
    estimatedDuration: "6-8 weeks",
    tags: ["CRM", "Local Business", "No-Code", "SMB"],
  },
  {
    id: "8",
    title: "AI Meeting Summarizer with Action Items CRM",
    description:
      "Records meetings, extracts key decisions and action items, then tracks follow-through in a lightweight CRM.",
    longDescription: `The problem isn't recording meetings — it's following through on what was decided. Most tools stop at summarization. This one tracks whether action items actually got done.

Features:
- Integrates with Zoom, Google Meet, Teams
- Real-time transcription and summary
- Auto-assigns action items to participants
- Sends reminders to action item owners
- Tracks completion rate per person per project
- Weekly digest of overdue items

The CRM angle: over time, you build a history of who follows through and who doesn't — valuable for team management.`,
    category: "Productivity",
    difficulty: "medium",
    status: "in_progress",
    votes: 167,
    comments: 38,
    bounty: 150,
    submittedBy: "pm_extraordinaire",
    submittedAt: "2024-01-25",
    claimedBy: "dev_focused_sam",
    marketSize: "$8.5B (Meeting Software)",
    techStack: ["Python", "Whisper API", "GPT-4", "React", "PostgreSQL"],
    estimatedDuration: "3-4 months",
    tags: ["AI", "Meetings", "Productivity", "CRM"],
  },
];

export const comments: Comment[] = [
  {
    id: "c1",
    ideaId: "1",
    author: "dev_curious",
    avatar: "DC",
    content:
      "This is exactly what we need at my startup. We have 3 devs and no bandwidth for thorough code reviews. Would pay $50/month easily.",
    createdAt: "2024-01-16",
    likes: 24,
  },
  {
    id: "c2",
    ideaId: "1",
    author: "senior_eng_lisa",
    avatar: "SL",
    content:
      "The context-awareness piece is the killer feature. Most bots just run static analysis rules. If you can make it understand startup lifecycle stages, that's a real moat.",
    createdAt: "2024-01-17",
    likes: 18,
  },
  {
    id: "c3",
    ideaId: "1",
    author: "founder_thoughts",
    avatar: "FT",
    content:
      "Have you looked at Graphite or LinearB? They do some of this. The gap is the startup-specific context you're describing.",
    createdAt: "2024-01-18",
    likes: 7,
  },
  {
    id: "c4",
    ideaId: "1",
    author: "builder_enthusiast",
    avatar: "BE",
    content:
      "I'd love to build this. Thinking of using tree-sitter for AST analysis + GPT-4 for the context layer. Anyone want to collaborate?",
    createdAt: "2024-01-20",
    likes: 31,
  },
];

export const leaderboard: User[] = [
  {
    id: "u1",
    name: "TechFounder Alex",
    avatar: "TA",
    points: 3420,
    ideasSubmitted: 12,
    ideasBuilt: 3,
    joinedAt: "2023-10-01",
    badges: ["Top Ideator", "Bounty Hunter", "Early Adopter"],
  },
  {
    id: "u2",
    name: "Builder Mike",
    avatar: "BM",
    points: 2890,
    ideasSubmitted: 4,
    ideasBuilt: 7,
    joinedAt: "2023-11-15",
    badges: ["Top Builder", "Streak Master"],
  },
  {
    id: "u3",
    name: "IndieSarah",
    avatar: "IS",
    points: 2340,
    ideasSubmitted: 9,
    ideasBuilt: 2,
    joinedAt: "2023-12-01",
    badges: ["Creative Mind", "Community Star"],
  },
  {
    id: "u4",
    name: "DevFocused Sam",
    avatar: "DS",
    points: 1980,
    ideasSubmitted: 2,
    ideasBuilt: 5,
    joinedAt: "2024-01-05",
    badges: ["Fast Builder", "Quality Code"],
  },
  {
    id: "u5",
    name: "EduTech Founder",
    avatar: "EF",
    points: 1750,
    ideasSubmitted: 8,
    ideasBuilt: 1,
    joinedAt: "2024-01-10",
    badges: ["Big Dreamer"],
  },
  {
    id: "u6",
    name: "Growth Guru Jen",
    avatar: "GJ",
    points: 1560,
    ideasSubmitted: 6,
    ideasBuilt: 2,
    joinedAt: "2024-01-20",
    badges: ["Growth Hacker"],
  },
  {
    id: "u7",
    name: "Freelance Pro",
    avatar: "FP",
    points: 1340,
    ideasSubmitted: 5,
    ideasBuilt: 0,
    joinedAt: "2024-01-12",
    badges: ["Idea Machine"],
  },
  {
    id: "u8",
    name: "PM Extraordinaire",
    avatar: "PE",
    points: 1120,
    ideasSubmitted: 7,
    ideasBuilt: 1,
    joinedAt: "2024-02-01",
    badges: ["Product Thinker"],
  },
];

export const categories: IdeaCategory[] = [
  "SaaS",
  "Mobile",
  "AI/ML",
  "Developer Tools",
  "E-commerce",
  "Education",
  "Health",
  "Finance",
  "Social",
  "Productivity",
];

export const pointsRules = [
  {
    action: "提交点子",
    points: 50,
    icon: "💡",
    description: "每次提交一个新点子",
  },
  {
    action: "点子获得投票",
    points: 2,
    icon: "👍",
    description: "你的点子每获得一票",
  },
  {
    action: "认领并完成点子",
    points: 500,
    icon: "🔨",
    description: "Builder 实现一个点子并通过验证",
  },
  {
    action: "你的点子被实现",
    points: 200,
    icon: "🎉",
    description: "你提交的点子被 Builder 实现",
  },
  {
    action: "完成悬赏任务",
    points: 1000,
    icon: "💰",
    description: "完成带有 USD 悬赏的点子",
  },
  {
    action: "每日登录",
    points: 5,
    icon: "📅",
    description: "连续登录奖励",
  },
  {
    action: "评论互动",
    points: 1,
    icon: "💬",
    description: "发表有价值的评论",
  },
];
