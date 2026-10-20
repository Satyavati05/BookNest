
const readingListModel = require("../models/readingListModel");
const bookModel = require("../models/bookModel");

const VALID_STATUSES = [
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "READ",
];

const addToReadingList = async (
  userId,
  bookId,
  status,
  rating = null,
  review = null
) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      "Invalid status. Use WANT_TO_READ, CURRENTLY_READING, or READ."
    );
  }

  // Check whether the book exists.
  const book = await bookModel.getBookById(bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  // Prevent duplicate entries.
  const existingItems =
    await readingListModel.getReadingListByUserId(userId);

  const alreadyAdded = existingItems.find(
    (item) => Number(item.book_id) === Number(bookId)
  );

  if (alreadyAdded) {
    throw new Error("Book is already in your reading list");
  }

  return await readingListModel.createReadingListItem(
    userId,
    bookId,
    status,
    rating,
    review
  );
};

const getMyReadingList = async (userId) => {
  return await readingListModel.getReadingListByUserId(userId);
};

const updateReadingListItem = async (
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

  const item =
    await readingListModel.getReadingListItemById(itemId);

  if (!item) {
    throw new Error("Reading list item not found");
  }

  // Ensure the item belongs to the logged-in user.
  if (Number(item.user_id) !== Number(userId)) {
    throw new Error("You are not authorized to update this item");
  }

  return await readingListModel.updateReadingListItem(
    itemId,
    status,
    rating,
    review
  );
};

const removeFromReadingList = async (userId, itemId) => {
  const item =
    await readingListModel.getReadingListItemById(itemId);

  if (!item) {
    throw new Error("Reading list item not found");
  }

  // Ensure the item belongs to the logged-in user.
  if (Number(item.user_id) !== Number(userId)) {
    throw new Error("You are not authorized to delete this item");
  }

  await readingListModel.deleteReadingListItem(itemId);

  return item;
};

module.exports = {
  addToReadingList,
  getMyReadingList,
  updateReadingListItem,
  removeFromReadingList,
};
