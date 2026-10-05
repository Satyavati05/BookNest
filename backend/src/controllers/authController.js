const { validateRegistration } = require("../validators/authValidator");
const { registerUser } = require("../services/authService");

async function register(req, res) {
    try {
        // 1. Validate incoming data
        const validation = validateRegistration(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // 2. Register the user
        const user = await registerUser(req.body);

        // 3. Send successful response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    register
};