require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined
});

async function checkTables() {
    try {
        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        if (result.rows.length === 0) {
            console.log("No tables found. Database is empty.");
        } else {
            console.log("Existing tables:");
            result.rows.forEach(row => console.log("-", row.table_name));
        }
    } catch (error) {
        console.error("Check failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

checkTables();
