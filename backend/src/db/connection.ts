import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env.js";
import * as schema from "./schema.js";

if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

pool.on("error", (err) => {
    console.error("Unexpected database error:", err);
    process.exit(-1);
});

export const db = drizzle(pool, {schema});