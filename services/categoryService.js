import { Category } from '../models/categoryModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = getAll(Category);

// @dec     Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = getOne(Category);

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = createOne(Category);

// @dec     Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = updateOne(Category);
// @dec     Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = deleteOne(Category);
