
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined
});

async function testConnection() {
    try {
        const result = await pool.query(
            "SELECT version() AS version, NOW() AS server_time"
        );

        console.log("PostgreSQL connection successful!");
        console.log("Server:", result.rows[0].version.split(" ").slice(0, 2).join(" "));
        console.log("Server time:", result.rows[0].server_time);
    } catch (error) {
        console.error("Connection failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testConnection();
