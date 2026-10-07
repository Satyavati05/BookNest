const db = require("../config/database");

const createReadingListItem = (
  userId,
  bookId,
  status,
  rating = null,
  review = null
) => {
  const stmt = db.prepare(`
    INSERT INTO reading_list
    (user_id, book_id, status, rating, review)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(userId, bookId, status, rating, review);

  return db
    .prepare("SELECT * FROM reading_list WHERE id = ?")
    .get(result.lastInsertRowid);
};

const getReadingListByUserId = (userId) => {
  return db
    .prepare(`
      SELECT
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
      WHERE reading_list.user_id = ?
      ORDER BY reading_list.created_at DESC
    `)
    .all(userId);
};

const getReadingListItemById = (id) => {
  return db
    .prepare("SELECT * FROM reading_list WHERE id = ?")
    .get(id);
};

const updateReadingListItem = (
  id,
  status,
  rating = null,
  review = null
) => {
  db.prepare(`
    UPDATE reading_list
    SET
      status = ?,
      rating = ?,
      review = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, rating, review, id);

  return getReadingListItemById(id);
};

const deleteReadingListItem = (id) => {
  const result = db
    .prepare("DELETE FROM reading_list WHERE id = ?")
    .run(id);

  return result.changes > 0;
};

module.exports = {
  createReadingListItem,
  getReadingListByUserId,
  getReadingListItemById,
  updateReadingListItem,
  deleteReadingListItem,
};