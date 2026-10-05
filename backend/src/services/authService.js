const bcrypt = require("bcryptjs");
const db = require("../config/database");

async function registerUser({ username, email, password, full_name }) {
    // 1. Check whether username or email already exists
    const existingUser = db
        .prepare(`
            SELECT id
            FROM users
            WHERE username = ? OR email = ?
        `)
        .get(username, email);

    if (existingUser) {
        throw new Error("Username or email already exists");
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Save the user
    const result = db
        .prepare(`
            INSERT INTO users (
                username,
                email,
                password_hash,
                full_name
            )
            VALUES (?, ?, ?, ?)
        `)
        .run(username, email, passwordHash, full_name);

    // 4. Return the newly created user's ID
    return {
        id: result.lastInsertRowid,
        username,
        email,
        full_name
    };
}

module.exports = {
    registerUser
};