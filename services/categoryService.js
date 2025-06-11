import slugify from 'slugify';
import { Category } from '../models/categoryModel.js';
import { ApiError } from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import qs from 'qs';

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res) => {
  // Build query
  const rawQuery = req._parsedUrl.query;
  const parsedQuery = qs.parse(rawQuery);

  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), parsedQuery)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await apiFeatures.mongooseQuery;

  res.status(200).json({
    success: true,
    results: categories.length,
    paginationResult,
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
