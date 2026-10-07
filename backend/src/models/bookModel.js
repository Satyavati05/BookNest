const db = require("../config/database");

function createBook({
    title,
    author,
    isbn,
    description,
    cover_image_url,
    publication_year,
    category_id,
    added_by_user_id
}) {
    const result = db.prepare(`
        INSERT INTO books (
            title,
            author,
            isbn,
            description,
            cover_image_url,
            publication_year,
            category_id,
            added_by_user_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        title,
        author,
        isbn,
        description,
        cover_image_url,
        publication_year,
        category_id,
        added_by_user_id
    );

    return db.prepare(`
        SELECT *
        FROM books
        WHERE id = ?
    `).get(result.lastInsertRowid);
}

function getAllBooks({
    search = "",
    category_id = null,
    page = 1,
    limit = 10
} = {}) {
    let query = `
        SELECT *
        FROM books
        WHERE 1 = 1
    `;

    const params = [];

    if (search) {
        query += `
            AND (
                title LIKE ?
                OR author LIKE ?
            )
        `;

        const searchPattern = `%${search}%`;

        params.push(searchPattern, searchPattern);
    }

    if (category_id) {
        query += `
            AND category_id = ?
        `;

        params.push(category_id);
    }

    query += `
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `;

    const offset = (page - 1) * limit;

    params.push(limit, offset);

    return db.prepare(query).all(...params);
}

function countBooks({
    search = "",
    category_id = null
} = {}) {
    let query = `
        SELECT COUNT(*) AS total
        FROM books
        WHERE 1 = 1
    `;

    const params = [];

    if (search) {
        query += `
            AND (
                title LIKE ?
                OR author LIKE ?
            )
        `;

        const searchPattern = `%${search}%`;

        params.push(searchPattern, searchPattern);
    }

    if (category_id) {
        query += `
            AND category_id = ?
        `;

        params.push(category_id);
    }

    return db.prepare(query).get(...params).total;
}

function getBookById(id) {
    return db.prepare(`
        SELECT *
        FROM books
        WHERE id = ?
    `).get(id);
}

function updateBook(id, {
    title,
    author,
    isbn,
    description,
    cover_image_url,
    publication_year,
    category_id
}) {
    db.prepare(`
        UPDATE books
        SET
            title = ?,
            author = ?,
            isbn = ?,
            description = ?,
            cover_image_url = ?,
            publication_year = ?,
            category_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        title,
        author,
        isbn,
        description,
        cover_image_url,
        publication_year,
        category_id,
        id
    );

    return getBookById(id);
}

function deleteBook(id) {
    const result = db.prepare(`
        DELETE FROM books
        WHERE id = ?
    `).run(id);

    return result.changes > 0;
}

module.exports = {
    createBook,
    getAllBooks,
    countBooks,
    getBookById,
    updateBook,
    deleteBook
};