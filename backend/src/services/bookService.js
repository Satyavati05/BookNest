const pool = require("../config/database");

const {
    createBook,
    getAllBooks,
    countBooks,
    getBookById,
    updateBook,
    deleteBook
} = require("../models/bookModel");

async function addBook(bookData, userId) {
    const { title, author, category_id } = bookData || {};

    if (typeof title !== "string" || !title.trim()) {
        throw new Error("Book title is required");
    }

    if (typeof author !== "string" || !author.trim()) {
        throw new Error("Book author is required");
    }

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

    const category = await pool.query(
        "SELECT id FROM categories WHERE id = $1",
        [categoryId]
    );

    if (category.rowCount === 0) {
        throw new Error("Category not found");
    }

    return await createBook({
        ...bookData,
        title: title.trim(),
        author: author.trim(),
        isbn: typeof bookData.isbn === "string" && !bookData.isbn.trim()
        ? null
        : bookData.isbn ?? null,
        category_id: categoryId,
        added_by_user_id: userId
    });
}

async function getBooks(filters = {}) {
    const [books, total] = await Promise.all([
        getAllBooks(filters),
        countBooks(filters)
    ]);

    return { books, total };
}

async function getBook(id) {
    return await getBookById(id);
}

async function editBook(id, bookData) {
    const existingBook = await getBookById(id);

    if (!existingBook) {
        throw new Error("Book not found");
    }

    if (bookData.category_id !== undefined) {
        const categoryId = Number(bookData.category_id);

        if (!Number.isInteger(categoryId) || categoryId < 1) {
            throw new Error("Category ID must be a positive integer");
        }

        const category = await pool.query(
            "SELECT id FROM categories WHERE id = $1",
            [categoryId]
        );

        if (category.rowCount === 0) {
            throw new Error("Category not found");
        }

        bookData = { ...bookData, category_id: categoryId };
    }

    return await updateBook(id, bookData);
}

async function removeBook(id) {
    const existingBook = await getBookById(id);

    if (!existingBook) {
        throw new Error("Book not found");
    }

    await deleteBook(id);

    return existingBook;
}

module.exports = {
    addBook,
    getBooks,
    getBook,
    editBook,
    removeBook
};
