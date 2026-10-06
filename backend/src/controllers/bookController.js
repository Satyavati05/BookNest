const {
    addBook,
    getBooks,
    getBook,
    editBook,
    removeBook
} = require("../services/bookService");

async function createBook(req, res) {
    try {
        const book = addBook(req.body, req.user.id);

        return res.status(201).json({
            success: true,
            message: "Book added successfully",
            book
        });
    } catch (error) {
        console.error("Create book error:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getAllBooks(req, res) {
    try {
        const books = getBooks();

        return res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        console.error("Get books error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch books"
        });
    }
}

async function getSingleBook(req, res) {
    try {
        const book = getBook(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        return res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        console.error("Get book error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch book"
        });
    }
}

async function updateBook(req, res) {
    try {
        const book = editBook(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        console.error("Update book error:", error);

        if (error.message === "Book not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteBook(req, res) {
    try {
        const book = removeBook(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            book
        });
    } catch (error) {
        console.error("Delete book error:", error);

        if (error.message === "Book not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook
};