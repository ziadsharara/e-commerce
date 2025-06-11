import { SubCategory } from '../models/subCategoryModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

export const setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
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
export const getSubCategories = getAll(SubCategory);

// @dec     Get specific subCategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
export const getSubCategory = getOne(SubCategory);

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  Private
export const createSubCategory = createOne(SubCategory);

// @dec     Update specific subCategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
export const updateSubCategory = updateOne(SubCategory);

// @dec     Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
export const deleteSubCategory = deleteOne(SubCategory);
