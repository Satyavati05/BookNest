const pool = require("./database");

async function initDatabase() {
    await pool.query("SELECT 1");

    const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN ('users', 'categories', 'books', 'reading_list')
    `);

    const existingTables = result.rows.map((row) => row.table_name);
    const requiredTables = [
        "users",
        "categories",
        "books",
        "reading_list"
    ];

    const missingTables = requiredTables.filter(
        (table) => !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
        throw new Error(
            `Missing PostgreSQL tables: ${missingTables.join(", ")}`
        );
    }

    console.log("PostgreSQL connection and schema verified successfully.");
}

module.exports = initDatabase;
