require("dotenv").config();

const Database = require("better-sqlite3");
const { Pool } = require("pg");

const sqlite = new Database("./database/booknest.db", {
    readonly: true
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: process.env.DATABASE_URL?.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined
});

const tables = ["users", "categories", "books", "reading_list"];

async function main() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Refuse to mix old and new data.
        for (const table of tables) {
            const result = await client.query(
                `SELECT COUNT(*)::int AS count FROM ${table}`
            );

            if (result.rows[0].count !== 0) {
                throw new Error(
                    `PostgreSQL table "${table}" is not empty. Migration stopped safely.`
                );
            }
        }

        const columns = {
            users: [
                "id", "username", "email", "password_hash",
                "full_name", "is_admin", "created_at"
            ],
            categories: ["id", "name", "description", "created_at"],
            books: [
                "id", "title", "author", "isbn", "description",
                "cover_image_url", "publication_year", "category_id",
                "added_by_user_id", "created_at", "updated_at"
            ],
            reading_list: [
                "id", "user_id", "book_id", "status",
                "rating", "review", "created_at", "updated_at"
            ]
        };

        const expected = {};

        for (const table of tables) {
            const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();
            expected[table] = rows.length;

            if (rows.length === 0) {
                console.log(`${table}: 0 rows to migrate`);
                continue;
            }

            const names = columns[table];
            const placeholders = names.map((_, i) => `$${i + 1}`).join(", ");
            const insert = `
                INSERT INTO "${table}" (${names.join(", ")})
                VALUES (${placeholders})
            `;

            for (const row of rows) {
                await client.query(
                    insert,
                    names.map((name) => row[name] ?? null)
                );
            }

            console.log(`${table}: migrated ${rows.length} rows`);
        }

        // Keep generated IDs above the IDs that were imported.
        for (const table of tables) {
            await client.query(`
                SELECT setval(
                    pg_get_serial_sequence('"${table}"', 'id'),
                    COALESCE((SELECT MAX(id) FROM "${table}"), 1),
                    (SELECT COUNT(*) > 0 FROM "${table}")
                )
            `);
        }

        // Verify counts before committing.
        for (const table of tables) {
            const result = await client.query(
                `SELECT COUNT(*)::int AS count FROM "${table}"`
            );

            if (result.rows[0].count !== expected[table]) {
                throw new Error(`Row-count verification failed for ${table}`);
            }
        }

        await client.query("COMMIT");
        console.log("\nMigration completed and row counts verified.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Migration failed; transaction rolled back:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        sqlite.close();
        await pool.end();
    }
}

main().catch(async (error) => {
    console.error("Migration could not start:", error.message);
    sqlite.close();
    await pool.end();
    process.exitCode = 1;
});
