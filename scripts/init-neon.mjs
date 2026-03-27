import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_BJor4ut5SCpj@ep-cool-thunder-ajyvvwig-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString: DATABASE_URL });

const schema = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id               TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name             TEXT        NOT NULL,
  avatar           TEXT        NOT NULL DEFAULT '',
  email            TEXT        UNIQUE,
  password_hash    TEXT,
  email_verified   BOOLEAN     NOT NULL DEFAULT false,
  provider         TEXT,
  provider_id      TEXT,
  points           INTEGER     NOT NULL DEFAULT 0,
  ideas_submitted  INTEGER     NOT NULL DEFAULT 0,
  ideas_built      INTEGER     NOT NULL DEFAULT 0,
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  badges           TEXT[]      NOT NULL DEFAULT '{}'
);

CREATE TABLE ideas (
  id               SERIAL PRIMARY KEY,
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  long_description TEXT        NOT NULL DEFAULT '',
  category         TEXT        NOT NULL,
  difficulty       TEXT        NOT NULL DEFAULT 'medium',
  status           TEXT        NOT NULL DEFAULT 'open',
  votes            INTEGER     NOT NULL DEFAULT 0,
  comments_count   INTEGER     NOT NULL DEFAULT 0,
  bounty           INTEGER,
  submitted_by     TEXT        NOT NULL DEFAULT 'anonymous',
  submitted_at     DATE        NOT NULL DEFAULT CURRENT_DATE,
  claimed_by       TEXT,
  market_size      TEXT        NOT NULL DEFAULT '',
  tech_stack       TEXT[]      NOT NULL DEFAULT '{}',
  estimated_duration TEXT      NOT NULL DEFAULT '',
  tags             TEXT[]      NOT NULL DEFAULT '{}'
);

