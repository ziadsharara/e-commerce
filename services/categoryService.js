import slugify from 'slugify';
import { Category } from '../models/categoryModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res) => {
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
};

// @dec     Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = async (req, res, next) => {
  // ============ Error Handling ============ //
  // 1- then() catch(err)
  // 2- try {} catch(err)
  // 3- asyncHandler(async func) ==> express error handler
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: category });
};

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ success: true, data: category });
};

// @dec     Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  // findOneAndUpdate(filter, update, options)
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }, // to return the data after update in response
  );

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: category });
};

// @dec     Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Category deleted successfully!' });
};
