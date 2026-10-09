
const bcrypt = require("bcryptjs");

const {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword
} = require("../models/userModel");

function getProfile(userId) {
    const user = getUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

function editProfile(userId, { username, email, full_name }) {
    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof full_name !== "string" ||
        !username.trim() ||
        !email.trim() ||
        !full_name.trim()
    ) {
        throw new Error("Username, email, and full name are required");
    }

    username = username.trim();
    email = email.trim().toLowerCase();
    full_name = full_name.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
    }

    const existingUsername = getUserByUsername(username);

    if (existingUsername && existingUsername.id !== Number(userId)) {
        throw new Error("Username is already taken");
    }

    const existingEmail = getUserByEmail(email);

    if (existingEmail && existingEmail.id !== Number(userId)) {
        throw new Error("Email is already registered");
    }

    updateUserProfile(userId, { username, email, full_name });

    return getProfile(userId);
}

async function changePassword(userId, { currentPassword, newPassword }) {
    if (
        typeof currentPassword !== "string" ||
        typeof newPassword !== "string" ||
        !currentPassword ||
        !newPassword
    ) {
        throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
    }

    const user = getUserPasswordHash(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const matches = await bcrypt.compare(
        currentPassword,
        user.password_hash
    );

    if (!matches) {
        throw new Error("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    updateUserPassword(userId, passwordHash);
}

module.exports = {
    getProfile,
    editProfile,
    changePassword
};