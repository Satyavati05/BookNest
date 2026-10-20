const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../models/categoryModel");

async function addCategory({ name, description }) {
    const categories = await getAllCategories();

    const existingCategory = categories.find(
        category => category.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    return await createCategory({ name, description });
}

async function getCategories() {
    return await getAllCategories();
}

async function getCategory(id) {
    return await getCategoryById(id);
}

async function editCategory(id, { name, description }) {
    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    const categories = await getAllCategories();

    const duplicateCategory = categories.find(
        category =>
            category.id !== Number(id) &&
            category.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicateCategory) {
        throw new Error("Category already exists");
    }

    return await updateCategory(id, { name, description });
}

async function removeCategory(id) {
    const existingCategory = await getCategoryById(id);

    if (!existingCategory) {
        throw new Error("Category not found");
    }

    await deleteCategory(id);

    return existingCategory;
}

module.exports = {
    addCategory,
    getCategories,
    getCategory,
    editCategory,
    removeCategory
};
