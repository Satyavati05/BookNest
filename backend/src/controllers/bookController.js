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
        const { search = "",
            category_id = null,
            page = 1,
            limit = 10
        } = req.query;

        const currentPage = Number(page);
        const currentLimit = Number(limit);
        if (
            !Number.isInteger(currentPage) ||
            currentPage < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer"
            });
        }

        if (
            !Number.isInteger(currentLimit) ||
            currentLimit < 1 ||
            currentLimit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Limit must be an integer between 1 and 100"
            });
        }

        if 
        (category_id !== null) {
            const categoryId = Number(category_id);
            if (
                !Number.isInteger(categoryId) || categoryId < 1) {
                    return res.status(400).json({
                        success: false,
                        message: "Category ID must be a positive integer"
                    });
                }
            }
        const result = getBooks({
            search,
            category_id: category_id === null ? null : Number(category_id),
            page: currentPage,
            limit: currentLimit
        });
        const totalPages = Math.ceil(result.total / currentLimit);

        return res.status(200).json({
            success: true,
            count: result.books.length,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total: result.total,
                totalPages
            },
            books: result.books
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