const {
    createBook,
    getAllBooks,
    countBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../models/bookModel");


function addBook(bookData, userId) {
    const { title, author } = bookData || {};

    if (typeof title !== "string" || !title.trim()) {
        throw new Error("Book title is required");
    }

    if (typeof author !== "string" || !author.trim()) {
        throw new Error("Book author is required");
    }

    return createBook({
        ...bookData,
        title: title.trim(),
        author: author.trim(),
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