import { Pool } from "pg";

// Reuse the connection pool across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    // Reasonable defaults — tune for your environment
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: process.env.DATABASE_URL?.includes("neon.tech") ? { rejectUnauthorized: false } : false,
  });
}

const pool: Pool = globalThis._pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis._pgPool = pool;
}

export default pool;
