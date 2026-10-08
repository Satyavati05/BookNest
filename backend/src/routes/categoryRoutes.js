const express = require("express");

const {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// Anyone can view categories
router.get("/", getAllCategories);

// Anyone can view one category
router.get("/:id", getSingleCategory);

// Only admins can create categories
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    createCategory
);

// Only admins can update categories
router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    updateCategory
);

// Only admins can delete categories
router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteCategory
);

module.exports = router;