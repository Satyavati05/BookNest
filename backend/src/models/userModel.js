
const db = require("../config/database");

function getUserById(id) {
    return db.prepare(`
        SELECT id, username, email, full_name, is_admin
        FROM users
        WHERE id = ?
    `).get(id);
}

function getUserByUsername(username) {
    return db.prepare(`
        SELECT id
        FROM users
        WHERE LOWER(username) = LOWER(?)
    `).get(username);
}

function getUserByEmail(email) {
    return db.prepare(`
        SELECT id
        FROM users
        WHERE LOWER(email) = LOWER(?)
    `).get(email);
}

function updateUserProfile(id, { username, email, full_name }) {
    return db.prepare(`
        UPDATE users
        SET username = ?, email = ?, full_name = ?
        WHERE id = ?
    `).run(username, email, full_name, id);
}

function getUserPasswordHash(id) {
    return db.prepare(`
        SELECT password_hash
        FROM users
        WHERE id = ?
    `).get(id);
}

function updateUserPassword(id, passwordHash) {
    return db.prepare(`
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
    `).run(passwordHash, id);
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword
};