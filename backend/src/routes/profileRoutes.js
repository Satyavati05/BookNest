
const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
    getMyProfile,
    updateMyProfile,
    updateMyPassword
} = require("../controllers/profileController");

const router = express.Router();

// View the logged-in user's profile
router.get("/", authenticateToken, getMyProfile);

// Update the logged-in user's profile
router.put("/", authenticateToken, updateMyProfile);

// Change the logged-in user's password
router.put("/password", authenticateToken, updateMyPassword);

module.exports = router;