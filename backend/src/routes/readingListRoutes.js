const express = require("express");
const router = express.Router();

const readingListController = require("../controllers/readingListController");
const authMiddleware = require("../middleware/authMiddleware");

// All reading-list routes require authentication
router.use(authMiddleware);

router.post("/", readingListController.addToReadingList);

router.get("/", readingListController.getMyReadingList);

router.put("/:id", readingListController.updateReadingListItem);

router.delete("/:id", readingListController.removeFromReadingList);

module.exports = router;