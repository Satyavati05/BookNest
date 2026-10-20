const pool = require("../config/database");

const createReadingListItem = async (
    userId,
    bookId,
    status,
    rating = null,
    review = null
) => {
    const result = await pool.query(
        `INSERT INTO reading_list
            (user_id, book_id, status, rating, review)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, bookId, status, rating, review]
    );

    return result.rows[0];
};

const getReadingListByUserId = async (userId) => {
    const result = await pool.query(
        `SELECT
            reading_list.id,
            reading_list.user_id,
            reading_list.book_id,
            reading_list.status,
            reading_list.rating,
            reading_list.review,
            reading_list.created_at,
            reading_list.updated_at,
            books.title,
            books.author,
            books.cover_image_url
         FROM reading_list
         JOIN books ON reading_list.book_id = books.id
         WHERE reading_list.user_id = $1
         ORDER BY reading_list.created_at DESC`,
        [userId]
    );

    return result.rows;
};

const getReadingListItemById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM reading_list WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

const updateReadingListItem = async (
    id,
    status,
    rating = null,
    review = null
) => {
    const result = await pool.query(
        `UPDATE reading_list
         SET status = $1,
             rating = $2,
             review = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [status, rating, review, id]
    );

    return result.rows[0];
};

const deleteReadingListItem = async (id) => {
    const result = await pool.query(
        `DELETE FROM reading_list WHERE id = $1`,
        [id]
    );

    return result.rowCount > 0;
};

module.exports = {
    createReadingListItem,
    getReadingListByUserId,
    getReadingListItemById,
    updateReadingListItem,
    deleteReadingListItem
};
