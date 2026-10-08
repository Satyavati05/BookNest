const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
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

function editCategory(id, { name, description }) {
    const existingCategory = getCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    const duplicateCategory = getAllCategories().find(
        category =>
            category.id !== Number(id) &&
            category.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicateCategory) {
        throw new Error("Category already exists");
    }

    return updateCategory(id, {
        name,
        description
    });
}

function removeCategory(id) {
    const existingCategory = getCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    deleteCategory(id);

    return existingCategory;
}

module.exports = {
    addCategory,
    getCategories,
    getCategory,
    editCategory,
    removeCategory
};