import slugify from 'slugify';
import { SubCategory } from '../models/subCategoryModel.js';
import { ApiError } from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import qs from 'qs';

export const setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  Private
export const createSubCategory = async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ success: true, data: subCategory });
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
export const getSubCategories = async (req, res) => {
  // Build query
  const rawQuery = req._parsedUrl.query;
  const parsedQuery = qs.parse(rawQuery);

  const documentsCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), parsedQuery)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await apiFeatures.mongooseQuery;

  res.status(200).json({
    success: true,
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
};

// @dec     Get specific subCategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategory = async (req, res, next) => {
  // ============ Error Handling ============ //
  // 1- then() catch(err)
  // 2- try {} catch(err)
  // 3- asyncHandler(async func) ==> express error handler
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: subCategory });
};

// @dec     Update specific subCategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  // findOneAndUpdate(filter, update, options)
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }, // to return the data after update in response
  );

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: subCategory });
};

// @dec     Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Sub Category deleted successfully!' });
};
