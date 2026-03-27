import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const dbUrl = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: dbUrl?.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
});

const sql = `
CREATE TABLE IF NOT EXISTS withdrawals (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  user_name   TEXT        NOT NULL,
  points      INTEGER     NOT NULL,
  method      TEXT        NOT NULL,
  account     TEXT        NOT NULL,
  real_name   TEXT        NOT NULL DEFAULT '',
  status      TEXT        NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes       TEXT
);

ALTER TABLE ideas
  ADD COLUMN IF NOT EXISTS bounty_points INTEGER NOT NULL DEFAULT 0;

UPDATE ideas SET bounty_points = COALESCE(bounty, 0) * 1000
  WHERE bounty IS NOT NULL AND bounty > 0;
`;

try {
  await pool.query(sql);
  console.log("Done: withdrawals table created, bounty_points column added.");
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await pool.end();
}
