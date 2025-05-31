const slugify = require('slugify');
const asyncHandler = require('express-async-handler'); // handling exceptions inside of async routes
const Category = require('../models/categoryModel');

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({
    success: true,
    results: categories.length,
    page,
    data: categories,
  });
});

// @dec     Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res
      .status(404)
      .json({ success: false, message: `No category for this id ${id}` });
  }
  res.status(200).json({ success: true, data: category });
});

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @dec     Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  // findOneAndUpdate(filter, update, options)
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true } // to return the data after update in response
  );

  if (!category) {
    res
      .status(404)
      .json({ success: false, message: `No category for this id ${id}` });
  }
  res.status(200).json({ success: true, data: category });
});
