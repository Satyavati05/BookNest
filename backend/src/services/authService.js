const bcrypt = require("bcryptjs");
const db = require("../config/database");

const jwt = require("jsonwebtoken");

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

async function loginUser({ email, password }) {
    // 1. Find the user by email
    const user = db
        .prepare(`
            SELECT *
            FROM users
            WHERE email = ?
        `)
        .get(email);

    // 2. Check whether the user exists
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // 3. Compare the entered password with the stored hash
    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);

    // 4. Return user information
    return {
    user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin
    },
    token
};
}

module.exports = {
    registerUser,
    loginUser
};