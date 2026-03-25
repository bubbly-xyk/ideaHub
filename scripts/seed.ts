/**
 * Seed the PostgreSQL database with initial data.
 * Usage:  npx tsx scripts/seed.ts
 *
 * Requires DATABASE_URL to be set (e.g. in .env.local).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback to .env
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";
import { ideas, comments, leaderboard } from "../lib/data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Apply schema
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
    await client.query(schema);
    console.log("✓ Schema applied");

    // 2. Seed ideas
    for (const idea of ideas) {
      await client.query(
        `INSERT INTO ideas
          (title, description, long_description, category, difficulty, status,
           votes, comments_count, bounty, submitted_by, submitted_at, claimed_by,
           market_size, tech_stack, estimated_duration, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          idea.title,
          idea.description,
          idea.longDescription,
          idea.category,
          idea.difficulty,
          idea.status,
          idea.votes,
          idea.comments,
          idea.bounty ?? null,
          idea.submittedBy,
          idea.submittedAt,
          idea.claimedBy ?? null,
          idea.marketSize,
          idea.techStack,
          idea.estimatedDuration,
          idea.tags,
        ]
      );
    }
    console.log(`✓ Seeded ${ideas.length} ideas`);

    // 3. Seed comments (map old string ids → new serial ids)
    // We re-query inserted ideas to get their DB ids in insertion order
    const { rows: insertedIdeas } = await client.query(
      "SELECT id FROM ideas ORDER BY id"
    );
    // old idea ids were "1".."15", matching insertion order
    const idMap: Record<string, number> = {};
    ideas.forEach((idea, i) => {
      idMap[idea.id] = insertedIdeas[i].id;
    });

    for (const comment of comments) {
      const dbIdeaId = idMap[comment.ideaId];
      if (!dbIdeaId) continue;
      await client.query(
        `INSERT INTO comments (author, avatar, content, created_at, likes, idea_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [comment.author, comment.avatar, comment.content, comment.createdAt, comment.likes, dbIdeaId]
      );
    }
    console.log(`✓ Seeded ${comments.length} comments`);

    // 4. Seed users / leaderboard
    for (const user of leaderboard) {
      await client.query(
        `INSERT INTO users (name, avatar, points, ideas_submitted, ideas_built, joined_at, badges)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          user.name,
          user.avatar,
          user.points,
          user.ideasSubmitted,
          user.ideasBuilt,
          user.joinedAt,
          user.badges,
        ]
      );
    }
    console.log(`✓ Seeded ${leaderboard.length} users`);

    await client.query("COMMIT");
    console.log("\n🎉 Database seeded successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed — rolled back:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
