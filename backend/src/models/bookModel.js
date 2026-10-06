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

function getAllBooks() {
    return db.prepare(`
        SELECT *
        FROM books
        ORDER BY created_at DESC
    `).all();
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
    getBookById,
    updateBook,
    deleteBook
};