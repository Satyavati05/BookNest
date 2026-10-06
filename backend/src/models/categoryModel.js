const db = require("../config/database");

function createCategory({ name, description }) {
    const result = db.prepare(`
        INSERT INTO categories (
            name,
            description
        )
        VALUES (?, ?)
    `).run(name, description);

    return db.prepare(`
        SELECT *
        FROM categories
        WHERE id = ?
    `).get(result.lastInsertRowid);
}

function getAllCategories() {
    return db.prepare(`
        SELECT *
        FROM categories
        ORDER BY name ASC
    `).all();
}

function getCategoryById(id) {
    return db.prepare(`
        SELECT *
        FROM categories
        WHERE id = ?
    `).get(id);
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById
};