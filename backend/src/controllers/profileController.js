
const {
    getProfile,
    editProfile,
    changePassword
} = require("../services/profileService");

async function getMyProfile(req, res) {
    try {
        const user = getProfile(req.user.id);

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(
            error.message === "User not found" ? 404 : 400
        ).json({
            success: false,
            message: error.message
        });
    }
}

async function updateMyProfile(req, res) {
    try {
        const user = editProfile(req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        const status = error.message === "User not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

async function updateMyPassword(req, res) {
    try {
        await changePassword(req.user.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        const status = error.message === "User not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateMyPassword
};