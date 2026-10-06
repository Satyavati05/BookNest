const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../models/bookModel");

function addBook(bookData, userId) {
    return createBook({
        ...bookData,
        added_by_user_id: userId
    });
}

function getBooks() {
    return getAllBooks();
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