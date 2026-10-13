
const db = require("../config/database");

const {
    createBook,
    getAllBooks,
    countBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../models/bookModel");


function addBook(bookData, userId) {
    const { title, author, category_id } = bookData || {};

    // Validate title
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("Book title is required");
    }

    // Validate author
    if (typeof author !== "string" || !author.trim()) {
        throw new Error("Book author is required");
    }

    // Validate category
    if (
        category_id === undefined ||
        category_id === null ||
        category_id === ""
    ) {
        throw new Error("Book category is required");
    }

    const categoryId = Number(category_id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
        throw new Error("Category ID must be a positive integer");
    }

    // Check that the category exists before inserting the book
    const category = db
        .prepare("SELECT id FROM categories WHERE id = ?")
        .get(categoryId);

    if (!category) {
        throw new Error("Category not found");
    }

    return createBook({
        ...bookData,
        title: title.trim(),
        author: author.trim(),
        category_id: categoryId,
        added_by_user_id: userId
    });
}


function getBooks(filters = {}) {
    const books = getAllBooks(filters);
    const total = countBooks(filters);

    return {
        books,
        total
    };
}


function getBook(id) {
    return getBookById(id);
}


function editBook(id, bookData) {
    const existingBook = getBookById(id);

    if (!existingBook) {
        throw new Error("Book not found");
    }

    return updateBook(id, bookData);
}


function removeBook(id) {
    const existingBook = getBookById(id);

    if (!existingBook) {
        throw new Error("Book not found");
    }

    deleteBook(id);

    return existingBook;
}


module.exports = {
    addBook,
    getBooks,
    getBook,
    editBook,
    removeBook
};
