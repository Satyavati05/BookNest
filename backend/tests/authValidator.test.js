const test = require("node:test");
const assert = require("node:assert/strict");

const {
    validateRegistration,
    validateLogin
} = require("../src/validators/authValidator");

test("registration accepts valid input", () => {
    const result = validateRegistration({
        username: "reader01",
        email: "reader@example.com",
        password: "secret123",
        full_name: "Test Reader"
    });

    assert.equal(result.valid, true);
});

test("registration rejects missing fields", () => {
    const result = validateRegistration({
        username: "reader01",
        email: "reader@example.com",
        password: "secret123"
    });

    assert.equal(result.valid, false);
    assert.equal(result.message, "All fields are required");
});

test("registration rejects passwords shorter than six characters", () => {
    const result = validateRegistration({
        username: "reader01",
        email: "reader@example.com",
        password: "abc",
        full_name: "Test Reader"
    });

    assert.equal(result.valid, false);
    assert.equal(
        result.message,
        "Password must be at least 6 characters"
    );
});

test("registration rejects invalid email addresses", () => {
    const result = validateRegistration({
        username: "reader01",
        email: "not-an-email",
        password: "secret123",
        full_name: "Test Reader"
    });

    assert.equal(result.valid, false);
    assert.equal(
        result.message,
        "Please provide a valid email address"
    );
});

test("login accepts email and password", () => {
    const result = validateLogin({
        email: "reader@example.com",
        password: "secret123"
    });

    assert.equal(result.valid, true);
});

test("login rejects missing credentials", () => {
    const result = validateLogin({
        email: "reader@example.com"
    });

    assert.equal(result.valid, false);
    assert.equal(
        result.message,
        "Email and password are required"
    );
});

test("registration handles an undefined request body", () => {
    assert.doesNotThrow(() => {
        validateRegistration(undefined);
    });
});

test("registration handles a null request body", () => {
    const result = validateRegistration(null);

    assert.equal(result.valid, false);
    assert.equal(result.message, "All fields are required");
});

test("login handles an undefined request body", () => {
    const result = validateLogin(undefined);

    assert.equal(result.valid, false);
    assert.equal(
        result.message,
        "Email and password are required"
    );
});