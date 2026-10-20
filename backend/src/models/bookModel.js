const pool = require("../config/database");

async function createBook({
    title,
    author,
    isbn,
    description,
    cover_image_url,
    publication_year,
    category_id,
    added_by_user_id
}) {
    const result = await pool.query(
        `INSERT INTO books (
            title, author, isbn, description, cover_image_url,
            publication_year, category_id, added_by_user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            title,
            author,
            isbn ?? null,
            description ?? null,
            cover_image_url ?? null,
            publication_year ?? null,
            category_id,
            added_by_user_id
        ]
    );

    return result.rows[0];
}

async function getAllBooks({
    search = "",
    category_id = null,
    page = 1,
    limit = 10
} = {}) {
    let query = `SELECT * FROM books WHERE 1 = 1`;
    const params = [];

    if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length})`;
    }

    if (category_id !== null && category_id !== undefined) {
        params.push(category_id);
        query += ` AND category_id = $${params.length}`;
    }

    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
    const offset = (safePage - 1) * safeLimit;

    params.push(safeLimit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    return result.rows;
}

async function countBooks({
    search = "",
    category_id = null
} = {}) {
    let query = `SELECT COUNT(*) AS total FROM books WHERE 1 = 1`;
    const params = [];

    if (search) {
        params.push(`%${search}%`);
        query += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length})`;
    }

    if (category_id !== null && category_id !== undefined) {
        params.push(category_id);
        query += ` AND category_id = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return Number(result.rows[0].total);
}

async function getBookById(id) {
    const result = await pool.query(
        `SELECT * FROM books WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

async function updateBook(id, {
    title,
    author,
    isbn,
    description,
    cover_image_url,
    publication_year,
    category_id
}) {
    const result = await pool.query(
        `UPDATE books
         SET title = $1,
             author = $2,
             isbn = $3,
             description = $4,
             cover_image_url = $5,
             publication_year = $6,
             category_id = $7,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [
            title,
            author,
            isbn ?? null,
            description ?? null,
            cover_image_url ?? null,
            publication_year ?? null,
            category_id,
            id
        ]
    );

    return result.rows[0];
}

async function deleteBook(id) {
    const result = await pool.query(
        `DELETE FROM books WHERE id = $1`,
        [id]
    );

    return result.rowCount > 0;
}

module.exports = {
    createBook,
    getAllBooks,
    countBooks,
    getBookById,
    updateBook,
    deleteBook
};
