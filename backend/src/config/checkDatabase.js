const db = require("./database");

const tables = db
    .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        ORDER BY name;
    `)
    .all();

console.log("Database tables:");

tables.forEach((table) => {
    console.log(`- ${table.name}`);
});