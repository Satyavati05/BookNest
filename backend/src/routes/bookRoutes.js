const express = require("express");

const {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// Anyone can browse books
router.get("/", getAllBooks);

// Anyone can view one book
router.get("/:id", getSingleBook);

// Only authenticated admins can add books
router.post(
    "/",
    authenticateToken,
    requireAdmin,
    createBook

);
//Only admins can update books
router.put(
    "/:id",
    authenticateToken,
    requireAdmin,
    updateBook
);

router.delete(
    "/:id",
    authenticateToken,
    requireAdmin,
    deleteBook
);

module.exports = router;