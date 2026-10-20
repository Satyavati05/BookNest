const pool = require("../config/database");

async function getUserById(id) {
    const result = await pool.query(
        `SELECT id, username, email, full_name, is_admin
         FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

async function getUserByUsername(username) {
    const result = await pool.query(
        `SELECT id FROM users WHERE LOWER(username) = LOWER($1)`,
        [username]
    );
    return result.rows[0];
}

async function getUserByEmail(email) {
    const result = await pool.query(
        `SELECT id FROM users WHERE LOWER(email) = LOWER($1)`,
        [email]
    );
    return result.rows[0];
}

async function updateUserProfile(id, { username, email, full_name }) {
    const result = await pool.query(
        `UPDATE users
         SET username = $1, email = $2, full_name = $3
         WHERE id = $4
         RETURNING id, username, email, full_name, is_admin`,
        [username, email, full_name, id]
    );
    return result.rows[0];
}

async function getUserPasswordHash(id) {
    const result = await pool.query(
        `SELECT password_hash FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

async function updateUserPassword(id, passwordHash) {
    const result = await pool.query(
        `UPDATE users SET password_hash = $1 WHERE id = $2`,
        [passwordHash, id]
    );
    return result.rowCount > 0;
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword
};
