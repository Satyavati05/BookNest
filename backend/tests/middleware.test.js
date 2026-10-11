
const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

const authenticateToken = require("../src/middleware/authMiddleware");
const requireAdmin = require("../src/middleware/adminMiddleware");

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

test("authentication rejects a missing token", () => {
    const req = { headers: {} };
    const res = createResponse();
    let nextCalled = false;

    authenticateToken(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Access token required");
    assert.equal(nextCalled, false);
});

test("authentication rejects an invalid token", () => {
    const req = {
        headers: { authorization: "Bearer invalid-token" }
    };
    const res = createResponse();
    let nextCalled = false;

    process.env.JWT_SECRET = "test-secret";

    authenticateToken(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid or expired token");
    assert.equal(nextCalled, false);
});

test("authentication accepts a valid token", () => {
    process.env.JWT_SECRET = "test-secret";

    const token = jwt.sign(
        { id: 10, email: "reader@example.com", is_admin: 0 },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );

    const req = {
        headers: { authorization: `Bearer ${token}` }
    };
    const res = createResponse();
    let nextCalled = false;

    authenticateToken(req, res, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(req.user.id, 10);
    assert.equal(req.user.is_admin, 0);
});

test("admin middleware rejects an unauthenticated user", () => {
    const req = {};
    const res = createResponse();
    let nextCalled = false;

    requireAdmin(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Authentication required");
    assert.equal(nextCalled, false);
});

test("admin middleware rejects a regular user", () => {
    const req = { user: { id: 10, is_admin: 0 } };
    const res = createResponse();
    let nextCalled = false;

    requireAdmin(req, res, () => {
        nextCalled = true;
    });

    assert.equal(res.statusCode, 403);
    assert.equal(res.body.message, "Admin access required");
    assert.equal(nextCalled, false);
});

test("admin middleware allows an admin user", () => {
    const req = { user: { id: 1, is_admin: 1 } };
    const res = createResponse();
    let nextCalled = false;

    requireAdmin(req, res, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null);
});
