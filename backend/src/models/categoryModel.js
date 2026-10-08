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

function updateCategory(id, { name, description }) {
    db.prepare(`
        UPDATE categories
        SET
            name = ?,
            description = ?
        WHERE id = ?
    `).run(name, description, id);

    return getCategoryById(id);
}

function deleteCategory(id) {
    const result = db.prepare(`
        DELETE FROM categories
        WHERE id = ?
    `).run(id);

    return result.changes > 0;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};