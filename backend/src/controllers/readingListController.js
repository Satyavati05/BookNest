const readingListService = require("../services/readingListService");

const addToReadingList = (req, res) => {
  try {
    const { book_id, status, rating, review } = req.body;

    const item = readingListService.addToReadingList(
      req.user.id,
      book_id,
      status,
      rating,
      review
    );

    res.status(201).json({
      success: true,
      message: "Book added to reading list",
      readingListItem: item,
    });
  } catch (error) {
    if (
      error.message === "Book not found" ||
      error.message === "Book is already in your reading list" ||
      error.message.startsWith("Invalid status")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Reading list error:", error);
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

const getMyReadingList = (req, res) => {
    
  try {
    const items = readingListService.getMyReadingList(req.user.id);

    res.status(200).json({
      success: true,
      count: items.length,
      readingList: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reading list",
    });
  }
};

const updateReadingListItem = (req, res) => {
  try {
    const { status, rating, review } = req.body;

    const item = readingListService.updateReadingListItem(
      req.user.id,
      req.params.id,
      status,
      rating,
      review
    );

    res.status(200).json({
      success: true,
      message: "Reading list item updated",
      readingListItem: item,
    });
  } catch (error) {
    if (
      error.message === "Reading list item not found" ||
      error.message === "You are not authorized to update this item" ||
      error.message.startsWith("Invalid status")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update reading list item",
    });
  }
};

const removeFromReadingList = (req, res) => {
  try {
    const item = readingListService.removeFromReadingList(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Book removed from reading list",
      readingListItem: item,
    });
  } catch (error) {
    if (
      error.message === "Reading list item not found" ||
      error.message === "You are not authorized to delete this item"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to remove book from reading list",
    });
  }
};

module.exports = {
  addToReadingList,
  getMyReadingList,
  updateReadingListItem,
  removeFromReadingList,
};