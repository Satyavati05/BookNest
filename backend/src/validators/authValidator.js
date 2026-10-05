function validateRegistration(data) {
    const { username, email, password, full_name } = data;

    if (!username || !email || !password || !full_name) {
        return {
            valid: false,
            message: "All fields are required"
        };
    }

    if (password.length < 6) {
        return {
            valid: false,
            message: "Password must be at least 6 characters"
        };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return {
            valid: false,
            message: "Please provide a valid email address"
        };
    }

    return {
        valid: true
    };
}

function validateLogin(data) {
    const { email, password } = data;

    if (!email || !password) {
        return {
            valid: false,
            message: "Email and password are required"
        };
    }

    return {
        valid: true
    };
}

module.exports = {
    validateRegistration,
    validateLogin
};