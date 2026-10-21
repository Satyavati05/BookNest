require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined
});

async function main() {
    try {
        for (const table of ["users", "categories", "books", "reading_list"]) {
            const result = await pool.query(
                `SELECT COUNT(*)::int AS count FROM "${table}"`
            );
            console.log(`${table}: ${result.rows[0].count} rows`);
        }

        const checks = [
            {
                name: "Books with missing categories",
                sql: `SELECT COUNT(*)::int AS count FROM books b
                      LEFT JOIN categories c ON c.id = b.category_id
                      WHERE c.id IS NULL`
            },
            {
                name: "Books with missing creator users",
                sql: `SELECT COUNT(*)::int AS count FROM books b
                      LEFT JOIN users u ON u.id = b.added_by_user_id
                      WHERE u.id IS NULL`
            },
            {
                name: "Reading-list entries with missing users or books",
                sql: `SELECT COUNT(*)::int AS count FROM reading_list r
                      LEFT JOIN users u ON u.id = r.user_id
                      LEFT JOIN books b ON b.id = r.book_id
                      WHERE u.id IS NULL OR b.id IS NULL`
            }
        ];

        console.log("\nRelationship checks:");
        for (const check of checks) {
            const result = await pool.query(check.sql);
            console.log(`${check.name}: ${result.rows[0].count}`);
        }
    } catch (error) {
        console.error("Verification failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
