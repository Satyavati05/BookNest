const readingListModel = require("../models/readingListModel");
const bookModel = require("../models/bookModel");

const VALID_STATUSES = [
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "READ",
];

const addToReadingList = (
  userId,
  bookId,
  status,
  rating = null,
  review = null
) => {
  // Validate status
  if (!VALID_STATUSES.includes(status)) {
  throw new Error(
    "Invalid status. Use WANT_TO_READ, CURRENTLY_READING, or READ."
  );
}

  // Check whether the book exists
  const book = bookModel.getBookById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  // Prevent duplicate entries
  const existingItems = readingListModel.getReadingListByUserId(userId);

  const alreadyAdded = existingItems.find(
    (item) => item.book_id === bookId
  );

  if (alreadyAdded) {
    throw new Error("Book is already in your reading list");
  }

  return readingListModel.createReadingListItem(
    userId,
    bookId,
    status,
    rating,
    review
  );
};

const getMyReadingList = (userId) => {
  return readingListModel.getReadingListByUserId(userId);
};

const updateReadingListItem = (
  userId,
  itemId,
  status,
  rating = null,
  review = null
) => {
  if (!VALID_STATUSES.includes(status)) {
  throw new Error(
    "Invalid status. Use WANT_TO_READ, CURRENTLY_READING, or READ."
  );
}

  const item = readingListModel.getReadingListItemById(itemId);

  if (!item) {
    throw new Error("Reading list item not found");
  }

  // Make sure the item belongs to the logged-in user
  if (item.user_id !== userId) {
    throw new Error("You are not authorized to update this item");
  }

  return readingListModel.updateReadingListItem(
    itemId,
    status,
    rating,
    review
  );
};

const removeFromReadingList = (userId, itemId) => {
  const item = readingListModel.getReadingListItemById(itemId);

  if (!item) {
    throw new Error("Reading list item not found");
  }

  // Make sure the item belongs to the logged-in user
  if (item.user_id !== userId) {
    throw new Error("You are not authorized to delete this item");
  }

  readingListModel.deleteReadingListItem(itemId);

  return item;
};

module.exports = {
  addToReadingList,
  getMyReadingList,
  updateReadingListItem,
  removeFromReadingList,
};