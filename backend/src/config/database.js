const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from the backend environment.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

module.exports = pool;
