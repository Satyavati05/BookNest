const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
    "/test",
    authenticateToken,
    requireAdmin,
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Admin access granted",
            user: req.user
        });
    }
);

module.exports = router;