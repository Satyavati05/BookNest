
const test = require("node:test");
const assert = require("node:assert/strict");

const bookServicePath = require.resolve("../src/services/bookService");
const controllerPath = require.resolve("../src/controllers/bookController");

function createResponse() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
}

function loadControllerWithMockService(overrides = {}) {
    const originalService = require.cache[bookServicePath];
    const originalController = require.cache[controllerPath];

    const mockService = {
        addBook: () => ({}),
        getBooks: () => ({ books: [], total: 0 }),
        getBook: () => undefined,
        editBook: () => ({}),
        removeBook: () => ({}),
        ...overrides
    };

    require.cache[bookServicePath] = {
        id: bookServicePath,
        filename: bookServicePath,
        loaded: true,
        exports: mockService
    };

    delete require.cache[controllerPath];

    try {
        return require("../src/controllers/bookController");
    } finally {
        if (originalService) {
            require.cache[bookServicePath] = originalService;
        } else {
            delete require.cache[bookServicePath];
        }

        if (originalController) {
            require.cache[controllerPath] = originalController;
        } else {
            delete require.cache[controllerPath];
        }
    }
}

test("book listing rejects an invalid page number", async () => {
    const controller = loadControllerWithMockService();
    const req = { query: { page: "0" } };
    const res = createResponse();

    await controller.getAllBooks(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, "Page must be a positive integer");
});

test("book listing rejects a limit greater than 100", async () => {
    const controller = loadControllerWithMockService();
    const req = { query: { limit: "101" } };
    const res = createResponse();

    await controller.getAllBooks(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
        res.body.message,
        "Limit must be an integer between 1 and 100"
    );
});

test("book listing rejects an invalid category ID", async () => {
    const controller = loadControllerWithMockService();
    const req = { query: { category_id: "-2" } };
    const res = createResponse();

    await controller.getAllBooks(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(
        res.body.message,
        "Category ID must be a positive integer"
    );
});

test("book lookup returns 404 when the book does not exist", async () => {
    const controller = loadControllerWithMockService({
        getBook: () => undefined
    });

    const req = { params: { id: "999999" } };
    const res = createResponse();

    await controller.getSingleBook(req, res);

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.message, "Book not found");
});

test("book listing returns an empty list when no books exist", async () => {
    const controller = loadControllerWithMockService({
        getBooks: () => ({ books: [], total: 0 })
    });

    const req = { query: {} };
    const res = createResponse();

    await controller.getAllBooks(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.count, 0);
    assert.deepEqual(res.body.books, []);
    assert.equal(res.body.pagination.total, 0);
});
