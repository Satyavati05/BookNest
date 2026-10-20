const pool = require("../config/database");

async function createCategory({ name, description }) {
    const result = await pool.query(
        `INSERT INTO categories (name, description)
         VALUES ($1, $2)
         RETURNING *`,
        [name, description ?? null]
    );

    return result.rows[0];
}

async function getAllCategories() {
    const result = await pool.query(
        `SELECT * FROM categories ORDER BY name ASC`
    );

    return result.rows;
}

async function getCategoryById(id) {
    const result = await pool.query(
        `SELECT * FROM categories WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

async function updateCategory(id, { name, description }) {
    const result = await pool.query(
        `UPDATE categories
         SET name = $1, description = $2
         WHERE id = $3
         RETURNING *`,
        [name, description ?? null, id]
    );

    return result.rows[0];
}

async function deleteCategory(id) {
    const result = await pool.query(
        `DELETE FROM categories WHERE id = $1`,
        [id]
    );

    return result.rowCount > 0;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
