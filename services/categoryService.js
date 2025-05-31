const slugify = require('slugify');
const asyncHandler = require('express-async-handler'); // handling exceptions inside of async routes
const CategoryModel = require('../models/categoryModel');

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find({});
  res
    .status(200)
    .json({ success: true, results: categories.length, data: categories });
});

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
