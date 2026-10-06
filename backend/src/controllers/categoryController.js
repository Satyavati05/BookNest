const {
    addCategory,
    getCategories,
    getCategory
} = require("../services/categoryService");

async function createCategory(req, res) {
    try {
        const category = addCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.error("Create category error:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getAllCategories(req, res) {
    try {
        const categories = getCategories();

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
}

async function getSingleCategory(req, res) {
    try {
        const category = getCategory(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error("Get category error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getSingleCategory
};