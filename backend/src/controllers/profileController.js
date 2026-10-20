
const {
  getProfile,
  editProfile,
  changePassword,
} = require("../services/profileService");

async function getMyProfile(req, res) {
  try {
    const user = await getProfile(req.user.id);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 500;

    console.error("Get profile error:", error);

    return res.status(status).json({
      success: false,
      message:
        status === 404 ? error.message : "Failed to fetch profile",
    });
  }
}

async function updateMyProfile(req, res) {
  try {
    const user = await editProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    const clientErrors = [
      "User not found",
      "Username, email, and full name are required",
      "Please enter a valid email address",
      "Username is already taken",
      "Email is already registered",
    ];

    const status = clientErrors.includes(error.message) ? 400 : 500;
    const actualStatus = error.message === "User not found" ? 404 : status;

    if (actualStatus === 500) {
      console.error("Update profile error:", error);
    }

    return res.status(actualStatus).json({
      success: false,
      message:
        actualStatus === 500 ? "Failed to update profile" : error.message,
    });
  }
}

async function updateMyPassword(req, res) {
  try {
    await changePassword(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    const clientErrors = [
      "Current password and new password are required",
      "New password must be at least 8 characters",
      "Current password is incorrect",
      "User not found",
    ];

    const actualStatus =
      error.message === "User not found"
        ? 404
        : clientErrors.includes(error.message)
          ? 400
          : 500;

    if (actualStatus === 500) {
      console.error("Change password error:", error);
    }

    return res.status(actualStatus).json({
      success: false,
      message:
        actualStatus === 500 ? "Failed to change password" : error.message,
    });
  }
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
};
