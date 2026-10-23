
const test = require("node:test");
const assert = require("node:assert/strict");

const poolPath = require.resolve("../src/config/database");
const modelPath = require.resolve("../src/models/bookModel");
const servicePath = require.resolve("../src/services/bookService");

async function runAddBookTest(isbn) {
    const originalPool = require.cache[poolPath];
    const originalModel = require.cache[modelPath];
    const originalService = require.cache[servicePath];

    let capturedBook;

    const mockPool = {
        query: async () => ({
            rowCount: 1,
            rows: [{ id: 1 }]
        })
    };

    const mockModel = {
        createBook: async (book) => {
            capturedBook = book;
            return book;
        },
        getAllBooks: async () => [],
        countBooks: async () => 0,
        getBookById: async () => undefined,
        updateBook: async () => ({}),
        deleteBook: async () => true
    };

    require.cache[poolPath] = {
        id: poolPath,
        filename: poolPath,
        loaded: true,
        exports: mockPool
    };

    require.cache[modelPath] = {
        id: modelPath,
        filename: modelPath,
        loaded: true,
        exports: mockModel
    };

    delete require.cache[servicePath];

    try {
        const { addBook } = require("../src/services/bookService");

        await addBook({
            title: "Test Book",
            author: "Test Author",
            isbn,
            category_id: 1
        }, 42);

        return capturedBook;
    } finally {
        for (const [path, original] of [
            [poolPath, originalPool],
            [modelPath, originalModel],
            [servicePath, originalService]
        ]) {
            if (original) {
                require.cache[path] = original;
            } else {
                delete require.cache[path];
            }
        }
    }
}

test("blank ISBN is normalized to null before database insertion", async () => {
    const book = await runAddBookTest("");

    assert.equal(book.isbn, null);
});

test("whitespace-only ISBN is normalized to null", async () => {
    const book = await runAddBookTest("   ");

    assert.equal(book.isbn, null);
});

test("a provided ISBN is preserved", async () => {
    const book = await runAddBookTest("9780141439518");

    assert.equal(book.isbn, "9780141439518");
});
