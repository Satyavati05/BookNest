const {
    createCategory,
    getAllCategories,
    getCategoryById
} = require("../models/categoryModel");

function addCategory({ name, description }) {
    const existingCategory = getAllCategories().find(
        category => category.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    return createCategory({
        name,
        description
    });
}

function getCategories() {
    return getAllCategories();
}

function getCategory(id) {
    return getCategoryById(id);
}

module.exports = {
    addCategory,
    getCategories,
    getCategory
};