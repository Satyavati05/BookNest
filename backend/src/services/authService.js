const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

async function registerUser({ username, email, password, full_name }) {
    const existingUser = await pool.query(
        `SELECT id FROM users
         WHERE LOWER(username) = LOWER($1)
            OR LOWER(email) = LOWER($2)`,
        [username, email]
    );

    if (existingUser.rowCount > 0) {
        throw new Error("Username or email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, full_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, full_name, is_admin`,
        [username, email, passwordHash, full_name]
    );

    const user = result.rows[0];

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
    };
}

async function loginUser({ email, password }) {
    const result = await pool.query(
        `SELECT id, username, email, password_hash, full_name, is_admin
         FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing from the environment");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

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

module.exports = { registerUser, loginUser };
