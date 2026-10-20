require("dotenv").config();
const pool = require("./database");

async function checkDatabase() {
    try {
        const result = await pool.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `);

        console.log("PostgreSQL database tables:");

        result.rows.forEach((table) => {
            console.log(`- ${table.tablename}`);
        });
    } catch (error) {
        console.error("Failed to check database:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

checkDatabase();
