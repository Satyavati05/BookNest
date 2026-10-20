
const readingListService = require("../services/readingListService");

const handleError = (res, error, action) => {
  const clientErrors = {
    "Book not found": 404,
    "Book is already in your reading list": 409,
    "Reading list item not found": 404,
    "You are not authorized to update this item": 403,
    "You are not authorized to delete this item": 403,
  };

  if (
    clientErrors[error.message] ||
    error.message.startsWith("Invalid status")
  ) {
    const status = clientErrors[error.message] ||
      400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }

  console.error(`Reading list ${action} error:`, error);

  return res.status(500).json({
    success: false,
    message: `Failed to ${action}`,
  });
};

const addToReadingList = async (req, res) => {
  try {
    const { book_id, status, rating, review } = req.body;

    const item = await readingListService.addToReadingList(
      req.user.id,
      book_id,
      status,
      rating,
      review
    );

    return res.status(201).json({
      success: true,
      message: "Book added to reading list",
      readingListItem: item,
    });
  } catch (error) {
    return handleError(res, error, "add book to reading list");
  }
};

const getMyReadingList = async (req, res) => {
  try {
    const items = await readingListService.getMyReadingList(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      count: items.length,
      readingList: items,
    });
  } catch (error) {
    return handleError(res, error, "fetch reading list");
  }
};

const updateReadingListItem = async (req, res) => {
  try {
    const { status, rating, review } = req.body;

    const item = await readingListService.updateReadingListItem(
      req.user.id,
      req.params.id,
      status,
      rating,
      review
    );

    return res.status(200).json({
      success: true,
      message: "Reading list item updated",
      readingListItem: item,
    });
  } catch (error) {
    return handleError(res, error, "update reading list item");
  }
};

const removeFromReadingList = async (req, res) => {
  try {
    const item = await readingListService.removeFromReadingList(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Book removed from reading list",
      readingListItem: item,
    });
  } catch (error) {
    return handleError(res, error, "remove book from reading list");
  }
};

module.exports = {
  addToReadingList,
  getMyReadingList,
  updateReadingListItem,
  removeFromReadingList,
};