CREATE TABLE comments (
  id         TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  idea_id    INTEGER     NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  author     TEXT        NOT NULL,
  avatar     TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  likes      INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE verification_codes (
  id         SERIAL      PRIMARY KEY,
  email      TEXT        NOT NULL,
  code       TEXT        NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ideas_status    ON ideas(status);
CREATE INDEX idx_ideas_category  ON ideas(category);
CREATE INDEX idx_ideas_votes     ON ideas(votes DESC);
CREATE INDEX idx_comments_idea   ON comments(idea_id);
CREATE INDEX idx_users_points    ON users(points DESC);
CREATE INDEX idx_users_email     ON users(email);
CREATE INDEX idx_vcodes_email    ON verification_codes(email);
`;

const seedIdeas = [
  {
    title: "AI驱动的本地生活服务匹配平台",
    description: "用AI帮助社区居民快速匹配家政、维修、外卖等本地服务，支持实时评价和智能推荐。",
    long_description: "目前本地生活服务市场碎片化严重，用户找到合适的服务提供商需要花费大量时间。该平台通过AI算法分析用户需求、历史评价和地理位置，在30秒内为用户精准匹配服务提供商。支持语音搜索、图片识别需求等创新交互方式。",
    category: "AI工具",
    difficulty: "hard",
    status: "open",
    votes: 342,
    bounty: 5000,
    submitted_by: "创意者 Alex",
    market_size: "1000亿+",
    tech_stack: ["Next.js", "Python", "OpenAI", "PostgreSQL"],
    estimated_duration: "3-6个月",
    tags: ["AI", "本地服务", "O2O", "推荐系统"]
  },
  {
    title: "程序员专属番茄钟 + 代码统计工具",
    description: "结合番茄工作法与代码量统计，帮助开发者追踪生产力，生成漂亮的GitHub风格贡献图。",
    long_description: "很多开发者使用番茄钟但无法量化产出。这个工具在每个番茄周期内自动统计代码行数、提交次数、解决的问题数量，并生成可分享的生产力报告。集成VSCode插件和GitHub Actions。",
    category: "开发工具",
    difficulty: "medium",
    status: "building",
    votes: 286,
    bounty: 2000,
    submitted_by: "开发者 Sam",
    market_size: "200亿",
    tech_stack: ["Electron", "VSCode API", "Node.js", "SQLite"],
    estimated_duration: "1-2个月",
    tags: ["效率", "番茄钟", "VSCode", "统计"]
  },
  {
    title: "独立开发者收入透明化社区",
    description: "鼓励独立开发者公开月收入、用户数、MRR等数据，互相激励，共同成长。",
    long_description: "Indie Hackers模式在国内的本土化版本。开发者可以创建产品页面，公开收入数据（可选），分享增长历程。提供数据可视化、对比功能，以及开发者之间的私信和合作系统。",
    category: "社区平台",
    difficulty: "medium",
    status: "open",
    votes: 198,
    bounty: 3000,
    submitted_by: "产品人 Maya",
    market_size: "50亿",
    tech_stack: ["Next.js", "Supabase", "Tailwind", "Chart.js"],
    estimated_duration: "2-3个月",
    tags: ["社区", "独立开发", "数据透明", "增长"]
  },
  {
    title: "小红书内容一键多平台分发工具",
    description: "将小红书图文、视频一键分发到微博、抖音、B站、公众号，自动适配各平台格式。",
    long_description: "内容创作者需要在多个平台维护账号，重复发布耗时耗力。该工具通过API接口或自动化操作，实现内容的智能重排版和多平台同步发布，并提供数据聚合统计面板。",
    category: "内容工具",
    difficulty: "hard",
    status: "open",
    votes: 445,
    bounty: 8000,
    submitted_by: "运营达人 Leo",
    market_size: "300亿",
    tech_stack: ["Python", "Playwright", "FastAPI", "Redis"],
    estimated_duration: "2-4个月",
    tags: ["内容分发", "自动化", "多平台", "创作者"]
  },
  {
    title: "极简日记 App：每天只问你一个问题",
    description: "每天推送一个精心设计的问题，帮助用户回顾和记录生活，积累成独特的人生档案。",
    long_description: "传统日记门槛太高，用户坚持不下去。这个App每天只问一个问题（如：今天让你开心的小事是什么？），用户用1-3句话回答即可。系统自动生成年度总结、词云和情绪曲线。",
    category: "效率工具",
    difficulty: "easy",
    status: "open",
    votes: 167,
    bounty: 1500,
    submitted_by: "设计师 Iris",
    market_size: "100亿",
    tech_stack: ["React Native", "Expo", "SQLite", "Node.js"],
    estimated_duration: "1个月",
    tags: ["日记", "极简", "习惯养成", "移动端"]
  },
  {
    title: "GitHub项目README智能生成器",
    description: "输入仓库URL，AI自动分析代码结构、依赖、功能，生成专业的README文档。",
    long_description: "很多开发者开源项目缺少好的文档。这个工具通过分析代码文件、package.json、commit历史等，自动生成包含项目介绍、安装指南、API文档、贡献指南的完整README，支持中英文双语。",
    category: "AI工具",
    difficulty: "medium",
    status: "building",
    votes: 523,
    bounty: 4000,
    submitted_by: "工程师 Chen",
    market_size: "30亿",
    tech_stack: ["Next.js", "OpenAI", "GitHub API", "MDX"],
    estimated_duration: "2-4周",
    tags: ["AI", "GitHub", "文档", "开发者工具"]
  }
];

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to Neon DB');

    // Run schema
    console.log('Running schema...');
    await client.query(schema);
    console.log('Schema created');

    // Seed ideas
    console.log('Seeding ideas...');
    for (const idea of seedIdeas) {
      await client.query(
        `INSERT INTO ideas (title, description, long_description, category, difficulty, status, votes, bounty, submitted_by, market_size, tech_stack, estimated_duration, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [idea.title, idea.description, idea.long_description, idea.category, idea.difficulty,
         idea.status, idea.votes, idea.bounty, idea.submitted_by, idea.market_size,
         idea.tech_stack, idea.estimated_duration, idea.tags]
      );
    }
    console.log(`Seeded ${seedIdeas.length} ideas`);

    // Verify
    const { rows } = await client.query('SELECT COUNT(*) FROM ideas');
    console.log(`Total ideas in DB: ${rows[0].count}`);

    console.log('Done!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
