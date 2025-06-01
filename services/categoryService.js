import slugify from 'slugify';
import asyncHandler from 'express-async-handler'; // handling exceptions inside of async routes
import Category from '../models/categoryModel.js';

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
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
export const getCategory = async (req, res) => {
  // ============ Error Handling ============ //
  // 1- then() catch(err)
  // 2- try {} catch(err)
  // 3- asyncHandler(async func) ==> express error handler
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res
      .status(404)
      .json({ success: false, message: `No category for this id ${id}` });
  }
  res.status(200).json({ success: true, data: category });
};

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @dec     Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res) => {
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
      .json({ success: false, message: `No category for this id ${id}!` });
  }
  res.status(200).json({ success: true, data: category });
});

// @dec     Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    res
      .status(404)

      .json({ success: false, message: `No category for this id ${id}` });
  }
  res
    .status(200)
    .json({ success: true, message: 'Category deleted successfully!' });
});
